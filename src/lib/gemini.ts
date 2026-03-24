export interface Suggestion {
  id: string;
  type: "grammar" | "spelling" | "style" | "clarity";
  original: string;
  suggestion: string;
  reason: string;
  position?: { start: number; end: number };
}

export interface AnalysisResult {
  suggestions: Suggestion[];
  summary: string;
  score: number;
}

export class ApiRequestError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

// Model fallback chain — primary first, then fallbacks on 503/UNAVAILABLE
const MODEL_CHAIN = [
  process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite',
  process.env.GEMINI_FALLBACK_MODEL_1 || 'gemini-2.0-flash',
  process.env.GEMINI_FALLBACK_MODEL_2 || 'gemini-1.5-flash',
];

// API Key rotation
let currentKeyIndex = 0;
const keyFailureCount = new Map<string, number>();
const keyLastFailureTime = new Map<string, number>();
const KEY_COOLDOWN = 60000; // 1 min cooldown after 3 failures

// Per-key rate limiting (replaces global throttle — no more artificial 3s delay)
const keyLastRequestTime = new Map<string, number>();
const KEY_MIN_INTERVAL = 1000; // 1s per key (much less aggressive)

function getApiKeys(): string[] {
  const keys: string[] = [];
  if (process.env.GEMINI_API_KEY)   keys.push(process.env.GEMINI_API_KEY);
  if (process.env.GEMINI_API_KEY_2) keys.push(process.env.GEMINI_API_KEY_2);
  if (process.env.GEMINI_API_KEY_3) keys.push(process.env.GEMINI_API_KEY_3);
  return keys;
}

function getNextApiKey(): string {
  const keys = getApiKeys();
  if (keys.length === 0) throw new Error('No API keys configured. Add GEMINI_API_KEY to .env.local');

  const now = Date.now();
  for (let i = 0; i < keys.length; i++) {
    const idx = (currentKeyIndex + i) % keys.length;
    const key = keys[idx];
    const failures = keyFailureCount.get(key) || 0;
    const lastFailure = keyLastFailureTime.get(key) || 0;

    if (failures >= 3 && (now - lastFailure) < KEY_COOLDOWN) continue;
    if (failures >= 3) keyFailureCount.set(key, 0); // cooldown expired, reset

    currentKeyIndex = (idx + 1) % keys.length;
    return key;
  }

  // All keys in cooldown — use least recently failed
  return keys.reduce((best, key) => {
    const t = keyLastFailureTime.get(key) || 0;
    return t < (keyLastFailureTime.get(best) || 0) ? key : best;
  }, keys[0]);
}

function markKeyFailure(key: string, is429: boolean = false) {
  keyFailureCount.set(key, (keyFailureCount.get(key) || 0) + (is429 ? 3 : 1));
  keyLastFailureTime.set(key, Date.now());
}

function isUnavailable(error: unknown): boolean {
  if (error instanceof ApiRequestError && error.status === 503) return true;
  if (error instanceof Error && error.message.includes('UNAVAILABLE')) return true;
  return false;
}

export async function analyzeText(text: string): Promise<AnalysisResult> {
  const keys = getApiKeys();
  let lastError: Error | null = null;

  // Try each model in the fallback chain
  for (const model of MODEL_CHAIN) {
    // Try each key for this model
    for (let attempt = 0; attempt < Math.max(keys.length, 1); attempt++) {
      const apiKey = getNextApiKey();

      // Per-key rate limit check (non-blocking — just skip to next key if too soon)
      const now = Date.now();
      const lastReq = keyLastRequestTime.get(apiKey) || 0;
      if (now - lastReq < KEY_MIN_INTERVAL && keys.length > 1) continue;

      try {
        keyLastRequestTime.set(apiKey, Date.now());
        const result = await makeApiRequest(text, apiKey, model);
        return result;
      } catch (error) {
        lastError = error as Error;

        if (error instanceof ApiRequestError) {
          if (error.status === 429) {
            markKeyFailure(apiKey, true);
            continue; // try next key
          }
          if (error.status === 503 || isUnavailable(error)) {
            markKeyFailure(apiKey);
            break; // 503 = model overloaded, skip to next model immediately
          }
          if ([500, 502, 504].includes(error.status)) {
            markKeyFailure(apiKey);
            continue; // transient server error, try next key
          }
        }

        throw error; // non-retryable (400, 401, etc.)
      }
    }

    // If we broke out due to 503, try next model
    if (lastError && isUnavailable(lastError)) {
      console.log(`Model ${model} unavailable, trying next model in chain...`);
      lastError = null;
      continue;
    }
  }

  // All models and keys exhausted
  if (lastError instanceof ApiRequestError && lastError.status === 429) {
    throw new ApiRequestError(
      'High demand right now. Please try again in a moment.',
      429
    );
  }

  throw new Error(lastError?.message || 'All models unavailable. Please try again later.');
}

async function makeApiRequest(text: string, apiKey: string, model: string): Promise<AnalysisResult> {
  const prompt = `You are a strict Tamil grammar checker. Find only real grammar and spelling errors.

Text: "${text}"

Rules:
- ONLY flag actual grammar mistakes or misspelled Tamil words
- Do NOT suggest style changes or rewording
- If text is correct, return empty suggestions array
- Write ALL reasons in Tamil only
- Keep reasons short (under 10 words each)

Return ONLY valid JSON, no markdown, no extra text:
{"suggestions":[{"type":"grammar|spelling","original":"wrong text","suggestion":"corrected","reason":"தமிழில்"}],"summary":"தமிழில் ஒரு வரி","score":90}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const status = response.status;
    // Check for UNAVAILABLE in error body (Gemini returns 200 sometimes with error inside)
    const errMsg = errorData?.error?.message || '';
    if (status === 503 || errMsg.includes('UNAVAILABLE') || errMsg.includes('high demand')) {
      throw new ApiRequestError(`Model ${model} unavailable: ${errMsg}`, 503);
    }
    console.error(`Gemini API Error [${model}]:`, status, errorData);
    throw new ApiRequestError(`API request failed: ${status}`, status);
  }

  const data = await response.json();

  // Gemini can return 200 with an error object inside
  if (data?.error) {
    const errMsg = data.error.message || '';
    if (data.error.status === 'UNAVAILABLE' || errMsg.includes('high demand')) {
      throw new ApiRequestError(`Model ${model} unavailable: ${errMsg}`, 503);
    }
    throw new ApiRequestError(`API error: ${errMsg}`, data.error.code || 500);
  }

  const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  if (!responseText) throw new Error('Empty response from API');

  const cleanText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in API response');

  let parsed;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch {
    throw new Error('Invalid JSON in API response. Please try again.');
  }

  const suggestionsWithIds = (parsed.suggestions || []).map(
    (s: { type: string; original: string; suggestion: string; reason: string }, i: number) => ({
      ...s,
      id: `suggestion-${Date.now()}-${i}`,
    })
  );

  return {
    suggestions: suggestionsWithIds,
    summary: parsed.summary || 'Analysis complete',
    score: Math.min(100, Math.max(0, parsed.score || 80)),
  };
}

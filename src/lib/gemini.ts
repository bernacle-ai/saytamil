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

// Model fallback chain — primary first, then fallbacks on 503/404/UNAVAILABLE
const MODEL_CHAIN = [
  process.env.GEMINI_MODEL || 'gemini-2.5-flash-preview-04-17',
  process.env.GEMINI_FALLBACK_MODEL_1 || 'gemini-2.0-flash',
  process.env.GEMINI_FALLBACK_MODEL_2 || 'gemini-1.5-flash',
];

// Rate limiting
let globalLastRequestTime = 0;
const MIN_INTERVAL = 1000; // 1s

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('No API keys configured. Add GEMINI_API_KEY to .env.local');
  return key;
}

export async function analyzeText(text: string): Promise<AnalysisResult> {
  const apiKey = getApiKey();
  let lastError: Error | null = null;

  // Try each model in the fallback chain
  for (const model of MODEL_CHAIN) {
    // Rate limit check
    const now = Date.now();
    const timeSinceLastReq = now - globalLastRequestTime;
    if (timeSinceLastReq < MIN_INTERVAL) {
      await new Promise(resolve => setTimeout(resolve, MIN_INTERVAL - timeSinceLastReq));
    }
    
    try {
      globalLastRequestTime = Date.now();
      const result = await makeApiRequest(text, apiKey, model);
      return result;
    } catch (error) {
      lastError = error as Error;

      if (error instanceof ApiRequestError) {
        if (error.status === 429) {
          console.log(`Model ${model} rate limited, trying next model in chain...`);
          continue; // try next model
        }
        if (error.status === 503 || error.status === 404) {
          console.log(`Model ${model} unavailable/not found, trying next model in chain...`);
          continue; // model unavailable or not found — skip to next model
        }
        if ([500, 502, 504].includes(error.status)) {
          console.log(`Model ${model} transient error, trying next model in chain...`);
          continue; // transient server error, try next model
        }
      }

      throw error; // non-retryable (400, 401, etc.)
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
    if (status === 404 || errMsg.includes('no longer available') || errMsg.includes('NOT_FOUND')) {
      throw new ApiRequestError(`Model ${model} not found: ${errMsg}`, 404);
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
    if (data.error.status === 'NOT_FOUND' || errMsg.includes('no longer available')) {
      throw new ApiRequestError(`Model ${model} not found: ${errMsg}`, 404);
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

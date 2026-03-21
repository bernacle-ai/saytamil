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

// Retryable HTTP status codes
const RETRYABLE_STATUSES = new Set([429, 401, 403, 500, 502, 503, 504]);

export class ApiRequestError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

// API Key rotation management
let currentKeyIndex = 0;
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 3000; // 3 seconds between requests
const keyFailureCount = new Map<string, number>();
const keyLastFailureTime = new Map<string, number>();
const KEY_COOLDOWN = 60000; // 1 minute cooldown after failures

function getApiKeys(): string[] {
  const keys: string[] = [];

  // Server-only env vars (no NEXT_PUBLIC_ prefix)
  const key1 = process.env.GEMINI_API_KEY;
  const key2 = process.env.GEMINI_API_KEY_2;
  const key3 = process.env.GEMINI_API_KEY_3;

  if (key1) keys.push(key1);
  if (key2) keys.push(key2);
  if (key3) keys.push(key3);

  return keys;
}

function getNextApiKey(): string {
  const keys = getApiKeys();

  if (keys.length === 0) {
    throw new Error("No API keys configured. Please add GEMINI_API_KEY to your .env.local file");
  }

  const now = Date.now();
  for (let i = 0; i < keys.length; i++) {
    const keyIndex = (currentKeyIndex + i) % keys.length;
    const key = keys[keyIndex];

    const failures = keyFailureCount.get(key) || 0;
    const lastFailure = keyLastFailureTime.get(key) || 0;

    if (failures >= 3 && (now - lastFailure) < KEY_COOLDOWN) continue;

    if (failures >= 3 && (now - lastFailure) >= KEY_COOLDOWN) {
      keyFailureCount.set(key, 0);
    }

    currentKeyIndex = (keyIndex + 1) % keys.length;
    return key;
  }

  // All keys in cooldown — use the one with the oldest failure
  let oldestKey = keys[0];
  let oldestTime = keyLastFailureTime.get(oldestKey) || 0;
  for (const key of keys) {
    const time = keyLastFailureTime.get(key) || 0;
    if (time < oldestTime) { oldestTime = time; oldestKey = key; }
  }
  return oldestKey;
}

function markKeyFailure(key: string, is429: boolean = false) {
  const current = keyFailureCount.get(key) || 0;
  keyFailureCount.set(key, current + (is429 ? 3 : 1));
  keyLastFailureTime.set(key, Date.now());
}

export async function analyzeText(text: string): Promise<AnalysisResult> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = Math.ceil((MIN_REQUEST_INTERVAL - timeSinceLastRequest) / 1000);
    throw new ApiRequestError(`Please wait ${waitTime} seconds before analyzing again`, 429);
  }

  lastRequestTime = now;

  const keys = getApiKeys();
  let lastError: Error | null = null;
  let allRateLimited = true;

  for (let attempt = 0; attempt < keys.length; attempt++) {
    const apiKey = getNextApiKey();

    try {
      const result = await makeApiRequest(text, apiKey);
      return result;
    } catch (error) {
      lastError = error as Error;

      if (error instanceof ApiRequestError && RETRYABLE_STATUSES.has(error.status)) {
        markKeyFailure(apiKey, error.status === 429);
        if (error.status !== 429) allRateLimited = false;
        console.log(`Key ${attempt + 1} failed with status ${error.status}, trying next key...`);
        continue;
      }

      allRateLimited = false;
      throw error;
    }
  }

  // All keys exhausted — surface the right status code
  if (allRateLimited) {
    throw new ApiRequestError(
      'We are facing high server load as a new application. We are handling this with high maintenance — please bear with us and try again in a few minutes.',
      429
    );
  }

  throw new Error(lastError?.message || 'All API keys exhausted. Please try again later.');
}

async function makeApiRequest(text: string, apiKey: string): Promise<AnalysisResult> {
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite';

  const prompt = `You are a strict Tamil grammar checker. Your ONLY job is to find real grammar and spelling errors in Tamil text.

Text to check: "${text}"

Rules:
- ONLY flag actual grammar mistakes or misspelled Tamil words
- Do NOT suggest style changes, rewording, or "improvements"
- Do NOT flag correct sentences just because they are simple
- If the text is grammatically correct, return empty suggestions
- Keep suggestions minimal — only what is clearly wrong
- Write ALL reasons in Tamil only

Return ONLY this JSON, no markdown:
{
  "suggestions": [
    {
      "type": "grammar|spelling",
      "original": "exact wrong text from input",
      "suggestion": "corrected text",
      "reason": "தமிழில் குறுகிய விளக்கம்"
    }
  ],
  "summary": "ஒரு வரி மதிப்பீடு தமிழில்",
  "score": 90
}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 512 },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Gemini API Error:', response.status, errorData);
    throw new ApiRequestError(`API request failed: ${response.status}`, response.status);
  }

  const data = await response.json();
  const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  if (!responseText) {
    throw new Error('Empty response from API');
  }

  const cleanText = responseText
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  const parsed = JSON.parse(cleanText);

  const suggestionsWithIds =
    parsed.suggestions?.map((s: { type: string; original: string; suggestion: string; reason: string }, index: number) => ({
      ...s,
      id: `suggestion-${Date.now()}-${index}`,
    })) || [];

  return {
    suggestions: suggestionsWithIds,
    summary: parsed.summary || "Analysis complete",
    score: Math.min(100, Math.max(0, parsed.score || 80)),
  };
}

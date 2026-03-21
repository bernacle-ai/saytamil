import { NextRequest, NextResponse } from 'next/server';
import { analyzeText } from '@/lib/gemini';

// In-memory session store: sessionId -> { count, resetAt }
// This is per-instance (fine for single server / serverless with short TTL)
const sessionStore = new Map<string, { count: number; resetAt: number }>();

const DEMO_LIMIT = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour window per session

export async function POST(req: NextRequest) {
  const { text, sessionId } = await req.json();

  if (!text?.trim()) {
    return NextResponse.json({ error: 'No text provided' }, { status: 400 });
  }

  if (!sessionId) {
    return NextResponse.json({ error: 'No session' }, { status: 400 });
  }

  const now = Date.now();
  const entry = sessionStore.get(sessionId);

  if (entry && now < entry.resetAt) {
    if (entry.count >= DEMO_LIMIT) {
      return NextResponse.json(
        {
          error: 'demo_limit',
          message: `You've used all ${DEMO_LIMIT} free demo checks. Sign up for unlimited access.`,
          remaining: 0,
        },
        { status: 429 }
      );
    }
    entry.count += 1;
    sessionStore.set(sessionId, entry);
  } else {
    // New window
    sessionStore.set(sessionId, { count: 1, resetAt: now + WINDOW_MS });
  }

  const current = sessionStore.get(sessionId)!;
  const remaining = Math.max(0, DEMO_LIMIT - current.count);

  try {
    const result = await analyzeText(text);
    return NextResponse.json({ ...result, remaining, limit: DEMO_LIMIT });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Analysis failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { getUserByEmail, getUserUsageToday, incrementUserUsage, FREE_DAILY_LIMIT } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await getUserByEmail(session.user.email);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const used = await getUserUsageToday(user.id);
  const limit = user.plan === 'pro' ? 999 : FREE_DAILY_LIMIT;

  return NextResponse.json({ used, limit, plan: user.plan, remaining: Math.max(0, limit - used) });
}

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await getUserByEmail(session.user.email);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const count = await incrementUserUsage(user.id);
  const limit = user.plan === 'pro' ? 999 : FREE_DAILY_LIMIT;

  return NextResponse.json({ used: count, limit, remaining: Math.max(0, limit - count) });
}

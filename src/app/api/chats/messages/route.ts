import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import pool, { getUserByEmail } from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { chatId, message } = await req.json();
  const user = await getUserByEmail(session.user.email);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  await pool.query(
    'INSERT INTO messages (id, chat_id, user_id, sender, text, is_loading) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO UPDATE SET text = $5',
    [message.id, chatId, user.id, message.sender, message.text, message.isLoading || false]
  );

  return NextResponse.json({ success: true });
}

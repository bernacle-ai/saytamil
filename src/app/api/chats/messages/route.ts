import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import pool, { getUserByEmail } from '@/lib/db';

const VALID_SENDERS = ['user', 'ai'];
const MAX_TEXT_LENGTH = 10000;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: { chatId?: string; message?: { id?: string; sender?: string; text?: string; isLoading?: boolean } };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { chatId, message } = body;

  if (!chatId || typeof chatId !== 'string') return NextResponse.json({ error: 'Invalid chatId' }, { status: 400 });
  if (!message?.id || !message?.sender || typeof message?.text !== 'string') return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
  if (!VALID_SENDERS.includes(message.sender)) return NextResponse.json({ error: 'Invalid sender' }, { status: 400 });
  if (message.text.length > MAX_TEXT_LENGTH) return NextResponse.json({ error: 'Message too long' }, { status: 400 });

  const user = await getUserByEmail(session.user.email);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Verify this chat belongs to the user before inserting
  const chatCheck = await pool.query('SELECT id FROM chats WHERE id = $1 AND user_id = $2', [chatId, user.id]);
  if (chatCheck.rowCount === 0) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });

  await pool.query(
    'INSERT INTO messages (id, chat_id, user_id, sender, text, is_loading) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO UPDATE SET text = $5',
    [message.id, chatId, user.id, message.sender, message.text, message.isLoading || false]
  );

  return NextResponse.json({ success: true });
}

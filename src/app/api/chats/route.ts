import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import pool, { initDB, getUserByEmail } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await initDB();
  const user = await getUserByEmail(session.user.email);
  if (!user) return NextResponse.json({ chats: [] });

  const chats = await pool.query(
    `SELECT c.id, c.title, c.created_at, c.updated_at,
      json_agg(json_build_object(
        'id', m.id, 'sender', m.sender, 'text', m.text,
        'isLoading', m.is_loading, 'timestamp', extract(epoch from m.created_at) * 1000
      ) ORDER BY m.created_at) FILTER (WHERE m.id IS NOT NULL) as messages
     FROM chats c
     LEFT JOIN messages m ON m.chat_id = c.id
     WHERE c.user_id = $1
     GROUP BY c.id ORDER BY c.updated_at DESC`,
    [user.id]
  );

  return NextResponse.json({ chats: chats.rows });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, title } = await req.json();
  await initDB();
  const user = await getUserByEmail(session.user.email);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  await pool.query(
    'INSERT INTO chats (id, user_id, title) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET title = $3, updated_at = NOW()',
    [id, user.id, title || 'Untitled Chat']
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  const user = await getUserByEmail(session.user.email);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  await pool.query('DELETE FROM chats WHERE id = $1 AND user_id = $2', [id, user.id]);
  return NextResponse.json({ success: true });
}

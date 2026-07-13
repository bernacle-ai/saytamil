import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Basic email format validation
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Strip potential header injection characters from user input
function sanitize(str: string): string {
  return str.replace(/[\r\n]/g, ' ').trim();
}

export async function POST(req: NextRequest) {
  let name: string, email: string, topic: string, message: string;

  try {
    ({ name, email, topic, message } = await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Validate email format
  if (!isValidEmail(email.trim())) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  // Enforce length limits to prevent abuse
  if (name.length > 100 || email.length > 200 || message.length > 5000 || (topic && topic.length > 100)) {
    return NextResponse.json({ error: 'Input too long' }, { status: 400 });
  }

  // Sanitize all fields to prevent header injection
  const safeName = sanitize(name);
  const safeEmail = sanitize(email);
  const safeTopic = sanitize(topic || 'General');
  const safeMessage = message.trim();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_SERVER_USER,
    to: process.env.EMAIL_SERVER_USER,
    replyTo: safeEmail,
    subject: `[SayTamil Contact] ${safeTopic} — ${safeName}`,
    text: `Name: ${safeName}\nEmail: ${safeEmail}\nTopic: ${safeTopic}\n\n${safeMessage}`,
  });

  return NextResponse.json({ ok: true });
}

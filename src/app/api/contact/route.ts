import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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
    replyTo: email,
    subject: `[SayTamil Contact] ${topic || 'General'} — ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nTopic: ${topic || 'N/A'}\n\n${message}`,
  });

  return NextResponse.json({ ok: true });
}

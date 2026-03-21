import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import pool from '@/lib/db';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email, type } = await req.json(); // type: 'reset' | 'verify'

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // For reset, check user exists
    if (type === 'reset') {
      const user = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (user.rows.length === 0) {
        return NextResponse.json({ error: 'No account found with this email' }, { status: 404 });
      }
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete old OTPs for this email
    await pool.query('DELETE FROM otp_store WHERE email = $1 AND type = $2', [email, type]);

    // Save new OTP
    await pool.query(
      'INSERT INTO otp_store (email, otp, type, expires_at) VALUES ($1, $2, $3, $4)',
      [email, otp, type, expiresAt]
    );

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"SayTamil Support" <${process.env.EMAIL_SERVER_USER}>`,
      to: email,
      subject: type === 'reset' ? 'SayTamil - Password Reset OTP' : 'SayTamil - Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0f172a; color: #fff; border-radius: 12px;">
          <h2 style="color: #22d3ee; margin-bottom: 8px;">SayTamil</h2>
          <p style="color: #94a3b8; margin-bottom: 24px;">
            ${type === 'reset' ? 'You requested a password reset.' : 'Please verify your email.'}
          </p>
          <div style="background: #1e293b; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <p style="color: #94a3b8; font-size: 14px; margin-bottom: 8px;">Your OTP code</p>
            <h1 style="color: #22d3ee; font-size: 40px; letter-spacing: 12px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #64748b; font-size: 13px;">This code expires in 10 minutes. Do not share it with anyone.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('OTP send error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}

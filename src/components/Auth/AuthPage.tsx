'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

type Mode = 'login' | 'signup' | 'forgot' | 'otp';
type AlertType = 'error' | 'success' | 'warning';

function Alert({ message, type }: { message: string; type: AlertType }) {
  const s = {
    error:   'bg-red-500/10 border-red-500/25 text-red-500',
    success: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600',
    warning: 'bg-amber-500/10 border-amber-500/25 text-amber-600',
  };
  const icons = { error: '✕', success: '✓', warning: '⚠' };
  return (
    <div className={`flex items-start gap-2.5 px-4 py-3 rounded-xl border text-sm ${s[type]}`}>
      <span className="font-bold mt-0.5 flex-shrink-0">{icons[type]}</span>
      <span className="leading-relaxed">{message}</span>
    </div>
  );
}

function PasswordStrength({ password, dark }: { password: string; dark: boolean }) {
  const checks = [
    { label: 'At least 8 characters', ok: password.length >= 8 },
    { label: 'Contains a number', ok: /\d/.test(password) },
    { label: 'Contains a symbol (!@#$...)', ok: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];
  if (!password) return null;
  const strength = checks.filter(c => c.ok).length;
  const barColor = strength === 1 ? '#ef4444' : strength === 2 ? '#f59e0b' : '#00d4b4';
  return (
    <div className="mt-2.5 space-y-2">
      <div className="flex gap-1">
        {[1,2,3].map(i => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= strength ? barColor : dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
        ))}
      </div>
      <div className="space-y-1">
        {checks.map(c => (
          <p key={c.label} className={`text-xs transition-colors ${c.ok ? 'text-emerald-500' : dark ? 'text-slate-500' : 'text-slate-400'}`}>
            {c.ok ? '✓' : '○'} {c.label}
          </p>
        ))}
      </div>
    </div>
  );
}

function isPasswordStrong(p: string) {
  return p.length >= 8 && /\d/.test(p) && /[!@#$%^&*(),.?":{}|<>]/.test(p);
}

// ── Sun icon ──
function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5" strokeWidth={2}/>
      <path strokeLinecap="round" strokeWidth={2} d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  );
}

// ── Moon icon ──
function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  );
}

export function AuthPage({ onAuthSuccess, initialMode = 'login' }: { onAuthSuccess: () => void; initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [dark, setDark] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: AlertType } | null>(null);

  const notify = (message: string, type: AlertType) => setAlert({ message, type });
  const clearAlert = () => setAlert(null);
  const switchMode = (m: Mode) => { clearAlert(); setMode(m); };

  // ── Theme tokens ──
  const bg          = dark ? '#090e1a'                  : '#f8fafc';
  const panelBg     = dark ? '#090e1a'                  : 'linear-gradient(135deg,#f0fdfa 0%,#f8fafc 50%,#faf5ff 100%)';
  const cardBg      = dark ? 'rgba(255,255,255,0.04)'   : 'rgba(255,255,255,0.90)';
  const cardBorder  = dark ? 'rgba(255,255,255,0.08)'   : 'rgba(0,212,180,0.20)';
  const cardShadow  = dark ? '0 0 0 1px rgba(0,212,180,0.04),0 32px 64px rgba(0,0,0,0.5)' : '0 0 0 1px rgba(0,212,180,0.08),0 24px 48px rgba(0,0,0,0.08)';
  const inputBg     = dark ? 'rgba(255,255,255,0.04)'   : '#ffffff';
  const inputBorder = dark ? 'rgba(255,255,255,0.08)'   : '#e2e8f0';
  const navBorder   = dark ? 'rgba(255,255,255,0.05)'   : 'rgba(0,0,0,0.06)';
  const gridLine    = dark ? 'rgba(255,255,255,0.025)'  : 'rgba(0,0,0,0.04)';
  const divider     = dark ? 'rgba(255,255,255,0.07)'   : 'rgba(0,0,0,0.08)';
  const heading     = dark ? '#f1f5f9'                  : '#0f172a';
  const body        = dark ? '#94a3b8'                  : '#334155';
  const muted       = dark ? '#475569'                  : '#94a3b8';
  const featCard    = dark ? 'rgba(255,255,255,0.03)'   : 'rgba(255,255,255,0.75)';
  const featBorder  = dark ? 'rgba(255,255,255,0.06)'   : 'rgba(0,0,0,0.07)';
  const gBtn        = dark ? 'rgba(255,255,255,0.05)'   : 'rgba(255,255,255,0.95)';
  const gBorder     = dark ? 'rgba(255,255,255,0.09)'   : '#e2e8f0';
  const gText       = dark ? '#cbd5e1'                  : '#334155';

  const inputCls = [
    'w-full px-4 py-3 rounded-xl text-sm transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-[#00d4b4]/30',
  ].join(' ');
  const inputStyle = { background: inputBg, border: `1px solid ${inputBorder}`, color: heading };

  const primaryBtn = [
    'w-full flex items-center justify-center gap-2 py-3 rounded-xl',
    'text-sm font-semibold text-white transition-all duration-200',
    'disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]',
  ].join(' ');

  const handleGoogleLogin = () => { signIn('google', { callbackUrl: '/tool' }); };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); clearAlert();
    if (!email || !password) return notify('Please fill in all fields', 'warning');
    setIsLoading(true);
    const res = await signIn('credentials', { email, password, redirect: false });
    setIsLoading(false);
    if (res?.error) { notify('Invalid email or password. Signed up with Google? Use the button above.', 'error'); return; }
    notify('Welcome back!', 'success');
    onAuthSuccess();
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); clearAlert();
    if (!email || !password || !confirmPassword) return notify('Please fill in all fields', 'warning');
    if (!isPasswordStrong(password)) return notify('Password does not meet the requirements below', 'warning');
    if (password !== confirmPassword) return notify('Passwords do not match', 'error');
    setIsLoading(true);
    const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, name }) });
    const data = await res.json();
    setIsLoading(false);
    if (res.status === 409) { notify('An account with this email already exists.', 'error'); setTimeout(() => switchMode('login'), 2000); return; }
    if (!res.ok) return notify(data.error || 'Signup failed. Please try again.', 'error');
    notify('Account created! Please sign in.', 'success');
    setTimeout(() => switchMode('login'), 1500);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault(); clearAlert();
    if (!email) return notify('Please enter your email address', 'warning');
    setIsLoading(true);
    const res = await fetch('/api/auth/send-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, type: 'reset' }) });
    const data = await res.json();
    setIsLoading(false);
    if (res.status === 404) return notify('No account found with this email', 'error');
    if (!res.ok) return notify(data.error || 'Failed to send OTP.', 'error');
    notify('OTP sent! Check your inbox.', 'success');
    setTimeout(() => switchMode('otp'), 1000);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault(); clearAlert();
    if (!otp || !newPassword) return notify('Please fill in all fields', 'warning');
    if (!isPasswordStrong(newPassword)) return notify('Password does not meet the requirements below', 'warning');
    setIsLoading(true);
    const res = await fetch('/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, otp, newPassword }) });
    const data = await res.json();
    setIsLoading(false);
    if (!res.ok) return notify(data.error || 'Invalid or expired OTP.', 'error');
    notify('Password reset! Redirecting to sign in...', 'success');
    setTimeout(() => switchMode('login'), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300" style={{ background: bg }}>

      {/* ── Top nav ── */}
      <nav className="flex-shrink-0 flex items-center justify-between px-8 py-4 transition-colors duration-300"
        style={{ borderBottom: `1px solid ${navBorder}` }}>
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/saytamil-logo.png" alt="SayTamil" className="w-9 h-9 rounded-xl object-cover" />
          <span className="font-bold text-base tracking-tight transition-colors" style={{ color: heading }}>SayTamil</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Dark / Light toggle */}
          <button onClick={() => setDark(!dark)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ background: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', border: `1px solid ${navBorder}`, color: dark ? '#f1c40f' : '#7c6af7' }}
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>

          <a href="/" className="flex items-center gap-1.5 text-sm transition-colors hover:opacity-70"
            style={{ color: body }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </a>
        </div>
      </nav>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left branding panel (55%) ── */}
        <div className="hidden lg:flex lg:w-[55%] flex-col justify-between pl-14 pr-4 py-14 relative overflow-hidden transition-all duration-300"
          style={{ background: panelBg }}>

          {/* Layered glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 55% at 15% 25%,rgba(0,212,180,0.10) 0%,transparent 65%),radial-gradient(ellipse 55% 50% at 85% 75%,rgba(124,106,247,0.08) 0%,transparent 65%)' }} />
            <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(${gridLine} 1px,transparent 1px),linear-gradient(90deg,${gridLine} 1px,transparent 1px)`, backgroundSize: '64px 64px' }} />
            <div className="absolute top-[38%] left-[30%] w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle,rgba(0,212,180,0.07) 0%,transparent 70%)', filter: 'blur(40px)' }} />
          </div>

          {/* ── Tamil art animations ── */}
          <style>{`
            @keyframes tamil-float {
              0%,100% { transform: translateY(0px) rotate(-1deg); }
              50%      { transform: translateY(-10px) rotate(1deg); }
            }
            @keyframes tamil-float2 {
              0%,100% { transform: translateY(0px) rotate(1deg); }
              50%      { transform: translateY(-14px) rotate(-1.5deg); }
            }
            @keyframes tamil-shimmer {
              0%   { background-position: -200% center; }
              100% { background-position: 200% center; }
            }
            @keyframes glyph-pop {
              0%,100% { transform: scale(1) rotate(0deg); opacity: 0.55; }
              50%      { transform: scale(1.18) rotate(6deg); opacity: 1; }
            }
            .tamil-word-1 {
              animation: tamil-float 5s ease-in-out infinite;
              cursor: default;
              transition: text-shadow 0.3s, transform 0.3s;
            }
            .tamil-word-1:hover {
              text-shadow: 0 0 20px #00d4b4, 0 0 50px rgba(0,212,180,0.6), 0 0 90px rgba(0,212,180,0.3) !important;
              transform: scale(1.04);
              animation-play-state: paused;
            }
            .tamil-word-2 {
              animation: tamil-float2 6s ease-in-out infinite;
              cursor: default;
              transition: text-shadow 0.3s, transform 0.3s;
            }
            .tamil-word-2:hover {
              text-shadow: 0 0 20px #7c6af7, 0 0 50px rgba(124,106,247,0.6), 0 0 90px rgba(124,106,247,0.3) !important;
              transform: scale(1.04);
              animation-play-state: paused;
            }
            .tamil-glyph {
              transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), opacity 0.25s, filter 0.25s;
              cursor: default;
            }
            .tamil-glyph:hover {
              transform: scale(1.35) rotate(-8deg) !important;
              opacity: 1 !important;
              filter: drop-shadow(0 0 10px currentColor);
            }
          `}</style>

          {/* ── Tamil art: "தமிழ் எழுது" — vivid, animated ── */}
          <div className="absolute inset-0 select-none flex flex-col items-start justify-center pl-8" style={{ maxWidth: '44%', pointerEvents: 'none' }}>
            <div style={{ pointerEvents: 'auto' }}>
              {/* தமிழ் */}
              <div className="tamil-word-1" style={{
                fontSize: 112,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: '-0.03em',
                color: dark ? '#00d4b4' : '#009e87',
                textShadow: dark
                  ? '0 0 40px rgba(0,212,180,0.35), 0 0 80px rgba(124,106,247,0.20)'
                  : '0 2px 16px rgba(0,158,135,0.25)',
              }}>தமிழ்</div>

              {/* Accent divider */}
              <div style={{ height: 3, width: 90, borderRadius: 99, margin: '10px 0 18px', background: 'linear-gradient(90deg,#00d4b4,#7c6af7)' }} />

              {/* எழுது */}
              <div className="tamil-word-2" style={{
                fontSize: 92,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: '-0.03em',
                color: dark ? '#7c6af7' : '#5b4fd4',
                textShadow: dark
                  ? '0 0 40px rgba(124,106,247,0.40), 0 0 80px rgba(0,212,180,0.20)'
                  : '0 2px 16px rgba(91,79,212,0.25)',
              }}>எழுது</div>

              {/* Small decorative glyphs */}
              <div className="flex items-end gap-5 mt-10">
                {[
                  { ch: 'அ', size: 38, color: dark ? '#00d4b4' : '#009e87', delay: '0s' },
                  { ch: 'இ', size: 44, color: dark ? '#7c6af7' : '#5b4fd4', delay: '0.4s' },
                  { ch: 'உ', size: 34, color: dark ? '#00d4b4' : '#009e87', delay: '0.8s' },
                  { ch: 'ஆ', size: 50, color: dark ? '#7c6af7' : '#5b4fd4', delay: '1.2s' },
                ].map(({ ch, size, color, delay }) => (
                  <span key={ch} className="tamil-glyph" style={{
                    fontSize: size,
                    fontWeight: 800,
                    color,
                    lineHeight: 1,
                    opacity: dark ? 0.70 : 0.60,
                    display: 'inline-block',
                    animation: `glyph-pop 3s ease-in-out ${delay} infinite`,
                  }}>{ch}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Content — right side of left panel */}
          <div className="relative space-y-10 ml-auto max-w-[380px] mr-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium"
              style={{ background: 'rgba(0,212,180,0.10)', border: '1px solid rgba(0,212,180,0.25)', color: '#00b89e' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              AI-powered Tamil writing assistant
            </div>

            <div className="space-y-4">
              <h1 className="text-[48px] font-bold leading-[1.08] tracking-tight transition-colors" style={{ color: heading }}>
                Write Tamil<br />
                <span style={{ background: 'linear-gradient(90deg,#00d4b4 0%,#7c6af7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  with confidence.
                </span>
              </h1>
              <p className="text-base leading-relaxed max-w-[340px] transition-colors" style={{ color: body }}>
                Grammar checking, smart transliteration, and real-time AI feedback — all explained in Tamil.
              </p>
            </div>

            <div className="space-y-3 max-w-[360px]">
              {[
                { icon: '✍️', title: 'Grammar Analysis', desc: 'Strict error detection, zero noise', accent: '#00d4b4' },
                { icon: '🌐', title: 'Transliteration', desc: 'Type English, get Tamil instantly', accent: '#7c6af7' },
                { icon: '⚡', title: 'AI Feedback', desc: 'Corrections explained in Tamil', accent: '#00d4b4' },
              ].map(({ icon, title, desc, accent }) => (
                <div key={title} className="flex items-center gap-4 p-4 rounded-2xl transition-all"
                  style={{ background: featCard, border: `1px solid ${featBorder}` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: `${accent}14`, border: `1px solid ${accent}28` }}>
                    {icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold transition-colors" style={{ color: heading }}>{title}</p>
                    <p className="text-xs mt-0.5 transition-colors" style={{ color: muted }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative ml-auto max-w-[380px] mr-6">
            <p className="text-xs transition-colors" style={{ color: muted }}>© 2025 SayTamil · Free plan: 10 analyses/day</p>
          </div>
        </div>

        {/* ── Right form panel (45%) ── */}
        <div className="flex-1 lg:w-[45%] flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-[380px]">

            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/saytamil-logo.png" alt="SayTamil" className="w-9 h-9 rounded-xl object-cover" />
              <span className="font-bold text-lg transition-colors" style={{ color: heading }}>SayTamil</span>
            </div>

            {/* Glass card */}
            <div className="rounded-2xl p-8 transition-all duration-300"
              style={{ background: cardBg, border: `1px solid ${cardBorder}`, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', boxShadow: cardShadow }}>

              <div className="mb-6">
                <h2 className="text-2xl font-bold transition-colors" style={{ color: heading }}>
                  {mode === 'login'  && 'Welcome back'}
                  {mode === 'signup' && 'Create account'}
                  {mode === 'forgot' && 'Reset password'}
                  {mode === 'otp'    && 'Check your email'}
                </h2>
                <p className="text-sm mt-1.5 transition-colors" style={{ color: muted }}>
                  {mode === 'login'  && 'Sign in to continue to SayTamil'}
                  {mode === 'signup' && "Join SayTamil — it's free"}
                  {mode === 'forgot' && "We'll send a 6-digit code to your email"}
                  {mode === 'otp'    && `Code sent to ${email}`}
                </p>
              </div>

              {alert && <div className="mb-5"><Alert message={alert.message} type={alert.type} /></div>}

              {(mode === 'login' || mode === 'signup') && (
                <>
                  <button onClick={handleGoogleLogin} disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 mb-5 active:scale-[0.98] hover:opacity-80"
                    style={{ background: gBtn, border: `1px solid ${gBorder}`, color: gText }}>
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex-1 h-px" style={{ background: divider }} />
                    <span className="text-xs transition-colors" style={{ color: muted }}>or continue with email</span>
                    <div className="flex-1 h-px" style={{ background: divider }} />
                  </div>
                </>
              )}

              {/* ── Login form ── */}
              {mode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5 transition-colors" style={{ color: body }}>Email address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com" disabled={isLoading}
                      className={inputCls} style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5 transition-colors" style={{ color: body }}>Password</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={password}
                        onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                        disabled={isLoading} className={inputCls + ' pr-16'} style={inputStyle} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold" style={{ color: '#00b89e' }}>
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end -mt-1">
                    <button type="button" onClick={() => switchMode('forgot')}
                      className="text-xs font-medium hover:opacity-70 transition-opacity" style={{ color: '#00b89e' }}>
                      Forgot password?
                    </button>
                  </div>
                  <button type="submit" disabled={isLoading} className={primaryBtn}
                    style={{ background: 'linear-gradient(135deg,#00d4b4,#7c6af7)', boxShadow: '0 4px 20px rgba(0,212,180,0.30)' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    {isLoading ? 'Signing in…' : 'Sign in'}
                  </button>
                  <p className="text-center text-sm pt-1 transition-colors" style={{ color: muted }}>
                    Don&apos;t have an account?{' '}
                    <button type="button" onClick={() => switchMode('signup')}
                      className="font-semibold hover:opacity-70 transition-opacity" style={{ color: '#00b89e' }}>
                      Create one
                    </button>
                  </p>
                </form>
              )}

              {/* ── Signup form ── */}
              {mode === 'signup' && (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5 transition-colors" style={{ color: body }}>Full name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                      placeholder="Your name" disabled={isLoading} className={inputCls} style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5 transition-colors" style={{ color: body }}>Email address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com" disabled={isLoading} className={inputCls} style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5 transition-colors" style={{ color: body }}>Password</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={password}
                        onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                        disabled={isLoading} className={inputCls + ' pr-16'} style={inputStyle} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold" style={{ color: '#00b89e' }}>
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <PasswordStrength password={password} dark={dark} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5 transition-colors" style={{ color: body }}>Confirm password</label>
                    <input type={showPassword ? 'text' : 'password'} value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••"
                      disabled={isLoading} className={inputCls} style={inputStyle} />
                    {confirmPassword && (
                      <p className={`text-xs mt-1.5 ${password === confirmPassword ? 'text-emerald-500' : 'text-red-500'}`}>
                        {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                      </p>
                    )}
                  </div>
                  <button type="submit" disabled={isLoading || !isPasswordStrong(password)} className={primaryBtn}
                    style={{ background: 'linear-gradient(135deg,#00d4b4,#7c6af7)', boxShadow: '0 4px 20px rgba(0,212,180,0.30)' }}>
                    {isLoading ? 'Creating account…' : 'Create account'}
                  </button>
                  <p className="text-center text-sm pt-1 transition-colors" style={{ color: muted }}>
                    Already have an account?{' '}
                    <button type="button" onClick={() => switchMode('login')}
                      className="font-semibold hover:opacity-70 transition-opacity" style={{ color: '#00b89e' }}>
                      Sign in
                    </button>
                  </p>
                </form>
              )}

              {/* ── Forgot password ── */}
              {mode === 'forgot' && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5 transition-colors" style={{ color: body }}>Email address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com" disabled={isLoading} className={inputCls} style={inputStyle} />
                  </div>
                  <button type="submit" disabled={isLoading} className={primaryBtn}
                    style={{ background: 'linear-gradient(135deg,#00d4b4,#7c6af7)', boxShadow: '0 4px 20px rgba(0,212,180,0.30)' }}>
                    {isLoading ? 'Sending OTP…' : 'Send OTP'}
                  </button>
                  <p className="text-center text-sm pt-1 transition-colors" style={{ color: muted }}>
                    <button type="button" onClick={() => switchMode('login')}
                      className="font-semibold hover:opacity-70 transition-opacity" style={{ color: '#00b89e' }}>
                      ← Back to sign in
                    </button>
                  </p>
                </form>
              )}

              {/* ── OTP + new password ── */}
              {mode === 'otp' && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5 transition-colors" style={{ color: body }}>6-digit OTP</label>
                    <input type="text" value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000" maxLength={6} disabled={isLoading}
                      className={inputCls + ' text-center text-2xl tracking-[0.5em] font-bold'} style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5 transition-colors" style={{ color: body }}>New password</label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                      placeholder="••••••••" disabled={isLoading} className={inputCls} style={inputStyle} />
                    <PasswordStrength password={newPassword} dark={dark} />
                  </div>
                  <button type="submit" disabled={isLoading || !isPasswordStrong(newPassword)} className={primaryBtn}
                    style={{ background: 'linear-gradient(135deg,#00d4b4,#7c6af7)', boxShadow: '0 4px 20px rgba(0,212,180,0.30)' }}>
                    {isLoading ? 'Resetting…' : 'Reset password'}
                  </button>
                  <p className="text-center text-sm pt-1 transition-colors" style={{ color: muted }}>
                    Didn&apos;t receive it?{' '}
                    <button type="button" onClick={() => switchMode('forgot')}
                      className="font-semibold hover:opacity-70 transition-opacity" style={{ color: '#00b89e' }}>
                      Resend OTP
                    </button>
                  </p>
                </form>
              )}

            </div>{/* end glass card */}
          </div>
        </div>{/* end right panel */}
      </div>{/* end body */}
    </div>
  );
}

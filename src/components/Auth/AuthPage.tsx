'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

type Mode = 'login' | 'signup' | 'forgot' | 'otp';
type AlertType = 'error' | 'success' | 'warning';

function Alert({ message, type }: { message: string; type: AlertType }) {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  };
  const icons = {
    error: '✕',
    success: '✓',
    warning: '⚠',
  };
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${styles[type]}`}>
      <span className="mt-0.5 font-bold">{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'At least 8 characters', ok: password.length >= 8 },
    { label: 'Contains a number', ok: /\d/.test(password) },
    { label: 'Contains a symbol (!@#$...)', ok: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];
  if (!password) return null;
  return (
    <div className="mt-2 space-y-1">
      {checks.map(c => (
        <p key={c.label} className={`text-xs ${c.ok ? 'text-green-600' : 'text-gray-400'}`}>
          {c.ok ? '✓' : '○'} {c.label}
        </p>
      ))}
    </div>
  );
}

function isPasswordStrong(p: string) {
  return p.length >= 8 && /\d/.test(p) && /[!@#$%^&*(),.?":{}|<>]/.test(p);
}

export function AuthPage({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const [mode, setMode] = useState<Mode>('login');
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

  const inputClass = "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm";
  const btnClass = "w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-md text-sm";

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await signIn('google', { callbackUrl: '/' });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlert();
    if (!email || !password) return notify('Please fill in all fields', 'warning');
    setIsLoading(true);
    const res = await signIn('credentials', { email, password, redirect: false });
    setIsLoading(false);
    if (res?.error) {
      notify('Invalid email or password. If you signed up with Google, please use the Google button above.', 'error');
      return;
    }
    notify('Welcome back!', 'success');
    onAuthSuccess();
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlert();
    if (!email || !password || !confirmPassword) return notify('Please fill in all fields', 'warning');
    if (!isPasswordStrong(password)) return notify('Password does not meet the requirements below', 'warning');
    if (password !== confirmPassword) return notify('Passwords do not match', 'error');
    setIsLoading(true);
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    setIsLoading(false);
    if (res.status === 409) {
      notify('An account with this email already exists. Please log in instead.', 'error');
      setTimeout(() => switchMode('login'), 2000);
      return;
    }
    if (!res.ok) return notify(data.error || 'Signup failed. Please try again.', 'error');
    notify('Account created successfully! Please log in.', 'success');
    setTimeout(() => switchMode('login'), 1500);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlert();
    if (!email) return notify('Please enter your email address', 'warning');
    setIsLoading(true);
    const res = await fetch('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, type: 'reset' }),
    });
    const data = await res.json();
    setIsLoading(false);
    if (res.status === 404) return notify('No account found with this email address', 'error');
    if (!res.ok) return notify(data.error || 'Failed to send OTP. Try again.', 'error');
    notify('OTP sent! Check your inbox (and spam folder).', 'success');
    setTimeout(() => switchMode('otp'), 1000);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlert();
    if (!otp || !newPassword) return notify('Please fill in all fields', 'warning');
    if (!isPasswordStrong(newPassword)) return notify('Password does not meet the requirements below', 'warning');
    setIsLoading(true);
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword }),
    });
    const data = await res.json();
    setIsLoading(false);
    if (!res.ok) return notify(data.error || 'Invalid or expired OTP. Please try again.', 'error');
    notify('Password reset successfully! Redirecting to login...', 'success');
    setTimeout(() => switchMode('login'), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'forgot' && 'Forgot Password'}
            {mode === 'otp' && 'Enter OTP'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {mode === 'login' && 'Sign in to SayTamil'}
            {mode === 'signup' && 'Join SayTamil today'}
            {mode === 'forgot' && "We'll send a 6-digit code to your email"}
            {mode === 'otp' && `Code sent to ${email}`}
          </p>
        </div>

        {/* Inline Alert */}
        {alert && <div className="mb-4"><Alert message={alert.message} type={alert.type} /></div>}

        {/* Google Button */}
        {(mode === 'login' || mode === 'signup') && (
          <>
            <button onClick={handleGoogleLogin} disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all shadow-sm disabled:opacity-60 mb-4 text-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-gray-400 text-xs">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
          </>
        )}

        {/* Login */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Email address" disabled={isLoading} className={inputClass} />
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Password" disabled={isLoading} className={inputClass + ' pr-16'} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700 text-xs font-semibold">
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="text-right">
              <button type="button" onClick={() => switchMode('forgot')} className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                Forgot password?
              </button>
            </div>
            <button type="submit" disabled={isLoading} className={btnClass}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
            <p className="text-center text-gray-500 text-sm pt-1">
              No account?{' '}
              <button type="button" onClick={() => switchMode('signup')} className="text-blue-600 hover:text-blue-700 font-semibold">Sign up</button>
            </p>
          </form>
        )}

        {/* Signup */}
        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-3">
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Full Name" disabled={isLoading} className={inputClass} />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Email address" disabled={isLoading} className={inputClass} />
            <div>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Password" disabled={isLoading} className={inputClass + ' pr-16'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700 text-xs font-semibold">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <PasswordStrength password={password} />
            </div>
            <div>
              <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password" disabled={isLoading} className={inputClass} />
              {confirmPassword && (
                <p className={`text-xs mt-1 ${password === confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                  {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>
            <button type="submit" disabled={isLoading || !isPasswordStrong(password)} className={btnClass}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
            <p className="text-center text-gray-500 text-sm pt-1">
              Have an account?{' '}
              <button type="button" onClick={() => switchMode('login')} className="text-blue-600 hover:text-blue-700 font-semibold">Log in</button>
            </p>
          </form>
        )}

        {/* Forgot Password */}
        {mode === 'forgot' && (
          <form onSubmit={handleSendOtp} className="space-y-3">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address" disabled={isLoading} className={inputClass} />
            <button type="submit" disabled={isLoading} className={btnClass}>
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
            <p className="text-center text-gray-500 text-sm pt-1">
              <button type="button" onClick={() => switchMode('login')} className="text-blue-600 hover:text-blue-700 font-semibold">← Back to login</button>
            </p>
          </form>
        )}

        {/* OTP + New Password */}
        {mode === 'otp' && (
          <form onSubmit={handleResetPassword} className="space-y-3">
            <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 6-digit OTP" maxLength={6} disabled={isLoading}
              className={inputClass + ' text-center text-2xl tracking-[0.5em] font-bold'} />
            <div>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                placeholder="New Password" disabled={isLoading} className={inputClass} />
              <PasswordStrength password={newPassword} />
            </div>
            <button type="submit" disabled={isLoading || !isPasswordStrong(newPassword)} className={btnClass}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
            <p className="text-center text-gray-500 text-sm pt-1">
              Didn't receive it?{' '}
              <button type="button" onClick={() => switchMode('forgot')} className="text-blue-600 hover:text-blue-700 font-semibold">Resend OTP</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AuthPage } from '@/components/Auth/AuthPage';

export function SignupPageClient() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.replace('/tool');
  }, [session, router]);

  if (status === 'loading' || session) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <AuthPage onAuthSuccess={() => router.replace('/tool')} initialMode="signup" />;
}

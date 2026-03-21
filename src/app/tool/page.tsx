'use client';

import { useSession } from 'next-auth/react';
import { AuthPage } from '@/components/Auth/AuthPage';
import { MainLayout } from '@/components/Layout/MainLayout';

export default function ToolPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <AuthPage onAuthSuccess={() => {}} />;
  }

  return <MainLayout />;
}

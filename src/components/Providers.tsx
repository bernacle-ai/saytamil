'use client';

import { SessionProvider } from 'next-auth/react';
import { ChatProvider } from '@/contexts/ChatContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { Toast } from './UI/Toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ChatProvider>
        <ToastProvider>
          {children}
          <Toast />
        </ToastProvider>
      </ChatProvider>
    </SessionProvider>
  );
}

'use client';

import { SessionProvider } from 'next-auth/react';
import { ChatProvider } from '@/contexts/ChatContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { UsageProvider } from '@/contexts/UsageContext';
import { Toast } from './UI/Toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ChatProvider>
        <ToastProvider>
          <UsageProvider>
            {children}
            <Toast />
          </UsageProvider>
        </ToastProvider>
      </ChatProvider>
    </SessionProvider>
  );
}

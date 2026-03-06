'use client';

import { ChatProvider } from '@/contexts/ChatContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { Toast } from './UI/Toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      <ToastProvider>
        {children}
        <Toast />
      </ToastProvider>
    </ChatProvider>
  );
}

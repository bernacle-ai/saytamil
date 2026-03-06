'use client';

import { useState, useEffect } from 'react';
import { AuthPage } from '@/components/Auth/AuthPage';
import { MainLayout } from '@/components/Layout/MainLayout';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('tamil_chat_user');
    setIsAuthenticated(!!user);
    setIsLoading(false);
  }, []);

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  return <MainLayout />;
}

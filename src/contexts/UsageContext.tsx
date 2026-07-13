'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface UsageData {
  used: number;
  limit: number;
  remaining: number;
  plan?: string;
}

interface UsageContextType {
  usage: UsageData | null;
  refreshUsage: () => Promise<void>;
  incrementUsage: () => Promise<void>;
}

const UsageContext = createContext<UsageContextType>({
  usage: null,
  refreshUsage: async () => {},
  incrementUsage: async () => {},
});

export function UsageProvider({ children }: { children: ReactNode }) {
  const [usage, setUsage] = useState<UsageData | null>(null);

  const refreshUsage = useCallback(async () => {
    try {
      const res = await fetch('/api/usage');
      if (res.ok) {
        const data = await res.json();
        setUsage(data);
      }
    } catch {
      // silent
    }
  }, []);

  const incrementUsage = useCallback(async () => {
    try {
      const res = await fetch('/api/usage', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setUsage(data); // immediately update shared state
      }
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    refreshUsage();
  }, [refreshUsage]);

  return (
    <UsageContext.Provider value={{ usage, refreshUsage, incrementUsage }}>
      {children}
    </UsageContext.Provider>
  );
}

export function useUsage() {
  return useContext(UsageContext);
}

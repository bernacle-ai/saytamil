import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tamil Grammar Tool | SayTamil',
  description: 'AI-powered Tamil grammar checker. Fix grammar, spelling, and sandhi errors instantly.',
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Tamil Grammar Checker Tool — Check Tamil Online | SayTamil',
  description: 'Free AI Tamil grammar checker. Paste your Tamil text and get instant corrections for grammar, spelling, sandhi rules, and verb forms.',
  alternates: { canonical: 'https://www.saytamil.com/tool' },
};

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return children;
}

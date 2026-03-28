import type { Metadata } from 'next';
import { LoginPageClient } from './LoginPageClient';

export const metadata: Metadata = {
  title: 'Sign In to SayTamil — Tamil Grammar Checker',
  description: 'Sign in to SayTamil to access your Tamil grammar checker, writing history, and unlimited AI-powered Tamil writing assistance.',
  alternates: { canonical: 'https://www.saytamil.com/login' },
  openGraph: {
    title: 'Sign In to SayTamil',
    description: 'Sign in to access unlimited AI-powered Tamil grammar checking and writing assistance.',
    url: 'https://www.saytamil.com/login',
    type: 'website',
  },
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginPageClient />;
}

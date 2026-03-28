import type { Metadata } from 'next';
import { SignupPageClient } from './SignupPageClient';

export const metadata: Metadata = {
  title: 'Create Free Account — SayTamil Tamil Grammar Checker',
  description: 'Create a free SayTamil account to get unlimited Tamil grammar checking, AI writing assistance, and persistent chat history. No credit card needed.',
  alternates: { canonical: 'https://www.saytamil.com/signup' },
  openGraph: {
    title: 'Create Free Account — SayTamil',
    description: 'Join SayTamil free. Unlimited Tamil grammar checking, AI writing assistance, and chat history.',
    url: 'https://www.saytamil.com/signup',
    type: 'website',
  },
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return <SignupPageClient />;
}

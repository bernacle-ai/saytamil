import type { Metadata } from 'next';
import Link from 'next/link';
import { NavBar } from '@/components/home/NavBar';
import { Footer } from '@/components/home/Footer';
import { PricingSection } from '@/components/home/PricingSection';

export const metadata: Metadata = {
  title: 'Pricing — Free, Pro & Team Plans | SayTamil Tamil Grammar Checker',
  description: 'SayTamil pricing plans. Free plan with 10 checks/day. Pro at ₹299/month for unlimited checks. Team plan with API access.',
  alternates: { canonical: 'https://www.saytamil.com/pricing' },
};

export default function PricingPage() {
  return (
    <div className="bg-white min-h-screen">
      <NavBar />
      <main className="pt-20">
        <div className="text-center pt-12 pb-2 px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Plans & Pricing</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Start free. Upgrade when you need more. No hidden fees.
          </p>
        </div>
        <PricingSection />
        <div className="text-center pb-16 px-4">
          <p className="text-gray-500 text-sm">
            Questions?{' '}
            <Link href="/contact" className="text-teal-600 hover:underline">Contact us</Link>
            {' '}— we respond within 24 hours.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

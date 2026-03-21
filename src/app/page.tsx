import { NavBar } from '@/components/home/NavBar';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { DemoSection } from '@/components/home/DemoSection';
import { UseCasesSection } from '@/components/home/UseCasesSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { PricingSection } from '@/components/home/PricingSection';
import { FAQSection } from '@/components/home/FAQSection';
import { CTABanner } from '@/components/home/CTABanner';
import { Footer } from '@/components/home/Footer';

export default function HomePage() {
  return (
    <div className="bg-white text-gray-900">
      <NavBar />
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <UseCasesSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTABanner />
      <Footer />
    </div>
  );
}

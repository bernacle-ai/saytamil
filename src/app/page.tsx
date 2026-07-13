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

const siteNavigationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SiteLinksSearchBox',
  url: 'https://www.saytamil.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.saytamil.com/tool?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

const siteNavigationElements = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'SayTamil Navigation',
  itemListElement: [
    { '@type': 'ListItem', position: 1, url: 'https://www.saytamil.com/tool', name: 'Tamil Grammar Checker Tool', description: 'Free AI Tamil grammar checker — check grammar, spelling, sandhi rules instantly' },
    { '@type': 'ListItem', position: 2, url: 'https://www.saytamil.com/pricing', name: 'Pricing', description: 'Free, Pro and Team plans for Tamil grammar checking' },
    { '@type': 'ListItem', position: 3, url: 'https://www.saytamil.com/tamil-grammar-checker', name: 'Tamil Grammar Guide', description: 'Learn Tamil grammar rules with examples' },
    { '@type': 'ListItem', position: 4, url: 'https://www.saytamil.com/tanglish-to-tamil', name: 'Tanglish to Tamil', description: 'Type Tamil using English letters' },
    { '@type': 'ListItem', position: 5, url: 'https://www.saytamil.com/contact', name: 'Contact', description: 'Get in touch with the SayTamil team' },
  ],
};

export default function HomePage() {
  return (
    <div className="bg-white text-gray-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationElements) }} />
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

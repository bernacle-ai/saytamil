import type { Metadata } from 'next';
import { Noto_Sans_Tamil, Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { defaultMetadata } from '@/lib/seo/metadata';
import {
  softwareApplicationSchema,
  faqSchema,
  organizationSchema,
} from '@/lib/seo/structuredData';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const notoSansTamil = Noto_Sans_Tamil({
  subsets: ['tamil'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-tamil',
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSansTamil.variable}`}>
      <head>
        {/* Hreflang tags */}
        <link rel="alternate" hrefLang="en-IN" href="https://saytamil.com/" />
        <link rel="alternate" hrefLang="ta" href="https://saytamil.com/ta" />
        <link rel="alternate" hrefLang="x-default" href="https://saytamil.com/" />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import { Metadata } from 'next'

export const defaultMetadata: Metadata = {
  title: {
    default: 'SayTamil — Free AI Tamil Grammar Checker',
    template: '%s | SayTamil',
  },
  description:
    'Free AI Tamil grammar checker. Fix grammar, spelling, sandhi rules & verb forms instantly. Trusted by students, writers & businesses. No signup needed.',
  keywords: [
    'tamil grammar checker',
    'tamil spell checker',
    'tamil grammar check online',
    'free tamil grammar tool',
    'tamil writing assistant',
    'tanglish to tamil',
    'tamil sandhi checker',
    'தமிழ் இலக்கண சரிபார்ப்பு',
    'தமிழ் எழுத்துப் பிழை திருத்தி',
    'தமிழ் இலக்கண கருவி',
    'online tamil grammar correction',
    'tamil grammar checker for students',
    'tamil grammar checker for content creators',
    'ai tamil proofreader',
  ],
  authors: [{ name: 'SayTamil' }],
  creator: 'SayTamil',
  metadataBase: new URL('https://saytamil.com'),
  icons: {
    icon: [
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/favicons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/favicons/favicon.ico' },
    ],
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-IN': '/',
      'ta-IN': '/ta',
    },
  },
  openGraph: {
    title: 'SayTamil — Free AI Tamil Grammar Checker',
    description:
      'Fix Tamil grammar errors in seconds. Sandhi rules, verb forms, spelling — all explained clearly.',
    url: 'https://saytamil.com',
    siteName: 'SayTamil',
    images: [
      {
        url: '/og/og-default.png',
        width: 1200,
        height: 630,
        alt: 'SayTamil Tamil Grammar Checker Tool Screenshot',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SayTamil — Free AI Tamil Grammar Checker',
    description: 'Fix Tamil grammar, spelling & sandhi errors instantly. Free, no signup.',
    images: ['/og/og-default.png'],
    creator: '@saytamil',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  verification: {
    google: 'RNBMLOIbF6kFAJe7FK9d6pRFrMHsiLoaQXmI33FJaDQ',
  },
}

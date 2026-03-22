export const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SayTamil Tamil Grammar Checker',
  operatingSystem: 'Web',
  applicationCategory: 'UtilitiesApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
  },
  description:
    'AI-powered Tamil grammar and spell checker. Supports sandhi rules, verb forms, Tanglish input, and more.',
  url: 'https://www.saytamil.com',
}

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is this Tamil grammar checker free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The basic grammar and spell check is 100% free with no signup required. A Pro plan is available for heavy users and teams.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it support Tanglish (romanized Tamil)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can type in English phonetics (Tanglish) and the tool converts it to Tamil script before checking grammar.',
      },
    },
    {
      '@type': 'Question',
      name: 'What grammar rules does it check?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It checks verb forms (வினைச்சொல்), sandhi rules (புணர்ச்சி), subject-verb agreement, spelling, and punctuation.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it work for formal and spoken Tamil?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. It supports both formal written Tamil (எழுத்து தமிழ்) and colloquial spoken Tamil (பேச்சு தமிழ்).',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my text stored or shared?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Your text is processed in real-time and never stored on our servers.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use this for formal Tamil (செந்தமிழ்) writing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. SayTamil is optimized for formal written Tamil (செந்தமிழ்) and handles classical grammar rules accurately.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it support Sri Lankan Tamil dialect?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The tool understands both Indian Tamil and Sri Lankan Tamil dialects and checks grammar accordingly.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is there a browser extension?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A Chrome extension is coming soon. For now, use the web tool at www.saytamil.com — it works on any browser.',
      },
    },
  ],
}

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SayTamil',
  url: 'https://www.saytamil.com',
  logo: 'https://www.saytamil.com/saytamil-logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'hello@saytamil.com',
  },
  sameAs: [
    'https://twitter.com/saytamil',
  ],
}

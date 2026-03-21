# Tamil Grammar Checker — Homepage Spec for Kiro

> **Stack assumption:** Next.js 14 (App Router) + Tailwind CSS + shadcn/ui  
> **Scope:** Landing page only (`/`). The grammar tool already exists in `/app/tool` (or wherever you have it). This homepage lives alongside it in the same repo, fully modularized.

---

## 0. Competitor Analysis — What GoTamil Does & Where You Beat Them

| Dimension | GoTamil (gotamil.in) | Your tool |
|---|---|---|
| Features shown | Tanglish → Tamil, grammar check, OCR, voice | Focus on grammar precision |
| Differentiator to claim | Broad feature set | **Accuracy, explainability, speed** |
| SEO weakness | No structured data, thin meta | Opportunity: schema markup, FAQ, hreflang |
| GEO weakness | English-only UI copy | Opportunity: Tamil-language landing sections |
| Pricing | Not shown prominently | Show it early → trust signal |
| Social proof | Vague claims | Opportunity: specific numbers, testimonials |

**Your positioning hook:** *"The grammar checker that explains why — not just what."*

---

## 1. Project Structure (Modular, Same Repo)

```
/app
  /                         ← homepage (this spec)
    page.tsx
  /tool                     ← your existing grammar tool (unchanged)
  /pricing                  ← pricing page (stub for now)
  /login                    ← auth pages (stub)
  /signup

/components
  /home                     ← homepage-only components
    HeroSection.tsx
    FeaturesSection.tsx
    DemoSection.tsx
    TestimonialsSection.tsx
    PricingSection.tsx
    FAQSection.tsx
    CTABanner.tsx
    NavBar.tsx
    Footer.tsx
  /shared                   ← reusable across tool + home
    Button.tsx
    Badge.tsx
    Logo.tsx

/lib
  /seo
    metadata.ts             ← all Next.js metadata exports
    structuredData.ts       ← JSON-LD schemas
    hreflang.ts             ← alternate lang tags

/public
  /og                       ← og:image assets
    og-default.png          ← 1200×630
    og-tamil.png            ← Tamil-language variant
```

---

## 2. SEO — Complete Implementation

### 2.1 `metadata.ts` — Export this from `/lib/seo/metadata.ts`

```ts
import { Metadata } from 'next'

export const defaultMetadata: Metadata = {
  title: {
    default: 'Tamil Grammar Checker — Free AI-Powered தமிழ் இலக்கணம் சரிபார்க்கவும்',
    template: '%s | Tamil Grammar Checker',
  },
  description:
    'Free AI Tamil grammar checker. Fix grammar, spelling, sandhi rules & verb forms instantly. Trusted by students, writers & businesses. No signup needed.',
  keywords: [
    // English
    'tamil grammar checker',
    'tamil spell checker',
    'tamil grammar check online',
    'free tamil grammar tool',
    'tamil writing assistant',
    'tanglish to tamil',
    'tamil sandhi checker',
    // Tamil-script keywords (GEO)
    'தமிழ் இலக்கண சரிபார்ப்பு',
    'தமிழ் எழுத்துப் பிழை திருத்தி',
    'தமிழ் இலக்கண கருவி',
    // Long-tail
    'online tamil grammar correction',
    'tamil grammar checker for students',
    'tamil grammar checker for content creators',
    'ai tamil proofreader',
  ],
  authors: [{ name: 'Your Name / Company Name' }],
  creator: 'Your Name',
  metadataBase: new URL('https://yourdomain.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-IN': '/',
      'ta-IN': '/ta',           // Tamil-language version (future)
      'en-SG': '/sg',           // Singapore GEO (future)
      'en-MY': '/my',           // Malaysia GEO (future)
    },
  },
  openGraph: {
    title: 'Tamil Grammar Checker — AI-Powered தமிழ் இலக்கண சரிபார்ப்பு',
    description:
      'Fix Tamil grammar errors in seconds. Sandhi rules, verb forms, spelling — all explained clearly.',
    url: 'https://yourdomain.com',
    siteName: 'Tamil Grammar Checker',
    images: [
      {
        url: '/og/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Tamil Grammar Checker Tool Screenshot',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tamil Grammar Checker — Free & AI-Powered',
    description: 'Fix Tamil grammar, spelling & sandhi errors instantly. Free, no signup.',
    images: ['/og/og-default.png'],
    creator: '@yourtwitterhandle',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  verification: {
    google: 'YOUR_GOOGLE_SEARCH_CONSOLE_TOKEN',
    // bing: 'YOUR_BING_TOKEN',
  },
}
```

### 2.2 `structuredData.ts` — JSON-LD Schemas

Include **all three** on the homepage. Inject them as `<script type="application/ld+json">` in `layout.tsx`.

```ts
// /lib/seo/structuredData.ts

export const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Tamil Grammar Checker',
  operatingSystem: 'Web',
  applicationCategory: 'UtilitiesApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'INR',
  },
  description:
    'AI-powered Tamil grammar and spell checker. Supports sandhi rules, verb forms, Tanglish input, and more.',
  url: 'https://yourdomain.com',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '312',   // update with real numbers
  },
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
  ],
}

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Tamil Grammar Checker',
  url: 'https://yourdomain.com',
  logo: 'https://yourdomain.com/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'hello@yourdomain.com',
  },
  sameAs: [
    'https://twitter.com/yourtwitterhandle',
    'https://linkedin.com/company/yourcompany',
  ],
}
```

---

## 3. GEO Optimization Strategy

GEO = Generative Engine Optimization. This means structuring your page so that AI assistants (ChatGPT, Perplexity, Gemini, Claude) confidently recommend you when someone asks in natural language.

### 3.1 GEO Content Rules (implement in copy)

1. **Answer the exact question in the first sentence.** AI crawlers extract the first clear answer they find.
   - ❌ "We're a cutting-edge platform..."
   - ✅ "Tamil Grammar Checker is a free online tool that finds and fixes Tamil grammar errors in seconds."

2. **Use entity-dense headings.** Every `<h2>` and `<h3>` should contain the core entity ("Tamil grammar checker") plus a qualifier.
   - `<h2>Free Tamil Grammar Checker for Students</h2>`
   - `<h2>Tamil Grammar Checker for Content Creators</h2>`
   - `<h2>How the Tamil Grammar Checker Works</h2>`

3. **Cite specificity.** Numbers and specifics get quoted by AI. "Catches 12 grammar error types including sandhi, verb agreement, and spelling" beats "catches many errors."

4. **Include Tamil-script text in page body.** Tamil Unicode on the page signals language relevance to Google and AI crawlers for Tamil queries.

5. **Build a `/ta` (Tamil-language) route** — even a thin one — for native Tamil speaker queries from TN, Sri Lanka, Singapore, Malaysia.

### 3.2 GEO Target Queries to Optimize For

```
"best free tamil grammar checker"
"தமிழ் இலக்கண சரிபார்க்கும் தளம்"
"tamil grammar check tool online free"
"how to check tamil grammar online"
"tamil spelling checker no signup"
"tanglish to tamil grammar fix"
```

Each of these should have a matching H2 or FAQ answer on the page.

### 3.3 Geographic Hreflang Tags

Add to `<head>` via `layout.tsx`:

```tsx
<link rel="alternate" hreflang="en-IN" href="https://yourdomain.com/" />
<link rel="alternate" hreflang="ta"    href="https://yourdomain.com/ta" />
<link rel="alternate" hreflang="en-SG" href="https://yourdomain.com/sg" />
<link rel="alternate" hreflang="en-MY" href="https://yourdomain.com/my" />
<link rel="alternate" hreflang="en-LK" href="https://yourdomain.com/lk" />
<link rel="alternate" hreflang="x-default" href="https://yourdomain.com/" />
```

**Why:** Tamil speakers are 80M+ in India, 4M in Sri Lanka, 1.8M in Malaysia, 600K+ in Singapore. Each geography has different search patterns.

---

## 4. Homepage Sections — Component Spec

### 4.1 `<NavBar />`

```
Logo (left)  |  Features · Pricing · How it Works · Blog (future)  |  Login  Sign Up (CTA)
```

- Sticky, blur-backdrop on scroll
- Sign Up button: filled, brand color
- Mobile: hamburger → sheet drawer
- No JS needed for desktop nav (pure CSS)

### 4.2 `<HeroSection />`

**Goal:** Immediately communicate what it is, who it's for, and let them try it.

```
[Above fold — full viewport height]

HEADLINE (H1):
  தமிழ் இலக்கணம் சரியாக எழுதுங்கள்
  Write Perfect Tamil Grammar — Instantly

SUBHEADLINE:
  Free AI-powered Tamil grammar checker. Catches verb form errors,
  sandhi mistakes, spelling issues — and explains every correction
  in plain language.

[Two CTAs side by side]
  [Try Free — No Signup]     [See How It Works ↓]

SOCIAL PROOF ROW (small text below CTAs):
  ✓ 10,000+ writers use it   ✓ No account needed   ✓ 100% private

[LIVE DEMO EMBED — inline grammar tool, max 3 lines of text]
  Textarea with placeholder: "இங்கே உங்கள் தமிழ் வாக்கியத்தை உள்ளிடுங்கள்..."
  Check Grammar button
  Shows 1-2 sample corrections inline
```

**SEO note:** H1 must contain "Tamil grammar checker" in English AND Tamil script.

### 4.3 `<FeaturesSection />`

H2: `Why Writers Choose This Tamil Grammar Checker`

Six feature cards. Each card has: icon, title (H3), 2-sentence description.

| # | Title | Copy |
|---|---|---|
| 1 | Grammar Error Detection | Catches 12+ error types: subject-verb agreement, tense, case endings, and more. Explains *why* each correction is needed. |
| 2 | Sandhi Rule Checker (புணர்ச்சி) | Validates complex Tamil word-joining rules that no basic spell checker touches. |
| 3 | Spelling & Sound-Alike Words | Distinguishes confusable pairs (ல vs ள, ன vs ண) that trip up even fluent writers. |
| 4 | Tanglish Input | Type in English phonetics — vanakkam, epdi irukinga — and get Tamil script back, grammar-checked. |
| 5 | Privacy First | Your text is never stored. Processed in real-time, deleted immediately. |
| 6 | Works Everywhere | No install, no plugin. Browser-based. Works on mobile, tablet, desktop. |

### 4.4 `<DemoSection />`

H2: `See the Tamil Grammar Checker in Action`

Side-by-side before/after with animation:

```
BEFORE:                          AFTER:
தோட்டத்தில் பல வண்ணப்          தோட்டத்தில் பல வண்ணப்
பூக்கள் இருந்தது.               பூக்கள் இருந்தன.
                                 
                                 [Why?] Subject-verb agreement:
                                 பூக்கள் (plural) → இருந்தன
```

3 rotating examples (students, writers, business). Cycle every 4s with fade transition.

### 4.5 `<UseCasesSection />`

H2: `Tamil Grammar Checker for Every Writer`

Three columns with distinct ICPs:

**Students (மாணவர்கள்)**
- Submit error-free Tamil essays
- Learn grammar by reading corrections
- Works for school, college, university

**Content Creators & Journalists**
- Publish polished Tamil articles
- Catch errors before they go live
- Handles formal and colloquial Tamil

**Businesses & Government**
- Professional Tamil communications
- Error-free circulars, notices, emails
- Team plan with shared checks (Pro)

### 4.6 `<TestimonialsSection />`

H2: `Trusted by Tamil Writers Across India and Beyond`

3 testimonials. Format: quote, name, role, location.

```tsx
// Placeholder — replace with real testimonials
[
  {
    quote: "Finally a tool that explains the sandhi rule instead of just changing the word.",
    name: "Priya K.",
    role: "Tamil blogger",
    location: "Chennai, Tamil Nadu",
  },
  {
    quote: "I use this before every press release. My editors have stopped sending back Tamil corrections.",
    name: "Murugan S.",
    role: "PR Manager",
    location: "Coimbatore",
  },
  {
    quote: "My students submit much better Tamil writing since I told them about this tool.",
    name: "Meenakshi T.",
    role: "Tamil Language Teacher",
    location: "Singapore",
  },
]
```

**GEO note:** Include locations like Singapore, Malaysia, Sri Lanka in future testimonials to signal diaspora relevance.

### 4.7 `<PricingSection />`

H2: `Simple, Honest Pricing`

Three tiers:

| | Free | Pro | Team |
|---|---|---|---|
| Price | ₹0 / $0 | ₹299/mo | ₹999/mo |
| Checks/day | 10 | Unlimited | Unlimited |
| Characters/check | 1,000 | 10,000 | 10,000 |
| History | ✗ | 30 days | 90 days |
| API access | ✗ | ✗ | ✓ |
| Priority support | ✗ | ✓ | ✓ |
| Seats | 1 | 1 | Up to 10 |

CTA per tier: `Start Free` / `Get Pro` / `Contact Us`

**Note:** Adjust prices to your actual model. INR pricing increases trust with Tamil Nadu users; show USD for diaspora.

### 4.8 `<FAQSection />`

H2: `Frequently Asked Questions about the Tamil Grammar Checker`

Use the 5 FAQ items from `faqSchema` above (same content, renders as visible accordion). This dual-purposes the content: visible UX + JSON-LD for AI/search.

Add 3 more:
- "Can I use this for formal Tamil (செந்தமிழ்) writing?"
- "Does it support Sri Lankan Tamil dialect?"
- "Is there a browser extension?"

### 4.9 `<CTABanner />`

Full-width band above footer.

```
Write better Tamil starting today.
Free. No signup. No download.

[Check Your Tamil Now →]
```

### 4.10 `<Footer />`

```
Logo + tagline: "AI-powered Tamil grammar, explained clearly."

Links:
  Product: Tool · Pricing · API (coming soon) · Chrome Extension (coming soon)
  Company: About · Blog · Contact
  Legal: Privacy Policy · Terms of Service

Language toggle: English | தமிழ்

© 2025 [Your Name/Company]. Made with ❤️ in Chennai.
```

---

## 5. Performance & Technical SEO Checklist

Kiro must implement all of these:

```
[ ] Next.js Image component for all images (WebP, lazy load, explicit width/height)
[ ] Font: Use next/font with display: 'swap' — no layout shift
[ ] Core Web Vitals targets: LCP < 2.5s, CLS < 0.1, INP < 200ms
[ ] Sitemap: /app/sitemap.ts — auto-generated, include /ta, /pricing
[ ] Robots.txt: /app/robots.ts — allow all, point to sitemap
[ ] Canonical tags on every page
[ ] No render-blocking scripts
[ ] All images have alt text containing "Tamil grammar checker" where natural
[ ] Page load without JS must still show hero content (SSR)
[ ] JSON-LD injected in <head> via layout.tsx, not client-side
[ ] 404 page: /app/not-found.tsx with link back to tool
```

---

## 6. ICP (Ideal Customer Profile) — Who to Target

Based on 80M+ Tamil speakers globally, your highest-value segments:

### Tier 1 — Free → Pro Conversion (India)
- **Tamil Nadu college students** — essays, assignments, entrance exams
- **Tamil bloggers & journalists** — Vikatan, Ananda Vikatan, The Hindu Tamil
- **Tamil Nadu government employees** — official documents in Tamil (mandated)

### Tier 2 — Diaspora (High willingness to pay in USD/SGD/MYR)
- **Singapore Tamil community** — 600K+ speakers, high income, tech-savvy
- **Malaysia Tamil community** — 1.8M speakers, active Tamil media
- **UK/US/Canada Tamil diaspora** — heritage language learners, parents

### Tier 3 — B2B / Team Plan
- **Tamil media companies** (Sun TV digital, Vikatan group)
- **Tamil Nadu state government departments**
- **Tamil language schools** (Singapore, UK)
- **EdTech companies** building Tamil content

### Acquisition Channels to Build Toward
1. **SEO** — this homepage spec (you own this)
2. **Reddit** — r/Tamil, r/languagelearning — share the tool, don't spam
3. **Twitter/X** — Tamil Twitter is large and active; post correction examples
4. **YouTube** — Tamil grammar tip videos linking to tool
5. **WhatsApp groups** — Tamil teachers, students; viral if tool is good
6. **Product Hunt** — launch in English, target Tamil diaspora
7. **Namma Chennai FB groups** — local community trust

---

## 7. Page-Level Metadata for Each Route

### `/` (homepage)
```ts
title: "Tamil Grammar Checker — Free AI தமிழ் இலக்கண சரிபார்ப்பு"
description: "Free AI-powered Tamil grammar checker. Fix grammar, spelling & sandhi rules instantly. No signup needed."
```

### `/pricing`
```ts
title: "Pricing — Tamil Grammar Checker"
description: "Free, Pro & Team plans for Tamil grammar checking. Start free, upgrade when you need more."
```

### `/login` and `/signup`
```ts
robots: { index: false }  // don't index auth pages
```

---

## 8. Implementation Order for Kiro

Ask Kiro to build in this exact order to avoid rework:

1. **`/lib/seo/metadata.ts`** — metadata config
2. **`/lib/seo/structuredData.ts`** — JSON-LD schemas
3. **`/app/layout.tsx`** — inject metadata + JSON-LD + fonts + hreflang
4. **`/app/robots.ts`** + **`/app/sitemap.ts`** — auto-generated
5. **`/components/home/NavBar.tsx`** — with Login/Sign Up buttons
6. **`/components/home/HeroSection.tsx`** — H1, subhead, CTAs, inline demo
7. **`/components/home/FeaturesSection.tsx`**
8. **`/components/home/DemoSection.tsx`**
9. **`/components/home/UseCasesSection.tsx`**
10. **`/components/home/TestimonialsSection.tsx`**
11. **`/components/home/PricingSection.tsx`**
12. **`/components/home/FAQSection.tsx`** — accordion + matches JSON-LD
13. **`/components/home/CTABanner.tsx`**
14. **`/components/home/Footer.tsx`**
15. **`/app/page.tsx`** — compose all sections
16. **`/public/og/og-default.png`** — generate 1200×630 OG image
17. **`/app/not-found.tsx`** — custom 404

---

## 9. Prompt to Give Kiro

Copy-paste this to Kiro after giving it this spec file:

```
Read HOMEPAGE_SPEC.md fully before writing any code.

Build the homepage for a Tamil grammar checker web app using Next.js 14 App Router + TypeScript + Tailwind CSS.

Constraints:
- This homepage lives in the same repo as the existing grammar tool. Do not touch /app/tool or any existing routes.
- Every component goes in /components/home/. Shared components in /components/shared/.
- SEO is critical. Implement everything in Section 2 and Section 5 of the spec exactly.
- The inline demo in HeroSection should call the existing tool API at /api/check (or whichever endpoint exists).
- Design: use a clean, modern look. Primary color: deep red (#C0392B) — Tamil cultural color. Secondary: gold (#F39C12). Background: white. Tamil script should appear large and proud in the hero.
- Use next/font with a font that renders Tamil Unicode correctly (Noto Sans Tamil is safe).
- All text content must match the copy in the spec exactly (do not paraphrase or shorten).
- Build in the order listed in Section 8.
```

---

## 10. Quick Wins You Can Do Today (Before Kiro Builds)

1. **Google Search Console** — verify your domain NOW. Takes 5 min. Starts collecting data immediately.
2. **Submit sitemap** — as soon as the page is live, submit `https://yourdomain.com/sitemap.xml`
3. **Add to Product Hunt** — schedule a launch for when the homepage is live
4. **One tweet** — post a before/after correction example in Tamil. Tamil Twitter shares fast.
5. **Ask 3 Tamil writers to try it** — get 3 real testimonials to replace the placeholders above

---

*This spec is complete. Hand it to Kiro and it has everything it needs.*

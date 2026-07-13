# Kiro Spec — Earn Google Sitelinks Block

## What Are Sitelinks?
The expandable sub-links Google shows under a main result.
GoTamil has them. SayTamil doesn't yet.
Google awards them automatically when it understands your site structure clearly.
You cannot manually request them — you earn them by doing the below.

---

## 1. Add SiteNavigationElement Schema to Homepage

In `src/app/page.tsx` add this JSON-LD script in the page head.
This explicitly tells Google what your main navigation links are.

```ts
const siteNavigationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SiteLinksSearchBox',
  url: 'https://www.saytamil.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.saytamil.com/tool?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

const siteNavigationElements = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'SayTamil Navigation',
  itemListElement: [
    {
      '@type': 'SiteLinksSearchBox',
      position: 1,
      url: 'https://www.saytamil.com/tool',
      name: 'Tamil Grammar Checker Tool',
      description: 'Free AI Tamil grammar checker — check grammar, spelling, sandhi rules instantly',
    },
    {
      '@type': 'ListItem',
      position: 2,
      url: 'https://www.saytamil.com/pricing',
      name: 'Pricing',
      description: 'Free, Pro and Team plans for Tamil grammar checking',
    },
    {
      '@type': 'ListItem',
      position: 3,
      url: 'https://www.saytamil.com/tamil-grammar-checker',
      name: 'Tamil Grammar Guide',
      description: 'Learn Tamil grammar rules with examples',
    },
    {
      '@type': 'ListItem',
      position: 4,
      url: 'https://www.saytamil.com/tanglish-to-tamil',
      name: 'Tanglish to Tamil',
      description: 'Type Tamil using English letters',
    },
    {
      '@type': 'ListItem',
      position: 5,
      url: 'https://www.saytamil.com/contact',
      name: 'Contact',
      description: 'Get in touch with the SayTamil team',
    },
  ],
}
```

Inject both as `<script type="application/ld+json">` in the page.

---

## 2. Add WebSite Schema to `layout.tsx`

Add this to the existing JSON-LD in layout.tsx alongside the existing schemas:

```ts
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SayTamil',
  alternateName: 'SayTamil Tamil Grammar Checker',
  url: 'https://www.saytamil.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.saytamil.com/tool?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}
```

---

## 3. Strengthen Internal Linking

Google needs to clearly understand which pages are most important.
Add these internal links:

### In homepage (`src/app/page.tsx`)
Every section CTA must link to a specific page — not just `/tool`:
- Features section → `/tool`
- Sandhi section mention → `/sandhi-rules`
- Tanglish section mention → `/tanglish-to-tamil`
- Pricing section → `/pricing`
- Footer Product links — make sure ALL these pages are linked:
  - Tool → `/tool`
  - Tamil Grammar Guide → `/tamil-grammar-checker`
  - Sandhi Rules → `/sandhi-rules`
  - Tanglish to Tamil → `/tanglish-to-tamil`
  - Tamil Typing → `/tamil-typing`
  - Pricing → `/pricing`
  - About → `/about`
  - Contact → `/contact`

### In NavBar
Add a dropdown under "Features" or add these as nav links:
```
Tool | Tamil Grammar | Sandhi Rules | Tanglish | Pricing
```

The more pages Google sees linked from your homepage, the more it
understands your site structure and considers them important enough for sitelinks.

---

## 4. Add `description` Meta to Every Page That Is Missing It

Check these pages have unique, specific description meta tags:
- `/tool` — "Free AI Tamil grammar checker. Paste Tamil text and get instant corrections."
- `/pricing` — "Free, Pro and Team plans. Start free with 10 checks/day."
- `/about` — "SayTamil is built by an ML engineer in Chennai to help Tamil writers."
- `/contact` — "Contact the SayTamil team for support, feedback or partnerships."
- `/login` — add `robots: { index: false }` — don't index auth pages
- `/signup` — add `robots: { index: false }` — don't index auth pages

---

## 5. Add Breadcrumb Schema to All Content Pages

Already specified in SEO_PAGES_KIRO_SPEC.md — confirm it is implemented on:
- `/tamil-grammar-checker`
- `/sandhi-rules`
- `/tanglish-to-tamil`
- `/tamil-typing`
- `/about`

---

## Done When

- [ ] View Source on homepage shows WebSite JSON-LD with SearchAction
- [ ] View Source on homepage shows ItemList JSON-LD with 5 navigation items
- [ ] Footer links to all 8 pages listed above
- [ ] NavBar links to at least Tool, Pricing, and 2 content pages
- [ ] `/login` and `/signup` have `robots: noindex`
- [ ] All main pages have unique description meta tags

# Kiro Spec — Sitemap Fix + New Pages for SEO

---

## Why Google Cannot Read the Sitemap

`https://www.saytamil.com/sitemap.xml` is returning binary/corrupted XML.
Google's crawler rejects it silently — this is why tool, pricing, contact are not indexed.

The fix is to **delete the auto-generated Next.js sitemap** and replace it with a
**static `/public/sitemap.xml` file**. Static XML files are always served correctly.
Next.js `app/sitemap.ts` dynamic generation is causing the binary output issue.

---

## Step 1 — Delete the Broken Sitemap Generator

Delete this file entirely:
```
app/sitemap.ts
```

Do not replace it with another `sitemap.ts`. We are switching to static XML.

---

## Step 2 — Create `/public/sitemap.xml`

Create this exact file at `/public/sitemap.xml`.
Copy the structure from GoTamil's sitemap — plain, valid XML, no dynamic generation.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>https://www.saytamil.com/</loc>
    <lastmod>2026-03-23</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <url>
    <loc>https://www.saytamil.com/tool</loc>
    <lastmod>2026-03-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://www.saytamil.com/pricing</loc>
    <lastmod>2026-03-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://www.saytamil.com/tamil-grammar-guide</loc>
    <lastmod>2026-03-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://www.saytamil.com/sandhi-rules</loc>
    <lastmod>2026-03-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://www.saytamil.com/tanglish-to-tamil</loc>
    <lastmod>2026-03-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.saytamil.com/tamil-typing</loc>
    <lastmod>2026-03-22</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    </url>

  <url>
    <loc>https://www.saytamil.com/contact</loc>
    <lastmod>2026-03-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://www.saytamil.com/signup</loc>
    <lastmod>2026-03-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://www.saytamil.com/login</loc>
    <lastmod>2026-03-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://www.saytamil.com/about</loc>
    <lastmod>2026-03-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://www.saytamil.com/privacy</loc>
    <lastmod>2026-03-23</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

  <url>
    <loc>https://www.saytamil.com/terms</loc>
    <lastmod>2026-03-23</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

</urlset>
```

---

## Step 3 — Fix `public/robots.txt`

Update the Sitemap line to point to the new static file (same URL, but now it works):

```
Sitemap: https://www.saytamil.com/sitemap.xml
```

No other changes to robots.txt.

---

## Step 4 — Create the 3 New SEO Pages

These pages each need their own route so Google indexes them as standalone pages.
Each page targets a specific high-volume search query.

### Page 1: `/app/tamil-grammar-guide/page.tsx`

**Target query:** "Tamil grammar guide", "தமிழ் இலக்கண விதிகள்"

Metadata:
```
title: "Tamil Grammar Guide — Rules, Examples & Checker | SayTamil"
description: "Complete Tamil grammar guide covering verb forms, sandhi rules, case endings, and tense. Free examples with our AI grammar checker."
canonical: https://www.saytamil.com/tamil-grammar-guide
```

Page content sections (build as a real content page, not a stub):
- H1: `Tamil Grammar Guide — இலக்கண வழிகாட்டி`
- Section: Verb forms (வினைச்சொல்) — 3 examples with correct/incorrect
- Section: Sandhi rules (புணர்ச்சி) — 3 examples
- Section: Subject-verb agreement — 3 examples
- Section: Common mistakes Tamil writers make
- CTA at bottom: "Check your Tamil grammar now →" linking to `/tool`

---

### Page 2: `/app/sandhi-rules/page.tsx`

**Target query:** "Tamil sandhi rules", "புணர்ச்சி விதிகள்"

Metadata:
```
title: "Tamil Sandhi Rules (புணர்ச்சி விதிகள்) — Examples & Checker | SayTamil"
description: "Learn Tamil sandhi rules with clear examples. Check your sandhi automatically with our free AI Tamil grammar tool."
canonical: https://www.saytamil.com/sandhi-rules
```

Page content sections:
- H1: `Tamil Sandhi Rules — புணர்ச்சி விதிகள்`
- What is sandhi in Tamil (2 paragraphs)
- 5 sandhi rule types with before/after word examples in Tamil script
- Common sandhi errors table
- CTA: "Check your sandhi rules automatically →" linking to `/tool`

---

### Page 3: `/app/tanglish-to-tamil/page.tsx`

**Target query:** "Tanglish to Tamil", "Tanglish converter"

Metadata:
```
title: "Tanglish to Tamil Converter — Type in English, Get Tamil | SayTamil"
description: "Type Tamil in English letters (Tanglish) and get correct Tamil script instantly. Free Tanglish to Tamil converter with grammar check."
canonical: https://www.saytamil.com/tanglish-to-tamil
```

Page content sections:
- H1: `Tanglish to Tamil — Type Tamil in English`
- What is Tanglish (1 paragraph)
- Conversion table: common Tanglish words → Tamil script (10 examples)
- How to use SayTamil with Tanglish input (3 steps)
- Embed the tool or link directly: "Try Tanglish input now →" linking to `/tool`

---

## Step 5 — Add Metadata to Existing Pages That Aren't Indexed

These pages exist but Google isn't indexing them — they're missing proper metadata.

### `/app/tool/page.tsx` — add this metadata export:
```
title: "Free Tamil Grammar Checker Tool — Check Tamil Online | SayTamil"
description: "Free AI Tamil grammar checker. Paste your Tamil text and get instant corrections for grammar, spelling, sandhi rules, and verb forms."
canonical: https://www.saytamil.com/tool
```

### `/app/pricing/page.tsx` — add this metadata export:
```
title: "Pricing — Free, Pro & Team Plans | SayTamil Tamil Grammar Checker"
description: "SayTamil pricing plans. Free plan with 10 checks/day. Pro at ₹299/month for unlimited checks. Team plan with API access."
canonical: https://www.saytamil.com/pricing
```

### `/app/contact/page.tsx` — add this metadata export:
```
title: "Contact SayTamil — Tamil Grammar Checker Support"
description: "Get in touch with the SayTamil team. Questions about the Tamil grammar checker, pricing, or API access."
canonical: https://www.saytamil.com/contact
```

---

## Step 6 — Create Stub Pages for Footer Links (Currently 404)

These are linked in the footer but return 404. 404 pages in the sitemap hurt indexing.

### `/app/about/page.tsx`
Simple page. Content:
- H1: `About SayTamil`
- 2 paragraphs: what SayTamil is, who built it, why (built by an ML engineer in Chennai to make correct Tamil writing accessible to everyone)
- Link back to `/tool`

Metadata:
```
title: "About SayTamil — AI Tamil Grammar Checker Built in Chennai"
description: "SayTamil is a free AI-powered Tamil grammar checker built by an ML engineer in Chennai to help students, writers, and businesses write correct Tamil."
```

---

## Build Order

1. Delete `app/sitemap.ts`
2. Create `public/sitemap.xml` (static file, exact XML above)
3. Update `public/robots.txt` sitemap line
4. Add metadata to `tool`, `pricing`, `contact` pages
5. Create `app/about/page.tsx`
6. Create `app/tamil-grammar-guide/page.tsx`
7. Create `app/sandhi-rules/page.tsx`
8. Create `app/tanglish-to-tamil/page.tsx`

---

## Done When

- [ ] `https://www.saytamil.com/sitemap.xml` opens as readable XML in browser (not binary)
- [ ] Sitemap contains exactly 12 URLs all starting with `https://www.saytamil.com`
- [ ] `/tamil-grammar-guide`, `/sandhi-rules`, `/tanglish-to-tamil` all load without 404
- [ ] `/about` loads without 404
- [ ] View Source on `/tool` shows a `<title>` tag with "Tamil Grammar Checker Tool"

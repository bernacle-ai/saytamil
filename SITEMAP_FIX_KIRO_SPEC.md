# Kiro Spec — Fix Sitemap Binary Issue (Google Cannot Read)

## Root Cause

`/public/sitemap.xml` exists and is valid XML. But Next.js middleware is
intercepting the `/sitemap.xml` request before it reaches the static file,
causing it to return binary/corrupted data to Google.

The fix is to stop using a static file for the sitemap and instead serve it
through a **Route Handler** (`app/sitemap.xml/route.ts`) that explicitly sets
the correct `Content-Type: application/xml` header and returns the raw XML string.

This is the correct production pattern for Next.js 14 App Router on Vercel.

---

## Step 1 — Delete the Static File

Delete:
```
public/sitemap.xml
```

---

## Step 2 — Create the Route Handler

Create this file: `app/sitemap.xml/route.ts`

```ts
import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
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
    <loc>https://www.saytamil.com/tamil-grammar-checker</loc>
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
    <lastmod>2026-03-23</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://www.saytamil.com/pricing</loc>
    <lastmod>2026-03-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://www.saytamil.com/about</loc>
    <lastmod>2026-03-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://www.saytamil.com/contact</loc>
    <lastmod>2026-03-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://www.saytamil.com/login</loc>
    <lastmod>2026-03-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <url>
    <loc>https://www.saytamil.com/signup</loc>
    <lastmod>2026-03-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
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

</urlset>`

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
    },
  })
}
```

---

## Step 3 — Check middleware.ts

Open `middleware.ts` (if it exists in the project root or `/src`).

Check if it has a `matcher` config. If yes, make sure `/sitemap.xml` is excluded.

Add this to the matcher to exclude sitemap and other static files:

```ts
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|llms.txt).*)',
  ],
}
```

If `middleware.ts` does not exist, skip this step.

---

## Step 4 — Verify After Deploy

After deploying, open `https://www.saytamil.com/sitemap.xml` in the browser.

It must show:
- Readable XML text starting with `<?xml version="1.0"`
- NOT a file download prompt
- NOT garbled characters

Also check the response header `Content-Type` is `application/xml; charset=utf-8`.
Use browser DevTools → Network tab → click sitemap.xml → check Headers.

---

## Done When

- [ ] `https://www.saytamil.com/sitemap.xml` shows readable XML in browser
- [ ] Network tab shows `Content-Type: application/xml; charset=utf-8`
- [ ] All 13 URLs in the sitemap start with `https://www.saytamil.com`
- [ ] No `public/sitemap.xml` file remains in the repo

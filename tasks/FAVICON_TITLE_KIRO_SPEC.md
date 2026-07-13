# Kiro Spec — Favicon & Title Tag Fix

## 1. Title Tag — Shorten to Under 60 Characters

In `src/app/layout.tsx` find the metadata title and change it to:

```ts
title: {
  default: 'SayTamil — Free AI Tamil Grammar Checker',
  template: '%s | SayTamil',
},
```

Remove any Tamil script from the title tag. Tamil script belongs only in the
page H1, not the title tag. Titles over 60 characters get cut off in Google results.

---

## 2. Favicon — Add Logo for Google Search Results

**Step 1 — The logo file**

The developer will provide the logo file manually as `public/icon.png` (512×512px square PNG).
Do not create or generate the image — just wire up the metadata to point to it.

**Step 2 — Add to metadata in `src/app/layout.tsx`**

Add an `icons` field to the metadata object:

```ts
icons: {
  icon: [
    { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    { url: '/favicon.ico', sizes: '32x32' },
  ],
  apple: '/apple-icon.png',
  shortcut: '/icon.png',
},
```

**Step 3 — Add icon.png to the App Router (required for Next.js 14)**

Next.js 14 App Router also needs the icon placed at:
```
src/app/icon.png
```

Copy the same `public/icon.png` file to `src/app/icon.png`.
Next.js will auto-generate the correct icon metadata from this location.

---

## 3. Open Graph Image — Fix for Social Sharing

While in layout.tsx, also confirm the openGraph image is set correctly.
If not already set, add:

```ts
openGraph: {
  ...existing fields,
  images: [
    {
      url: '/og/og-default.png',
      width: 1200,
      height: 630,
      alt: 'SayTamil — Free AI Tamil Grammar Checker',
    },
  ],
},
```

---

## Done When

- [ ] Title in browser tab shows `SayTamil — Free AI Tamil Grammar Checker` (no Tamil script, under 60 chars)
- [ ] `https://www.saytamil.com/icon.png` loads the logo image in browser
- [ ] View Source on homepage shows `<link rel="icon"` pointing to `/icon.png`
- [ ] No console errors about missing favicon

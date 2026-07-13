# Your Tasks — Favicon & Title Fix

## Step 1 — Export Your Logo (You must do this, Kiro cannot)

Export your SayTamil logo as a PNG with these exact specs:

- Size: 512 × 512 pixels
- Format: PNG
- Background: solid color (not transparent — Google shows it on white)
- Shape: square, logo centered with some padding

Save it in two places:
```
public/icon.png
public/apple-icon.png   ← same file, just copy it
```

If you have a Figma or design file — export from there.
If not, use your existing logo and resize it to 512×512 using any tool.

---

## Step 2 — Copy to App Folder

After placing the file in `/public`, also copy it to:
```
src/app/icon.png
```

Next.js 14 requires the icon in the app folder to auto-generate favicon metadata.

---

## Step 3 — After Kiro Deploys

1. Open `https://www.saytamil.com` in Chrome
2. Check the browser tab — you should see your logo as the favicon
3. Check the title says `SayTamil — Free AI Tamil Grammar Checker`

---

## Step 4 — Wait for Google to Update (Nothing to do)

Google takes **1–2 weeks** to update the logo/favicon shown in search results.
You cannot speed this up. It will change on its own.

Check `site:saytamil.com` in Google once a week to see progress.

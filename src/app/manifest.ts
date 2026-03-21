import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SayTamil — AI Tamil Grammar Checker',
    short_name: 'SayTamil',
    description: 'Free AI-powered Tamil grammar and spell checker',
    start_url: '/',
    display: 'standalone',
    background_color: '#020617', // slate-950
    theme_color: '#14b8a6',      // teal-500
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/favicons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/favicons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}

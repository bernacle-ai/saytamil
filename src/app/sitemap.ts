import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://www.saytamil.com/',                    lastModified: new Date('2026-03-23'), changeFrequency: 'daily',   priority: 1.0 },
    { url: 'https://www.saytamil.com/tool',                lastModified: new Date('2026-03-23'), changeFrequency: 'weekly',  priority: 0.9 },
    { url: 'https://www.saytamil.com/tamil-grammar-checker', lastModified: new Date('2026-03-23'), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://www.saytamil.com/sandhi-rules',        lastModified: new Date('2026-03-23'), changeFrequency: 'weekly',  priority: 0.9 },
    { url: 'https://www.saytamil.com/tanglish-to-tamil',   lastModified: new Date('2026-03-23'), changeFrequency: 'weekly',  priority: 0.9 },
    { url: 'https://www.saytamil.com/tamil-typing',        lastModified: new Date('2026-03-23'), changeFrequency: 'weekly',  priority: 0.9 },
    { url: 'https://www.saytamil.com/pricing',             lastModified: new Date('2026-03-23'), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.saytamil.com/about',               lastModified: new Date('2026-03-23'), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://www.saytamil.com/contact',             lastModified: new Date('2026-03-23'), changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://www.saytamil.com/signup',              lastModified: new Date('2026-03-23'), changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://www.saytamil.com/login',               lastModified: new Date('2026-03-23'), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://www.saytamil.com/privacy',             lastModified: new Date('2026-03-23'), changeFrequency: 'yearly',  priority: 0.3 },
    { url: 'https://www.saytamil.com/terms',               lastModified: new Date('2026-03-23'), changeFrequency: 'yearly',  priority: 0.3 },
  ]
}

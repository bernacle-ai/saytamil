import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        // Allow Googlebot full access
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        // Allow Bingbot full access
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        // Allow GPTBot (OpenAI) to crawl for AI indexing
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        // Allow Claude/Anthropic crawler
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: 'https://saytamil.com/sitemap.xml',
    host: 'https://saytamil.com',
  }
}

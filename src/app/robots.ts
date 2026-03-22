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
        // Allow GPTBot (OpenAI) to crawl everything public
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        // Allow Claude/Anthropic crawler everything public
        userAgent: 'ClaudeBot',
        allow: '/',
      },
    ],
    sitemap: 'https://www.saytamil.com/sitemap.xml',
    host: 'https://www.saytamil.com',
  }
}

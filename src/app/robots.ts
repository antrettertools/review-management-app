import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://reviewinzight.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/dashboard/*', '/api/*', '/checkout', '/reactivate', '/account-cancelled'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

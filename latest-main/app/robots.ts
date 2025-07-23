import { generateRobotsTxt } from '../lib/sitemap'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/messages/', '/auth/', '/admin/', '/api/'],
    },
    sitemap: 'https://musliminfluencers.io/sitemap.xml',
  }
}

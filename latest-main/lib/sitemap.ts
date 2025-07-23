import { MetadataRoute } from 'next'

export interface SitemapEntry {
  url: string
  lastModified?: string | Date
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

const baseUrl = 'https://musliminfluencers.io'

// Static pages configuration
const staticPages: SitemapEntry[] = [
  {
    url: '',
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  },
  {
    url: '/search',
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: '/creators',
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: '/pricing',
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: '/auth/register/brand',
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: '/auth/register/creator',
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
]

// Generate sitemap for static pages
export function generateStaticSitemap(): MetadataRoute.Sitemap {
  return staticPages.map(page => ({
    url: `${baseUrl}${page.url}`,
    lastModified: page.lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }))
}

// Generate sitemap for dynamic creator profiles
export async function generateCreatorsSitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // In a real implementation, you would fetch from your API
    // For now, we'll create a placeholder structure
    const creators = await fetchCreators()
    
    return creators.map(creator => ({
      url: `${baseUrl}/profile/${creator.id}`,
      lastModified: creator.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))
  } catch (error) {
    console.error('Error generating creators sitemap:', error)
    return []
  }
}

// Generate sitemap for campaigns (if public)
export async function generateCampaignsSitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // This would be for public campaign pages if you have them
    const campaigns = await fetchPublicCampaigns()
    
    return campaigns.map(campaign => ({
      url: `${baseUrl}/campaigns/${campaign.id}`,
      lastModified: campaign.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))
  } catch (error) {
    console.error('Error generating campaigns sitemap:', error)
    return []
  }
}

// Combine all sitemaps
export async function generateFullSitemap(): Promise<MetadataRoute.Sitemap> {
  const [staticSitemap, creatorsSitemap, campaignsSitemap] = await Promise.all([
    generateStaticSitemap(),
    generateCreatorsSitemap(),
    generateCampaignsSitemap(),
  ])

  return [...staticSitemap, ...creatorsSitemap, ...campaignsSitemap]
}

// Mock functions - replace with actual API calls
async function fetchCreators() {
  // Replace with actual API call
  return [
    { id: '1', updatedAt: new Date('2024-01-15') },
    { id: '2', updatedAt: new Date('2024-01-20') },
    // Add more creators as needed
  ]
}

async function fetchPublicCampaigns() {
  // Replace with actual API call for public campaigns
  return [
    { id: '1', updatedAt: new Date('2024-01-10') },
    // Add more campaigns as needed
  ]
}

// Generate robots.txt content
export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /messages/
Disallow: /auth/
Disallow: /admin/
Disallow: /api/

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for responsible crawling
Crawl-delay: 1
`
}

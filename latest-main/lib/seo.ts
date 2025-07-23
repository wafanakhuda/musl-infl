import type { Metadata } from "next"

type OGType =
  | "website"
  | "article"
  | "book"
  | "profile"
  | "music.song"
  | "music.album"
  | "music.playlist"
  | "music.radio_station"
  | "video.movie"
  | "video.episode"
  | "video.tv_show"
  | "video.other"

interface SEOOptions {
  title?: string
  description?: string
  image?: string
  keywords?: string[]
  noIndex?: boolean
  type?: OGType
  path?: string
}

// Page-specific SEO configurations
export const pageMetadata = {
  home: {
    title: "Award-Winning Halal Creator Marketplace",
    description: "Connect with authentic Muslim content creators. The premier marketplace for halal brand partnerships valued at $3 trillion. Find verified Muslim influencers for your brand.",
    keywords: ["Muslim influencers", "halal marketing", "Islamic content creators", "Muslim marketplace", "halal economy", "Islamic influencers", "Muslim brands", "halal advertising"],
    type: "website" as OGType,
  },
  search: {
    title: "Find Muslim Influencers & Content Creators",
    description: "Search and discover authentic Muslim influencers across all platforms. Filter by niche, location, and audience size to find the perfect creator for your halal brand campaign.",
    keywords: ["search Muslim influencers", "find Islamic creators", "halal content creators", "Muslim influencer directory", "Islamic marketing"],
    type: "website" as OGType,
  },
  creators: {
    title: "Browse Top Muslim Content Creators",
    description: "Explore our curated collection of verified Muslim influencers and content creators. Connect with authentic voices in the halal economy.",
    keywords: ["Muslim creators", "Islamic influencers", "halal content", "verified Muslim influencers", "Islamic social media"],
    type: "website" as OGType,
  },
  pricing: {
    title: "Pricing Plans for Halal Marketing",
    description: "Transparent pricing for brands and creators in the halal economy. Choose the perfect plan to grow your Islamic brand or creator profile.",
    keywords: ["halal marketing pricing", "Muslim influencer rates", "Islamic marketing costs", "halal advertising prices"],
    type: "website" as OGType,
  },
  dashboard: {
    title: "Creator & Brand Dashboard",
    description: "Manage your campaigns, track performance, and grow your presence in the halal economy. Complete analytics for Muslim influencer marketing.",
    keywords: ["influencer dashboard", "brand dashboard", "halal marketing analytics", "campaign management"],
    type: "website" as OGType,
    noIndex: true,
  },
  campaigns: {
    title: "Halal Brand Campaigns",
    description: "Create and manage halal marketing campaigns with authentic Muslim influencers. Connect your brand with the $3 trillion halal economy.",
    keywords: ["halal campaigns", "Muslim influencer campaigns", "Islamic marketing campaigns", "halal brand partnerships"],
    type: "website" as OGType,
    noIndex: true,
  },
  auth: {
    login: {
      title: "Login to MuslimInfluencers.io",
      description: "Access your halal creator marketplace account. Login to connect with Muslim influencers or manage your brand campaigns.",
      keywords: ["login", "Muslim influencer login", "halal marketplace access"],
      type: "website" as OGType,
      noIndex: true,
    },
    register: {
      brand: {
        title: "Join as a Halal Brand",
        description: "Register your brand to connect with authentic Muslim influencers. Start your halal marketing journey in the $3 trillion Islamic economy.",
        keywords: ["brand registration", "halal brand signup", "Muslim influencer marketing", "Islamic brand partnership"],
        type: "website" as OGType,
      },
      creator: {
        title: "Join as a Muslim Creator",
        description: "Register as a Muslim content creator and connect with halal brands. Monetize your authentic Islamic content with verified brand partnerships.",
        keywords: ["Muslim creator signup", "Islamic influencer registration", "halal content creator", "Muslim influencer join"],
        type: "website" as OGType,
      },
    },
  },
  profile: {
    title: "Creator Profile",
    description: "View detailed creator profiles, portfolio, and engagement metrics. Connect with authentic Muslim influencers for your halal brand campaigns.",
    keywords: ["Muslim creator profile", "Islamic influencer portfolio", "halal content creator stats"],
    type: "profile" as OGType,
  },
  messages: {
    title: "Messages & Communications",
    description: "Secure messaging platform for halal brand-creator communications. Manage your partnerships in the Islamic marketplace.",
    keywords: ["creator messages", "brand communication", "halal partnership chat"],
    type: "website" as OGType,
    noIndex: true,
  },
}

export function generateMetadata({
  title,
  description,
  image,
  keywords,
  noIndex = false,
  type = "website",
  path = "",
}: SEOOptions): Metadata {
  const baseTitle = "MuslimInfluencers.io"
  const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle
  const metaDescription =
    description ||
    "The halal economy is valued at $3 trillion. Market your products with MuslimInfluencers.io"
  const allKeywords =
    keywords ||
    ["halal marketing", "muslim influencers", "halal creators"]
  const metaImage = image || "/default-og-image.jpg"
  const baseUrl = "https://musliminfluencers.io"
  const canonical = path ? `${baseUrl}${path}` : baseUrl

  return {
    title: fullTitle,
    description: metaDescription,
    keywords: allKeywords,
    authors: [{ name: "Halal Marketplace Team" }],
    creator: "MuslimInfluencers.io",
    publisher: "MuslimInfluencers.io",
    alternates: {
      canonical,
    },
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      url: canonical,
      siteName: baseTitle,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: title || baseTitle,
        },
      ],
      locale: "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: metaDescription,
      images: [metaImage],
      creator: "@musliminfluencers",
      site: "@musliminfluencers",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
    },
    other: {
      ...(process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION && {
        "facebook-domain-verification": process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION,
      }),
    },
  }
}

// Helper function to get metadata for specific pages
export function getPageMetadata(pagePath: string, dynamicData?: any): Metadata {
  const pathSegments = pagePath.split('/').filter(Boolean)
  
  if (pathSegments.length === 0) {
    return generateMetadata({ ...pageMetadata.home, path: "/" })
  }
  
  const [firstSegment, secondSegment, thirdSegment] = pathSegments
  
  switch (firstSegment) {
    case 'search':
      return generateMetadata({ ...pageMetadata.search, path: "/search" })
    case 'creators':
      return generateMetadata({ ...pageMetadata.creators, path: "/creators" })
    case 'pricing':
      return generateMetadata({ ...pageMetadata.pricing, path: "/pricing" })
    case 'dashboard':
      if (secondSegment === 'brand') {
        return generateMetadata({ 
          ...pageMetadata.dashboard, 
          title: "Brand Dashboard - Manage Halal Campaigns",
          path: "/dashboard/brand" 
        })
      } else if (secondSegment === 'creator') {
        return generateMetadata({ 
          ...pageMetadata.dashboard, 
          title: "Creator Dashboard - Manage Your Profile",
          path: "/dashboard/creator" 
        })
      }
      return generateMetadata({ ...pageMetadata.dashboard, path: "/dashboard" })
    case 'campaigns':
      if (secondSegment === 'create') {
        return generateMetadata({
          ...pageMetadata.campaigns,
          title: "Create Halal Campaign",
          description: "Create a new halal marketing campaign with Muslim influencers. Set your budget, target audience, and campaign goals.",
          path: "/campaigns/create"
        })
      }
      return generateMetadata({ ...pageMetadata.campaigns, path: "/campaigns" })
    case 'auth':
      if (secondSegment === 'login') {
        return generateMetadata({ ...pageMetadata.auth.login, path: "/auth/login" })
      } else if (secondSegment === 'register') {
        if (thirdSegment === 'brand') {
          return generateMetadata({ ...pageMetadata.auth.register.brand, path: "/auth/register/brand" })
        } else if (thirdSegment === 'creator') {
          return generateMetadata({ ...pageMetadata.auth.register.creator, path: "/auth/register/creator" })
        }
      }
      return generateMetadata({ 
        title: "Authentication",
        description: "Access your MuslimInfluencers.io account",
        path: `/auth/${pathSegments.slice(1).join('/')}`,
        noIndex: true
      })
    case 'profile':
      if (secondSegment && dynamicData?.name) {
        return generateMetadata({
          ...pageMetadata.profile,
          title: `${dynamicData.name} - Muslim Creator Profile`,
          description: `Connect with ${dynamicData.name}, a verified Muslim content creator. View portfolio, engagement rates, and collaboration opportunities.`,
          path: `/profile/${secondSegment}`,
          image: dynamicData.avatar || "/default-creator-image.jpg"
        })
      }
      return generateMetadata({ ...pageMetadata.profile, path: "/profile" })
    case 'messages':
      return generateMetadata({ ...pageMetadata.messages, path: "/messages" })
    default:
      return generateMetadata({ 
        title: "Page Not Found",
        description: "The page you're looking for doesn't exist.",
        path: `/${pathSegments.join('/')}`,
        noIndex: true
      })
  }
}

// Structured data generators
export function generatePersonSchema(creator: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": creator.name,
    "url": `https://musliminfluencers.io/profile/${creator.id}`,
    "image": creator.avatar,
    "description": creator.bio,
    "sameAs": [
      creator.instagram && `https://instagram.com/${creator.instagram}`,
      creator.youtube && `https://youtube.com/@${creator.youtube}`,
      creator.tiktok && `https://tiktok.com/@${creator.tiktok}`,
    ].filter(Boolean),
    "knowsAbout": creator.niches,
    "memberOf": {
      "@type": "Organization",
      "name": "MuslimInfluencers.io"
    }
  }
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MuslimInfluencers.io",
    "url": "https://musliminfluencers.io",
    "logo": "https://musliminfluencers.io/logo.png",
    "description": "The premier marketplace for halal brand partnerships with authentic Muslim content creators.",
    "foundingDate": "2024",
    "sameAs": [
      "https://twitter.com/musliminfluencers",
      "https://instagram.com/musliminfluencers",
      "https://linkedin.com/company/musliminfluencers"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-0123",
      "contactType": "customer service",
      "email": "hello@musliminfluencers.io"
    }
  }
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MuslimInfluencers.io",
    "url": "https://musliminfluencers.io",
    "description": "The premier marketplace for halal brand partnerships with authentic Muslim content creators.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://musliminfluencers.io/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }
}

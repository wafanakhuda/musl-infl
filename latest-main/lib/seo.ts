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
}

export function generateMetadata({
  title,
  description,
  image,
  keywords,
  noIndex = false,
  type = "website",
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
  const canonical = "https://musliminfluencers.io"

  return {
    title: fullTitle,
    description: metaDescription,
    keywords: allKeywords,
    authors: [{ name: "Halal Marketplace Team" }],
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
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
  }
}

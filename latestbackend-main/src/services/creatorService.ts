// src/services/creatorService.ts
import prisma from "../lib/prisma"

export async function getFilteredCreators(query: any) {
  const {
    niche,
    platform,
    min_followers,
    max_followers,
    min_price,
    max_price,
  } = query

  const creators = await prisma.user.findMany({
    where: {
      user_type: "creator",
      ...(niche && { niche: { contains: niche, mode: "insensitive" } }),
      ...(platform && { platforms: { has: platform } }),
      ...(min_followers && { followers: { gte: parseInt(min_followers) } }),
      ...(max_followers && { followers: { lte: parseInt(max_followers) } }),
      ...(min_price && { price_min: { gte: parseInt(min_price) } }),
      ...(max_price && { price_max: { lte: parseInt(max_price) } }),
    },
    select: {
  id: true,
  full_name: true,
  avatar_url: true,
  bio: true,
  niche: true,
  platforms: true,
  price_min: true,
  price_max: true,
  followers: true,
  engagement: true,
  _count: {
    select: {
      campaigns: true,
      createdCampaignApplications: true, // ✅ this replaces `applications`
    },
  },
}
  })

  return creators
}

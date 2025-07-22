// src/services/creatorService.ts
import prisma from "../lib/prisma"

export async function getFilteredCreators(query: any) {
  const {
    search,
    niche,
    platform,
    min_followers,
    max_followers,
    min_price,
    max_price,
  } = query

  console.log("🔍 Search query received:", { search, niche, platform, min_followers, max_followers, min_price, max_price })

  // Build the base where condition for non-search filters
  const baseConditions: any = {
    user_type: "creator",
  }

  // Add filter conditions
  if (niche) {
    baseConditions.niche = { contains: niche, mode: "insensitive" }
  }
  
  if (platform) {
    baseConditions.platforms = { has: platform }
  }
  
  if (min_followers) {
    baseConditions.followers = { ...baseConditions.followers, gte: parseInt(min_followers) }
  }
  
  if (max_followers) {
    baseConditions.followers = { ...baseConditions.followers, lte: parseInt(max_followers) }
  }
  
  if (min_price) {
    baseConditions.price_min = { ...baseConditions.price_min, gte: parseInt(min_price) }
  }
  
  if (max_price) {
    baseConditions.price_max = { ...baseConditions.price_max, lte: parseInt(max_price) }
  }

  // Build the final where condition
  let whereCondition: any = baseConditions

  // Add text search if provided
  if (search && search.trim()) {
    whereCondition = {
      AND: [
        baseConditions,
        {
          OR: [
            { full_name: { contains: search, mode: "insensitive" } },
            { bio: { contains: search, mode: "insensitive" } },
            { niche: { contains: search, mode: "insensitive" } },
            { platforms: { has: search } },
          ]
        }
      ]
    }
  }

  console.log("🗄️  Final where condition:", JSON.stringify(whereCondition, null, 2))

  const creators = await prisma.user.findMany({
    where: whereCondition,
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

  console.log(`📊 Found ${creators.length} creators`)
  return creators
}

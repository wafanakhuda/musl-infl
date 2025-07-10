// src/services/searchService.ts
import prisma from '../lib/prisma'

export const searchCampaigns = async (query: string) => {
  return await prisma.campaign.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { niche: { has: query } },
        { platforms: { has: query } },
      ],
    },
  })
}

export const searchSuggestions = async (query: string) => {
  const campaigns = await prisma.campaign.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { niche: { has: query } },
        { platforms: { has: query } },
      ],
    },
    select: {
      title: true,
      description: true,
      niche: true,
      platforms: true,
    },
  })

  return [...new Set(
    campaigns.flatMap((t) => [
      ...(t.niche ?? []),
      ...(t.platforms ?? []),
      t.title,
      t.description,
    ])
  )]
}

export const logSearch = async (userId: string, query: string) => {
  return await prisma.searchLog.create({
    data: {
      userId,
      query,
      timestamp: new Date(),
    },
  })
}

export const searchCreators = async (query: string) => {
  return await prisma.user.findMany({
    where: {
      user_type: 'creator',
      OR: [
        { full_name: { contains: query, mode: 'insensitive' } },
        { bio: { contains: query, mode: 'insensitive' } },
        { niche: { contains: query, mode: 'insensitive' } },
        { platforms: { has: query } },
      ],
    },
    select: {
      id: true,
      full_name: true,
      avatar_url: true,
      bio: true,
      niche: true,
      platforms: true,
      followers: true,
      price_min: true,
      price_max: true,
    },
  })
}
export const searchBrands = async (query: string) => {
  return await prisma.user.findMany({
    where: {
      user_type: 'brand',
      OR: [
        { full_name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      full_name: true,
      avatar_url: true,
      email: true,
    },
  })
}
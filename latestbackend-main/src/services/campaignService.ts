// src/services/campaignService.ts
import prisma from '../lib/prisma'

interface CampaignData {
  title: string
  description: string
  category?: string
  campaign_type: string
  deliverables: string
  budget_min: number
  budget_max: number
  deadline: string
  start_date?: string
  end_date?: string
  gender?: string | string[]
  age_range?: string
  language?: string | string[]
  country?: string | string[]
  city?: string | string[]
  niche?: string | string[]
  platform?: string | string[]
  followers_min?: number
  followers_max?: number
  influencers_needed?: number
  requirements?: string
  target_audience?: string[]
}

export const getAllCampaigns = async (creatorId?: string, limit?: number) => {
  return prisma.campaign.findMany({
    where: creatorId
      ? {
          applications: {
            some: {
              creatorId,
            },
          },
        }
      : undefined,
    take: limit,
    include: {
      brand: {
        select: {
          id: true,
          full_name: true,
          avatar_url: true,
          email: true,
        },
      },
    },
    orderBy: { created_at: 'desc' },
  })
}

export const getCampaignById = async (id: string) => {
  return prisma.campaign.findUnique({
    where: { id },
    include: {
      brand: {
        select: {
          id: true,
          full_name: true,
          avatar_url: true,
          email: true,
        },
      },
    },
  })
}

export const createCampaign = async (brandId: string, data: CampaignData) => {
  const estimatedReach =
    1000 +
    (data.followers_min || 0) * 5 +
    (data.influencers_needed || 1) * 100 +
    Math.floor(Math.random() * 1000)

  return prisma.campaign.create({
    data: {
      title: data.title,
      description: data.description,
      category: data.category || '',
      campaign_type: data.campaign_type,
      deliverables: data.deliverables,
      budget_min: data.budget_min,
      budget_max: data.budget_max,
      deadline: new Date(data.deadline),
      start_date: data.start_date ? new Date(data.start_date) : undefined,
      end_date: data.end_date ? new Date(data.end_date) : undefined,
      gender: Array.isArray(data.gender) ? data.gender : data.gender ? [data.gender] : [],
      age_range: data.age_range,
      language: Array.isArray(data.language) ? data.language : data.language ? [data.language] : [],
      country: Array.isArray(data.country) ? data.country : data.country ? [data.country] : [],
      city: Array.isArray(data.city) ? data.city : data.city ? [data.city] : [],
      niche: Array.isArray(data.niche) ? data.niche : data.niche ? [data.niche] : [],
      platforms: Array.isArray(data.platform) ? data.platform : data.platform ? [data.platform] : [],
      followers_min: data.followers_min,
      followers_max: data.followers_max,
      influencers_needed: data.influencers_needed,
      requirements: data.requirements || '',
      target_audience: data.target_audience || [],
      estimated_reach: estimatedReach,
      brandId,
    },
  })
}

export const updateCampaign = async (id: string, data: Partial<CampaignData>) => {
  return prisma.campaign.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      campaign_type: data.campaign_type,
      deliverables: data.deliverables,
      budget_min: data.budget_min,
      budget_max: data.budget_max,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
      start_date: data.start_date ? new Date(data.start_date) : undefined,
      end_date: data.end_date ? new Date(data.end_date) : undefined,
      gender: Array.isArray(data.gender) ? data.gender : data.gender ? [data.gender] : [],
      age_range: data.age_range,
      language: Array.isArray(data.language) ? data.language : data.language ? [data.language] : [],
      country: Array.isArray(data.country) ? data.country : data.country ? [data.country] : [],
      city: Array.isArray(data.city) ? data.city : data.city ? [data.city] : [],
      niche: Array.isArray(data.niche) ? data.niche : data.niche ? [data.niche] : [],
      platforms: Array.isArray(data.platform) ? data.platform : data.platform ? [data.platform] : [],
      followers_min: data.followers_min,
      followers_max: data.followers_max,
      influencers_needed: data.influencers_needed,
      requirements: data.requirements,
      target_audience: data.target_audience,
    },
  })
}

export const deleteCampaign = async (id: string) => {
  return prisma.campaign.delete({
    where: { id },
  })
}

export const applyToCampaign = async (
  campaignId: string,
  userId: string,
  creatorId: string
) => {
  return prisma.campaignApplication.create({
    data: {
      campaignId,
      userId,
      creatorId,
      applied_at: new Date(),
    },
  })
}

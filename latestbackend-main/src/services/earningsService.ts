// src/services/earningsService.ts
import prisma from '../lib/prisma'

export const getCreatorEarnings = async (creatorId: string) => {
  return await prisma.transaction.aggregate({
    where: {
      creatorId,
      status: 'succeeded',
    },
    _sum: {
      amount: true,
    },
  })
}

export const getCampaignEarnings = async (campaignId: string) => {
  // Your schema doesn't support campaignId in transactions, so skip
  return null // or throw new Error('campaignId not supported in schema')
}

export const getRecentEarnings = async (creatorId: string) => {
  return await prisma.transaction.findMany({
    where: {
      creatorId,
      status: 'succeeded',
    },
    orderBy: { created_at: 'desc' },
    take: 10,
  })
}

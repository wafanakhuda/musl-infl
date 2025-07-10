// src/services/analyticsService.ts
import prisma from '../lib/prisma'

export const getPlatformStats = async () => {
  const totalUsers = await prisma.user.count()
  const totalCreators = await prisma.user.count({ where: { user_type: 'creator' } })
  const totalBrands = await prisma.user.count({ where: { user_type: 'brand' } })

  const totalCampaigns = await prisma.campaign.count()

  // Since 'status' does not exist in Campaign schema, skip active/completed

  const totalRevenue = await prisma.transaction.aggregate({
    where: { status: 'succeeded' },
    _sum: { amount: true },
  })

  return {
    users: {
      total: totalUsers,
      creators: totalCreators,
      brands: totalBrands,
    },
    campaigns: {
      total: totalCampaigns,
      active: null, // Not tracked in schema
      completed: null, // Not tracked in schema
    },
    revenue: {
      total: totalRevenue._sum.amount ?? 0,
    },
  }
}

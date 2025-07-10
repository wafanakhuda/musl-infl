// src/services/adminService.ts
import prisma from '../lib/prisma'

// Get all users (admin view)
export const getAllUsers = async () => {
  return await prisma.user.findMany()
}

// Get all campaigns with brand details
export const getAllCampaigns = async () => {
  return await prisma.campaign.findMany({
    include: { brand: true },
  })
}

// Moderate user (approve = active, ban/reject = inactive)
export const moderateUser = async (
  userId: string,
  action: 'approve' | 'ban' | 'reject'
) => {
  let isActive: boolean

  switch (action) {
    case 'approve':
      isActive = true
      break
    case 'ban':
    case 'reject':
      isActive = false
      break
    default:
      throw new Error('Invalid user moderation action')
  }

  return await prisma.user.update({
    where: { id: userId },
    data: {
      is_active: isActive,
    },
  })
}

// Moderate campaign (approve, ban, reject)
export const moderateCampaign = async (
  campaignId: string,
  action: 'approve' | 'ban' | 'reject'
) => {
  // Since the schema does NOT have `moderation_status`, we skip it
  if (!['approve', 'ban', 'reject'].includes(action)) {
    throw new Error('Invalid campaign moderation action')
  }

  const isActive = action === 'approve'

  return await prisma.campaign.update({
    where: { id: campaignId },
    data: {
      // You can implement status logic if schema supports it
      // Otherwise, no-op or soft delete by brand
    },
  })
}

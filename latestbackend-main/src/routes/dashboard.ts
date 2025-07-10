// src/routes/dashboard.ts
import { Router, Request, Response } from "express"
import { authenticateToken } from "../middlewares/authMiddleware"
import prisma from "../lib/prisma"
import dayjs from "dayjs"
import { AuthRequest } from "../types/AuthRequest"
import asyncHandler from "express-async-handler"

const router = Router()

// GET /api/dashboard/stats
router.get(
  "/stats",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { user } = req as AuthRequest
    if (!user) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        createdCampaignApplications: { include: { campaign: true } },
        messages: true,
        transactions: true,
        campaigns: true,
      },
    })

    if (!dbUser) {
      res.status(404).json({ error: "User not found" })
      return
    }

    if (user.user_type === "creator") {
      const totalEarnings = dbUser.transactions.reduce((sum: number, txn) => sum + Number(txn.amount), 0)
      const pendingApplications = dbUser.createdCampaignApplications.filter(a => a.status === "pending").length
      const totalApplications = dbUser.createdCampaignApplications.length
      const completedApplications = dbUser.createdCampaignApplications.filter(a => a.status === "completed").length
      const completionRate =
        totalApplications === 0 ? 0 : Math.round((completedApplications / totalApplications) * 100)

      res.json({
        userType: "creator",
        total_earnings: totalEarnings,
        active_campaigns: totalApplications,
        profile_views: 0,
        unread_messages: dbUser.messages.length,
        completion_rate: completionRate,
        rating: 0,
        total_reviews: 0,
        pending_applications: pendingApplications,
        appliedCampaigns: dbUser.createdCampaignApplications.map(a => a.campaign),
      })
      return
    }

    if (user.user_type === "brand") {
      res.json({
        userType: "brand",
        campaignsCount: dbUser.campaigns.length,
        messagesCount: dbUser.messages.length,
        transactionsCount: dbUser.transactions.length,
        campaigns: dbUser.campaigns,
      })
      return
    }

    res.status(400).json({ error: "Invalid user type" })
  })
)

// GET /api/dashboard/earnings (creator only)
router.get(
  "/earnings",
  authenticateToken,
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { user } = req as AuthRequest
    if (!user || user.user_type !== "creator") {
      res.status(403).json({ error: "Only creators can access earnings" })
      return
    }

    const sixMonthsAgo = dayjs().subtract(5, "month").startOf("month").toDate()
    const transactions = await prisma.transaction.findMany({
      where: {
        creatorId: user.id,
        created_at: { gte: sixMonthsAgo },
      },
      select: { amount: true, created_at: true },
    })

    const earningsByMonth: Record<string, number> = {}
    for (const txn of transactions) {
      const month = dayjs(txn.created_at).format("MMM")
      earningsByMonth[month] = (earningsByMonth[month] || 0) + Number(txn.amount)
    }

    const months = Array.from({ length: 6 }).map((_, i) =>
      dayjs().subtract(5 - i, "month").format("MMM")
    )

    const earnings = months.map(month => ({
      month,
      amount: earningsByMonth[month] || 0,
    }))

    res.json(earnings)
  })
)

// GET /api/stats/platform
router.get(
  "/platform",
  asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const totalCreators = await prisma.user.count({
      where: { user_type: "creator" },
    })

    const totalBrands = await prisma.user.count({
      where: { user_type: "brand" },
    })

    const totalCampaigns = await prisma.campaign.count()

    const totalEarnings = await prisma.transaction.aggregate({
      _sum: { amount: true },
    })

    res.json({
      total_creators: totalCreators,
      total_brands: totalBrands,
      total_campaigns: totalCampaigns,
      total_earnings: totalEarnings._sum.amount || 0,
    })
  })
)

export default router
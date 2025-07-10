"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "../lib/api-client"
import { useAuth } from "./use-auth"

interface DashboardStats {
  total_earnings?: string
  active_campaigns?: string
  total_reach?: string
  unread_messages?: string
  total_spent?: string
  total_applications?: string
  campaign_performance?: string
  budget?: string
  new_campaigns?: string
  reach: string
  reach_growth?: string
  roi_average?: string
  roi_change?: string
}

interface EarningsData {
  month: string
  amount: number
}

interface CampaignAnalytics {
  total_campaigns: number
  active_campaigns: number
  completed_campaigns: number
  pending_applications: number
  accepted_applications: number
  total_budget: number
}

interface AudienceDemographic {
  region: string
  percentage: number
  color: string
}

export function useDashboardData() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>()
  const [earningsData, setEarningsData] = useState<EarningsData[]>([])
  const [campaignAnalytics, setCampaignAnalytics] = useState<CampaignAnalytics | null>(null)
  const [audienceDemographics, setAudienceDemographics] = useState<AudienceDemographic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Fetch dashboard stats
      const statsData = await apiClient.getDashboardStats()
      setStats(statsData)

      // Fetch earnings data for creators
      if (user.user_type === "creator") {
        const earnings = await apiClient.getEarningsData("6months")
        setEarningsData(earnings)

        const demographics = await apiClient.getAudienceDemographics()
        setAudienceDemographics(demographics)
      }

      // Fetch campaign analytics
      const analytics = await apiClient.getCampaignAnalytics()
      setCampaignAnalytics(analytics)
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Failed to fetch dashboard data"
      setError(errorMessage)
      console.error("Dashboard data fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const refreshData = useCallback(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  return {
    stats,
    earningsData,
    campaignAnalytics,
    audienceDemographics,
    loading,
    error,
    refreshData,
  }
}
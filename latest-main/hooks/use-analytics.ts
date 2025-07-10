"use client"

import { useState, useEffect } from "react"
import { apiClient } from "../lib/api-client"
import { useAuth } from "./use-auth"
import { toast } from "./use-toast"

export function useAnalytics() {
  const { user } = useAuth()
  const [demographics, setDemographics] = useState([])
  const [engagement, setEngagement] = useState([])
  const [topCategories, setTopCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async () => {
  if (!user?.id) return

  try {
    setLoading(true)
    setError(null)

    const [demographicsData, engagementData, analyticsData] = await Promise.all([
      apiClient.getAudienceDemographics(),
      apiClient.getEngagementMetrics(),
      apiClient.getAnalytics(),
    ])

    setDemographics(demographicsData)
    setEngagement(engagementData)
    setTopCategories(analyticsData.top_categories || [])
  } catch (err: any) {
    const errorMessage = err.response?.data?.detail || "Failed to fetch analytics"
    setError(errorMessage)
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    })
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    fetchAnalytics()
  }, [user?.id])

  return {
    demographics,
    engagement,
    topCategories,
    loading,
    error,
    refetch: fetchAnalytics,
  }
}
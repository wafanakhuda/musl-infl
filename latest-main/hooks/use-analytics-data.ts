"use client"

// Hook for real analytics data
import { useState, useEffect } from "react"
import { databaseApi } from "../lib/database-api"
import { useAuth } from "./use-auth"

export function useAnalyticsData() {
  const { user } = useAuth()
  const [demographics, setDemographics] = useState([])
  const [engagement, setEngagement] = useState([])
  const [topCategories, setTopCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return

    const fetchAnalyticsData = async () => {
      try {
        setLoading(true)

        const [demographicsData, engagementData, categoriesData] = await Promise.all([
          databaseApi.getAudienceDemographics(user.id),
          databaseApi.getEngagementMetrics(user.id),
          databaseApi.getTopCategories(),
        ])

        setDemographics(demographicsData)
        setEngagement(engagementData)
        setTopCategories(categoriesData)
      } catch (err) {
        console.error("Failed to fetch analytics data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [user?.id])

  return { demographics, engagement, topCategories, loading }
}

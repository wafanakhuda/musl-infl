"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient, type Campaign } from "../lib/api-client"
import { toast } from "sonner"

interface CampaignFilters {
  search?: string
  category?: string
  campaign_type?: string
  budget_range?: string
  skip?: number
  limit?: number
}

interface CreateCampaignInput {
  title: string
  description: string
  category: string
  campaign_type: string[]
  budget_min?: number
  budget_max?: number
  start_date?: string
  end_date?: string
  target_audience: string[]
  requirements?: string
  deliverables: string[]
  status?: "draft" | "active" | "paused" | "completed" | "cancelled"
}

export function useCampaigns(initialFilters?: CampaignFilters) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const fetchCampaigns = useCallback(
    async (filters?: CampaignFilters, append = false) => {
      try {
        if (!append) setLoading(true)
        setError(null)

        const data = await apiClient.getCampaigns(filters)

        if (append) {
          setCampaigns((prev) => [...prev, ...data])
        } else {
          setCampaigns(data)
        }

        setHasMore(data.length === (filters?.limit || 20))
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || "Failed to fetch campaigns"
        setError(errorMessage)
        console.error("Failed to fetch campaigns:", err)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const createCampaign = useCallback(
    async (campaignData: CreateCampaignInput) => {
      try {
        const newCampaign = await apiClient.createCampaign(campaignData)
        setCampaigns((prev) => [newCampaign, ...prev])
        toast.success("Campaign created successfully!")
        return newCampaign
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || "Failed to create campaign"
        toast.error(errorMessage)
        throw err
      }
    },
    []
  )

  const updateCampaign = useCallback(
    async (id: string, campaignData: Partial<Campaign>) => {
      try {
        const updatedCampaign = await apiClient.updateCampaign(id, campaignData)
        setCampaigns((prev) =>
          prev.map((campaign) =>
            campaign.id === id ? updatedCampaign : campaign
          )
        )
        toast.success("Campaign updated successfully!")
        return updatedCampaign
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || "Failed to update campaign"
        toast.error(errorMessage)
        throw err
      }
    },
    []
  )

  const deleteCampaign = useCallback(
    async (id: string) => {
      try {
        await apiClient.deleteCampaign(id)
        setCampaigns((prev) => prev.filter((campaign) => campaign.id !== id))
        toast.success("Campaign deleted successfully!")
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || "Failed to delete campaign"
        toast.error(errorMessage)
        throw err
      }
    },
    []
  )

  const applyToCampaign = useCallback(
    async (
      campaignId: string,
      applicationData: {
        proposal: string
        price: number
        timeline: string
        deliverables?: string[]
      }
    ) => {
      try {
        const result = await apiClient.applyToCampaign(campaignId, applicationData)

        setCampaigns((prev) =>
          prev.map((campaign) =>
            campaign.id === campaignId
              ? {
                  ...campaign,
                  applications_count: (campaign.applications_count || 0) + 1,
                }
              : campaign
          )
        )

        toast.success("Application submitted successfully!")
        return result
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || "Failed to submit application"
        toast.error(errorMessage)
        throw err
      }
    },
    []
  )

  const getCampaign = useCallback(async (id: string) => {
    try {
      const campaign = await apiClient.getCampaign(id)
      return campaign
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || "Failed to fetch campaign"
      toast.error(errorMessage)
      throw err
    }
  }, [])

  const loadMore = useCallback(
    (filters?: CampaignFilters) => {
      if (!loading && hasMore) {
        const newFilters = {
          ...filters,
          skip: campaigns.length,
          limit: filters?.limit || 20,
        }
        fetchCampaigns(newFilters, true)
      }
    },
    [campaigns.length, loading, hasMore, fetchCampaigns]
  )

  useEffect(() => {
    fetchCampaigns(initialFilters)
  }, [fetchCampaigns, initialFilters])

  return {
    campaigns,
    loading,
    error,
    hasMore,
    fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    applyToCampaign,
    getCampaign,
    loadMore,
    refetch: () => fetchCampaigns(initialFilters),
  }
}

export type { Campaign, CampaignFilters }

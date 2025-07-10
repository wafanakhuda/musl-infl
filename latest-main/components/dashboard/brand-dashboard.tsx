"use client"

export const dynamic = "force-dynamic"

import { useAuth } from "../../hooks/use-auth"
import { useDashboardData } from "../../hooks/use-dashboard-data"
import { useCampaigns } from "../../hooks/use-campaigns"
import BrandNavigation from "../../components/layouts/brand-navbar"

import Link from "next/link"
import {
  DollarSign,
  TrendingUp,
  Users,
  Plus,
  Search,
  Megaphone,
} from "lucide-react"

import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Card, CardContent } from "../../components/ui/card"
import { Skeleton } from "../../components/ui/skeleton"
import { CampaignCard } from "../../components/campaigns/campaign-card"

export function BrandDashboard() {
  const { user } = useAuth()
  const {
    stats,
    loading,
    error,
    refreshData: refetch,
  } = useDashboardData()
  const { campaigns: brandCampaigns, loading: campaignsLoading } = useCampaigns()

  if (loading) return <BrandDashboardSkeleton />

  if (error) {
    return (
      <>
        <BrandNavigation />
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Card className="glass-card border-red-500/20">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold text-red-400 mb-2">Error Loading Dashboard</h3>
                <p className="text-gray-300 mb-4">{error}</p>
                <Button onClick={refetch} className="bg-red-600 hover:bg-red-700">
                  Try Again
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    )
  }

  const brandStats = [
    {
      title: "Campaign Budget",
      value: stats?.budget || "$0",
      change: "Available",
      icon: DollarSign,
      color: "text-green-400",
    },
    {
      title: "Active Campaigns",
      value: stats?.active_campaigns || "0",
      change: `+${stats?.new_campaigns || 0} this month`,
      icon: Megaphone,
      color: "text-blue-400",
    },
    {
      title: "Total Reach",
      value: stats?.reach || "0",
      change: stats?.reach_growth || "0%",
      icon: Users,
      color: "text-purple-400",
    },
    {
      title: "Avg ROI",
      value: stats?.roi_average || "0%",
      change: stats?.roi_change || "0%",
      icon: TrendingUp,
      color: "text-orange-400",
    },
  ]

  return (
    <>
      <BrandNavigation />
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Brand Dashboard</h1>
              <p className="text-gray-300">
                Welcome back, <span className="gradient-text">{user?.full_name || "Brand"}</span>
              </p>
              <p className="text-gray-400 text-sm">Manage your campaigns and discover creators</p>
            </div>
            <div className="flex gap-3 mt-4 sm:mt-0">
              <Link href="/creators">
                <Button variant="outline" className="border-white/20 hover:bg-white/5">
                  <Search className="w-4 h-4 mr-2" />
                  Find Creators
                </Button>
              </Link>
              <Link href="/campaigns/create">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {brandStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} className="glass-card border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                      <Badge variant="outline" className="border-green-500/30 text-green-300">
                        {stat.change}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.title}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Campaign List */}
          {!campaignsLoading && brandCampaigns?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Campaigns</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brandCampaigns.slice(0, 3).map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function BrandDashboardSkeleton() {
  return (
    <>
      <BrandNavigation />
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="glass-card border-white/10">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-6 mb-2" />
                  <Skeleton className="h-8 w-20 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
export default BrandDashboard
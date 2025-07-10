"use client"

import { useEffect, useState } from "react"
import { Users, Briefcase, DollarSign, CheckCircle } from "lucide-react"

export function PlatformStats() {
  const [stats, setStats] = useState<{
    total_creators: number
    total_brands: number
    total_campaigns: number
    total_earnings: number
  } | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats/platform`)
        const data = await res.json()
        setStats(data)
      } catch (err) {
        console.error("Failed to fetch platform stats", err)
      }
    }

    fetchStats()
  }, [])

  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse bg-slate-200/10 p-6 rounded-xl h-32" />
        ))}
      </div>
    )
  }

  const statItems = [
    {
      label: "Total Creators",
      value: stats.total_creators.toLocaleString(),
      icon: Users,
    },
    {
      label: "Campaigns Posted",
      value: stats.total_campaigns.toLocaleString(),
      icon: Briefcase,
    },
    {
      label: "Brands Onboarded",
      value: stats.total_brands.toLocaleString(),
      icon: CheckCircle,
    },
    {
      label: "Earnings Paid Out",
      value: `$${(stats.total_earnings / 1000).toFixed(1)}K+`,
      icon: DollarSign,
    },
  ]

  return (
    <div className="bg-slate-100/5 rounded-2xl p-8 shadow-inner border border-white/10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        {statItems.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white/5 border border-slate-300/10 rounded-xl p-6 shadow-md hover:shadow-lg transition"
          >
            <stat.icon className="w-8 h-8 text-teal-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-slate-300 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

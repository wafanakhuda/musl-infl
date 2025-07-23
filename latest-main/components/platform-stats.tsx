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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // ✅ Fetch from your real backend endpoint that actually exists
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats/platform`)
        
        if (!res.ok) {
          throw new Error(`API Error: ${res.status}`)
        }
        
        const data = await res.json()
        console.log('✅ Real platform stats loaded:', data)
        setStats(data)
      } catch (err: any) {
        console.error("❌ Failed to fetch platform stats:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="bg-slate-100/5 rounded-2xl p-8 shadow-inner border border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/5 border border-slate-300/10 rounded-xl p-6 shadow-md animate-pulse">
              <div className="w-8 h-8 bg-slate-600 rounded mx-auto mb-4"></div>
              <div className="h-8 bg-slate-600 rounded mb-2"></div>
              <div className="h-4 bg-slate-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="bg-slate-100/5 rounded-2xl p-8 shadow-inner border border-white/10">
        <div className="text-center text-red-400 py-8">
          <p>Failed to load platform statistics</p>
          <p className="text-sm mt-2">{error}</p>
          <p className="text-xs mt-2">Check your backend connection at {process.env.NEXT_PUBLIC_API_URL}</p>
        </div>
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
      value: `${(stats.total_earnings / 1000).toFixed(1)}K+`,
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
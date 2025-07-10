"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../../hooks/use-auth"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { PlusCircle, DollarSign, Briefcase, Mail, Star } from "lucide-react"
import PortfolioManager from "../../components/portfolio/portfolio-manager"
import Link from "next/link"


interface PortfolioItem {
  id: string
  title: string
  description?: string
  mediaUrl: string
}

interface DashboardStats {
  earnings: number
  activeCampaigns: number
  unreadMessages: number
  rating: number
}

interface Campaign {
  id: string
  title: string
  description: string
  deadline: string
}

export default function CreatorDashboard() {
  const { user } = useAuth()
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [showPortfolioManager, setShowPortfolioManager] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    earnings: 0,
    activeCampaigns: 0,
    unreadMessages: 0,
    rating: 0,
  })
  const [recentCampaigns, setRecentCampaigns] = useState<Campaign[]>([])

  const fetchPortfolio = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portfolio/mine`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      const data = await res.json()
      setPortfolio(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to fetch portfolio", error)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch stats", error)
    }
  }

  const fetchCampaigns = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaigns/my-applications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      const data = await res.json()
      setRecentCampaigns(data.slice(0, 3))
    } catch (error) {
      console.error("Failed to fetch campaigns", error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchPortfolio()
      fetchStats()
      fetchCampaigns()
    }
  }, [user])

  return (
    <div className="p-6 text-white space-y-8">
      <h2 className="text-2xl font-semibold">Welcome, {user?.full_name}</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <DollarSign className="text-green-400" />
          <div>
            <p className="text-sm">Earnings</p>
            <p className="text-lg font-bold">${stats.earnings}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <Briefcase className="text-blue-400" />
          <div>
            <p className="text-sm">Active Campaigns</p>
            <p className="text-lg font-bold">{stats.activeCampaigns}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <Mail className="text-yellow-400" />
          <div>
            <p className="text-sm">Messages</p>
            <p className="text-lg font-bold">{stats.unreadMessages}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <Star className="text-purple-400" />
          <div>
            <p className="text-sm">Rating</p>
            <p className="text-lg font-bold">{stats.rating.toFixed(1) || "—"}</p>
          </div>
        </Card>
      </div>

      {/* Recent Campaigns */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Recent Campaigns</h3>
          <Link href="/campaigns" className="text-sm text-blue-400 hover:underline">
  View All
</Link>
        </div>
        {recentCampaigns.length === 0 ? (
          <p className="text-muted-foreground">No recent campaigns.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentCampaigns.map((c) => (
              <Card key={c.id} className="p-4">
                <h4 className="font-semibold mb-1">{c.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                <p className="text-xs text-gray-400 mt-2">Deadline: {new Date(c.deadline).toLocaleDateString()}</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Portfolio */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Your Portfolio</h3>
          <Button onClick={() => setShowPortfolioManager(true)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
        {portfolio.length === 0 ? (
          <p className="text-muted-foreground">You haven’t added any portfolio items yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {portfolio.map((item) => (
              <Card key={item.id} className="overflow-hidden border">
                <img src={item.mediaUrl} alt={item.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h4 className="font-semibold">{item.title}</h4>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {showPortfolioManager && (
        <PortfolioManager
          onClose={() => {
            setShowPortfolioManager(false)
            fetchPortfolio()
          }}
        />
      )}
    </div>
  )
}

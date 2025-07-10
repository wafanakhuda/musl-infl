"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { LoadingSpinner } from "../../components/ui/loading-spinner"
import { useAuth } from "../../hooks/use-auth"
import { apiClient, ModerateAction } from "../../lib/api-client" // <-- import ModerateAction
import { Users, DollarSign, AlertTriangle, BarChart3, RefreshCw, Briefcase, TrendingUp } from "lucide-react"
import { FloatingShapes } from "../../components/ui/floating-shapes"
import { toast } from "sonner"

// Define your interfaces
interface AdminStats {
  users: {
    total: number
    creators: number
    brands: number
    verified: number
    new_30d: number
  }
  campaigns: {
    total: number
    active: number
    completed: number
    new_30d: number
  }
  payments: {
    total_transactions: number
    total_revenue: number
    average_transaction: number
  }
}

interface AdminUser {
  id: string
  email: string
  full_name: string
  user_type: string
  verified: boolean
  email_verified: boolean
  is_active: boolean
  last_login: string | null
  created_at: string
}

interface AdminCampaign {
  id: string
  title: string
  status: string
  budget_min: number
  budget_max: number
  created_at: string
  brand: {
    full_name: string
    email: string
  }
  applications_count: number
}

// Dummy data for top dashboard stats
const statsData = [
  { label: "Total Users", value: "2,847", icon: Users, change: "+12%", color: "from-blue-500 to-cyan-500" },
  { label: "Active Campaigns", value: "156", icon: Briefcase, change: "+8%", color: "from-green-500 to-emerald-500" },
  { label: "Revenue", value: "$45,230", icon: DollarSign, change: "+23%", color: "from-yellow-500 to-orange-500" },
  { label: "Growth Rate", value: "18.2%", icon: TrendingUp, change: "+5%", color: "from-purple-500 to-pink-500" },
]

const recentActivity = [
  { type: "user", message: "New creator registered: Sarah Ahmed", time: "2 minutes ago" },
  { type: "campaign", message: "Campaign 'Modest Fashion' went live", time: "15 minutes ago" },
  { type: "payment", message: "Payment processed: $2,500", time: "1 hour ago" },
  { type: "report", message: "Content flagged for review", time: "2 hours ago" },
]

const pendingReviews = [
  { id: 1, type: "Creator Profile", name: "Omar Al-Rashid", status: "pending" },
  { id: 2, type: "Campaign Content", name: "Halal Food Review", status: "flagged" },
  { id: 3, type: "Payment Dispute", name: "Fashion Campaign #123", status: "urgent" },
]

export default function AdminPanel() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [campaigns, setCampaigns] = useState<AdminCampaign[]>([])
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<AdminCampaign | null>(null)
  const [suspendReason, setSuspendReason] = useState("")
  const [userFilters, setUserFilters] = useState({ search: "", user_type: "", verified: "", active: "" })
  const [campaignFilters, setCampaignFilters] = useState({ search: "", status: "" })

  useEffect(() => {
    if (user && user.user_type !== "admin") {
      window.location.href = "/dashboard"
    }
  }, [user])

  useEffect(() => {
    loadAdminData()
  }, [])

const loadAdminData = async () => {
  try {
    setLoading(true)
    const [statsData, usersData, campaignsData] = await Promise.all([
      apiClient.getAdminDashboard(),
      apiClient.getAdminUsers(),
      apiClient.getAdminCampaigns(),
    ])
    setStats(statsData)
    setUsers(usersData) // ← Fix here
    setCampaigns(campaignsData) // ← And here
  } catch (error) {
    console.error("Failed to load admin data:", error)
    toast.error("Failed to load admin data")
  } finally {
    setLoading(false)
  }
}

  const handleVerifyUser = async (userId: string, verified: boolean) => {
    try {
      await apiClient.verifyUser(userId, verified)
      toast.success(`User ${verified ? "verified" : "unverified"} successfully`)
      loadAdminData()
    } catch (error) {
      console.error("Failed to update user verification:", error)
      toast.error("Failed to update user verification")
    }
  }

  const handleSuspendUser = async (userId: string) => {
    if (!suspendReason.trim()) {
      toast.error("Please provide a reason for suspension")
      return
    }
    try {
      await apiClient.suspendUser(userId, suspendReason)
      toast.success("User suspended successfully")
      setSuspendReason("")
      setSelectedUser(null)
      loadAdminData()
    } catch (error) {
      console.error("Failed to suspend user:", error)
      toast.error("Failed to suspend user")
    }
  }

  const handleModerateCampaign = async (
    campaignId: string,
    action: ModerateAction, // <-- enforce this type
    reason: string
  ) => {
    try {
      await apiClient.moderateCampaign(campaignId, action, reason)
      toast.success(`Campaign ${action}ed successfully`)
      setSelectedCampaign(null)
      loadAdminData()
    } catch (error) {
      console.error("Failed to moderate campaign:", error)
      toast.error("Failed to moderate campaign")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <FloatingShapes />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <FloatingShapes />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Failed to Load Admin Data</h2>
            <Button onClick={loadAdminData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <FloatingShapes />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Platform overview and management</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-green-400">{stat.change}</Badge>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            )
          })}
        </div>

        {/* Recent Activity and Pending Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.message}</p>
                    <p className="text-gray-400 text-xs">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Reviews */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Pending Reviews</h2>
            <div className="space-y-4">
              {pendingReviews.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <div className="text-white font-medium">{item.name}</div>
                    <div className="text-gray-400 text-sm">{item.type}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={
                        item.status === "urgent"
                          ? "bg-red-500/20 text-red-300 border-red-500/30"
                          : item.status === "flagged"
                          ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                          : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                      }
                    >
                      {item.status}
                    </Badge>
                    <Button size="sm" variant="outline" className="text-white border-white/20">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="text-white border-white/20">
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Button>
            <Button variant="outline" className="text-white border-white/20">
              <Briefcase className="w-4 h-4 mr-2" />
              Review Campaigns
            </Button>
            <Button variant="outline" className="text-white border-white/20">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
            <Button variant="outline" className="text-white border-white/20">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Handle Reports
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

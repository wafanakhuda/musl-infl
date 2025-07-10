// File: /app/dashboard/creator/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../hooks/use-auth"
import CreatorDashboard from "../../../components/dashboard/creator-dashboard"
import CreatorDashboardLayout from "../../../components/layouts/creator-dashboard-layout"

export const dynamic = "force-dynamic"

export default function CreatorDashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAccess = async () => {
      if (!isAuthenticated) {
        router.push('/auth/login/creator')
        return
      }

      if (!user) {
        setLoading(false)
        return
      }

      // ✅ Check if OAuth user needs to complete profile
      const isIncompleteProfile = (
        !user.bio || 
        !user.location || 
        !user.niche ||
        !user.platforms || 
        user.platforms.length === 0
      )

      if (isIncompleteProfile) {
        console.log('🔄 User has incomplete profile, redirecting to onboarding...')
        router.push('/auth/complete-profile?from_oauth=true')
        return
      }

      setLoading(false)
    }

    checkAccess()
  }, [user, isAuthenticated, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <CreatorDashboardLayout>
      <CreatorDashboard />
    </CreatorDashboardLayout>
  )
}
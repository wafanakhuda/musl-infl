"use client"

export const dynamic = "force-dynamic"

import { useAuth } from "../../hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { FloatingShapes } from "../../components/ui/floating-shapes" 

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (user?.user_type === "creator") {
        router.replace("/dashboard/creator")
      } else if (user?.user_type === "brand") {
        router.replace("/dashboard/brand")
      }
    } else if (!loading && !isAuthenticated) {
      router.push("/auth/login")
    }
  }, [user, loading, isAuthenticated, router])

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
      <FloatingShapes />
      <div className="relative z-10 text-white text-lg">
        Redirecting to your dashboard...
      </div>
    </div>
  )
}

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function GenericLoginPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to creator login by default
    router.replace("/auth/login/creator")
  }, [router])
  
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-white">Redirecting to login...</div>
    </div>
  )
}

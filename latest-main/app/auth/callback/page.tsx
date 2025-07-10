// app/auth/callback/page.tsx
"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "../../../hooks/use-auth"

export default function OAuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const { loginWithToken } = useAuth()

  useEffect(() => {
    if (token) {
      localStorage.setItem("access_token", token)
      loginWithToken(token).then(() => {
        router.replace("/dashboard/creator")
      })
    } else {
      router.replace("/auth/login") // fallback
    }
  }, [token])

  return <p className="text-white p-6">Redirecting...</p>
}

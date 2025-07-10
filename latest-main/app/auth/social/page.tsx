"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "../../../hooks/use-auth"

export default function SocialRedirect() {
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
    }
  }, [token])

  return <div className="text-white p-10">Signing you in...</div>
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { FloatingElements } from "../../../components/ui/floating-elements"
import { useAuth } from "../../../hooks/use-auth"

export default function VerifyOtpPage() {
  const router = useRouter()
  const { loginWithToken } = useAuth()

  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const savedEmail = localStorage.getItem("pending_email")
    if (savedEmail) setEmail(savedEmail)
  }, [])

  const handleVerify = async () => {
    setError("")
    setSuccess(false)
    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "OTP verification failed")

      const user = data.user // ✅ assign the user object

      // ✅ Save token and login using context
      localStorage.setItem("access_token", data.token)
      await loginWithToken(data.token)
      localStorage.removeItem("pending_email")

      // ✅ Show success and redirect to role-based dashboard
      setSuccess(true)

      if (user?.user_type === "creator") {
        router.replace("/dashboard/creator")
      } else if (user?.user_type === "brand") {
        router.replace("/dashboard/brand")
      } else {
        router.replace("/dashboard") // fallback
      }
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white overflow-hidden">
      <FloatingElements />
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-slate-800/50 p-8 rounded-2xl shadow-lg backdrop-blur-md border border-white/10">
          <Link href="/" className="text-sm text-slate-400 block mb-6">
            ← Back to Home
          </Link>
          <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
          <p className="text-sm text-slate-400 mb-6">
            Enter the OTP sent to your email to complete registration
          </p>

          <Input
            type="email"
            placeholder="Your email"
            className="mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="text"
            inputMode="numeric"
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            className="mb-4"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-400 text-sm mb-4">✅ OTP Verified! Redirecting...</p>}

          <Button onClick={handleVerify} className="w-full" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>

          <p className="text-sm text-center mt-4 text-slate-400">
            Didn’t receive OTP?{" "}
            <span className="text-blue-400 cursor-pointer hover:underline">Check spam folder</span>
          </p>
        </div>
      </div>
    </main>
  )
}

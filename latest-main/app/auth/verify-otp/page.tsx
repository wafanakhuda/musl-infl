"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { FloatingElements } from "../../../components/ui/floating-elements"
import { useAuth } from "../../../hooks/use-auth"
import { Loader2, Mail, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function VerifyOtpPage() {
  const router = useRouter()
  const { loginWithToken } = useAuth()

  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    const savedEmail = localStorage.getItem("pending_email")
    if (savedEmail) setEmail(savedEmail)
  }, [])

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

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

      const user = data.user

      // Save token and login using context
      localStorage.setItem("access_token", data.token)
      await loginWithToken(data.token)
      localStorage.removeItem("pending_email")
      localStorage.removeItem("pending_user_type") // Clean up the user type as well

      // Show success and redirect to role-based dashboard
      setSuccess(true)
      toast.success("Account verified successfully!")

      setTimeout(() => {
        if (user?.user_type === "creator") {
          router.replace("/dashboard/creator")
        } else if (user?.user_type === "brand") {
          router.replace("/dashboard/brand")
        } else {
          router.replace("/dashboard")
        }
      }, 1500)

    } catch (err: any) {
      setError(err.message || "Failed to verify OTP")
      toast.error(err.message || "OTP verification failed")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email not found. Please go back to registration.")
      return
    }

    setResendLoading(true)
    setError("")

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Failed to resend OTP")

      toast.success("New OTP sent to your email!")
      setCountdown(60) // Start 60 second countdown

    } catch (err: any) {
      setError(err.message || "Failed to resend OTP")
      toast.error(err.message || "Failed to resend OTP")
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white overflow-hidden">
      <FloatingElements />
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
          
          <Link 
            href="/auth/register" 
            className="flex items-center text-sm text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Registration
          </Link>

          <div className="text-center mb-8">
            <Mail className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
            <p className="text-slate-400">
              We've sent a verification code to
            </p>
            <p className="text-white font-medium">{email}</p>
          </div>

          {success ? (
            <div className="text-center">
              <div className="text-green-400 text-lg font-semibold mb-2">
                ✅ Email Verified!
              </div>
              <p className="text-slate-400 mb-4">Redirecting to your dashboard...</p>
              <div className="animate-pulse">
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">Verification Code</label>
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-2xl tracking-wider font-mono border-white/20 bg-white/5 text-white"
                  maxLength={6}
                  autoFocus
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <Button
                onClick={handleVerify}
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {loading ? "Verifying..." : "Verify Email"}
              </Button>

              <div className="text-center">
                <p className="text-sm text-slate-400 mb-3">
                  Didn't receive the code?
                </p>
                <Button
                  onClick={handleResendOtp}
                  disabled={resendLoading || countdown > 0}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  {resendLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
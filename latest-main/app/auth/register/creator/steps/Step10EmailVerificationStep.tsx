"use client"

import React, { useEffect, useState, useRef } from "react"
import { Input } from "../../../../../components/ui/input"
import { Button } from "../../../../../components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { CreatorFormData } from "../../../../../components/types/form"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../../../hooks/use-auth" // ✅ Import useAuth

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://latestbackend-3psc.onrender.com"

interface Step10Props {
  formData: CreatorFormData
  updateForm: (data: Partial<CreatorFormData>) => void
  back: () => void
}

const Step10EmailVerificationStep: React.FC<Step10Props> = ({ formData, updateForm, back }) => {
  const router = useRouter()
  const { loginWithToken } = useAuth() // ✅ Get loginWithToken function
  const hasRegistered = useRef(false)

  const [isVerifying, setIsVerifying] = useState(false)
  const [isSending, setIsSending] = useState(true)
  const [countdown, setCountdown] = useState(60)
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    // Prevent double registration in React StrictMode
    if (hasRegistered.current) return
    hasRegistered.current = true

    const registerUser = async () => {
      try {
        console.log("🔄 Starting registration process...")
        console.log("📝 Form data received:", {
          email: formData.email,
          hasPassword: !!formData.password,
          hasFullName: !!formData.full_name,
          hasLocation: !!formData.location,
          hasBio: !!formData.bio,
          hasTitle: !!formData.title,
          contentTypes: formData.content_type?.length || 0
        })

        // ✅ Prepare the payload to match backend expectations exactly
        const payload = {
          email: formData.email?.trim(),
          password: formData.password,
          full_name: formData.full_name?.trim(),
          user_type: "creator",
          location: formData.location?.trim() || "Not specified",
          bio: formData.bio?.trim() || "Creator on MuslimInfluencers.io",
          avatar_url: typeof formData.avatar === 'string' ? formData.avatar : undefined,
          profile: {
            username: formData.title?.trim() || `user_${Date.now()}`
          },
          // ✅ Additional creator fields
          platforms: Array.isArray(formData.content_type) ? formData.content_type : [],
          gender: formData.gender || undefined,
          niche: formData.content_type?.[0] || undefined,
        }

        console.log("📤 Sending registration payload:", {
          ...payload,
          password: "[HIDDEN]"
        })

        const res = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        const data = await res.json()
        console.log("📥 Registration response:", {
          ok: res.ok,
          status: res.status,
          hasUser: !!data.user,
          message: data.message
        })

        if (!res.ok) {
          const errorMessage = data.error || "Registration failed"
          console.error("❌ Registration failed:", errorMessage)
          throw new Error(errorMessage)
        }

        console.log("✅ Registration successful!")
        toast.success("Account created successfully! Please check your email for the OTP.")
        setCountdown(60)

      } catch (error: unknown) {
        const errorMessage = (error as Error).message
        console.error("❌ Registration error:", errorMessage)
        
        if (errorMessage.includes("already registered") || errorMessage.includes("Email already")) {
          toast.error("This email is already registered. Please login instead.")
          setTimeout(() => {
            router.push("/auth/login/creator")
          }, 2000)
        } else if (errorMessage.includes("Missing required fields")) {
          toast.error("Please complete all previous steps before proceeding.")
          hasRegistered.current = false // Allow retry
        } else {
          toast.error(errorMessage || "Registration failed. Please try again.")
          hasRegistered.current = false // Allow retry
        }
      } finally {
        setIsSending(false)
      }
    }

    registerUser()
  }, [formData, router])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const sendOtp = async () => {
    setIsResending(true)
    try {
      const res = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to send OTP")

      toast.success("OTP resent to your email.")
      setCountdown(60)
    } catch (error: unknown) {
      toast.error((error as Error).message || "Failed to resend OTP")
    } finally {
      setIsResending(false)
    }
  }

  const savePackages = async (token: string) => {
    if (!formData.packages || formData.packages.length === 0) return true

    try {
      const packagesPayload = {
        packages: formData.packages.map(pkg => ({
          title: pkg.title,
          description: pkg.description,
          price: parseInt(pkg.price)
        }))
      }

      console.log("💼 Saving packages:", packagesPayload)

      const res = await fetch(`${API_BASE_URL}/creators/packages`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(packagesPayload),
      })

      if (!res.ok) {
        const error = await res.json()
        console.error("Failed to save packages:", error)
        return false
      }
      console.log("✅ Packages saved successfully")
      return true
    } catch (error) {
      console.error("Error saving packages:", error)
      return false
    }
  }

  const verifyOtp = async () => {
    if (formData.otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP")
      return
    }

    setIsVerifying(true)
    try {
      console.log("🔍 Verifying OTP for:", formData.email)

      const verifyRes = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          otp: formData.otp.trim(),
        }),
      })

      const verifyData = await verifyRes.json()
      console.log("📥 OTP verification response:", {
        ok: verifyRes.ok,
        status: verifyRes.status,
        hasToken: !!verifyData.token,
        hasUser: !!verifyData.user
      })

      if (!verifyRes.ok) {
        throw new Error(verifyData.error || "OTP verification failed")
      }

      console.log("✅ OTP verification successful!")

      // ✅ Save packages after successful verification (if token available)
      if (verifyData.token) {
        const packagesSuccess = await savePackages(verifyData.token)
        if (!packagesSuccess) {
          console.warn("⚠️ Failed to save packages, but user is still registered")
        }
      }

      // ✅ AUTO LOGIN: Use the token to log the user in automatically
      if (verifyData.token) {
        console.log("🔐 Auto-logging in user with received token...")
        
        // Store the token
        localStorage.setItem("access_token", verifyData.token)
        
        // Login with token using auth provider
        await loginWithToken(verifyData.token)
        
        console.log("✅ Auto-login successful!")
        
        // Clear any stored registration data
        localStorage.removeItem("creator_registration_data")
        
        // Show success message
        toast.success("🎉 Account created successfully! Welcome to MuslimInfluencers.io!")
        
        // ✅ Redirect to dashboard instead of login page
        setTimeout(() => {
          router.push("/dashboard/creator")
        }, 1500)
        
      } else {
        // ✅ Fallback: No token received, redirect to login
        console.warn("⚠️ No token received, redirecting to login")
        
        // Clear any stored registration data
        localStorage.removeItem("creator_registration_data")
        
        toast.success("🎉 Account created successfully! Please login to continue.")
        
        setTimeout(() => {
          router.push("/auth/login/creator")
        }, 2000)
      }
      
    } catch (error: unknown) {
      const errorMessage = (error as Error).message
      console.error("❌ OTP verification error:", errorMessage)
      
      if (errorMessage.includes("Invalid or expired")) {
        toast.error("Invalid or expired OTP. Please request a new one.")
      } else if (errorMessage.includes("User not found")) {
        toast.error("Account not found. Please register again.")
      } else {
        toast.error(errorMessage || "OTP verification failed. Please try again.")
      }
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Verify Your Email</h2>
      <p className="text-sm text-muted-foreground mb-6">
        We've sent a verification code to <span className="font-medium">{formData.email}</span>
      </p>

      {isSending ? (
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">
            Creating your account...
          </p>
          <p className="text-xs text-slate-500 mt-2">
            This may take a few moments
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-1 mb-4">
            <label className="text-sm text-muted-foreground">Enter verification code</label>
            <Input
              placeholder="000000"
              maxLength={6}
              value={formData.otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '') // Only allow digits
                updateForm({ otp: value })
              }}
              className="text-center text-2xl tracking-wider font-mono"
              autoFocus
            />
          </div>
          
          <Button
            className="w-full"
            onClick={verifyOtp}
            disabled={isVerifying || formData.otp.length !== 6}
          >
            {isVerifying && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {isVerifying ? "Verifying..." : "Verify & Complete Registration"}
          </Button>
          
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Didn't receive the code?{" "}
            <button
              onClick={() => sendOtp()}
              className="underline text-primary disabled:text-muted-foreground hover:text-primary/80 transition-colors"
              disabled={countdown > 0 || isResending}
            >
              {isResending ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
            </button>
          </p>

          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> Check your spam folder if you don't see the email. 
              The code expires in 10 minutes.
            </p>
            {/* ✅ Debug info for development */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-2">
                <summary className="text-xs cursor-pointer text-blue-500">Show Debug Info</summary>
                <pre className="text-xs mt-2 p-2 bg-black/20 rounded overflow-auto">
                  {JSON.stringify({
                    email: formData.email,
                    hasPassword: !!formData.password,
                    hasFullName: !!formData.full_name,
                    hasLocation: !!formData.location,
                    hasBio: !!formData.bio,
                    hasTitle: !!formData.title,
                    contentTypes: formData.content_type,
                    packages: formData.packages?.length || 0
                  }, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </>
      )}

      <div className="mt-6 flex justify-between">
        <Button 
          variant="secondary" 
          onClick={back} 
          disabled={isVerifying || isSending}
        >
          Back
        </Button>
      </div>
    </div>
  )
}

export default Step10EmailVerificationStep

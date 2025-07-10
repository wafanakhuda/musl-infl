"use client"

import React, { useEffect, useState, useRef } from "react"
import { Input } from "../../../../../components/ui/input"
import { Button } from "../../../../../components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { CreatorFormData } from "../../../../../components/types/form"
import { useRouter } from "next/navigation"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://latestbackend-3psc.onrender.com"

interface Step10Props {
  formData: CreatorFormData
  updateForm: (data: Partial<CreatorFormData>) => void
  back: () => void
}

const Step10EmailVerificationStep: React.FC<Step10Props> = ({ formData, updateForm, back }) => {
  const router = useRouter()
  const hasRegistered = useRef(false)

  const [isVerifying, setIsVerifying] = useState(false)
  const [isSending, setIsSending] = useState(true)
  const [countdown, setCountdown] = useState(60)
  const [isResending, setIsResending] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Prevent double registration in React StrictMode
    if (hasRegistered.current) return
    hasRegistered.current = true

    const registerUser = async () => {
      try {
        // ✅ FIXED: Prepare payload to match backend expectations exactly
        const payload = {
          email: formData.email?.trim(),
          password: formData.password,
          full_name: formData.full_name?.trim(),
          user_type: "creator",
          location: formData.location?.trim() || "Not specified", // ✅ Backend requires this
          bio: formData.bio?.trim() || "Content creator", // ✅ Backend requires this
          avatar_url: formData.avatar instanceof File ? undefined : formData.avatar, // ✅ Handle File objects
          profile: {
            username: formData.title?.trim() || `user_${Date.now()}` // ✅ Backend requires username in profile
          },
          // ✅ Optional fields that backend can handle
          platforms: Array.isArray(formData.content_type) ? formData.content_type : [],
          gender: formData.gender || undefined,
          niche: formData.content_type?.[0] || undefined, // Use first content type as niche
        }

        console.log("✅ Registering user with fixed payload:", payload)

        const res = await fetch(`${API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        const data = await res.json()
        console.log("Registration response:", data)

        if (!res.ok) {
          const errorMessage = data.error || "Registration failed"
          console.error("Registration failed:", errorMessage)
          throw new Error(errorMessage)
        }

        // Store user ID if returned
        if (data.user?.id) {
          setUserId(data.user.id)
        }

        toast.success("Registration successful! Please check your email for the OTP.")
        setCountdown(60)

      } catch (error: unknown) {
        const errorMessage = (error as Error).message
        console.error("Registration error:", errorMessage)
        
        // Check if error is due to existing email
        if (errorMessage.includes("already registered") || errorMessage.includes("Email already")) {
          toast.error("This email is already registered. Please login instead.")
          setTimeout(() => {
            router.push("/auth/login/creator") // ✅ Fixed route
          }, 2000)
        } else {
          toast.error(errorMessage || "Registration failed. Please try again.")
        }
        
        // Allow user to go back if registration fails
        hasRegistered.current = false
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

      console.log("Saving packages:", packagesPayload)

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
      console.log("Verifying OTP for:", formData.email)

      // ✅ Verify OTP
      const verifyRes = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          otp: formData.otp.trim(),
        }),
      })

      const verifyData = await verifyRes.json()
      console.log("OTP verification response:", verifyData)

      if (!verifyRes.ok) {
        throw new Error(verifyData.error || "OTP verification failed")
      }

      // ✅ Save packages after successful verification (if token available)
      if (verifyData.token) {
        const packagesSuccess = await savePackages(verifyData.token)
        if (!packagesSuccess) {
          console.warn("Failed to save packages, but user is still registered")
        }
      }

      // ✅ Success! User is registered, verified, and ready to login
      toast.success("🎉 Account created successfully! Redirecting to login...")
      
      // Clear any stored registration data
      localStorage.removeItem("creator_registration_data")
      
      // ✅ Navigate to the correct login page
      setTimeout(() => {
        router.push("/auth/login/creator") // Make sure this route exists
      }, 1500)
      
    } catch (error: unknown) {
      const errorMessage = (error as Error).message
      console.error("OTP verification error:", errorMessage)
      
      if (errorMessage.includes("Invalid or expired")) {
        toast.error("Invalid or expired OTP. Please try again or request a new one.")
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
              <strong>Debug Info:</strong> Check your spam folder if you don't see the email. 
              The code expires in 10 minutes.
            </p>
            {/* ✅ Debug info for development */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-2">
                <summary className="text-xs cursor-pointer">Show Debug Data</summary>
                <pre className="text-xs mt-2 p-2 bg-black/20 rounded">
                  {JSON.stringify({
                    email: formData.email,
                    hasTitle: !!formData.title,
                    hasLocation: !!formData.location,
                    hasBio: !!formData.bio,
                    contentTypes: formData.content_type
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

// File: /app/auth/register/brand/steps/Step1Account.tsx
"use client"

import { useState } from "react"
import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { FloatingElements } from "../../../../../components/ui/floating-elements"
import { Eye, EyeOff, Building2, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Step1AccountProps {
  formData: {
    email: string
    password: string
    full_name: string
  }
  updateForm: (data: any) => void
  onNext: () => void
}

export default function Step1Account({ formData, updateForm, onNext }: Step1AccountProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required"
    } else if (formData.full_name.trim().length < 2) {
      newErrors.full_name = "Full name must be at least 2 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  const handleGoogleSignup = () => {
    setLoading(true)
    // Redirect to Google OAuth with brand user type
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google?user_type=brand`
  }

  const handleAppleSignup = () => {
    toast.info("Apple Sign-in coming soon!")
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-950 text-white overflow-hidden">
      <FloatingElements />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <Card className="w-full max-w-md bg-black/40 backdrop-blur-md border-white/10">
          <CardHeader className="text-center space-y-2">
            <Link href="/" className="text-sm text-slate-400 hover:text-slate-300 transition-colors flex items-center justify-center gap-2">
              ← Back to Home
            </Link>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Building2 className="w-6 h-6 text-purple-400" />
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Join as a Brand
              </CardTitle>
            </div>
            <p className="text-sm text-slate-400">
              Step 1 of 8 • Account Information
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Social Signup Options */}
            <div className="space-y-3">
              <Button
                onClick={handleGoogleSignup}
                variant="outline"
                className="w-full bg-white text-black hover:bg-gray-100 border-white/20"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                {loading ? "Connecting..." : "Continue with Google"}
              </Button>

              <Button
                onClick={handleAppleSignup}
                variant="outline"
                className="w-full bg-black text-white hover:bg-gray-800 border-white/20"
                disabled={loading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Continue with Apple
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black/40 text-slate-400">Or create account with email</span>
              </div>
            </div>

            {/* Manual Signup Form */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm text-slate-300">Full Name *</label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.full_name}
                  onChange={(e) => updateForm({ full_name: e.target.value })}
                  className="border-white/20 bg-white/5 text-white placeholder-gray-400"
                  required
                />
                {errors.full_name && <p className="text-red-400 text-sm">{errors.full_name}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm text-slate-300">Email Address *</label>
                <Input
                  type="email"
                  placeholder="Enter your business email"
                  value={formData.email}
                  onChange={(e) => updateForm({ email: e.target.value })}
                  className="border-white/20 bg-white/5 text-white placeholder-gray-400"
                  required
                />
                {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm text-slate-300">Password *</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={(e) => updateForm({ password: e.target.value })}
                    className="border-white/20 bg-white/5 text-white placeholder-gray-400 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm text-slate-300">Confirm Password *</label>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-white/20 bg-white/5 text-white placeholder-gray-400"
                  required
                />
                {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
              </div>

              <Button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                Continue
              </Button>
            </div>

            <div className="text-center space-y-2">
              <p className="text-sm text-slate-400">
                Already have an account?{" "}
                <Link
                  href="/auth/login/brand"
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Sign In
                </Link>
              </p>
              
              <p className="text-sm text-slate-400">
                Are you a creator?{" "}
                <Link
                  href="/auth/register/creator"
                  className="text-teal-400 hover:text-teal-300 font-medium transition-colors"
                >
                  Join as Creator
                </Link>
              </p>
            </div>

            <div className="text-xs text-slate-500 text-center">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-purple-400 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-purple-400 hover:underline">
                Privacy Policy
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
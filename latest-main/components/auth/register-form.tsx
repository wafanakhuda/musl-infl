"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { useAuth } from "../../hooks/use-auth"
import { Eye, EyeOff, Loader2, User, Building2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface FormData {
  email: string
  password: string
  confirmPassword: string
  full_name: string
  user_type: "creator" | "brand" | ""
  company_name: string
  niche: string
}

interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
  full_name?: string
  user_type?: string
  company_name?: string
  general?: string
  niche?: string
}

export function RegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    user_type: "",
    company_name: "",
    niche: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const router = useRouter()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Enhanced email validation
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    } else if (formData.email.length > 254) {
      newErrors.email = "Email address is too long"
    }

    // Enhanced password validation with specific requirements
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else {
      const passwordErrors: string[] = []
      if (formData.password.length < 8) passwordErrors.push("at least 8 characters")
      if (!/(?=.*[a-z])/.test(formData.password)) passwordErrors.push("one lowercase letter")
      if (!/(?=.*[A-Z])/.test(formData.password)) passwordErrors.push("one uppercase letter")
      if (!/(?=.*\d)/.test(formData.password)) passwordErrors.push("one number")
      if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(formData.password)) passwordErrors.push("one special character")

      if (passwordErrors.length > 0) {
        newErrors.password = `Password must contain ${passwordErrors.join(", ")}`
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match"
    }

    // Enhanced full name validation
    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required"
    } else if (formData.full_name.trim().length < 2) {
      newErrors.full_name = "Full name must be at least 2 characters"
    } else if (formData.full_name.trim().length > 100) {
      newErrors.full_name = "Full name is too long (max 100 characters)"
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.full_name.trim())) {
      newErrors.full_name = "Full name can only contain letters, spaces, hyphens, and apostrophes"
    }

    // User type validation
    if (!formData.user_type) {
      newErrors.user_type = "Please select an account type"
    }

    // Enhanced company name validation for brands
    if (formData.user_type === "brand") {
      if (!formData.company_name.trim()) {
        newErrors.company_name = "Company name is required for brand accounts"
      } else if (formData.company_name.trim().length < 2) {
        newErrors.company_name = "Company name must be at least 2 characters"
      } else if (formData.company_name.trim().length > 200) {
        newErrors.company_name = "Company name is too long (max 200 characters)"
      }
    }

    // Enhanced niche validation for creators
    if (formData.user_type === "creator" && formData.niche.trim()) {
      if (formData.niche.trim().length > 100) {
        newErrors.niche = "Niche is too long (max 100 characters)"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const registrationData = {
        email: formData.email.trim(),
        password: formData.password,
        full_name: formData.full_name.trim(),
        user_type: formData.user_type as "creator" | "brand",
        ...(formData.user_type === "brand" && { company_name: formData.company_name.trim() }),
        ...(formData.user_type === "creator" && formData.niche && { niche: formData.niche.trim() }),
      }

      await register(registrationData)

      toast.success("Account Created Successfully!", {
        description: `Welcome ${formData.full_name}! Please check your email to verify your account.`,
        duration: 5000,
      })
      router.push("/")
    } catch (error: any) {
      setErrors({ general: error.message || "Registration failed. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const handleUserTypeChange = (value: "creator" | "brand") => {
    setFormData((prev) => ({
      ...prev,
      user_type: value,
      // Clear company name if switching to creator
      ...(value === "creator" && { company_name: "" }),
    }))

    if (errors.user_type) {
      setErrors((prev) => ({
        ...prev,
        user_type: undefined,
      }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <Card className="w-full max-w-md glass-card border-white/10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
          <p className="text-gray-400">Join the halal marketplace community</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-white">
                Full Name *
              </Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={handleChange("full_name")}
                placeholder="Enter your full name"
                className={`border-white/20 bg-white/5 text-white placeholder-gray-400 ${
                  errors.full_name ? "border-red-500" : ""
                }`}
                disabled={loading}
              />
              {errors.full_name && <p className="text-red-400 text-sm">{errors.full_name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                placeholder="Enter your email address"
                className={`border-white/20 bg-white/5 text-white placeholder-gray-400 ${
                  errors.email ? "border-red-500" : ""
                }`}
                disabled={loading}
              />
              {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <Label className="text-white">Account Type *</Label>
              <Select value={formData.user_type} onValueChange={handleUserTypeChange} disabled={loading}>
                <SelectTrigger
                  className={`border-white/20 bg-white/5 text-white ${errors.user_type ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="creator">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Creator/Influencer</div>
                        <div className="text-xs text-muted-foreground">
                          Showcase your content and collaborate with brands
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="brand">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <div>
                        <div className="font-medium">Brand/Business</div>
                        <div className="text-xs text-muted-foreground">Find creators and launch campaigns</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.user_type && <p className="text-red-400 text-sm">{errors.user_type}</p>}
            </div>

            {/* Company Name (for brands) */}
            {formData.user_type === "brand" && (
              <div className="space-y-2">
                <Label htmlFor="company_name" className="text-white">
                  Company Name *
                </Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={handleChange("company_name")}
                  placeholder="Enter your company name"
                  className={`border-white/20 bg-white/5 text-white placeholder-gray-400 ${
                    errors.company_name ? "border-red-500" : ""
                  }`}
                  disabled={loading}
                />
                {errors.company_name && <p className="text-red-400 text-sm">{errors.company_name}</p>}
              </div>
            )}

            {/* Niche (for creators) */}
            {formData.user_type === "creator" && (
              <div className="space-y-2">
                <Label htmlFor="niche" className="text-white">
                  Content Niche (Optional)
                </Label>
                <Input
                  id="niche"
                  value={formData.niche}
                  onChange={handleChange("niche")}
                  placeholder="e.g., Fashion, Food, Tech, Lifestyle"
                  className="border-white/20 bg-white/5 text-white placeholder-gray-400"
                  disabled={loading}
                />
                {errors.niche && <p className="text-red-400 text-sm">{errors.niche}</p>}
              </div>
            )}

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Password *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange("password")}
                  placeholder="Create a strong password"
                  className={`border-white/20 bg-white/5 text-white placeholder-gray-400 pr-10 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && <p className="text-red-400 text-sm">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">
                Confirm Password *
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  placeholder="Confirm your password"
                  className={`border-white/20 bg-white/5 text-white placeholder-gray-400 pr-10 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-sm">{errors.confirmPassword}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

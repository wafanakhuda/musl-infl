"use client"

import { useState } from "react"
import { Input } from "../../../../../components/ui/input"
import { Button } from "../../../../../components/ui/button"
import { toast } from "sonner"
import { FcGoogle } from "react-icons/fc"

interface Step1AccountProps {
  formData: any
  updateForm: (data: any) => void
  onNext: () => void
}

export default function Step1Account({ formData, updateForm, onNext }: Step1AccountProps) {
  const [loading, setLoading] = useState(false)

  const handleNext = async () => {
    const { email, password, full_name } = formData

    if (!email || !password || !full_name) {
      toast.error("Please fill all fields")
      return
    }

    try {
      setLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to send OTP")

      toast.success("OTP sent to your email")
      onNext()
    } catch (err: any) {
      toast.error(err.message || "Error sending OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-center">Sign up as a Brand</h2>
      <p className="text-center text-muted-foreground text-sm">
        Start collaborating with top creators on MuslimInfluencers.io
      </p>

      {/* Google Sign Up */}
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
        onClick={() => toast("Google Sign-Up coming soon")}
      >
        <FcGoogle size={20} />
        Continue with Google
      </Button>

      <div className="relative text-center text-sm text-gray-500 py-2">
        <span className="absolute left-0 top-1/2 w-full border-t border-gray-300"></span>
        <span className="bg-white px-2 relative z-10">or sign up with email</span>
      </div>

      {/* Full Name */}
      <div>
        <label className="text-sm font-medium mb-1 block">Full Name</label>
        <Input
          placeholder="John Doe"
          value={formData.full_name || ""}
          onChange={(e) => updateForm({ full_name: e.target.value })}
        />
      </div>

      {/* Email */}
      <div>
        <label className="text-sm font-medium mb-1 block">Email Address</label>
        <Input
          type="email"
          placeholder="you@company.com"
          value={formData.email || ""}
          onChange={(e) => updateForm({ email: e.target.value })}
        />
      </div>

      {/* Password */}
      <div>
        <label className="text-sm font-medium mb-1 block">Password</label>
        <Input
          type="password"
          placeholder="••••••••"
          value={formData.password || ""}
          onChange={(e) => updateForm({ password: e.target.value })}
        />
      </div>

      {/* Continue Button */}
      <div className="pt-4">
        <Button className="w-full" onClick={handleNext} disabled={loading}>
          {loading ? "Sending OTP..." : "Continue"}
        </Button>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Input } from "../../../../../components/ui/input"
import { Button } from "../../../../../components/ui/button"
import { toast } from "sonner"

interface Step2OtpProps {
  formData: {
    email: string
    otp: string
  }
  updateForm: (data: Partial<any>) => void
  next: () => void
}

export default function Step2Otp({ formData, updateForm, next }: Step2OtpProps) {
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    if (!formData.otp) {
      toast.error("Please enter the OTP")
      return
    }

    try {
      setLoading(true)

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "OTP verification failed")

      toast.success("Email verified successfully")

      console.log("✅ OTP verified successfully. Moving to next step.")
      next()
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center">Verify Your Email</h2>
      <p className="text-center text-muted-foreground text-sm">
        We sent a 6-digit code to <strong>{formData.email}</strong>
      </p>

      <div>
        <label className="text-sm font-medium mb-1 block">Enter OTP</label>
        <Input
          placeholder="Enter the 6-digit code"
          value={formData.otp || ""}
          onChange={(e) => updateForm({ otp: e.target.value })}
          maxLength={6}
        />
      </div>

      <div className="pt-4">
        <Button className="w-full" onClick={handleVerify} disabled={loading}>
          {loading ? "Verifying..." : "Verify & Continue"}
        </Button>
      </div>
    </div>
  )
}

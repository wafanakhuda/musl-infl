"use client"

import { Button } from "../../../../../components/ui/button"
import { Input } from "../../../../../components/ui/input"
import { useState } from "react"

interface StepProps {
  formData: any
  updateForm: (data: Partial<any>) => void
  next: () => void
}

export default function Step1Account({ formData, updateForm, next }: StepProps) {
  const [error, setError] = useState("")

  const handleNext = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formData.full_name?.trim()) {
      setError("Full name is required.")
      return
    }
    if (!formData.email?.trim()) {
      setError("Email is required.")
      return
    }
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.")
      return
    }
    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setError("")
    next()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Create your account</h2>

      {/* Social Buttons */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
        >
          <img src="/icons/google.svg" alt="Google" className="w-5 h-5 mr-2" />
          Continue with Google
        </Button>
      </div>

      {/* Divider */}
      <div className="text-center text-sm text-muted-foreground">
        or enter your details below
      </div>

      {/* Email/Password Form */}
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={(e) => updateForm({ full_name: e.target.value })}
        />
        <Input
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => updateForm({ email: e.target.value })}
        />
        <Input
          type="password"
          placeholder="Password (min 6 characters)"
          value={formData.password}
          onChange={(e) => updateForm({ password: e.target.value })}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {/* Next Button */}
      <div className="pt-4 flex justify-end">
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  )
}

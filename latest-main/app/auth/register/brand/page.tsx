"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Step1Account from "./steps/Step1Account"
import Step2Otp from "./steps/Step2Otp"
import Step3Industry from "./steps/Step3Industry"
import Step4Role from "./steps/Step4Role"
import Step5Categories from "./steps/Step5Categories"
import Step6Platforms from "./steps/Step6Platforms"
import Step7Content from "./steps/Step7Content"
import Step8Budget from "./steps/Step8Budget"
import { useAuth } from "../../../../hooks/use-auth"
import { toast } from "sonner"

export default function BrandRegisterPage() {
  const router = useRouter()
  const { register } = useAuth()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    full_name: "",
    role: "",
    industry: "",
    categories: [] as string[],
    platforms: [] as string[],
    contentNeed: "",
    budget: "",
  })

  const updateForm = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      await register({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        user_type: "brand",
        profile: {
          role: formData.role,
          industry: formData.industry,
          categories: formData.categories,
          platforms: formData.platforms,
          content_need: formData.contentNeed,
          annual_budget: formData.budget,
        },
      })
      toast.success("Brand registered successfully! Please check your email for verification.")
      // No need to redirect here - the register function will handle OTP verification redirect
      // After OTP verification, user will be redirected to brand dashboard automatically
    } catch (error: any) {
      toast.error(error.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const steps = [
  <Step1Account key={1} formData={formData} updateForm={updateForm} onNext={nextStep} />,
  <Step2Otp key={2} formData={formData} updateForm={updateForm} next={nextStep} />,
  <Step3Industry key={3} data={formData} update={updateForm} next={nextStep} prev={prevStep} />,
  <Step4Role key={4} data={formData} update={updateForm} next={nextStep} prev={prevStep} />,
  <Step5Categories key={5} data={formData} update={updateForm} next={nextStep} prev={prevStep} />,
  <Step6Platforms key={6} data={formData} update={updateForm} next={nextStep} prev={prevStep} />,
  <Step7Content key={7} data={formData} update={updateForm} next={nextStep} prev={prevStep} />,
  <Step8Budget key={8} data={formData} update={updateForm} prev={prevStep} submit={handleSubmit} loading={loading} />,
  ]



  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      {steps[step - 1]}
    </div>
  )
}

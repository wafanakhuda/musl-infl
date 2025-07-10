"use client"

import { useState } from "react"
import Step1Account from "./steps/Step1Account"
import Step2Location from "./steps/Step2Location"
import Step3Title from "./steps/Step3Title"
import Step4Bio from "./steps/Step4Bio"
import Step5Socials from "./steps/Step5Socials"
import Step6Gender from "./steps/Step6Gender"
import Step7ContentType from "./steps/Step7ContentType"
import Step8Photos from "./steps/Step8Photos"
import Step9Packages from "./steps/Step9Packages"
import Step10EmailVerificationStep from "./steps/Step10EmailVerificationStep"
import { FloatingElements } from "../../../../components/ui/floating-elements"
import type { CreatorFormData } from "../../../../components/types/form"

const steps = [
  Step1Account,
  Step2Location,
  Step3Title,
  Step4Bio,
  Step5Socials,
  Step6Gender,
  Step7ContentType,
  Step8Photos,
  Step9Packages,
  Step10EmailVerificationStep,
]

export default function CreatorRegistrationPage() {
  const [step, setStep] = useState(0)

  const [formData, setFormData] = useState<CreatorFormData>({
  full_name: "",
  email: "",
  password: "",
  location: "",
  title: "",
  bio: "",
  social_links: [],
  gender: "",
  content_type: [], // ✅ FIXED: was `content_types`
  avatar: "",
  cover_photos: [],
  packages: [],
  otp: "",
});

  const next = () => {
    if (step === 0 && (!formData.password || formData.password.length < 6)) {
      alert("Please enter a valid password before continuing.")
      return
    }
    setStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const back = () => setStep((prev) => Math.max(prev - 1, 0))

  const updateForm = (data: Partial<CreatorFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const StepComponent = steps[step]

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 text-white">
      <FloatingElements />
      <main className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-black/20 p-6 rounded-2xl shadow-xl">
          <StepComponent
            formData={formData}
            updateForm={updateForm}
            next={next}
            back={back}
          />
        </div>
      </main>
    </div>
  )
}

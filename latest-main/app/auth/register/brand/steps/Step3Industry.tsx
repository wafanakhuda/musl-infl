// app/auth/register/brand/steps/Step3Industry.tsx

"use client"

import { useState } from "react"
import { Button } from "../../../../../components/ui/button"
import { Label } from "../../../../../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../../../../../components/ui/radio-group"

interface Step3IndustryProps {
  data: any
  update: (data: Partial<any>) => void
  next: () => void
  prev: () => void
}

export default function Step3Industry({ data, update, next, prev }: Step3IndustryProps) {
  const industries = [
    "E-commerce",
    "Fashion & Apparel",
    "Beauty & Cosmetics",
    "Tech & Software",
    "Health & Wellness",
    "Food & Beverage",
    "Other",
  ]

  const [selected, setSelected] = useState(data.industry || "")

  const handleNext = () => {
    if (!selected) return
    update({ industry: selected })
    next()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Which industry best describes you?</h2>

      <RadioGroup value={selected} onValueChange={setSelected} className="space-y-3">
        {industries.map((industry) => (
          <div key={industry} className="flex items-center space-x-2">
            <RadioGroupItem value={industry} id={industry} />
            <Label htmlFor={industry}>{industry}</Label>
          </div>
        ))}
      </RadioGroup>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={prev}>
          Back
        </Button>
        <Button disabled={!selected} onClick={handleNext}>
          Continue
        </Button>
      </div>
    </div>
  )
}

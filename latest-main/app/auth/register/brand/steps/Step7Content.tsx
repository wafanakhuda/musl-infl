// app/auth/register/brand/steps/Step6ContentQuantity.tsx

"use client"

import { useState } from "react"
import { Button } from "../../../../../components/ui/button"
import { Badge } from "../../../../../components/ui/badge"
import { cn } from "../../../../../lib/utils"

interface Step6ContentQuantityProps {
  data: any
  update: (data: Partial<any>) => void
  next: () => void
  prev: () => void
}

const options = [
  "0-5",
  "5-10",
  "10-20",
  "20-50",
  "50+"
]

export default function Step6ContentQuantity({ data, update, next, prev }: Step6ContentQuantityProps) {
  const [selected, setSelected] = useState<string>(data.content_per_month || "")

  const handleSelect = (option: string) => {
    setSelected(option)
  }

  const handleNext = () => {
    update({ content_per_month: selected })
    next()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">How many pieces of content do you need from influencers each month?</h2>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Badge
            key={option}
            onClick={() => handleSelect(option)}
            className={cn(
              "cursor-pointer px-4 py-2 rounded-full border text-sm transition-all",
              selected === option
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-transparent border-gray-400 text-gray-300 hover:bg-gray-700"
            )}
          >
            {option}
          </Badge>
        ))}
      </div>

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

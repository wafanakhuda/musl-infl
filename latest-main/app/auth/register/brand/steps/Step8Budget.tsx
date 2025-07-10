// app/auth/register/brand/steps/Step7Budget.tsx

"use client"

import { useState } from "react"
import { Button } from "../../../../../components/ui/button"
import { Badge } from "../../../../../components/ui/badge"
import { cn } from "../../../../../lib/utils"

interface Step7BudgetProps {
  data: any
  update: (data: Partial<any>) => void
  prev: () => void
  submit: () => Promise<void> // ✅ FIXED: using submit instead of next
  loading: boolean
}

const options = [
  "Under $1,000",
  "$1,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $50,000",
  "$50,000+",
]

export default function Step7Budget({ data, update, submit, prev, loading }: Step7BudgetProps) {
  const [selected, setSelected] = useState<string>(data.annual_budget || "")

  const handleSelect = (value: string) => {
    setSelected(value)
  }

  const handleFinish = async () => {
    if (!selected) return
    update({ annual_budget: selected })
    await submit() // ✅ Submit final data
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">What’s your annual budget for working with influencers?</h2>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Badge
            key={option}
            onClick={() => handleSelect(option)}
            className={cn(
              "cursor-pointer px-4 py-2 rounded-full border text-sm transition-all",
              selected === option
                ? "bg-green-600 text-white border-green-600"
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
        <Button disabled={!selected || loading} onClick={handleFinish}>
          {loading ? "Submitting..." : "Finish"}
        </Button>
      </div>
    </div>
  )
}

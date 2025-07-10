// app/auth/register/brand/steps/Step4Categories.tsx

"use client"

import { useState } from "react"
import { Button } from "../../../../../components/ui/button"
import { Badge } from "../../../../../components/ui/badge"
import { cn } from "../../../../../lib/utils"

interface Step4CategoriesProps {
  data: any
  update: (data: Partial<any>) => void
  next: () => void
  prev: () => void
}

const categoriesList = [
  "Fashion",
  "Beauty",
  "Travel",
  "Health & Fitness",
  "Food & Drink",
  "Comedy & Entertainment",
  "Art & Photography",
  "Music & Dance",
  "Family & Children",
  "Entrepreneur & Business",
  "Animals & Pets",
  "Education",
  "Adventure & Outdoors",
  "Athlete & Sports",
  "Technology",
  "Gaming",
  "Healthcare",
  "Automotive",
  "Skilled Trades",
  "Cannabis",
]

export default function Step4Categories({ data, update, next, prev }: Step4CategoriesProps) {
  const [selected, setSelected] = useState<string[]>(data.categories || [])

  const toggleCategory = (category: string) => {
    if (selected.includes(category)) {
      setSelected(selected.filter((c) => c !== category))
    } else if (selected.length < 3) {
      setSelected([...selected, category])
    }
  }

  const handleNext = () => {
    update({ categories: selected })
    next()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Which categories best describe your brand?</h2>
      <p className="text-sm text-muted-foreground">You can select up to 3 categories.</p>

      <div className="flex flex-wrap gap-2">
        {categoriesList.map((category) => (
          <Badge
            key={category}
            onClick={() => toggleCategory(category)}
            className={cn(
              "cursor-pointer px-3 py-1 rounded-full border transition-all",
              selected.includes(category)
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-transparent border-gray-400 text-gray-300 hover:bg-gray-700"
            )}
          >
            {category}
          </Badge>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={prev}>
          Back
        </Button>
        <Button disabled={selected.length === 0} onClick={handleNext}>
          Continue
        </Button>
      </div>
    </div>
  )
}

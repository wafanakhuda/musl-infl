// app/auth/register/brand/steps/Step5Platforms.tsx

"use client"

import { useState } from "react"
import { Button } from "../../../../../components/ui/button"
import { Badge } from "../../../../../components/ui/badge"
import { cn } from "../../../../../lib/utils"

interface Step5PlatformsProps {
  data: any
  update: (data: Partial<any>) => void
  next: () => void
  prev: () => void
}

const platforms = ["Instagram", "TikTok", "User Generated Content", "YouTube"]

export default function Step5Platforms({ data, update, next, prev }: Step5PlatformsProps) {
  const [selected, setSelected] = useState<string[]>(data.platforms || [])

  const togglePlatform = (platform: string) => {
    if (selected.includes(platform)) {
      setSelected(selected.filter((p) => p !== platform))
    } else {
      setSelected([...selected, platform])
    }
  }

  const handleNext = () => {
    update({ platforms: selected })
    next()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">What are your target platforms?</h2>
      <p className="text-sm text-muted-foreground">You can select multiple platforms.</p>

      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => (
          <Badge
            key={platform}
            onClick={() => togglePlatform(platform)}
            className={cn(
              "cursor-pointer px-3 py-1 rounded-full border transition-all",
              selected.includes(platform)
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-transparent border-gray-400 text-gray-300 hover:bg-gray-700"
            )}
          >
            {platform}
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

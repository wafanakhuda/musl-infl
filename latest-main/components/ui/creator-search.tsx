"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Badge } from "../../components/ui/badge"
import { Search, Star, TrendingUp, DollarSign, Award, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

const platforms = ["All Platforms", "Instagram", "TikTok", "YouTube", "Twitter", "LinkedIn"]

const categories = [
  "Fashion & Beauty",
  "Food & Lifestyle",
  "Islamic Content",
  "Health & Fitness",
  "Travel",
  "Technology",
  "Business",
  "Education",
]

const filterTags = [
  { label: "Rising Stars", icon: Star, color: "bg-yellow-100 text-yellow-800" },
  { label: "Most Viewed", icon: TrendingUp, color: "bg-blue-100 text-blue-800" },
  { label: "Trending", icon: TrendingUp, color: "bg-green-100 text-green-800" },
  { label: "Under $250", icon: DollarSign, color: "bg-purple-100 text-purple-800" },
  { label: "Fast Turnover", icon: Clock, color: "bg-orange-100 text-orange-800" },
  { label: "Top Creator", icon: Award, color: "bg-red-100 text-red-800" },
]

export function CreatorSearch() {
  const [platform, setPlatform] = useState("All Platforms")
  const [category, setCategory] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const router = useRouter()

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (platform !== "All Platforms") params.set("platform", platform)
    if (category) params.set("category", category)
    if (activeFilters.length > 0) params.set("filters", activeFilters.join(","))

    router.push(`/search?${params.toString()}`)
  }

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
        <div className="flex-1">
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Choose a platform" />
            </SelectTrigger>
            <SelectContent>
              {platforms.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Input
            placeholder="Enter keywords, niches or categories"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-12"
          />
        </div>

        <Button onClick={handleSearch} size="lg" className="bg-gray-900 hover:bg-gray-800 h-12 px-8">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Filter Tags */}
      <div className="flex flex-wrap justify-center gap-3">
        {filterTags.map(({ label, icon: Icon, color }) => (
          <Badge
            key={label}
            variant="secondary"
            className={`cursor-pointer transition-all hover:scale-105 ${
              activeFilters.includes(label) ? color : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => toggleFilter(label)}
          >
            <Icon className="w-3 h-3 mr-1" />
            {label}
          </Badge>
        ))}
      </div>
    </div>
  )
}

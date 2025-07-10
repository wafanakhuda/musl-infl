"use client"

import { useEffect, useState } from "react"
import { apiClient, type User } from "../../lib/api-client"
import { Input } from "../../components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select"
import { FloatingElements } from "../../components/ui/floating-elements"
import { FooterCTA } from "../../components/ui/footer-cta"
import { Button } from "../../components/ui/button"
import { Loader2 } from "lucide-react"
import CreatorCard from "../../components/creator-card"
import { debounce } from "lodash"

export default function CreatorsPage() {
  const [creators, setCreators] = useState<User[]>([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [platform, setPlatform] = useState("all")
  const [minFollowers, setMinFollowers] = useState("")
  const [maxFollowers, setMaxFollowers] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCreators = async () => {
    try {
      setLoading(true)
      setError(null)

      const filters = {
        search,
        niche: category === "all" ? "" : category,
        platform: platform === "all" ? undefined : platform,
        minFollowers: minFollowers ? parseInt(minFollowers) : undefined,
        maxFollowers: maxFollowers ? parseInt(maxFollowers) : undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      }

      const data = await apiClient.getCreators(filters)
      setCreators(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Fetch creators failed", err)
      setError("Unable to load creators. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const debouncedFetch = debounce(fetchCreators, 400)
    debouncedFetch()
    return () => debouncedFetch.cancel()
  }, [search])

  useEffect(() => {
    fetchCreators()
  }, [category, platform, minFollowers, maxFollowers, minPrice, maxPrice])

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 text-white">
      <FloatingElements />

      <main className="relative z-10 min-h-screen pb-32 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-6">
          Find <span className="text-primary">Muslim Creators</span>
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Discover authentic Muslim influencers to partner with your brand
        </p>

        {/* 🔍 Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Input
            placeholder="Search creators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72"
          />

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="fashion">Fashion</SelectItem>
              <SelectItem value="tech">Tech</SelectItem>
              <SelectItem value="lifestyle">Lifestyle</SelectItem>
              <SelectItem value="fitness">Fitness</SelectItem>
              <SelectItem value="beauty">Beauty</SelectItem>
              <SelectItem value="food">Food</SelectItem>
            </SelectContent>
          </Select>

          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="tiktok">TikTok</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Min Followers"
            className="w-36"
            value={minFollowers}
            onChange={(e) => setMinFollowers(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max Followers"
            className="w-36"
            value={maxFollowers}
            onChange={(e) => setMaxFollowers(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Min Price"
            className="w-36"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max Price"
            className="w-36"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />

          <Button onClick={fetchCreators}>Search</Button>
        </div>

        {/* 🔄 Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* ❌ Error */}
        {error && (
          <div className="text-center text-red-500 mb-6">
            {error}
            <div className="mt-4">
              <Button onClick={fetchCreators}>Try Again</Button>
            </div>
          </div>
        )}

        {/* ✅ Creator Cards */}
        {!loading && !error && creators.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {creators
              .filter((c) => !!c.id && !!c.full_name)
              .map((creator) => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
          </div>
        )}

        {/* 🚫 No Results */}
        {!loading && !error && creators.length === 0 && (
          <p className="text-center text-muted-foreground py-20">
            No creators found.
          </p>
        )}
      </main>

      <FooterCTA />
    </div>
  )
}

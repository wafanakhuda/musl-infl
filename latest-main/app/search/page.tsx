"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select"
import { FooterCTA } from "../../components/ui/footer-cta"
import { FloatingElements } from "../../components/ui/floating-elements"

export default function SearchPage() {
  const [search, setSearch] = useState("")
  const [niche, setNiche] = useState("all")
  const [platform, setPlatform] = useState("all")
  const [error, setError] = useState<string | null>(null)

  const handleSearch = () => {
    // TODO: Perform search request using filters
    console.log({ search, niche, platform })
  }

  const clearFilters = () => {
    setSearch("")
    setNiche("all")
    setPlatform("all")
    setError(null)
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white overflow-hidden pb-32">
      <FloatingElements />

      <main className="relative z-10 container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-center mb-4">
          Find <span className="text-primary">Muslim Creators</span>
        </h1>
        <p className="text-center text-muted-foreground mb-10">
          Discover authentic Muslim influencers and content creators for your brand campaigns
        </p>

        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl px-4 py-6 max-w-5xl mx-auto">
          <Input
            className="mb-4 w-full"
            placeholder="Search creators by name, niche, or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex flex-wrap gap-4 justify-between items-center">
            <Select value={niche} onValueChange={setNiche}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select Niche" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Niches</SelectItem>
                <SelectItem value="fashion">Fashion</SelectItem>
                <SelectItem value="tech">Tech</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
              </SelectContent>
            </Select>

            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-3">
              <Button onClick={handleSearch}>Search</Button>
              <Button variant="outline" onClick={clearFilters}>Clear</Button>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-center mt-6">{error}</p>
        )}

        {/* Placeholder results section */}
        <div className="mt-16 text-center text-muted-foreground">
          No creators found matching your criteria.
          <div className="mt-4">
            <Button onClick={clearFilters} variant="outline">Clear Filters</Button>
          </div>
        </div>
      </main>

      <FooterCTA />
    </div>
  )
}
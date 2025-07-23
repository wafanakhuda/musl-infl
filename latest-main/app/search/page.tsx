"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select"
import { FooterCTA } from "../../lib/FooterCTA"
import { FloatingElements } from "../../components/ui/floating-elements"
import { SearchResults } from "../../components/search-results"
import { FeaturedCreators } from "../../components/featured-creators"
import CreatorCard from "../../components/creator-card"
import { Search } from "lucide-react"

export default function SearchPage() {
  const [search, setSearch] = useState("")
  const [niche, setNiche] = useState("all")
  const [platform, setPlatform] = useState("all")
  const [error, setError] = useState<string | null>(null)
  const [creators, setCreators] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    setError(null)
    setHasSearched(true)
    
    try {
      // Build query parameters
      const params = new URLSearchParams()
      if (search.trim()) params.append('search', search.trim())
      if (niche !== 'all') params.append('niche', niche)
      if (platform !== 'all') params.append('platform', platform)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/creators?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch creators')
      }
      
      const data = await response.json()
      setCreators(data)
    } catch (err: any) {
      console.error('Search error:', err)
      setError(err.message || 'Failed to search creators')
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setSearch("")
    setNiche("all")
    setPlatform("all")
    setError(null)
    setCreators([])
    setHasSearched(false)
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
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="beauty">Beauty</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
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

        {loading && (
          <div className="text-center py-12 mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-300">Searching creators...</p>
          </div>
        )}

        {/* Search Results */}
        {hasSearched && !loading && (
          <div className="mt-16">
            {creators.length > 0 ? (
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  Found {creators.length} creator{creators.length !== 1 ? 's' : ''}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {creators.map((creator: any) => (
                    <CreatorCard key={creator.id} creator={creator} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <div className="mb-4">
                  <Search className="h-16 w-16 mx-auto text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No creators found</h3>
                <p className="mb-4">Try adjusting your search criteria or clearing filters</p>
                <Button onClick={clearFilters} variant="outline">Clear Filters</Button>
              </div>
            )}
          </div>
        )}

        {/* Show featured creators when no search has been performed */}
        {!hasSearched && !loading && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center mb-8">Featured Creators</h2>
            <FeaturedCreators />
          </div>
        )}
      </main>

      <FooterCTA />
    </div>
  )
}
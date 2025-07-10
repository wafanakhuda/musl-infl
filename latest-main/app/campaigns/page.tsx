"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { Campaign, apiClient } from "../../lib/api-client"
import { Input } from "../../components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select"
import { CampaignCard } from "../../components/campaigns/campaign-card"
import { Button } from "../../components/ui/button"
import { Loader2 } from "lucide-react"
import { FooterCTA } from "../../components/ui/footer-cta"
import { FloatingElements } from "../../components/ui/floating-elements"

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState("")
  const [status, setStatus] = useState("active")
  const [search, setSearch] = useState("")

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      setError(null)
      const filters = { status, category, search }
      const data = await apiClient.getCampaigns(filters)
      setCampaigns(data)
    } catch {
      setError("Failed to load campaigns")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaigns()
  }, [category, status])

  return (
    <main className="relative z-10 min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 pb-32 text-white">
      <FloatingElements />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-6">
          Browse <span className="text-primary">Active Campaigns</span>
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Find the perfect campaigns for your content
        </p>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Input
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-96"
          />

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fashion">Fashion</SelectItem>
              <SelectItem value="tech">Tech</SelectItem>
              <SelectItem value="lifestyle">Lifestyle</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Active" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-center text-red-500 mb-6">
            {error}
            <div className="mt-4">
              <Button onClick={fetchCampaigns}>Try Again</Button>
            </div>
          </div>
        )}

        {/* Loader */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Campaign List */}
        {!loading && !error && campaigns.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        )}

        {!loading && !error && campaigns.length === 0 && (
          <p className="text-center text-muted-foreground py-20">No campaigns found.</p>
        )}
      </div>

      <FooterCTA />
    </main>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { apiClient } from "../../../lib/api-client"
import { Badge } from "../../../components/ui/badge"
import { Card } from "../../../components/ui/card"

interface User {
  id: string
  full_name: string
  bio?: string
  avatar_url?: string
  content_types?: string[]
  social_links?: { platform: string; url: string }[]
  location?: string
  followers?: number
  price_min?: number
  price_max?: number
  profile?: any
}

interface PortfolioItem {
  id: string
  title: string
  description?: string
  mediaUrl: string
}

export default function PublicProfilePage() {
  const { id } = useParams()
  const [creator, setCreator] = useState<User | null>(null)
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log("🔍 Fetching creator profile for ID:", id)
        
        // Use direct fetch instead of apiClient for debugging
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
        
        const userResponse = await fetch(`${API_URL}/creators/${id}`)
        console.log("📡 Creator API Response status:", userResponse.status)
        
        if (!userResponse.ok) {
          throw new Error(`Creator not found (${userResponse.status})`)
        }
        
        const user = await userResponse.json()
        console.log("✅ Creator data received:", user)
        setCreator(user)
        
        // Try to fetch portfolio
        try {
          const portfolioResponse = await fetch(`${API_URL}/portfolio/public/${id}`)
          if (portfolioResponse.ok) {
            const portfolioItems = await portfolioResponse.json()
            setPortfolio(Array.isArray(portfolioItems) ? portfolioItems : [])
          }
        } catch (portfolioErr) {
          console.warn("⚠️ Portfolio fetch failed:", portfolioErr)
          setPortfolio([])
        }
        
      } catch (err: any) {
        console.error("❌ Failed to fetch creator:", err)
        setError(err.message || "Failed to load creator profile")
        setCreator(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 pb-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
          <p>Loading creator profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 pb-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Creator Not Found</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <a href="/creators" className="text-blue-400 hover:underline">
            ← Back to Creators
          </a>
        </div>
      </div>
    )
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-black text-white pt-20 pb-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Creator Not Found</h2>
          <p className="text-gray-400 mb-4">The creator you're looking for doesn't exist.</p>
          <a href="/creators" className="text-blue-400 hover:underline">
            ← Back to Creators
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <img
            src={creator.avatar_url || "/default-avatar.png"}
            alt={creator.full_name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-semibold">{creator.full_name}</h2>
            <p className="text-sm text-gray-400">{creator.location}</p>
          </div>
        </div>

        {creator.bio && <p className="text-gray-300">{creator.bio}</p>}

        <div className="flex gap-2 flex-wrap">
          {creator.content_types?.map((type, idx) => (
            <Badge key={idx} variant="secondary">
              {type}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {portfolio.map((item) => (
            <Card key={item.id} className="overflow-hidden border">
              <img
                src={item.mediaUrl}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="font-semibold">{item.title}</h4>
                {item.description && (
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

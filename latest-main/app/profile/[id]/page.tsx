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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await apiClient.get(`/creators/${id}`)
        const portfolioItems = await apiClient.get(`/portfolio/public/${id}`)
        setCreator(user)
        setPortfolio(portfolioItems)
      } catch (err) {
        console.error("Failed to fetch creator", err)
      }
    }

    if (id) fetchData()
  }, [id])

  if (!creator) return <div className="text-white p-10">Loading...</div>

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
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

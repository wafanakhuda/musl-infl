"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Star, MapPin, Instagram, Users, Youtube } from "lucide-react"

type Creator = {
  id: string
  full_name: string
  avatar_url?: string
  bio?: string
  location?: string
  followers?: number
  price_min?: number
  price_max?: number
  niche?: string
  platforms?: string[]
  rating?: number
  verified?: boolean
}

export function FeaturedCreators() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/creators`)
        
        if (!res.ok) {
          throw new Error('Failed to fetch creators')
        }
        
        const data = await res.json()
        // Add mock data for rating and enhanced info to match collabstr style
        const enhancedCreators = data.slice(0, 4).map((creator: Creator, index: number) => ({
          ...creator,
          rating: 4.8 + (Math.random() * 0.4), // Random rating between 4.8-5.0
          niche: creator.niche || ['Lifestyle Creator', 'Fashion & Beauty', 'Tech Reviewer', 'Travel Blogger'][index],
          followers: creator.followers || [125000, 89000, 203000, 156000][index],
          price_min: creator.price_min || [250, 180, 350, 220][index],
          price_max: creator.price_max || [400, 300, 500, 380][index],
          platforms: creator.platforms || ['instagram', 'tiktok']
        }))
        setCreators(enhancedCreators)
      } catch (err: any) {
        console.error('Failed to fetch featured creators:', err)
        setError(err.message || 'Failed to load creators')
      } finally {
        setLoading(false)
      }
    }
    
    fetchCreators()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
            <div className="w-full h-64 bg-gray-300"></div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="h-4 bg-gray-300 rounded flex-1"></div>
              </div>
              <div className="h-3 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-8">
        <p>Failed to load featured creators</p>
        <p className="text-sm text-gray-500 mt-2">{error}</p>
      </div>
    )
  }

  if (creators.length === 0) {
    return <div className="text-center text-gray-500">No creators found.</div>
  }

  const formatFollowers = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`
    return num.toString()
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-3 h-3 text-pink-600" />
      case 'youtube':
        return <Youtube className="w-3 h-3 text-red-600" />
      case 'tiktok':
        return <span className="text-xs font-bold text-black">T</span>
      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {creators.map((creator) => (
        <Link key={creator.id} href={`/profile/${creator.id}`}>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
            {/* Profile Image */}
            <div className="relative">
              <img 
                src={creator.avatar_url || "/placeholder-user.jpg"} 
                alt={creator.full_name} 
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" 
              />
              
              {/* Top Creator Badge */}
              <div className="absolute top-3 left-3">
                <span className="bg-black/80 text-white text-xs px-2 py-1 rounded-full font-medium">
                  ⭐ Top Creator
                </span>
              </div>

              {/* Responds Fast Badge */}
              {creator.verified && (
                <div className="absolute top-3 right-3">
                  <span className="bg-green-500/90 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Responds Fast
                  </span>
                </div>
              )}

              {/* Follower Count */}
              <div className="absolute bottom-3 right-3">
                <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {formatFollowers(creator.followers || 0)}
                </span>
              </div>

              {/* Platform Icons */}
              <div className="absolute bottom-3 left-3 flex gap-1">
                {creator.platforms?.map((platform, index) => (
                  <div key={index} className="w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                    {getPlatformIcon(platform)}
                  </div>
                )) || (
                  <div className="w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Instagram className="w-3 h-3 text-pink-600" />
                  </div>
                )}
              </div>
            </div>

            {/* Creator Info */}
            <div className="p-4">
              {/* Name and Rating */}
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-900 text-lg leading-tight">
                  {creator.full_name}
                </h3>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-700">{creator.rating?.toFixed(1)}</span>
                </div>
              </div>

              {/* Niche/Category */}
              <p className="text-sm font-medium text-gray-800 mb-2 line-clamp-1">
                {creator.niche}
              </p>
              
              {/* Location */}
              {creator.location && (
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                  <MapPin className="w-3 h-3" />
                  <span>{creator.location}</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  ${creator.price_min || 0}
                </span>
                <span className="text-xs text-gray-500">
                  Starting price
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
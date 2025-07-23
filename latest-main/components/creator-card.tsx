"use client"

import Link from "next/link"
import Image from "next/image"
import { Star, MapPin, Users, Instagram, Youtube } from "lucide-react"
import { Badge } from "./ui/badge"

interface Creator {
  id: string
  full_name: string
  avatar_url?: string
  bio?: string
  location?: string
  verified?: boolean
  followers?: number
  price_min?: number
  price_max?: number
  platforms?: string[]
  niche?: string
  rating?: number
}

interface CreatorCardProps {
  creator: Creator
  viewMode?: "grid" | "list"
  showFullDetails?: boolean
}

export default function CreatorCard({
  creator,
  viewMode = "grid",
  showFullDetails = false,
}: CreatorCardProps) {
  const formatFollowers = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`
    return num.toString()
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-600" />
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-600" />
      case 'tiktok':
        return <span className="text-xs font-bold text-black">T</span>
      default:
        return null
    }
  }

  const rating = creator.rating || (4.8 + Math.random() * 0.4)
  const enhancedNiche = creator.niche || creator.bio || "Content Creator"

  if (viewMode === "list") {
    return (
      <Link href={`/profile/${creator.id}`}>
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer flex items-center gap-4">
          <div className="relative">
            <Image
              src={creator.avatar_url || "/placeholder-user.jpg"}
              alt={creator.full_name}
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
            {/* Small platform indicator */}
            {creator.platforms && creator.platforms.length > 0 && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                {getPlatformIcon(creator.platforms[0])}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg text-gray-900">{creator.full_name}</h3>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-gray-700">{rating.toFixed(1)}</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-2 line-clamp-1">{enhancedNiche}</p>
            {creator.location && (
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                <MapPin className="w-3 h-3" />
                <span>{creator.location}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg text-gray-900">
                ${creator.price_min || 200}
              </span>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>{formatFollowers(creator.followers || 50000)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/profile/${creator.id}`}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
        {/* Profile Image */}
        <div className="relative">
          <Image
            src={creator.avatar_url || "/placeholder-user.jpg"}
            alt={creator.full_name}
            width={300}
            height={200}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-black/80 text-white text-xs px-2 py-1 rounded-full">
              ⭐ Top Creator
            </Badge>
            {creator.verified && (
              <Badge className="bg-green-500/90 text-white text-xs px-2 py-1 rounded-full">
                Responds Fast
              </Badge>
            )}
          </div>

          {/* Follower Count */}
          <div className="absolute bottom-3 right-3">
            <div className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
              <Users className="w-3 h-3" />
              {formatFollowers(creator.followers || 50000)}
            </div>
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
              <span className="font-semibold text-gray-700">{rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Niche/Category */}
          <p className="text-sm font-medium text-gray-800 mb-2 line-clamp-1">
            {enhancedNiche}
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
              ${creator.price_min || 200}
            </span>
            <span className="text-xs text-gray-500">
              Starting price
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
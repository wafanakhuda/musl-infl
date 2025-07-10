"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { CheckCircle } from "lucide-react"
import { cn } from "../lib/utils"

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
  const platformIcons: Record<string, string> = {
    instagram: "/icons/instagram.svg",
    tiktok: "/icons/tiktok.svg",
    youtube: "/icons/youtube.svg",
  }

  return (
    <Link href={`/profile/${creator.id}`}>
      <Card
        className={cn(
          "hover:shadow-lg cursor-pointer transition-all duration-200",
          viewMode === "list" ? "flex items-center p-4 space-x-6" : ""
        )}
      >
        <div className={viewMode === "list" ? "" : "text-center"}>
          <Image
            src={creator.avatar_url || "/default-avatar.png"}
            alt={creator.full_name}
            width={viewMode === "list" ? 72 : 64}
            height={viewMode === "list" ? 72 : 64}
            className="rounded-full object-cover"
          />
        </div>

        <div className={viewMode === "list" ? "flex-1" : ""}>
          <CardHeader className={viewMode === "list" ? "p-0" : ""}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                {creator.full_name}
              </CardTitle>
              {creator.verified && (
                <Badge className="ml-2 bg-green-500 text-white">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            {creator.location && (
              <p className="text-sm text-muted-foreground">{creator.location}</p>
            )}
          </CardHeader>

          <CardContent className={viewMode === "list" ? "p-0 pt-2" : ""}>
            {creator.bio && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {creator.bio}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 mt-3">
              {creator.followers && (
                <span className="text-xs bg-slate-700 px-2 py-1 rounded-full">
                  {creator.followers.toLocaleString()} followers
                </span>
              )}
              {(creator.price_min || creator.price_max) && (
                <span className="text-xs bg-slate-700 px-2 py-1 rounded-full">
                  ${creator.price_min || 0} - ${creator.price_max || 0}
                </span>
              )}
              {creator.platforms?.map((p) => (
                <Image
                  key={p}
                  src={platformIcons[p.toLowerCase()] || ""}
                  alt={p}
                  width={20}
                  height={20}
                  className="inline-block"
                />
              ))}
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}

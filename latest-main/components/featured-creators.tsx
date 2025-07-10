"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Creator = {
  id: string
  full_name: string
  avatar_url?: string
  bio?: string
}

export function FeaturedCreators() {
  const [creators, setCreators] = useState<Creator[]>([])

  useEffect(() => {
    const fetchCreators = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/creators`)
      const data = await res.json()
      setCreators(data.slice(0, 6)) // Limit to top 6
    }
    fetchCreators()
  }, [])

  if (creators.length === 0) return <div className="text-center">No creators found.</div>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {creators.map((creator) => (
        <Link key={creator.id} href={`/profile/${creator.id}`}>
          <div className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition">
            <img src={creator.avatar_url || "/placeholder.jpg"} alt={creator.full_name} className="w-20 h-20 rounded-full mx-auto mb-2" />
            <h3 className="text-xl font-bold">{creator.full_name}</h3>
            <p className="text-sm text-muted-foreground">{creator.bio}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

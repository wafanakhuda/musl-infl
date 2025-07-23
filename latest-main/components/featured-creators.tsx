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
        setCreators(data.slice(0, 6)) // Limit to top 6
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-lg p-4 animate-pulse">
            <div className="w-20 h-20 bg-slate-700 rounded-full mx-auto mb-2"></div>
            <div className="h-4 bg-slate-700 rounded mb-2"></div>
            <div className="h-3 bg-slate-700 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-8">
        <p>Failed to load featured creators</p>
        <p className="text-sm text-muted-foreground mt-2">{error}</p>
      </div>
    )
  }

  if (creators.length === 0) {
    return <div className="text-center text-muted-foreground">No creators found.</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {creators.map((creator) => (
        <Link key={creator.id} href={`/profile/${creator.id}`}>
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <img 
                src={creator.avatar_url || "/placeholder-user.jpg"} 
                alt={creator.full_name} 
                className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-primary/20" 
              />
              <h3 className="text-xl font-bold mb-2 text-white">{creator.full_name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{creator.bio || 'No bio available'}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

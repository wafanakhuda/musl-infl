"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { FeaturedCreators } from "./featured-creators"
import { PlatformSections } from "./platform-sections"

export function SearchResults() {
  const searchParams = useSearchParams()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const platform = searchParams.get("platform")
  const category = searchParams.get("category")
  const filters = searchParams.get("filters")

  useEffect(() => {
    // Simulate search
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [platform, category, filters])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Searching creators...</p>
      </div>
    )
  }

  return (
    <div>
      {platform || category || filters ? (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Search Results {platform && `for ${platform}`}</h2>
          <FeaturedCreators />
        </div>
      ) : (
        <>
          <FeaturedCreators />
          <PlatformSections />
        </>
      )}
    </div>
  )
}

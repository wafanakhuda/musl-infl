"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { TrendingUp, Search, Users, BarChart3, Filter, Target } from "lucide-react"
import { apiClient } from "../../lib/api-client"

interface SearchAnalyticsProps {
  searchType: "creators" | "campaigns"
}

export function SearchAnalytics({ searchType }: SearchAnalyticsProps) {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [searchType])

const loadAnalytics = async () => {
  try {
    setLoading(true)
    const data = await apiClient.getSearchAnalytics(searchType) // Now works
    setAnalytics(data)
  } catch (error) {
    console.error("Failed to load search analytics:", error)
  } finally {
    setLoading(false)
  }
}

  if (loading || !analytics) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Popular Searches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Popular Searches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.popular_searches?.map((search: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    #{index + 1}
                  </Badge>
                  <span className="font-medium">{search.query}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Search className="h-3 w-3" />
                    {search.count}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {search.results_avg}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Search Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{analytics.total_searches?.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Searches</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analytics.avg_results?.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Avg Results</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analytics.click_through_rate?.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Click Rate</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analytics.avg_search_time?.toFixed(2)}s</div>
              <div className="text-sm text-muted-foreground">Avg Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Popular Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Popular Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.popular_filters?.map((filter: any, index: number) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium capitalize">{filter.name}</span>
                  <span className="text-sm text-muted-foreground">{filter.usage_percentage}% of searches</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {filter.values?.slice(0, 5).map((value: string, valueIndex: number) => (
                    <Badge key={valueIndex} variant="secondary" className="text-xs">
                      {value}
                    </Badge>
                  ))}
                  {filter.values?.length > 5 && (
                    <Badge variant="outline" className="text-xs">
                      +{filter.values.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Recommended Searches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground mb-3">Based on current trends and your search history</p>
            <div className="flex flex-wrap gap-2">
              {analytics.recommended_searches?.map((search: string, index: number) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={() => {
                    // Trigger search with this query
                    window.dispatchEvent(
                      new CustomEvent("search-suggestion", {
                        detail: { query: search },
                      }),
                    )
                  }}
                >
                  <Search className="h-3 w-3 mr-1" />
                  {search}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Checkbox } from "../../components/ui/checkbox"
import { Slider } from "../../components/ui/slider"
import { Badge } from "../../components/ui/badge"
import { Separator } from "../../components/ui/separator"
import { Search, Filter, X, MapPin, Users, DollarSign, Star, Zap } from "lucide-react"
import { useDebounce } from "../../hooks/use-debounce"
import { apiClient } from "../../lib/api-client"
import { toast } from "sonner"

interface SearchFilters {
  query: string
  category: string
  location: string
  priceRange: [number, number]
  rating: number
  languages: string[]
  platforms: string[]
  availability: string
  verified: boolean
  halalCertified: boolean
  sortBy: string
  sortOrder: "asc" | "desc"
}

interface AdvancedSearchProps {
  searchType: "creators" | "campaigns"
  onResults: (results: any[], totalCount: number) => void
  onFiltersChange: (filters: SearchFilters) => void
}

const categories = [
  "All Categories",
  "Fashion & Beauty",
  "Food & Lifestyle",
  "Technology",
  "Travel",
  "Health & Fitness",
  "Education",
  "Entertainment",
  "Islamic Content",
  "Business & Finance",
]

const languages = [
  "English",
  "Arabic",
  "Urdu",
  "Turkish",
  "Malay",
  "Indonesian",
  "French",
  "Spanish",
  "German",
  "Bengali",
  "Persian",
]

const platforms = ["Instagram", "YouTube", "TikTok", "Twitter", "LinkedIn", "Facebook", "Snapchat", "Pinterest", "Blog"]

const sortOptions = {
  creators: [
    { value: "rating", label: "Rating" },
    { value: "followers", label: "Followers" },
    { value: "price", label: "Price" },
    { value: "response_time", label: "Response Time" },
    { value: "completion_rate", label: "Completion Rate" },
    { value: "created_at", label: "Newest" },
  ],
  campaigns: [
    { value: "budget", label: "Budget" },
    { value: "applications", label: "Applications" },
    { value: "deadline", label: "Deadline" },
    { value: "created_at", label: "Newest" },
    { value: "relevance", label: "Relevance" },
  ],
}

export function AdvancedSearch({ searchType, onResults, onFiltersChange }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "All Categories",
    location: "",
    priceRange: [0, 10000],
    rating: 0,
    languages: [],
    platforms: [],
    availability: "all",
    verified: false,
    halalCertified: true,
    sortBy: searchType === "creators" ? "rating" : "budget",
    sortOrder: "desc",
  })

  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  const debouncedQuery = useDebounce(filters.query, 300)

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem(`search_history_${searchType}`)
    if (history) {
      setSearchHistory(JSON.parse(history))
    }
  }, [searchType])

  // Get search suggestions
  const getSuggestions = useCallback(
    async (query: string) => {
      if (query.length < 2) {
        setSuggestions([])
        return
      }

      try {
        const response = await apiClient.getSearchSuggestions(searchType, query)
        setSuggestions(response.suggestions || [])
      } catch (error) {
        console.error("Failed to get suggestions:", error)
      }
    },
    [searchType],
  )

  // Debounced search
  useEffect(() => {
    if (debouncedQuery) {
      getSuggestions(debouncedQuery)
      performSearch()
    }
  }, [debouncedQuery, getSuggestions])

  // Perform search
  const performSearch = useCallback(async () => {
    setIsSearching(true)

    try {
      const searchParams = {
        ...filters,
        category: filters.category === "All Categories" ? "" : filters.category,
        price_min: filters.priceRange[0],
        price_max: filters.priceRange[1],
        min_rating: filters.rating,
        languages: filters.languages.join(","),
        platforms: filters.platforms.join(","),
        sort_by: filters.sortBy,
        sort_order: filters.sortOrder,
      }

      const response =
        searchType === "creators"
          ? await apiClient.searchCreators(searchParams)
          : await apiClient.searchCampaigns(searchParams)

      onResults(response.results || [], response.total_count || 0)
      onFiltersChange(filters)

      // Save to search history
      if (filters.query && !searchHistory.includes(filters.query)) {
        const newHistory = [filters.query, ...searchHistory.slice(0, 9)]
        setSearchHistory(newHistory)
        localStorage.setItem(`search_history_${searchType}`, JSON.stringify(newHistory))
      }

      // Track search analytics
      apiClient.trackSearchEvent({
        search_type: searchType,
        query: filters.query,
        filters: searchParams,
        results_count: response.total_count || 0,
      })
    } catch (error: any) {
      console.error("Search failed:", error)
      toast.error("Search failed. Please try again.")
      onResults([], 0)
    } finally {
      setIsSearching(false)
    }
  }, [filters, searchType, onResults, onFiltersChange, searchHistory])

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const toggleArrayFilter = (key: "languages" | "platforms", value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((item) => item !== value) : [...prev[key], value],
    }))
  }

  const clearFilters = () => {
    setFilters({
      query: "",
      category: "All Categories",
      location: "",
      priceRange: [0, 10000],
      rating: 0,
      languages: [],
      platforms: [],
      availability: "all",
      verified: false,
      halalCertified: true,
      sortBy: searchType === "creators" ? "rating" : "budget",
      sortOrder: "desc",
    })
  }

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "query" || key === "sortBy" || key === "sortOrder") return false
    if (key === "category") return value !== "All Categories"
    if (key === "priceRange") return value[0] !== 0 || value[1] !== 10000
    if (key === "rating") return value > 0
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === "boolean") return value === true && key !== "halalCertified"
    return value !== "" && value !== "all"
  }).length

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Advanced Search
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount} filter{activeFiltersCount !== 1 ? "s" : ""} active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Input */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${searchType}...`}
              value={filters.query}
              onChange={(e) => {
                updateFilter("query", e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="pl-10 pr-4"
            />
          </div>

          {/* Search Suggestions */}
          {showSuggestions && (suggestions.length > 0 || searchHistory.length > 0) && (
            <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto">
              <CardContent className="p-2">
                {suggestions.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Suggestions</p>
                    {suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-left h-8"
                        onClick={() => {
                          updateFilter("query", suggestion)
                          setShowSuggestions(false)
                        }}
                      >
                        <Search className="h-3 w-3 mr-2" />
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}

                {searchHistory.length > 0 && (
                  <div className={suggestions.length > 0 ? "mt-3 pt-3 border-t" : ""}>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Recent Searches</p>
                    {searchHistory.slice(0, 5).map((query, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-left h-8"
                        onClick={() => {
                          updateFilter("query", query)
                          setShowSuggestions(false)
                        }}
                      >
                        <Search className="h-3 w-3 mr-2" />
                        {query}
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filters.verified ? "default" : "outline"}
            size="sm"
            onClick={() => updateFilter("verified", !filters.verified)}
            className="h-8"
          >
            <Star className="h-3 w-3 mr-1" />
            Verified Only
          </Button>
          <Button
            variant={filters.halalCertified ? "default" : "outline"}
            size="sm"
            onClick={() => updateFilter("halalCertified", !filters.halalCertified)}
            className="h-8"
          >
            <Zap className="h-3 w-3 mr-1" />
            Halal Certified
          </Button>
          {searchType === "creators" && (
            <Button
              variant={filters.availability === "available" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("availability", filters.availability === "available" ? "all" : "available")}
              className="h-8"
            >
              <Users className="h-3 w-3 mr-1" />
              Available Now
            </Button>
          )}
        </div>

        <Separator />

        {/* Advanced Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Location
            </label>
            <Input
              placeholder="City, Country"
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
            />
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Sort By</label>
            <div className="flex gap-2">
              <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions[searchType].map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateFilter("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc")}
                className="px-3"
              >
                {filters.sortOrder === "asc" ? "↑" : "↓"}
              </Button>
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </label>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilter("priceRange", value)}
            max={10000}
            min={0}
            step={100}
            className="w-full"
          />
        </div>

        {/* Rating Filter */}
        {searchType === "creators" && (
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-1">
              <Star className="h-3 w-3" />
              Minimum Rating: {filters.rating > 0 ? `${filters.rating}+ stars` : "Any rating"}
            </label>
            <Slider
              value={[filters.rating]}
              onValueChange={(value) => updateFilter("rating", value[0])}
              max={5}
              min={0}
              step={0.5}
              className="w-full"
            />
          </div>
        )}

        {/* Languages */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Languages</label>
          <div className="flex flex-wrap gap-2">
            {languages.map((language) => (
              <div key={language} className="flex items-center space-x-2">
                <Checkbox
                  id={`lang-${language}`}
                  checked={filters.languages.includes(language)}
                  onCheckedChange={() => toggleArrayFilter("languages", language)}
                />
                <label htmlFor={`lang-${language}`} className="text-sm">
                  {language}
                </label>
              </div>
            ))}
          </div>
          {filters.languages.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {filters.languages.map((language) => (
                <Badge key={language} variant="secondary" className="text-xs">
                  {language}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => toggleArrayFilter("languages", language)}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Platforms */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Platforms</label>
          <div className="flex flex-wrap gap-2">
            {platforms.map((platform) => (
              <div key={platform} className="flex items-center space-x-2">
                <Checkbox
                  id={`platform-${platform}`}
                  checked={filters.platforms.includes(platform)}
                  onCheckedChange={() => toggleArrayFilter("platforms", platform)}
                />
                <label htmlFor={`platform-${platform}`} className="text-sm">
                  {platform}
                </label>
              </div>
            ))}
          </div>
          {filters.platforms.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {filters.platforms.map((platform) => (
                <Badge key={platform} variant="secondary" className="text-xs">
                  {platform}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => toggleArrayFilter("platforms", platform)}
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={performSearch} disabled={isSearching} className="flex-1">
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search {searchType}
              </>
            )}
          </Button>

          <Button variant="outline" onClick={clearFilters} disabled={isSearching}>
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
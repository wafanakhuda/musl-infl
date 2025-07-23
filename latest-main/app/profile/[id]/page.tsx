"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Card } from "../../../components/ui/card"
import { FloatingElements } from "../../../components/ui/floating-elements"
import { useAuth } from "../../../hooks/use-auth"
import { toast } from "sonner"
import { 
  Star, 
  MapPin, 
  Users, 
  Instagram, 
  Youtube,
  Globe,
  Calendar,
  CheckCircle,
  MessageCircle,
  Zap,
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  TrendingUp,
  Eye
} from "lucide-react"

// ✅ COMPLETE interface matching API
interface Creator {
  id: string
  email: string
  full_name: string
  user_type: string
  avatar_url?: string
  bio?: string
  location?: string
  niche?: string
  followers?: number
  price_min?: number
  price_max?: number
  platforms?: string[]
  website?: string
  email_verified?: boolean
  verified?: boolean
  created_at?: string
}

interface Package {
  id: string
  title: string
  description: string
  price: number
  deliveryTime?: string
  revisions?: number
  platform?: string
  creatorId: string
  created_at: string
}

interface PortfolioItem {
  id: string
  title: string
  description?: string
  mediaUrl: string
  platform?: string
  engagement?: number
  views?: number
}

export default function PublicProfilePage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [creator, setCreator] = useState<Creator | null>(null)
  const [packages, setPackages] = useState<Package[]>([])
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState<'all' | 'instagram' | 'tiktok' | 'youtube'>('all')
  const [cart, setCart] = useState<Package[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log("🔍 Fetching creator profile for ID:", id)
        
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
        
        // Fetch creator details
        const userResponse = await fetch(`${API_URL}/creators/${id}`)
        if (!userResponse.ok) {
          throw new Error(`Creator not found (${userResponse.status})`)
        }
        const user = await userResponse.json()
        console.log("✅ Creator data received:", user)
        setCreator(user)
        
        // Fetch creator packages (real pricing data)
        try {
          const packagesResponse = await fetch(`${API_URL}/creators/${id}/packages`)
          if (packagesResponse.ok) {
            const packagesData = await packagesResponse.json()
            setPackages(Array.isArray(packagesData.packages) ? packagesData.packages : [])
            console.log("✅ Packages data received:", packagesData)
          }
        } catch (packageErr) {
          console.warn("⚠️ Packages fetch failed:", packageErr)
        }
        
        // Fetch portfolio
        try {
          const portfolioResponse = await fetch(`${API_URL}/portfolio/public/${id}`)
          if (portfolioResponse.ok) {
            const portfolioItems = await portfolioResponse.json()
            setPortfolio(Array.isArray(portfolioItems) ? portfolioItems : [])
          }
        } catch (portfolioErr) {
          console.warn("⚠️ Portfolio fetch failed:", portfolioErr)
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

  const handleStartConversation = () => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to start a conversation')
      router.push('/auth/login/brand?redirect=' + encodeURIComponent(window.location.pathname))
      return
    }
    
    try {
      const messagesRoute = `/messages?creator=${id}&name=${encodeURIComponent(creator?.full_name || '')}`
      router.push(messagesRoute)
      toast.success('Opening conversation...')
    } catch (error) {
      console.error('Navigation error:', error)
      toast.error('Messages feature coming soon!')
    }
  }

  const handleAddToCart = (pkg: Package) => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to add items to cart')
      router.push('/auth/login/brand?redirect=' + encodeURIComponent(window.location.pathname))
      return
    }

    // Check if already in cart
    if (cart.find(item => item.id === pkg.id)) {
      toast.error('Item already in cart')
      return
    }

    setCart([...cart, pkg])
    toast.success(`Added "${pkg.title}" to cart`)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${creator?.full_name} - ${creator?.niche}`,
        text: `Check out ${creator?.full_name}'s profile on MuslimInfluencers.io`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Profile link copied to clipboard!')
    }
  }

  const formatFollowers = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}k`
    return num.toString()
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-400" />
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-400" />
      case 'tiktok':
        return <span className="text-sm font-bold text-white bg-black rounded px-1">T</span>
      default:
        return <Globe className="w-4 h-4 text-gray-400" />
    }
  }

  const generateMockRating = () => {
    return (4.8 + Math.random() * 0.4).toFixed(1)
  }

  const filteredPackages = packages.filter(pkg => {
    if (selectedTab === 'all') return true
    return pkg.platform?.toLowerCase() === selectedTab
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <FloatingElements />
        <div className="relative z-10 pt-24 pb-12 px-4 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
            <p className="text-slate-300">Loading creator profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !creator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <FloatingElements />
        <div className="relative z-10 pt-24 pb-12 px-4 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-white mb-4">Creator Not Found</h2>
            <p className="text-slate-300 mb-6">{error || "The creator you're looking for doesn't exist."}</p>
            <Button onClick={() => window.history.back()} className="bg-slate-700 hover:bg-slate-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const rating = generateMockRating()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      <FloatingElements />
      
      {/* Portfolio Header - Collabstr Style */}
      <div className="relative z-10 pt-24 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Back Button */}
          <div className="mb-6">
            <Button onClick={() => window.history.back()} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Creators
            </Button>
          </div>

          {/* Portfolio Images Grid */}
          {portfolio.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {portfolio.slice(0, 3).map((item, index) => (
                <div key={item.id} className="relative group">
                  <img 
                    src={item.mediaUrl} 
                    alt={item.title}
                    className={`w-full object-cover rounded-lg ${index === 0 ? 'h-96' : 'h-48'} group-hover:opacity-90 transition-opacity`}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <Button size="sm" className="bg-white/20 backdrop-blur-sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </div>
                  {item.views && (
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs">
                      <Eye className="w-3 h-3 inline mr-1" />
                      {formatFollowers(item.views)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Creator Info Section */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side - Creator Details */}
            <div className="flex-1">
              <div className="flex items-start gap-6 mb-6">
                {/* Profile Photo */}
                <div className="relative">
                  <img
                    src={creator.avatar_url || "/placeholder-user.jpg"}
                    alt={creator.full_name}
                    className="w-24 h-24 rounded-full object-cover border-3 border-slate-600"
                  />
                  {creator.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-teal-500 rounded-full p-1">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-white">{creator.full_name}</h1>
                    <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-yellow-400">{rating}</span>
                    </div>
                  </div>

                  <p className="text-lg text-slate-300 mb-3">{creator.niche || 'Content Creator'}</p>

                  {/* Stats */}
                  <div className="flex items-center gap-6 mb-4">
                    {creator.followers && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold text-white">{formatFollowers(creator.followers)}</span>
                        <span className="text-slate-400 text-sm">followers</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm">95% Response Rate</span>
                    </div>
                  </div>

                  {/* Platforms */}
                  {creator.platforms && creator.platforms.length > 0 && (
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-slate-400 text-sm">Platforms:</span>
                      <div className="flex gap-2">
                        {creator.platforms.map((platform, index) => (
                          <div key={index} className="flex items-center justify-center w-8 h-8 bg-slate-700/50 rounded-full border border-slate-600">
                            {getPlatformIcon(platform)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button onClick={handleStartConversation} className="bg-teal-600 hover:bg-teal-500">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button onClick={handleShare} variant="outline" className="border-slate-600 text-slate-300">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" className="border-slate-600 text-slate-300">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {creator.bio && (
                <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-lg mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">About</h3>
                  <p className="text-slate-300 leading-relaxed">{creator.bio}</p>
                </Card>
              )}
            </div>

            {/* Right Side - Packages */}
            <div className="lg:w-96">
              <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-lg">
                <h3 className="text-lg font-semibold text-white mb-4">Packages</h3>

                {/* Package Tabs */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  <Button
                    onClick={() => setSelectedTab('all')}
                    size="sm"
                    variant={selectedTab === 'all' ? 'default' : 'outline'}
                    className={selectedTab === 'all' ? 'bg-teal-600' : 'border-slate-600 text-slate-300'}
                  >
                    All
                  </Button>
                  <Button
                    onClick={() => setSelectedTab('instagram')}
                    size="sm"
                    variant={selectedTab === 'instagram' ? 'default' : 'outline'}
                    className={selectedTab === 'instagram' ? 'bg-pink-600' : 'border-slate-600 text-slate-300'}
                  >
                    Instagram
                  </Button>
                  <Button
                    onClick={() => setSelectedTab('tiktok')}
                    size="sm"
                    variant={selectedTab === 'tiktok' ? 'default' : 'outline'}
                    className={selectedTab === 'tiktok' ? 'bg-black text-white' : 'border-slate-600 text-slate-300'}
                  >
                    TikTok
                  </Button>
                  <Button
                    onClick={() => setSelectedTab('youtube')}
                    size="sm"
                    variant={selectedTab === 'youtube' ? 'default' : 'outline'}
                    className={selectedTab === 'youtube' ? 'bg-red-600' : 'border-slate-600 text-slate-300'}
                  >
                    YouTube
                  </Button>
                </div>

                {/* Packages List */}
                <div className="space-y-4">
                  {filteredPackages.length > 0 ? (
                    filteredPackages.map((pkg) => (
                      <div key={pkg.id} className="border border-slate-600 rounded-lg p-4 bg-slate-700/30">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {pkg.platform && getPlatformIcon(pkg.platform)}
                              <h4 className="font-semibold text-white">{pkg.title}</h4>
                            </div>
                            <p className="text-slate-300 text-sm mb-3">{pkg.description}</p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-white">${pkg.price}</span>
                              <Button
                                onClick={() => handleAddToCart(pkg)}
                                size="sm"
                                className="bg-teal-600 hover:bg-teal-500"
                              >
                                <ShoppingCart className="w-4 h-4 mr-1" />
                                Add to Cart
                              </Button>
                            </div>
                            
                            {pkg.deliveryTime && (
                              <p className="text-slate-400 text-xs mt-2">
                                Delivery: {pkg.deliveryTime}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Default packages if none exist
                    <div className="border border-slate-600 rounded-lg p-4 bg-slate-700/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Instagram className="w-4 h-4 text-pink-400" />
                        <h4 className="font-semibold text-white">Instagram Post</h4>
                      </div>
                      <p className="text-slate-300 text-sm mb-3">Professional Instagram post with your product/service</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-white">${creator.price_min || 250}</span>
                        <Button
                          onClick={() => handleAddToCart({
                            id: 'default-ig',
                            title: 'Instagram Post',
                            description: 'Professional Instagram post',
                            price: creator.price_min || 250,
                            platform: 'instagram',
                            creatorId: creator.id,
                            created_at: new Date().toISOString()
                          })}
                          size="sm"
                          className="bg-teal-600 hover:bg-teal-500"
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cart Info */}
                {cart.length > 0 && (
                  <div className="mt-4 p-3 bg-teal-500/20 border border-teal-500/30 rounded-lg">
                    <p className="text-teal-400 text-sm">
                      {cart.length} item(s) in cart - Total: ${cart.reduce((sum, item) => sum + item.price, 0)}
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
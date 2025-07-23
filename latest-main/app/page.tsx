"use client"

export const dynamic = "force-dynamic"

import Link from "next/link"
import { ArrowRight, Star, TrendingUp, Zap, Users, DollarSign, Instagram, Youtube, MapPin, CheckCircle, MessageCircle, Shield } from "lucide-react"
import { FloatingElements } from "../components/ui/floating-elements"
import { Button } from "../components/ui/button"
import { PlatformStats } from "../components/platform-stats"
import { FooterCTA } from "../components/ui/footer-cta"
import { HowItWorks } from "../components/ui/how-it-works"
import { WhyChooseUs } from "../components/ui/why-choose-us"
import CreatorCard from "../components/creator-card"
import { useEffect, useState } from "react"
import { apiClient, User } from "../lib/api-client"

export default function HomePage() {
  const [creators, setCreators] = useState<User[]>([])

  useEffect(() => {
    const loadCreators = async () => {
      try {
        const data = await apiClient.getCreators()
        setCreators(data)
      } catch (err) {
        console.error("Failed to load creators", err)
      }
    }
    loadCreators()
  }, [])

  const stats = [
    { icon: <Star className="w-6 h-6" />, label: "Rising Stars" },
    { icon: <TrendingUp className="w-6 h-6" />, label: "Most Viewed" },
    { icon: <Zap className="w-6 h-6" />, label: "Trending" },
    { icon: <DollarSign className="w-6 h-6" />, label: "Under $250" },
    { icon: <Zap className="w-6 h-6" />, label: "Fast Turnaround" },
    { icon: <Users className="w-6 h-6" />, label: "Top Creator" }
  ]

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      <FloatingElements />

      {/* Hero Section - Your existing design + stats badges */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-4rem)]">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Award<span className="text-teal-400">•</span>Winning
                <br />
                Halal Creator
                <br />
                Marketplace
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed max-w-lg">
                The halal economy is valued at 3 trillion dollars, and the global Muslim population now exceeds 2
                billion. Imagine the potential of connecting with every internet-savvy Muslim to introduce your business
                or market your products.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/register/creator">
                <Button className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-4 text-lg font-medium rounded-full border border-slate-600 flex items-center gap-2">
                  Become a Creator
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/search">
                <Button
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-800 px-8 py-4 text-lg font-medium rounded-full"
                >
                  Hire Creators
                </Button>
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap gap-3 pt-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full px-3 py-2 text-sm"
                >
                  {stat.icon}
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <img src="/professional.png" alt="Professional" className="w-full max-w-lg mx-auto" />
            </div>
            <div className="absolute top-10 right-10 w-6 h-6 bg-blue-400 rotate-45 animate-pulse" />
            <div className="absolute bottom-20 right-20 w-4 h-4 bg-teal-400 rounded-full animate-bounce" />
            <div className="absolute top-1/3 -right-4 w-8 h-8 border-2 border-purple-400 rounded-full" />
          </div>
        </div>
      </div>

      {/* Platform Stats Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <PlatformStats />
      </section>

      

      {/* Featured Muslim Creators Section - Real Data Only */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Featured Muslim Creators</h2>
        
        {/* Debug: Log creators data */}
        {console.log("Creators data:", creators)}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {creators
            .filter(creator => creator.full_name && creator.full_name.trim()) // Only show creators with names
            .slice(0, 8)
            .map((creator) => (
            <Link key={creator.id} href={`/profile/${creator.id}`}>
              <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl overflow-hidden hover:bg-slate-700/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                {/* Profile Image */}
                <div className="relative">
                  <img 
                    src={creator.avatar_url || "/placeholder-user.jpg"} 
                    alt={creator.full_name} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-user.jpg";
                    }}
                  />
                  
                  {/* Top Creator Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-black/80 text-white text-xs px-2 py-1 rounded-full font-medium">
                      ⭐ Top Creator
                    </span>
                  </div>

                  {/* Follower Count - Only show if exists */}
                  {creator.followers && creator.followers > 0 && (
                    <div className="absolute bottom-3 right-3">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {formatFollowers(creator.followers)}
                      </span>
                    </div>
                  )}

                  {/* Platform Icons - Only show if exists */}
                  {creator.platforms && Array.isArray(creator.platforms) && creator.platforms.length > 0 && (
                    <div className="absolute bottom-3 left-3 flex gap-1">
                      {creator.platforms.slice(0, 3).map((platform, index) => {
                        const icon = getPlatformIcon(platform);
                        return icon ? (
                          <div key={index} className="w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                            {icon}
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>

                {/* Creator Info */}
                <div className="p-4">
                  {/* Name and Rating */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-white text-lg leading-tight">
                      {creator.full_name}
                    </h3>
                    {/* Only show rating if available and valid */}
                    {creator.rating && creator.rating > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-gray-300">{creator.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Niche/Category - Only show if exists */}
                  {creator.niche && creator.niche.trim() && (
                    <p className="text-sm font-medium text-gray-300 mb-2">
                      {creator.niche}
                    </p>
                  )}
                  
                  {/* Bio fallback if no niche */}
                  {!creator.niche && creator.bio && creator.bio.trim() && (
                    <p className="text-sm font-medium text-gray-300 mb-2 line-clamp-1">
                      {creator.bio}
                    </p>
                  )}
                  
                  {/* Location - Only show if exists */}
                  {creator.location && creator.location.trim() && (
                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                      <MapPin className="w-3 h-3" />
                      <span>{creator.location}</span>
                    </div>
                  )}

                  {/* Price - Only show if exists and valid */}
                  {creator.price_min && creator.price_min > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-white">
                        ${creator.price_min}
                      </span>
                      <span className="text-xs text-gray-400">
                        Starting price
                      </span>
                    </div>
                  )}
                  
                  {/* Fallback: Show user type if no price */}
                  {(!creator.price_min || creator.price_min <= 0) && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        Content Creator
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Show message if no creators */}
        {creators.filter(creator => creator.full_name && creator.full_name.trim()).length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No creators found. Check your API connection.</p>
          </div>
        )}

        <div className="text-center mt-8">
          <Link href="/campaigns/create">
            <Button className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded-full text-lg">
              Post a Campaign
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">How It Works</h2>
        <HowItWorks />
      </section>

      {/* Why Choose Us Section - Feature boxes */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Why Choose MuslimInfluencers.io?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            {
              icon: <DollarSign className="w-12 h-12 text-pink-400" />,
              title: "No Upfront Cost",
              description: "Search influencers for free. No subscriptions, contracts, or hidden fees."
            },
            {
              icon: <CheckCircle className="w-12 h-12 text-green-400" />,
              title: "Vetted Influencers", 
              description: "Every influencer is vetted by us. Always receive high-quality, professional content."
            },
            {
              icon: <MessageCircle className="w-12 h-12 text-blue-400" />,
              title: "Instant Chat",
              description: "Instantly chat with influencers and stay in touch throughout the whole transaction."
            },
            {
              icon: <Shield className="w-12 h-12 text-purple-400" />,
              title: "Secure Purchases",
              description: "Your money is held safely until you approve the influencer's work."
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-8 text-center hover:bg-slate-700/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Campaign CTA */}
        <div className="bg-slate-800/30 backdrop-blur-lg border border-slate-700 rounded-2xl py-12 px-8">
          <div className="max-w-2xl mx-auto">
            <span className="inline-block bg-pink-500/20 text-pink-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              Campaigns
            </span>
            <h3 className="text-3xl font-bold text-white mb-4">
              Post Campaigns and Have 250,000+ Influencers Come to You
            </h3>
            <p className="text-gray-300 mb-8">
              Create campaigns that attract top Muslim creators to collaborate with your brand
            </p>
            <Link href="/campaigns/create">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg">
                Post a Campaign
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-8 text-center">
        <Link href="/campaigns/create">
          <Button className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded-full text-lg">
            Start Your Campaign Now
          </Button>
        </Link>
      </section>

      <FooterCTA />
    </div>
  )
}
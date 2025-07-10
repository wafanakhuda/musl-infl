"use client"

export const dynamic = "force-dynamic"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      <FloatingElements />

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

      <section className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <PlatformStats />
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Featured Muslim Creators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/campaigns/create">
            <Button className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded-full text-lg">
              Post a Campaign
            </Button>
          </Link>
        </div>
      </section>

      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">How It Works</h2>
        <HowItWorks />
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Why Choose MuslimInfluencers.io?</h2>
        <WhyChooseUs />
      </section>

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

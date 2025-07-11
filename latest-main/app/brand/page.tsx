// File: app/brand/page.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../hooks/use-auth"
import { FloatingElements } from "../../components/ui/floating-elements"
import { Button } from "../../components/ui/button"
import { Building2, TrendingUp, Users, Megaphone } from "lucide-react"
import Link from "next/link"

export default function BrandLandingPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  // Redirect authenticated brand users to dashboard
  useEffect(() => {
    if (isAuthenticated && user?.user_type === "brand") {
      router.push("/dashboard/brand")
    }
  }, [isAuthenticated, user, router])

  // If user is authenticated but not a brand, show message
  if (isAuthenticated && user?.user_type !== "brand") {
    return (
      <main className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-950 text-white overflow-hidden">
        <FloatingElements />
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-slate-400 mb-6">This page is for brand accounts only.</p>
            <Link href="/dashboard/creator">
              <Button className="bg-gradient-to-r from-teal-500 to-blue-500">
                Go to Creator Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // Show brand landing page for non-authenticated users
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-950 text-white overflow-hidden">
      <FloatingElements />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Building2 className="w-12 h-12 text-purple-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              For Brands
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Connect with authentic Muslim creators and influencers to grow your brand through meaningful partnerships
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
            <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Find Verified Creators</h3>
            <p className="text-slate-400">
              Access a curated network of authentic Muslim creators across various niches and platforms
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
            <Megaphone className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Launch Campaigns</h3>
            <p className="text-slate-400">
              Create and manage influencer marketing campaigns with easy-to-use tools and analytics
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
            <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Track Performance</h3>
            <p className="text-slate-400">
              Monitor campaign performance with detailed analytics and ROI tracking
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/10 rounded-2xl p-12 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-slate-300 mb-8">
              Join thousands of brands already working with Muslim creators
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link href="/auth/register/brand">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-3 text-lg">
                      Sign Up as Brand
                    </Button>
                  </Link>
                  <Link href="/auth/login/brand">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg">
                      Login
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/dashboard/brand">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-3 text-lg">
                    Go to Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="fixed top-6 left-6">
          <Link href="/" className="text-slate-400 hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
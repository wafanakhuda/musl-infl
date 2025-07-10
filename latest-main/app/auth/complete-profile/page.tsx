"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "../../../hooks/use-auth"
import { FloatingElements } from "../../../components/ui/floating-elements"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { toast } from "sonner"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"

interface ProfileData {
  bio: string
  location: string
  niche: string
  content_type: string[]
  title: string
  social_links: { platform: string; url: string }[]
  packages: { title: string; description: string; price: string }[]
}

const CONTENT_TYPES = [
  "Instagram Posts", "Instagram Stories", "Instagram Reels",
  "TikTok Videos", "YouTube Videos", "YouTube Shorts",
  "Twitter/X Posts", "LinkedIn Posts", "Podcast Appearances",
  "Blog Posts", "Live Streaming"
]

const NICHES = [
  "Lifestyle", "Fashion", "Beauty", "Food", "Travel",
  "Technology", "Business", "Education", "Health & Fitness",
  "Parenting", "Islamic Content", "Modest Fashion"
]

export default function CompleteProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromOAuth = searchParams.get("from_oauth") === "true"
  const { user, updateProfile } = useAuth()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    bio: "",
    location: "",
    niche: "",
    content_type: [],
    title: "",
    social_links: [],
    packages: []
  })

  useEffect(() => {
    if (!user) {
      router.push('/auth/login/creator')
      return
    }

    if (!fromOAuth) {
      // If not from OAuth, redirect to regular dashboard
      router.push('/dashboard/creator')
      return
    }

    // Pre-fill with existing user data if available
    if (user.bio) setProfileData(prev => ({ ...prev, bio: user.bio! }))
    if (user.location) setProfileData(prev => ({ ...prev, location: user.location! }))
    if (user.niche) setProfileData(prev => ({ ...prev, niche: user.niche! }))
  }, [user, fromOAuth, router])

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const updateForm = (data: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...data }))
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      // Update user profile
      await updateProfile({
        bio: profileData.bio,
        location: profileData.location,
        niche: profileData.niche,
        platforms: profileData.content_type,
      })

      toast.success("Profile completed successfully!")
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard/creator')
      }, 1500)
      
    } catch (error) {
      console.error('Profile completion error:', error)
      toast.error("Failed to complete profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!user || !fromOAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Redirecting...</div>
      </div>
    )
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white overflow-hidden">
      <FloatingElements />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Step {step} of 4</span>
              <span>{Math.round((step / 4) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          <Card className="bg-black/40 backdrop-blur-lg border-white/10">
            <CardHeader>
              <CardTitle className="text-center text-white">
                {step === 1 && "Tell us about yourself"}
                {step === 2 && "Where are you located?"}
                {step === 3 && "What content do you create?"}
                {step === 4 && "Review & Complete"}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-white">Creator Title/Tagline</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Muslim Lifestyle & Fashion Creator"
                      value={profileData.title}
                      onChange={(e) => updateForm({ title: e.target.value })}
                      className="border-white/20 bg-white/5 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio" className="text-white">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself and what makes your content unique..."
                      value={profileData.bio}
                      onChange={(e) => updateForm({ bio: e.target.value })}
                      className="border-white/20 bg-white/5 text-white"
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="location" className="text-white">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., London, UK"
                      value={profileData.location}
                      onChange={(e) => updateForm({ location: e.target.value })}
                      className="border-white/20 bg-white/5 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="niche" className="text-white">Primary Niche</Label>
                    <Select value={profileData.niche} onValueChange={(value) => updateForm({ niche: value })}>
                      <SelectTrigger className="border-white/20 bg-white/5 text-white">
                        <SelectValue placeholder="Select your niche" />
                      </SelectTrigger>
                      <SelectContent>
                        {NICHES.map((niche) => (
                          <SelectItem key={niche} value={niche.toLowerCase()}>
                            {niche}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Content Types (Select all that apply)</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {CONTENT_TYPES.map((type) => (
                        <label key={type} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profileData.content_type.includes(type)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                updateForm({ content_type: [...profileData.content_type, type] })
                              } else {
                                updateForm({ 
                                  content_type: profileData.content_type.filter(t => t !== type) 
                                })
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm text-white">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Almost Done!</h3>
                    <p className="text-slate-400">Review your information and complete your profile.</p>
                  </div>
                  
                  <div className="bg-slate-800/50 p-4 rounded-lg space-y-2">
                    <div><strong>Title:</strong> {profileData.title || "Not set"}</div>
                    <div><strong>Location:</strong> {profileData.location || "Not set"}</div>
                    <div><strong>Niche:</strong> {profileData.niche || "Not set"}</div>
                    <div><strong>Content Types:</strong> {profileData.content_type.join(", ") || "None selected"}</div>
                    <div><strong>Bio:</strong> {profileData.bio ? `${profileData.bio.substring(0, 100)}...` : "Not set"}</div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <Button 
                  variant="outline" 
                  onClick={step === 1 ? () => router.push('/') : handleBack}
                  className="border-white/20"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {step === 1 ? 'Cancel' : 'Back'}
                </Button>

                {step < 4 ? (
                  <Button 
                    onClick={handleNext}
                    disabled={
                      (step === 1 && (!profileData.title || !profileData.bio)) ||
                      (step === 2 && (!profileData.location || !profileData.niche)) ||
                      (step === 3 && profileData.content_type.length === 0)
                    }
                    className="bg-gradient-to-r from-blue-500 to-teal-500"
                  >
                    Next <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleComplete}
                    disabled={loading}
                    className="bg-gradient-to-r from-green-500 to-blue-500"
                  >
                    {loading ? "Completing..." : "Complete Profile"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
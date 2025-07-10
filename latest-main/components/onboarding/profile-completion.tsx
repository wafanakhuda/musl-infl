"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { useAuth } from "../../hooks/use-auth"
import { toast } from "sonner"
import { User, Building2, MapPin, Globe, Loader2 } from "lucide-react"

interface ProfileData {
  bio: string
  location: string
  website: string
  // Creator specific
  niche?: string
  languages?: string[]
  // Brand specific
  industry?: string
  company_size?: string
}

export function ProfileCompletion() {
  const { user, updateProfile } = useAuth()
  const [profileData, setProfileData] = useState<ProfileData>({
    bio: "",
    location: "",
    website: "",
    niche: "",
    languages: [],
    industry: "",
    company_size: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateProfile(profileData)
      toast.success("Profile completed successfully!")
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof ProfileData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Card className="glass-card border-white/10">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
              {user.user_type === "creator" ? (
                <User className="w-8 h-8 text-blue-400" />
              ) : (
                <Building2 className="w-8 h-8 text-blue-400" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-white">Complete Your Profile</CardTitle>
            <p className="text-gray-400">Help others discover you by completing your profile information</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-white">
                  Bio *
                </Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={handleChange("bio")}
                  placeholder={
                    user.user_type === "creator"
                      ? "Tell brands about yourself, your content style, and what makes you unique..."
                      : "Describe your company, values, and what you're looking for in creators..."
                  }
                  className="border-white/20 bg-white/5 text-white placeholder-gray-400 min-h-[100px]"
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </Label>
                <Input
                  id="location"
                  value={profileData.location}
                  onChange={handleChange("location")}
                  placeholder="City, Country"
                  className="border-white/20 bg-white/5 text-white placeholder-gray-400"
                />
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website" className="text-white flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={profileData.website}
                  onChange={handleChange("website")}
                  placeholder="https://your-website.com"
                  className="border-white/20 bg-white/5 text-white placeholder-gray-400"
                />
              </div>

              {/* Creator-specific fields */}
              {user.user_type === "creator" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="niche" className="text-white">
                      Content Niche *
                    </Label>
                    <Select
                      value={profileData.niche}
                      onValueChange={(value) => setProfileData((prev) => ({ ...prev, niche: value }))}
                    >
                      <SelectTrigger className="border-white/20 bg-white/5 text-white">
                        <SelectValue placeholder="Select your primary niche" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fashion">Fashion & Beauty</SelectItem>
                        <SelectItem value="food">Food & Cooking</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="fitness">Health & Fitness</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="family">Family & Parenting</SelectItem>
                        <SelectItem value="islamic">Islamic Content</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Brand-specific fields */}
              {user.user_type === "brand" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-white">
                      Industry *
                    </Label>
                    <Select
                      value={profileData.industry}
                      onValueChange={(value) => setProfileData((prev) => ({ ...prev, industry: value }))}
                    >
                      <SelectTrigger className="border-white/20 bg-white/5 text-white">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                        <SelectItem value="food">Food & Beverage</SelectItem>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="health">Health & Wellness</SelectItem>
                        <SelectItem value="finance">Finance & Banking</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="travel">Travel & Tourism</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="services">Services</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company_size" className="text-white">
                      Company Size
                    </Label>
                    <Select
                      value={profileData.company_size}
                      onValueChange={(value) => setProfileData((prev) => ({ ...prev, company_size: value }))}
                    >
                      <SelectTrigger className="border-white/20 bg-white/5 text-white">
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-1000">201-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Profile...
                  </>
                ) : (
                  "Complete Profile"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarImage } from "../../components/ui/avatar"
import { toast } from "../../components/ui/use-toast"
import { apiClient } from "../../lib/api-client"

interface ProfileData {
  full_name: string
  email: string
  bio?: string
  location?: string
  avatar_url?: string
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [saving, setSaving] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await apiClient.getCurrentUser()
        if (user && typeof user === "object") {
          setProfileData({
            full_name: user.full_name,
            email: user.email || "",
            bio: user.bio || "",
            location: user.location || "",
            avatar_url: user.avatar_url || "",
          })
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error)
      }
    }

    fetchProfile()
  }, [])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0])
    }
  }

  const uploadAvatar = async (): Promise<{ url: string } | null> => {
    if (!avatarFile) return null
    try {
      const response = await apiClient.uploadAvatar(avatarFile)
if (response && response.avatar_url) {
  return { url: response.avatar_url }
}
return null
    } catch (err) {
      toast({
        title: "Upload Failed",
        description: "Could not upload avatar",
        variant: "destructive",
      })
      return null
    }
  }

  const handleSave = async () => {
    if (!profileData) return
    setSaving(true)

    const avatarResult = await uploadAvatar()
    const avatarUrl = avatarResult?.url || profileData.avatar_url

    try {
      await apiClient.updateProfile({
        full_name: profileData.full_name,
        bio: profileData.bio,
        location: profileData.location,
        avatar_url: avatarUrl,
      })

      toast({
        title: "Profile Saved",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not save profile.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (!profileData) return <div className="p-8 text-white">Loading profile...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-12 px-4">
      <div className="max-w-2xl mx-auto bg-slate-800/60 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

        <div className="flex items-center mb-6 space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profileData.avatar_url || "/placeholder.svg"} alt={profileData.full_name} />
          </Avatar>
          <label htmlFor="avatar-upload" className="text-sm font-medium text-gray-200">
            Upload Avatar
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="text-sm mt-1 block"
              title="Choose a profile picture"
            />
          </label>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="sr-only">Full Name</span>
            <Input
              placeholder="Full Name"
              value={profileData.full_name}
              onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
              title="Enter your full name"
            />
          </label>

          <label className="block">
            <span className="sr-only">Email</span>
            <Input
              value={profileData.email}
              disabled
              className="bg-slate-700 text-gray-300"
              title="Your email address"
            />
          </label>

          <label className="block">
            <span className="sr-only">Bio</span>
            <Input
              placeholder="Bio"
              value={profileData.bio || ""}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              title="Tell us something about yourself"
            />
          </label>

          <label className="block">
            <span className="sr-only">Location</span>
            <Input
              placeholder="Location"
              value={profileData.location || ""}
              onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
              title="Where are you located?"
            />
          </label>
        </div>

        <div className="mt-6">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}

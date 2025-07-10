"use client"

import { useEffect, useRef, useState } from "react"
import { useAuth } from "../../hooks/use-auth"
import {
  Upload,
  Instagram,
  Youtube,
} from "lucide-react"
import Image from "next/image"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import PageLayout from "../../components/ui/pagelayout"
import { toast } from "sonner"

export default function SettingsPage() {
  const { user, updateUser } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [fullName, setFullName] = useState("")
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [niche, setNiche] = useState("")
  const [followers, setFollowers] = useState<number | null>(null)
  const [priceMin, setPriceMin] = useState<number | null>(null)
  const [priceMax, setPriceMax] = useState<number | null>(null)
  const [platforms, setPlatforms] = useState<string[]>([])
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "")
      setBio(user.bio || "")
      setLocation(user.location || "")
      setNiche(user.niche || "")
      setFollowers(user.followers || null)
      setPriceMin(user.price_min || null)
      setPriceMax(user.price_max || null)
      setPlatforms(user.platforms || [])
      setAvatarPreview(user.avatar_url || null)
    }
  }, [user])

  const togglePlatform = (platform: string) => {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    )
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user?.id) return

    const previewUrl = URL.createObjectURL(file)
    setAvatarPreview(previewUrl)

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append("avatar", file)
      formData.append("userId", user.id)

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/avatar`, {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Upload failed")

      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar_url: data.url }),
      })

      updateUser?.({ ...user, avatar_url: data.url })
      toast.success("Avatar updated!")
    } catch (err: any) {
      toast.error(err.message || "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          bio,
          location,
          niche,
          followers,
          price_min: priceMin,
          price_max: priceMax,
          platforms,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Update failed")

      updateUser?.({ ...user, ...data })
      toast.success("Profile updated successfully")
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile")
    }
  }

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto py-20 px-4 space-y-8">
        <div className="flex items-center gap-4">
          <div
            className="relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <img
              src={avatarPreview || "/placeholder.svg"}
              alt="Avatar"
              className="w-20 h-20 rounded-full border-2 border-white object-cover"
            />
            <div className="absolute inset-0 bg-black/40 rounded-full hidden group-hover:flex items-center justify-center">
              <Upload className="text-white w-5 h-5" />
            </div>
            <input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  onChange={handleAvatarUpload}
  className="hidden"
  disabled={isUploading}
  aria-label="Upload avatar image"
  title="Upload avatar image"
/>
          </div>
          <Input
            className="flex-1 text-lg"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <Textarea
          placeholder="Your bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <Input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <Input
          placeholder="Niche (e.g. Fashion, Tech)"
          value={niche}
          onChange={(e) => setNiche(e.target.value)}
        />

        <div className="flex gap-4">
          <Input
            type="number"
            placeholder="Followers"
            value={followers || ""}
            onChange={(e) => setFollowers(Number(e.target.value))}
          />
          <Input
            type="number"
            placeholder="Min Price"
            value={priceMin || ""}
            onChange={(e) => setPriceMin(Number(e.target.value))}
          />
          <Input
            type="number"
            placeholder="Max Price"
            value={priceMax || ""}
            onChange={(e) => setPriceMax(Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-400">Platforms</p>
          <div className="flex gap-3">
            {["Instagram", "TikTok", "YouTube"].map((p) => (
              <Button
                key={p}
                variant={platforms.includes(p) ? "default" : "outline"}
                onClick={() => togglePlatform(p)}
              >
                {p === "TikTok" ? (
                  <Image src="/icons/tiktok.svg" alt="TikTok" width={18} height={18} />
                ) : p === "Instagram" ? (
                  <Instagram className="w-4 h-4 mr-1" />
                ) : (
                  <Youtube className="w-4 h-4 mr-1" />
                )}
                {p}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </PageLayout>
  )
}

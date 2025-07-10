"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../hooks/use-auth"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { Button } from "../../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Checkbox } from "../../../components/ui/checkbox"
import { toast } from "sonner"

export default function CreateCampaignPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [form, setForm] = useState({
    title: "",
    description: "",
    campaign_type: "",
    deliverables: "",
    budget_min: "",
    budget_max: "",
    deadline: "",
    gender: "",
    age_range: "",
    language: "",
    country: "",
    city: "",
    platform: "",
    followers_min: "",
    followers_max: "",
    niche: "",
    influencers_needed: "",
  })

  useEffect(() => {
    if (user && user.user_type !== "brand") {
      toast.error("Only brand users can post campaigns.")
      router.push("/")
    }
  }, [user])

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        budget_min: Number(form.budget_min),
        budget_max: Number(form.budget_max),
        followers_min: Number(form.followers_min),
        followers_max: Number(form.followers_max),
        influencers_needed: Number(form.influencers_needed),
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/campaigns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Failed to create campaign")
      toast.success("Campaign posted successfully!")
      router.push("/dashboard/brand")
    } catch (err) {
      toast.error("Something went wrong!")
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-6">
      <h1 className="text-3xl font-bold">Post a Campaign</h1>

      <Input placeholder="Campaign Title" value={form.title} onChange={e => handleChange("title", e.target.value)} />

      <Textarea placeholder="Brief Description" value={form.description} onChange={e => handleChange("description", e.target.value)} />

      <Select value={form.campaign_type} onValueChange={val => handleChange("campaign_type", val)}>
        <SelectTrigger><SelectValue placeholder="Campaign Type" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="product">Product Promotion</SelectItem>
          <SelectItem value="service">Service Campaign</SelectItem>
          <SelectItem value="branding">Brand Awareness</SelectItem>
        </SelectContent>
      </Select>

      <Textarea placeholder="Deliverables (e.g. 1 Reel, 1 Story)" value={form.deliverables} onChange={e => handleChange("deliverables", e.target.value)} />

      <div className="grid grid-cols-2 gap-4">
        <Input type="number" placeholder="Budget Min" value={form.budget_min} onChange={e => handleChange("budget_min", e.target.value)} />
        <Input type="number" placeholder="Budget Max" value={form.budget_max} onChange={e => handleChange("budget_max", e.target.value)} />
      </div>

      <Input type="date" placeholder="Deadline" value={form.deadline} onChange={e => handleChange("deadline", e.target.value)} />

      {/* Advanced Targeting */}
      <h2 className="text-xl font-semibold mt-8">Targeting</h2>

      <Select value={form.gender} onValueChange={val => handleChange("gender", val)}>
        <SelectTrigger><SelectValue placeholder="Gender" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any</SelectItem>
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
        </SelectContent>
      </Select>

      <Input placeholder="Age Range (e.g. 18-35)" value={form.age_range} onChange={e => handleChange("age_range", e.target.value)} />
      <Input placeholder="Language (e.g. English, Arabic)" value={form.language} onChange={e => handleChange("language", e.target.value)} />
      <Input placeholder="Country" value={form.country} onChange={e => handleChange("country", e.target.value)} />
      <Input placeholder="City" value={form.city} onChange={e => handleChange("city", e.target.value)} />
      <Input placeholder="Niche (e.g. Beauty, Fashion)" value={form.niche} onChange={e => handleChange("niche", e.target.value)} />
      <Input placeholder="Platform (e.g. Instagram)" value={form.platform} onChange={e => handleChange("platform", e.target.value)} />

      <div className="grid grid-cols-2 gap-4">
        <Input type="number" placeholder="Min Followers" value={form.followers_min} onChange={e => handleChange("followers_min", e.target.value)} />
        <Input type="number" placeholder="Max Followers" value={form.followers_max} onChange={e => handleChange("followers_max", e.target.value)} />
      </div>

      <Input type="number" placeholder="Influencers Needed" value={form.influencers_needed} onChange={e => handleChange("influencers_needed", e.target.value)} />

      <Button onClick={handleSubmit}>Submit Campaign</Button>
    </div>
  )
}

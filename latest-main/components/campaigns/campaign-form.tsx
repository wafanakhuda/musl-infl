// components/campaign/create-campaign-form.tsx
"use client"

import { useState } from "react"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Slider } from "../ui/slider"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"

export default function CreateCampaignForm() {
  const [platform, setPlatform] = useState("instagram")
  const [influencersCount, setInfluencersCount] = useState("100")
  const [niches, setNiches] = useState<string[]>([])
  const [genders, setGenders] = useState("any")
  const [ageRange, setAgeRange] = useState([0, 100])
  const [languages, setLanguages] = useState<string[]>([])
  const [ethnicities, setEthnicities] = useState<string[]>([])
  const [countries, setCountries] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [followerRanges, setFollowerRanges] = useState<string[]>([])

  return (
    <form className="space-y-8">
      <h2 className="text-xl font-semibold">Set Campaign Targeting</h2>

      <div>
        <label>What type of campaign do you want to run?</label>
        <Select value={platform} onValueChange={setPlatform}>
          <SelectTrigger>
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label>How many influencers do you want to hire?</label>
        <Input type="number" value={influencersCount} onChange={(e) => setInfluencersCount(e.target.value)} />
      </div>

      {/* Advanced Filters, Follower Ranges, Country, City, Language, etc. */}
      {/* Will continue in next message */}
    </form>
  )
}

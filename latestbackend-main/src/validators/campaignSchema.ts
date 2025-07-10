// src/validators/campaignSchema.ts
import { z } from "zod"

export const campaignSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().optional(),
  campaign_type: z.string(),
  deliverables: z.string(),
  budget_min: z.number().nonnegative(),
  budget_max: z.number().nonnegative(),
  deadline: z.string(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  gender: z.string().optional(),
  age_range: z.string().optional(),
  language: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  niche: z.string().optional(),
  platform: z.string().optional(),
  followers_min: z.number().optional(),
  followers_max: z.number().optional(),
  influencers_needed: z.number().optional(),
  requirements: z.string().optional(),
  target_audience: z.array(z.string()).optional(),
})

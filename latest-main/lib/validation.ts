import { z } from "zod"

// User validation schemas
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .max(255, "Email is too long"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),

    confirmPassword: z.string(),

    full_name: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name is too long")
      .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),

    user_type: z.enum(["creator", "brand"], {
      required_error: "Please select a user type",
    }),

    // Creator-specific fields
    niche: z.string().optional(),

    // Brand-specific fields
    company_name: z.string().optional(),

    // Terms acceptance
    terms_accepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.user_type === "creator" && !data.niche) {
        return false
      }
      return true
    },
    {
      message: "Niche is required for creators",
      path: ["niche"],
    },
  )
  .refine(
    (data) => {
      if (data.user_type === "brand" && !data.company_name) {
        return false
      }
      return true
    },
    {
      message: "Company name is required for brands",
      path: ["company_name"],
    },
  )

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),

  password: z.string().min(1, "Password is required"),
})

export const campaignSchema = z
  .object({
    title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title is too long"),

    description: z.string().min(20, "Description must be at least 20 characters").max(2000, "Description is too long"),

    category: z.string().min(1, "Category is required"),

    campaign_type: z.array(z.string()).min(1, "At least one campaign type is required"),

    budget_min: z.number().min(1, "Minimum budget must be at least $1").max(1000000, "Budget is too high"),

    budget_max: z.number().min(1, "Maximum budget must be at least $1").max(1000000, "Budget is too high"),

    target_audience: z.array(z.string()).min(1, "At least one target audience is required"),

    deliverables: z.array(z.string()).min(1, "At least one deliverable is required"),

    requirements: z.string().max(1000, "Requirements are too long").optional(),

    start_date: z.string().optional(),

    end_date: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.budget_max < data.budget_min) {
        return false
      }
      return true
    },
    {
      message: "Maximum budget must be greater than minimum budget",
      path: ["budget_max"],
    },
  )
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return new Date(data.end_date) > new Date(data.start_date)
      }
      return true
    },
    {
      message: "End date must be after start date",
      path: ["end_date"],
    },
  )

export const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(1000, "Message is too long"),
})

export const profileUpdateSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters").max(100, "Full name is too long").optional(),

  bio: z.string().max(500, "Bio is too long").optional(),

  location: z.string().max(100, "Location is too long").optional(),

  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
})

export const applicationSchema = z.object({
  proposal: z.string().min(50, "Proposal must be at least 50 characters").max(2000, "Proposal is too long"),

  price: z.number().min(1, "Price must be at least $1").max(1000000, "Price is too high"),

  timeline: z.string().min(5, "Timeline must be at least 5 characters").max(200, "Timeline is too long"),

  deliverables: z.array(z.string()).min(1, "At least one deliverable is required").optional(),
})

// Validation helper functions
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential XSS characters
    .slice(0, 1000) // Limit length
}

export function validateFileUpload(file: File): {
  isValid: boolean
  error?: string
} {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "File size must be less than 10MB",
    }
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "File must be a JPEG, PNG, GIF, or WebP image",
    }
  }

  return { isValid: true }
}

// Export types
export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type CampaignFormData = z.infer<typeof campaignSchema>
export type MessageFormData = z.infer<typeof messageSchema>
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>
export type ApplicationFormData = z.infer<typeof applicationSchema>

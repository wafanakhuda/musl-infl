// Environment configuration with validation
import { z } from "zod"

const envSchema = z.object({
  // App Configuration
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:8000"),
  NEXT_PUBLIC_WS_URL: z.string().default("ws://localhost:8000"),

  // Database
  DATABASE_URL: z.string().min(1, "Database URL is required"),

  // Authentication
  JWT_SECRET_KEY: z.string().min(32, "JWT secret must be at least 32 characters"),
  ACCESS_TOKEN_EXPIRE_DAYS: z.string().transform(Number).default("7"),

  // Stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).default("587"),
  SMTP_USERNAME: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  FROM_EMAIL: z.string().email().optional(),

  // File Upload
  MAX_FILE_SIZE: z.string().transform(Number).default("10485760"), // 10MB
  UPLOAD_PATH: z.string().default("/uploads"),

  // Analytics
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_FACEBOOK_PIXEL_ID: z.string().optional(),

  // Features
  ENABLE_REGISTRATION: z
    .string()
    .transform((val) => val !== "false")
    .default("true"),
  ENABLE_EMAIL_VERIFICATION: z
    .string()
    .transform((val) => val !== "false")
    .default("true"),
  ENABLE_PAYMENTS: z
    .string()
    .transform((val) => val !== "false")
    .default("true"),

  // Security
  RATE_LIMIT_REQUESTS: z.string().transform(Number).default("100"),
  RATE_LIMIT_WINDOW: z.string().transform(Number).default("60"),

  // Monitoring
  SENTRY_DSN: z.string().optional(),
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
})

function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join("\n")
      throw new Error(`Environment validation failed:\n${missingVars}`)
    }
    throw error
  }
}

export const env = validateEnv()

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>

// Helper functions
export function isProduction() {
  return env.NODE_ENV === "production"
}

export function isDevelopment() {
  return env.NODE_ENV === "development"
}

export function isTest() {
  return env.NODE_ENV === "test"
}

// Feature flags
export const features = {
  registration: env.ENABLE_REGISTRATION,
  emailVerification: env.ENABLE_EMAIL_VERIFICATION,
  payments: env.ENABLE_PAYMENTS,
  analytics: !!env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  monitoring: !!env.SENTRY_DSN,
} as const

// API configuration
export const apiConfig = {
  baseURL: env.NEXT_PUBLIC_API_URL,
  wsURL: env.NEXT_PUBLIC_WS_URL,
  timeout: 30000,
  retries: 3,
} as const

// Upload configuration
export const uploadConfig = {
  maxFileSize: env.MAX_FILE_SIZE,
  allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  uploadPath: env.UPLOAD_PATH,
} as const

// Rate limiting configuration
export const rateLimitConfig = {
  requests: env.RATE_LIMIT_REQUESTS,
  window: env.RATE_LIMIT_WINDOW,
} as const

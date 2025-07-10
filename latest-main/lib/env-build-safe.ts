// Build-safe environment configuration
export const env = {
  // App Configuration
  NODE_ENV: process.env.NODE_ENV || "development",
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",

  // Database (with fallbacks)
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://localhost:5432/placeholder",

  // Supabase (with fallbacks)
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key",

  // JWT (with fallback)
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || "build-time-placeholder-key-not-for-production",

  // Features
  ENABLE_REGISTRATION: process.env.ENABLE_REGISTRATION !== "false",
  ENABLE_EMAIL_VERIFICATION: process.env.ENABLE_EMAIL_VERIFICATION === "true",
  ENABLE_PAYMENTS: process.env.ENABLE_PAYMENTS === "true",
}

// Helper functions
export function isProduction() {
  return env.NODE_ENV === "production"
}

export function isDevelopment() {
  return env.NODE_ENV === "development"
}

export function isBuildTime() {
  return process.env.NODE_ENV === "production" && !process.env.VERCEL
}

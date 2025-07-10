"use client"

// Mock keys and test credentials for preview/testing
export const ENV = {
  // API Configuration
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  WS_URL: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000",

  // Site Configuration
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME || "MuslimInfluencers.io",

  // Mock Stripe Keys (Test Mode)
  STRIPE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51MockKeyForTestingPurposesOnly123456789",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "sk_test_51MockSecretKeyForTestingPurposesOnly123456789",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || "whsec_MockWebhookSecretForTestingOnly123456789",

  // Mock Database URL
  DATABASE_URL:
    process.env.DATABASE_URL || "postgresql://mock_user:mock_password@localhost:5432/halal_marketplace_test",

  // Mock JWT Secret
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || "mock_jwt_secret_key_for_testing_only_change_in_production_123456789",
  ACCESS_TOKEN_EXPIRE_DAYS: Number.parseInt(process.env.ACCESS_TOKEN_EXPIRE_DAYS || "7"),

  // Mock Email Configuration
  SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
  SMTP_PORT: Number.parseInt(process.env.SMTP_PORT || "587"),
  SMTP_USERNAME: process.env.SMTP_USERNAME || "test@musliminfluencers.io",
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || "mock_email_password_123",
  FROM_EMAIL: process.env.FROM_EMAIL || "noreply@musliminfluencers.io",

  // Mock Analytics Keys
  GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-MOCK123456789",
  FACEBOOK_PIXEL_ID: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "123456789012345",
  MIXPANEL_TOKEN: process.env.MIXPANEL_TOKEN || "mock_mixpanel_token_123456789",
  AMPLITUDE_API_KEY: process.env.AMPLITUDE_API_KEY || "mock_amplitude_key_123456789",

  // File Upload Configuration
  MAX_FILE_SIZE: Number.parseInt(process.env.MAX_FILE_SIZE || "10485760"), // 10MB
  UPLOAD_PATH: process.env.UPLOAD_PATH || "/uploads",

  // Feature Flags
  ENABLE_REGISTRATION: process.env.ENABLE_REGISTRATION !== "false",
  ENABLE_EMAIL_VERIFICATION: process.env.ENABLE_EMAIL_VERIFICATION !== "false",
  ENABLE_PAYMENTS: process.env.ENABLE_PAYMENTS !== "false",

  // Development flags
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
  IS_PREVIEW: !process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL.includes("localhost"),
  DEBUG: process.env.DEBUG === "true",

  // Mock data flags
  USE_MOCK_API:
    !process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL.includes("localhost:8000") === false,
  USE_MOCK_WS: !process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_WS_URL.includes("localhost:8000") === false,
}

// Test user credentials for demo
export const TEST_CREDENTIALS = {
  CREATOR: {
    email: "creator@test.com",
    password: "test123",
    full_name: "Ahmed Hassan",
    user_type: "creator" as const,
    niche: "Islamic Lifestyle",
  },
  BRAND: {
    email: "brand@test.com",
    password: "test123",
    full_name: "Halal Foods Co",
    user_type: "brand" as const,
    company_name: "Halal Foods Co",
  },
  ADMIN: {
    email: "admin@test.com",
    password: "admin123",
    full_name: "Admin User",
    user_type: "admin" as const,
  },
}

// Mock Stripe test card numbers
export const TEST_CARDS = {
  VISA: "4242424242424242",
  VISA_DEBIT: "4000056655665556",
  MASTERCARD: "5555555555554444",
  AMEX: "378282246310005",
  DECLINED: "4000000000000002",
  INSUFFICIENT_FUNDS: "4000000000009995",
}

// Helper functions
export const isPreviewMode = () => {
  return ENV.IS_PREVIEW || ENV.USE_MOCK_API
}

export const shouldShowPreviewBanner = () => {
  return isPreviewMode() && typeof window !== "undefined"
}

export const getTestCredentials = (userType: "creator" | "brand" | "admin") => {
  return TEST_CREDENTIALS[userType.toUpperCase() as keyof typeof TEST_CREDENTIALS]
}

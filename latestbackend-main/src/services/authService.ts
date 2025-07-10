// src/services/authService.ts
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"
import { sendEmail } from "../utils/email"
import { otpStore, generateOtp } from "../utils/otpUtils"

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret"

function createToken(user: { id: string; user_type: string }) {
  return jwt.sign({ id: user.id, user_type: user.user_type }, JWT_SECRET, {
    expiresIn: "7d",
  })
}

// ✅ More flexible registration payload interface
interface RegisterPayload {
  email: string
  password: string
  full_name: string
  user_type: "creator" | "brand"
  location?: string
  bio?: string
  avatar_url?: string
  username?: string
  profile?: {
    username?: string
  }
  followers?: number
  price_min?: number
  price_max?: number
  niche?: string
  platforms?: string[]
  gender?: string
}

// ✅ Register new user with flexible validation
export async function registerUser(data: RegisterPayload) {
  try {
    console.log("📝 Processing registration for:", data.email)
    console.log("📝 Registration data:", {
      email: data.email,
      user_type: data.user_type,
      hasLocation: !!data.location,
      hasBio: !!data.bio,
      hasUsername: !!(data.username || data.profile?.username),
      platformsCount: data.platforms?.length || 0
    })

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      throw new Error("Email already registered.")
    }

    // ✅ Extract username from profile or use fallback
    const username = data.profile?.username || data.username || `user_${Date.now()}`
    
    // ✅ Provide sensible defaults for required fields
    const location = data.location?.trim() || "Not specified"
    const bio = data.bio?.trim() || `${data.user_type === 'creator' ? 'Content creator' : 'Brand'} on MuslimInfluencers.io`

    console.log("📝 Creating user with:", {
      username,
      location,
      bio: bio.substring(0, 50) + "...",
      platforms: data.platforms
    })

    const hashed = await bcrypt.hash(data.password, 10)

    const user = await prisma.user.create({
      data: {
        email: data.email.trim(),
        password: hashed,
        full_name: data.full_name.trim(),
        user_type: data.user_type,
        location: location,
        bio: bio,
        avatar_url: data.avatar_url,
        email_verified: false,
        username: username,
        followers: data.followers || null,
        price_min: data.price_min || null,
        price_max: data.price_max || null,
        niche: data.niche || null,
        platforms: data.platforms || [],
        gender: data.gender || null,
      },
    })

    // Generate and store OTP
    const otp = generateOtp()
    otpStore[data.email] = otp

    console.log("📧 Sending OTP to:", data.email)

    // Send verification email
    await sendEmail({
      to: data.email,
      subject: "Verify Your MuslimInfluencers.io Account",
      text: `Welcome to MuslimInfluencers.io!\n\nYour verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't create an account, please ignore this email.`,
    })

    console.log("✅ Registration successful for user:", user.id)

    return {
      message: "Registration successful. Please check your email for the OTP verification code.",
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        user_type: user.user_type,
      },
    }
  } catch (error: any) {
    console.error("❌ Registration error:", error.message)
    throw error
  }
}

// ✅ Verify email OTP
export async function verifyOtp(data: { email: string; otp: string }) {
  try {
    console.log("🔍 Verifying OTP for:", data.email)

    const stored = otpStore[data.email]
    if (!stored || stored !== data.otp) {
      console.log("❌ Invalid OTP - Stored:", stored, "Provided:", data.otp)
      throw new Error("Invalid or expired OTP.")
    }

    const existingUser = await prisma.user.findUnique({ where: { email: data.email } })
    if (!existingUser) {
      throw new Error("User not found")
    }

    // Update user as verified
    const user = await prisma.user.update({
      where: { id: existingUser.id },
      data: { email_verified: true },
    })

    // Clean up OTP
    delete otpStore[data.email]

    // Generate auth token
    const token = createToken(user)

    console.log("✅ Email verification successful for user:", user.id)

    return {
      message: "Email verified successfully. Welcome to MuslimInfluencers.io!",
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        user_type: user.user_type,
        username: user.username,
        email_verified: true,
        bio: user.bio,
        location: user.location,
        niche: user.niche,
        platforms: user.platforms,
        avatar_url: user.avatar_url,
      },
    }
  } catch (error: any) {
    console.error("❌ OTP verification error:", error.message)
    throw error
  }
}

// ✅ Login user
export async function loginUser(data: { email: string; password: string }) {
  try {
    const { email, password } = data

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid email or password.")
    }

    if (!user.email_verified) {
      throw new Error("Please verify your email first. Check your inbox for the OTP.")
    }

    const token = createToken(user)

    console.log("✅ Login successful for user:", user.id)

    return {
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        user_type: user.user_type,
        username: user.username,
        email_verified: user.email_verified,
        avatar_url: user.avatar_url,
        bio: user.bio,
        location: user.location,
        niche: user.niche,
        platforms: user.platforms,
        verified: user.verified,
      },
    }
  } catch (error: any) {
    console.error("❌ Login error:", error.message)
    throw error
  }
}
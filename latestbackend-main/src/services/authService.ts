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

// Full type-safe payload
interface RegisterPayload {
  email: string
  password: string
  full_name: string
  user_type: "creator"
  location: string
  bio: string
  avatar_url?: string
  username: string
  followers?: number
  price_min?: number
  price_max?: number
  niche?: string
  platforms?: string[]
  gender?: string
}

// ✅ Register new creator user
export async function registerUser(data: RegisterPayload) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } })
  if (existing) throw new Error("Email already registered.")

  const hashed = await bcrypt.hash(data.password, 10)

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashed,
      full_name: data.full_name,
      user_type: data.user_type,
      location: data.location,
      bio: data.bio,
      avatar_url: data.avatar_url,
      email_verified: false,
      username: data.username, // ✅ required
      followers: data.followers,
      price_min: data.price_min,
      price_max: data.price_max,
      niche: data.niche,
      platforms: data.platforms,
      gender: data.gender,
    },
  })

  const otp = generateOtp()
  otpStore[data.email] = otp

  await sendEmail({
    to: data.email,
    subject: "Verify Your Account",
    text: `Your OTP is ${otp}`,
  })

  return {
    message: "Registration complete. OTP sent.",
    user: {
      id: user.id,
      email: user.email,
      user_type: user.user_type,
    },
  }
}

// ✅ Verify email OTP
export async function verifyOtp(data: { email: string; otp: string }) {
  const stored = otpStore[data.email]
  if (!stored || stored !== data.otp) {
    throw new Error("Invalid or expired OTP.")
  }

  const existingUser = await prisma.user.findUnique({ where: { email: data.email } })
  if (!existingUser) throw new Error("User not found")

  const user = await prisma.user.update({
    where: { id: existingUser.id },
    data: { email_verified: true },
  })

  delete otpStore[data.email]

  const token = createToken(user)

  return {
    message: "Email verified successfully.",
    token,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      user_type: user.user_type,
      email_verified: true,
    },
  }
}

// ✅ Login user
export async function loginUser(data: { email: string; password: string }) {
  const { email, password } = data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials.")
  }

  if (!user.email_verified) {
    throw new Error("Please verify your email with the OTP.")
  }

  const token = createToken(user)

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      user_type: user.user_type,
      email_verified: user.email_verified,
    },
  }
}

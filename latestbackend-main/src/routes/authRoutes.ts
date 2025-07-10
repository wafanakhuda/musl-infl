import { Router, Request, Response } from "express"
import { registerUser, loginUser, verifyOtp } from "../services/authService"
import { generateOtp, otpStore } from "../utils/otpUtils"
import { sendEmail } from "../utils/email"
import prisma from "../lib/prisma"

const router = Router()

// ✅ Creator Registration with Logging
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Registration payload:", req.body)

    const {
      email,
      password,
      full_name,
      user_type,
      location,
      bio,
      avatar_url,
      profile,
    } = req.body

    if (
      !email || !password || !full_name || !user_type ||
      !location || !bio || !profile || !profile.username
    ) {
      res.status(400).json({ error: "Missing required fields." })
      return
    }

    const result = await registerUser({
      email,
      password,
      full_name,
      user_type,
      location,
      bio,
      avatar_url,
      username: profile.username,
    })

    res.status(201).json(result)
  } catch (error: any) {
    console.error("Registration error:", error)
    res.status(500).json({ error: error.message || "Internal server error" })
  }
})

// ✅ Login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: "Email and password required." })
      return
    }

    const result = await loginUser({ email, password })
    res.status(200).json(result)
  } catch (error: any) {
    console.error("Login error:", error)
    res.status(500).json({ error: error.message || "Internal server error" })
  }
})

// ✅ Send OTP
router.post("/send-otp", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body
    if (!email) {
      res.status(400).json({ error: "Email is required." })
      return
    }

    const otp = generateOtp()
    otpStore[email] = otp

    await sendEmail({
      to: email,
      subject: "Your OTP Code",
      text: `Your verification code is: ${otp}`,
    })

    res.status(200).json({ message: "OTP sent successfully." })
  } catch (error: any) {
    console.error("Send OTP error:", error)
    res.status(500).json({ error: error.message || "Failed to send OTP" })
  }
})

// ✅ Verify OTP
router.post("/verify-otp", async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("OTP verification payload:", req.body)

    const { email, otp } = req.body
    if (!email || !otp) {
      res.status(400).json({ error: "Email and OTP are required." })
      return
    }

    const result = await verifyOtp({ email, otp })
    res.status(200).json(result)
  } catch (error: any) {
    console.error("OTP verification error:", error)
    res.status(500).json({ error: error.message || "Internal server error" })
  }
})

// ✅ Resend OTP
router.post("/resend-otp", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body
    if (!email) {
      res.status(400).json({ error: "Email is required." })
      return
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      res.status(404).json({ error: "User not found." })
      return
    }

    const otp = generateOtp()
    otpStore[email] = otp

    await sendEmail({
      to: email,
      subject: "Your OTP Code",
      text: `Your verification code is: ${otp}`,
    })

    res.status(200).json({ message: "OTP resent successfully." })
  } catch (error: any) {
    console.error("Resend OTP error:", error)
    res.status(500).json({ error: error.message || "Failed to resend OTP" })
  }
})

export default router

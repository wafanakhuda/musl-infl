import { Router, Request, Response } from "express"
import { registerUser, loginUser, verifyOtp } from "../services/authService"
import { generateOtp, otpStore } from "../utils/otpUtils"
import { sendEmail } from "../utils/email"
import prisma from "../lib/prisma"

const router = Router()

// ✅ Enhanced Creator Registration with more flexible validation
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("📝 Registration request received")
    console.log("📝 Request body keys:", Object.keys(req.body))
    console.log("📝 Full payload:", JSON.stringify(req.body, null, 2))

    const {
      email,
      password,
      full_name,
      user_type,
      location,
      bio,
      avatar_url,
      profile,
      platforms,
      gender,
      niche,
      username,
    } = req.body

    // ✅ Basic validation with more helpful error messages
    const errors = []
    
    if (!email?.trim()) errors.push("Email is required")
    if (!password) errors.push("Password is required")
    if (!full_name?.trim()) errors.push("Full name is required")
    if (!user_type) errors.push("User type is required")

    // ✅ More flexible validation - these fields are not strictly required
    // The service will provide defaults if needed

    if (errors.length > 0) {
      console.log("❌ Validation errors:", errors)
      res.status(400).json({ 
        error: "Validation failed", 
        details: errors,
        message: `Missing required fields: ${errors.join(", ")}`
      })
      return
    }

    // ✅ Prepare payload for registration service
    const registrationData = {
      email: email.trim(),
      password,
      full_name: full_name.trim(),
      user_type,
      location: location?.trim(),
      bio: bio?.trim(),
      avatar_url,
      profile,
      username,
      platforms: Array.isArray(platforms) ? platforms : [],
      gender,
      niche,
    }

    console.log("📝 Calling registerUser with:", {
      email: registrationData.email,
      user_type: registrationData.user_type,
      hasProfile: !!registrationData.profile,
      hasUsername: !!registrationData.username,
      hasLocation: !!registrationData.location,
      hasBio: !!registrationData.bio,
      platformsCount: registrationData.platforms.length
    })

    const result = await registerUser(registrationData)

    console.log("✅ Registration successful, sending response")
    res.status(201).json(result)

  } catch (error: any) {
    console.error("❌ Registration error:", error.message)
    console.error("❌ Full error:", error)
    
    // Provide more specific error messages
    let errorMessage = error.message
    if (error.message.includes("Email already")) {
      errorMessage = "This email is already registered. Please login instead."
    } else if (error.message.includes("validation")) {
      errorMessage = "Please check your input and try again."
    } else if (!errorMessage || errorMessage === "Internal server error") {
      errorMessage = "Registration failed. Please try again later."
    }

    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// ✅ Login with better error handling
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." })
      return
    }

    console.log("🔐 Login attempt for:", email)
    const result = await loginUser({ email: email.trim(), password })
    
    console.log("✅ Login successful for:", email)
    res.status(200).json(result)
  } catch (error: any) {
    console.error("❌ Login error:", error.message)
    
    let errorMessage = error.message
    if (error.message.includes("Invalid")) {
      errorMessage = "Invalid email or password."
    } else if (error.message.includes("verify")) {
      errorMessage = "Please verify your email first. Check your inbox for the OTP."
    }
    
    res.status(401).json({ error: errorMessage })
  }
})

// ✅ Send OTP (for initial registration)
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
      subject: "Your MuslimInfluencers.io OTP Code",
      text: `Your verification code is: ${otp}\n\nThis code will expire in 10 minutes.`,
    })

    console.log("📧 OTP sent to:", email)
    res.status(200).json({ message: "OTP sent successfully." })
  } catch (error: any) {
    console.error("❌ Send OTP error:", error.message)
    res.status(500).json({ error: "Failed to send OTP. Please try again." })
  }
})

// ✅ Verify OTP with enhanced logging
router.post("/verify-otp", async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("🔍 OTP verification request received")
    console.log("📝 Payload:", { email: req.body.email, otpLength: req.body.otp?.length })

    const { email, otp } = req.body
    if (!email || !otp) {
      res.status(400).json({ error: "Email and OTP are required." })
      return
    }

    if (otp.length !== 6) {
      res.status(400).json({ error: "OTP must be 6 digits." })
      return
    }

    const result = await verifyOtp({ email: email.trim(), otp: otp.trim() })
    
    console.log("✅ OTP verification successful for:", email)
    res.status(200).json(result)
  } catch (error: any) {
    console.error("❌ OTP verification error:", error.message)
    
    let errorMessage = error.message
    if (error.message.includes("Invalid or expired")) {
      errorMessage = "Invalid or expired OTP. Please request a new one."
    } else if (error.message.includes("User not found")) {
      errorMessage = "Account not found. Please register first."
    }
    
    res.status(400).json({ error: errorMessage })
  }
})

// ✅ Resend OTP with better error handling
router.post("/resend-otp", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body
    if (!email) {
      res.status(400).json({ error: "Email is required." })
      return
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      res.status(404).json({ error: "No account found with this email address." })
      return
    }

    if (user.email_verified) {
      res.status(400).json({ error: "Email is already verified. Please login." })
      return
    }

    // Generate new OTP
    const otp = generateOtp()
    otpStore[email] = otp

    await sendEmail({
      to: email,
      subject: "Your New OTP Code - MuslimInfluencers.io",
      text: `Your new verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`,
    })

    console.log("📧 OTP resent to:", email)
    res.status(200).json({ message: "New OTP sent successfully. Please check your email." })
  } catch (error: any) {
    console.error("❌ Resend OTP error:", error.message)
    res.status(500).json({ error: "Failed to resend OTP. Please try again." })
  }
})




// ADD THESE ROUTES TO YOUR EXISTING authRoutes.ts file

// ✅ Forgot Password - Send reset OTP
router.post("/forgot-password", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body
    
    if (!email?.trim()) {
      res.status(400).json({ error: "Email is required." })
      return
    }

    console.log("🔑 Password reset requested for:", email)

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email: email.trim() } })
    if (!user) {
      // Don't reveal if email exists or not for security
      res.status(200).json({ message: "If an account with this email exists, you will receive a password reset code." })
      return
    }

    // Generate and store OTP for password reset
    const resetOtp = generateOtp()
    otpStore[`reset_${email.trim()}`] = resetOtp // Use prefix to distinguish from registration OTPs

    console.log("📧 Sending password reset OTP to:", email)

    // Send password reset email
    await sendEmail({
      to: email.trim(),
      subject: "Reset Your MuslimInfluencers.io Password",
      text: `You requested a password reset for your MuslimInfluencers.io account.\n\nYour password reset code is: ${resetOtp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email and your password will remain unchanged.`,
    })

    res.status(200).json({ 
      message: "If an account with this email exists, you will receive a password reset code." 
    })

  } catch (error: any) {
    console.error("❌ Forgot password error:", error.message)
    res.status(500).json({ error: "Failed to process password reset request. Please try again." })
  }
})

// ✅ Verify Reset OTP and Reset Password
router.post("/reset-password", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body
    
    if (!email?.trim() || !otp?.trim() || !newPassword) {
      res.status(400).json({ error: "Email, OTP, and new password are required." })
      return
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters long." })
      return
    }

    console.log("🔑 Password reset verification for:", email)

    // Check if reset OTP is valid
    const resetKey = `reset_${email.trim()}`
    const storedOtp = otpStore[resetKey]
    
    if (!storedOtp || storedOtp !== otp.trim()) {
      res.status(400).json({ error: "Invalid or expired reset code." })
      return
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email: email.trim() } })
    if (!user) {
      res.status(404).json({ error: "User not found." })
      return
    }

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })

    // Clean up the reset OTP
    delete otpStore[resetKey]

    console.log("✅ Password reset successful for user:", user.id)

    res.status(200).json({ 
      message: "Password reset successful. You can now login with your new password." 
    })

  } catch (error: any) {
    console.error("❌ Reset password error:", error.message)
    res.status(500).json({ error: "Failed to reset password. Please try again." })
  }
})

// ✅ Resend Password Reset OTP
router.post("/resend-reset-otp", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body
    
    if (!email?.trim()) {
      res.status(400).json({ error: "Email is required." })
      return
    }

    console.log("🔄 Resending password reset OTP for:", email)

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email: email.trim() } })
    if (!user) {
      // Don't reveal if email exists or not for security
      res.status(200).json({ message: "If an account with this email exists, you will receive a new password reset code." })
      return
    }

    // Generate new reset OTP
    const resetOtp = generateOtp()
    otpStore[`reset_${email.trim()}`] = resetOtp

    // Send new reset email
    await sendEmail({
      to: email.trim(),
      subject: "New Password Reset Code - MuslimInfluencers.io",
      text: `You requested a new password reset code for your MuslimInfluencers.io account.\n\nYour new password reset code is: ${resetOtp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`,
    })

    console.log("📧 New password reset OTP sent to:", email)

    res.status(200).json({ 
      message: "If an account with this email exists, you will receive a new password reset code." 
    })

  } catch (error: any) {
    console.error("❌ Resend reset OTP error:", error.message)
    res.status(500).json({ error: "Failed to resend password reset code. Please try again." })
  }
})


// ✅ Health check endpoint
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Auth service is running",
    timestamp: new Date().toISOString()
  })
})

export default router
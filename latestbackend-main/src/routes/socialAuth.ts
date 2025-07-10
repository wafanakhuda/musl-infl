import express from "express"
import passport from "passport"
import "../auth/google" // Ensures Google strategy is registered

const router = express.Router()

// ✅ Initiate Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
)

// ✅ Handle Google OAuth callback with enhanced error handling
router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    console.log('🔐 OAuth callback - err:', err, 'user:', !!user, 'info:', info)
    
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000"
    
    if (err) {
      console.error('OAuth error:', err)
      return res.redirect(`${frontendUrl}/auth/social?error=authentication_failed`)
    }
    
    if (!user) {
      console.error('No user returned from OAuth')
      return res.redirect(`${frontendUrl}/auth/social?error=user_not_found`)
    }

    const { token } = user as any
    if (!token) {
      console.error('No token generated for user')
      return res.redirect(`${frontendUrl}/auth/social?error=token_generation_failed`)
    }

    console.log('✅ OAuth successful, redirecting with token')
    res.redirect(`${frontendUrl}/auth/social?token=${token}`)
  })(req, res, next)
})

// ✅ Add logout endpoint for OAuth users
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err)
      return res.status(500).json({ error: "Logout failed" })
    }
    
    // Clear session
    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        console.error('Session destroy error:', sessionErr)
      }
      res.clearCookie('connect.sid') // Clear session cookie
      res.status(200).json({ message: "Logged out successfully" })
    })
  })
})

export default router

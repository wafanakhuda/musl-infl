// routes/socialAuth.ts
import express from "express"
import passport from "passport"
import "../auth/google" // Ensures Google strategy is registered

const router = express.Router()

// ✅ Initiate Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
)

// ✅ Handle Google OAuth callback with custom logic
router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/social?error=OAuthFailed`)
    }

    const { token } = user as any
    res.redirect(`${process.env.FRONTEND_URL}/auth/social?token=${token}`)
  })(req, res, next)
})

export default router

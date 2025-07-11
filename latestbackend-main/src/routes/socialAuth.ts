// routes/socialAuth.ts
import express from "express"
import passport from "passport"
import "../auth/google" // Ensures Google strategy is registered

const router = express.Router()

// ✅ Enhanced Google OAuth initiation with user type support
router.get("/google", (req, res, next) => {
  const userType = req.query.user_type || "creator"
  console.log(`🔐 Initiating Google OAuth for user type: ${userType}`)
  
  // ✅ Store user type in session to access in callback
  if (req.session) {
    (req.session as any).oauth_user_type = userType
  }
  
  const authenticateOptions = {
    scope: ["profile", "email"]
  }
  
  passport.authenticate("google", authenticateOptions)(req, res, next)
})

// ✅ Enhanced callback with profile completion detection
router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, authResult, info) => {
    console.log('🔐 OAuth callback result:', { 
      hasError: !!err, 
      hasAuthResult: !!authResult, 
      hasToken: !!(authResult?.token),
      userType: authResult?.user?.user_type
    })
    
const frontendUrl = process.env.FRONTEND_URL || 
  (req.get('host')?.includes('localhost') 
    ? "http://localhost:3000"
    : "https://musl-infl.vercel.app")    
    if (err) {
      console.error('❌ OAuth error:', err)
      return res.redirect(`${frontendUrl}/auth/social?error=authentication_failed`)
    }
    
    if (!authResult) {
      console.error('❌ No auth result returned from OAuth')
      return res.redirect(`${frontendUrl}/auth/social?error=user_not_found`)
    }

    const { token, user, profile_complete, is_new_oauth_user, needs_onboarding } = authResult

    if (!token) {
      console.error('❌ No token generated for user')
      return res.redirect(`${frontendUrl}/auth/social?error=token_generation_failed`)
    }

    if (!user) {
      console.error('❌ No user data in auth result')
      return res.redirect(`${frontendUrl}/auth/social?error=user_data_missing`)
    }

    console.log('📊 OAuth user details:', {
      userId: user.id,
      userType: user.user_type,
      isNewUser: is_new_oauth_user,
      profileComplete: profile_complete,
      needsOnboarding: needs_onboarding
    })

    // ✅ Enhanced redirect logic based on user type and profile completion
    const baseRedirectUrl = `${frontendUrl}/auth/social?token=${token}`

    if (user.user_type === "creator") {
      if (is_new_oauth_user || needs_onboarding || !profile_complete) {
        console.log('📝 Creator needs onboarding, redirecting to profile completion')
        return res.redirect(`${baseRedirectUrl}&needs_onboarding=true&user_type=creator&is_new=${is_new_oauth_user}`)
      } else {
        console.log('✅ Creator profile complete, redirecting to dashboard')
        return res.redirect(`${baseRedirectUrl}&needs_onboarding=false&user_type=creator`)
      }
    } else if (user.user_type === "brand") {
      // ✅ Brands might need different onboarding in the future
      console.log('🏢 Brand user, redirecting to brand dashboard')
      return res.redirect(`${baseRedirectUrl}&needs_onboarding=false&user_type=brand`)
    } else {
      // ✅ Fallback for any other user types
      console.log('🔄 Unknown user type, redirecting with onboarding check')
      return res.redirect(`${baseRedirectUrl}&needs_onboarding=true&user_type=${user.user_type}`)
    }
  })(req, res, next)
})

// ✅ Enhanced logout endpoint for OAuth users
router.post("/logout", (req, res) => {
  console.log('🚪 OAuth logout requested')
  
  req.logout((err) => {
    if (err) {
      console.error('❌ Logout error:', err)
      return res.status(500).json({ error: "Logout failed" })
    }
    
    // Clear session data
    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        console.error('⚠️ Session destroy error:', sessionErr)
      }
      
      // Clear session cookie
      res.clearCookie('connect.sid')
      
      console.log('✅ OAuth logout successful')
      res.status(200).json({ message: "Logged out successfully" })
    })
  })
})

// ✅ Health check endpoint for OAuth routes
router.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Social auth service is running",
    timestamp: new Date().toISOString(),
    endpoints: {
      google_oauth: "/auth/google",
      google_callback: "/auth/google/callback",
      logout: "/auth/logout"
    }
  })
})

// ✅ Apple OAuth support (placeholder for future implementation)
router.get("/apple", (req, res) => {
  res.status(501).json({ 
    message: "Apple OAuth not yet implemented",
    status: "coming_soon"
  })
})

export default router

import { Router, Request, Response } from 'express'
import { authenticateToken } from '../middlewares/authMiddleware' // ✅ Correct path
import { AuthRequest } from '../types/AuthRequest' // ✅ Correct type
import prisma from '../lib/prisma'

const router = Router()

// ✅ GET /api/users/me - Fetch current logged-in user (EXISTING - UNCHANGED)
router.get(
  '/me',
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    const user = (req as AuthRequest).user
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    try {
      const foundUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          full_name: true,
          user_type: true,
          avatar_url: true,
          bio: true,
          location: true,
          niche: true,
          followers: true,
          price_min: true,
          price_max: true,
          platforms: true,
          email_verified: true,
          verified: true,
        },
      })
      if (!foundUser) {
        res.status(404).json({ error: 'User not found' })
        return
      }
      res.json(foundUser)
    } catch (error) {
      console.error('Error in /users/me:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
)

// ✅ PUT /api/users/me - Update creator profile (EXISTING - UNCHANGED)
router.put(
  '/me',
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    const user = (req as AuthRequest).user
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }
    const {
      full_name,
      avatar_url,
      bio,
      location,
      niche,
      followers,
      price_min,
      price_max,
      platforms,
    } = req.body
    try {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          full_name,
          avatar_url,
          bio,
          location,
          niche,
          followers,
          price_min,
          price_max,
          platforms,
        },
      })
      res.json(updatedUser)
    } catch (error) {
      console.error('Error updating user profile:', error)
      res.status(500).json({ error: 'Failed to update user profile' })
    }
  }
)

// ✅ NEW: PUT /api/users/profile - Enhanced profile update for OAuth onboarding
router.put(
  '/profile',
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    const user = (req as AuthRequest).user // ✅ Use AuthRequest type
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    console.log(`📝 Updating profile for user: ${user.id}`)

    const {
      bio,
      location,
      niche,
      platforms,
      website,
      price_min,
      price_max,
      followers
    } = req.body

    try {
      // ✅ Validate required fields for profile completion
      const errors = []
      if (!bio?.trim()) errors.push("Bio is required")
      if (!location?.trim()) errors.push("Location is required")
      if (!niche?.trim()) errors.push("Niche is required")
      if (!platforms || platforms.length === 0) errors.push("At least one content type is required")

      if (errors.length > 0) {
        res.status(400).json({ 
          error: "Profile validation failed", 
          details: errors 
        })
        return
      }

      // ✅ Update user profile
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          bio: bio?.trim(),
          location: location?.trim(),
          niche: niche?.trim(),
          platforms: Array.isArray(platforms) ? platforms : [],
          website: website?.trim() || null,
          price_min: price_min ? parseInt(price_min) : null,
          price_max: price_max ? parseInt(price_max) : null,
          followers: followers ? parseInt(followers) : null,
        },
        // ✅ Select fields to return (excluding password)
        select: {
          id: true,
          email: true,
          full_name: true,
          user_type: true,
          avatar_url: true,
          bio: true,
          location: true,
          niche: true,
          followers: true,
          price_min: true,
          price_max: true,
          platforms: true,
          website: true,
          email_verified: true,
          verified: true,
          created_at: true,
        }
      })

      console.log(`✅ Profile updated successfully for user: ${user.id}`)
      
      res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser
      })

    } catch (error: any) {
      console.error("❌ Profile update error:", error)
      res.status(500).json({ 
        error: "Failed to update profile",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }
)

// ✅ NEW: GET /api/users/profile-status - Check profile completion status
router.get(
  '/profile-status',
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    const user = (req as AuthRequest).user // ✅ Use AuthRequest type
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' })
      return
    }

    try {
      const foundUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          full_name: true,
          user_type: true,
          bio: true,
          location: true,
          niche: true,
          platforms: true,
          avatar_url: true,
          created_at: true,
        }
      })

      if (!foundUser) {
        res.status(404).json({ error: "User not found" })
        return
      }

      // ✅ Check profile completion status
      const isProfileComplete = !!(
        foundUser.bio && 
        foundUser.location && 
        foundUser.niche &&
        foundUser.platforms && 
        foundUser.platforms.length > 0
      )

      const completionPercentage = [
        foundUser.bio,
        foundUser.location,
        foundUser.niche,
        foundUser.platforms?.length > 0,
        foundUser.avatar_url
      ].filter(Boolean).length * 20 // 5 fields = 100%

      res.status(200).json({
        user: foundUser,
        profile_complete: isProfileComplete,
        completion_percentage: completionPercentage,
        missing_fields: {
          bio: !foundUser.bio,
          location: !foundUser.location,
          niche: !foundUser.niche,
          platforms: !foundUser.platforms || foundUser.platforms.length === 0,
          avatar: !foundUser.avatar_url
        }
      })

    } catch (error: any) {
      console.error("❌ Profile status error:", error)
      res.status(500).json({ error: "Failed to get profile status" })
    }
  }
)

export default router
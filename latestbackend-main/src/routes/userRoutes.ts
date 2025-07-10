import { Router, Request, Response } from 'express'
import { authenticateToken } from '../middlewares/authMiddleware'
import { AuthRequest } from '../types/AuthRequest'
import prisma from '../lib/prisma'

const router = Router()

// ✅ GET /api/users/me - Fetch current logged-in user
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

// ✅ PUT /api/users/me - Update creator profile
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

export default router

import { Router, Response } from 'express'
import { authenticateToken, isAuthenticated } from '../middlewares/authMiddleware'
import {
  getAllUsers,
  getAllCampaigns,
  moderateUser,
  moderateCampaign
} from '../services/adminService'
import { wrapAsync } from '../utils/wrapAsync'
import { AuthRequest } from '../types/AuthRequest'

const router = Router()

router.get(
  '/users',
  authenticateToken,
  wrapAsync<AuthRequest>(async (req, res) => {
    if (!isAuthenticated(req) || req.user?.user_type !== 'admin') {
      return res.status(403).json({ error: 'Admin access only' })
    }

    const users = await getAllUsers()
    res.json(users)
  })
)

router.get(
  '/campaigns',
  authenticateToken,
  wrapAsync<AuthRequest>(async (req, res) => {
    if (!isAuthenticated(req) || req.user?.user_type !== 'admin') {
      return res.status(403).json({ error: 'Admin access only' })
    }

    const campaigns = await getAllCampaigns()
    res.json(campaigns)
  })
)

router.post(
  '/users/:id/moderate',
  authenticateToken,
  wrapAsync<AuthRequest>(async (req, res) => {
    if (!isAuthenticated(req) || req.user?.user_type !== 'admin') {
      return res.status(403).json({ error: 'Admin access only' })
    }

    const { action } = req.body
    const updatedUser = await moderateUser(req.params.id, action)
    res.json(updatedUser)
  })
)

router.post(
  '/campaigns/:id/moderate',
  authenticateToken,
  wrapAsync<AuthRequest>(async (req, res) => {
    if (!isAuthenticated(req) || req.user?.user_type !== 'admin') {
      return res.status(403).json({ error: 'Admin access only' })
    }

    const { action } = req.body
    const updatedCampaign = await moderateCampaign(req.params.id, action)
    res.json(updatedCampaign)
  })
)

export default router

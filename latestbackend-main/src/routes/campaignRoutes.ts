import { Router, Request, Response } from 'express'
import { authenticateToken } from '../middlewares/authMiddleware'
import { campaignSchema } from '../validators/campaignSchema'
import { AuthRequest } from '../types/AuthRequest'
import {
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  applyToCampaign,
} from '../services/campaignService'

const router = Router()

// GET /campaigns
router.get('/', async (req: Request, res: Response) => {
  try {
    const { creator_id, limit } = req.query
    const campaigns = await getAllCampaigns(
      creator_id?.toString(),
      limit ? parseInt(limit.toString()) : undefined
    )
    res.json(campaigns)
  } catch (err: any) {
    console.error('Error fetching campaigns:', err)
    res.status(500).json({ error: 'Failed to fetch campaigns' })
  }
})

// GET /campaigns/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const campaign = await getCampaignById(req.params.id)
    if (!campaign) {
      res.status(404).json({ error: 'Campaign not found' })
      return
    }
    res.json(campaign)
  } catch (err: any) {
    console.error('Error retrieving campaign:', err)
    res.status(500).json({ error: 'Error retrieving campaign' })
  }
})

// POST /campaigns (brand only)
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  const user = (req as AuthRequest).user

  if (!user || user.user_type !== 'brand') {
    res.status(403).json({ error: 'Only brands can create campaigns' })
    return
  }

  const parsed = campaignSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      error: 'Invalid campaign data',
      details: parsed.error.flatten(),
    })
    return
  }

  try {
    const campaign = await createCampaign(user.id, parsed.data)
    res.status(201).json(campaign)
  } catch (err: any) {
    console.error('Error creating campaign:', err)
    res.status(500).json({ error: 'Failed to create campaign' })
  }
})

// PUT /campaigns/:id
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const campaign = await updateCampaign(req.params.id, req.body)
    res.json(campaign)
  } catch (err: any) {
    console.error('Error updating campaign:', err)
    res.status(400).json({ error: err.message })
  }
})

// DELETE /campaigns/:id
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    await deleteCampaign(req.params.id)
    res.status(204).send()
  } catch (err: any) {
    console.error('Error deleting campaign:', err)
    res.status(400).json({ error: err.message })
  }
})

// POST /campaigns/:id/apply (creator only)
router.post('/:id/apply', authenticateToken, async (req: Request, res: Response) => {
  const user = (req as AuthRequest).user

  if (!user || user.user_type !== 'creator') {
    res.status(403).json({ error: 'Only creators can apply to campaigns' })
    return
  }

  try {
    const application = await applyToCampaign(req.params.id, user.id, user.id)
    res.json({ message: 'Applied successfully', application })
  } catch (err: any) {
    console.error('Error applying to campaign:', err)
    res.status(400).json({ error: err.message })
  }
})

export default router

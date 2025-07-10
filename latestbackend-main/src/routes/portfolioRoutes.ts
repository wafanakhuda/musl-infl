import { Router, Request, Response } from 'express'
import { authenticateToken } from '../middlewares/authMiddleware'
import { AuthRequest } from '../types/AuthRequest'
import {
  getUserPortfolio,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem
} from '../services/portfolioService'

const router = Router()

// ✅ GET /api/portfolio - Get current user's portfolio
router.get('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const user = (req as AuthRequest).user
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  try {
    const items = await getUserPortfolio(user.id)
    res.json(items)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// ✅ POST /api/portfolio - Add new portfolio item
router.post('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const user = (req as AuthRequest).user
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const { title, description, mediaUrl } = req.body
  if (!title || !mediaUrl) {
    res.status(400).json({ error: 'Title and mediaUrl are required' })
    return
  }

  try {
    const newItem = await addPortfolioItem(user.id, {
      title,
      description,
      mediaUrl // ✅ Correct field name for service
    })
    res.status(201).json(newItem)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// ✅ PUT /api/portfolio/:id - Update portfolio item
router.put('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const user = (req as AuthRequest).user
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  const { title, description, mediaUrl } = req.body

  try {
    const updated = await updatePortfolioItem(
      req.params.id,
      {
        title,
        description,
        mediaUrl // ✅ Correct field name for service
      },
      user.id
    )
    res.json(updated)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// ✅ DELETE /api/portfolio/:id - Delete portfolio item
router.delete('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const user = (req as AuthRequest).user
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  try {
    await deletePortfolioItem(req.params.id, user.id)
    res.status(204).send()
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

export default router

// src/routes/searchRoutes.ts
import { Router, Request, Response } from 'express'
import { authenticateToken } from '../middlewares/authMiddleware'
import { AuthRequest } from '../types/AuthRequest'
import {
  searchCreators,
  searchCampaigns,
  searchSuggestions,
  logSearch
} from '../services/searchService'
import { wrapAsync } from '../utils/wrapAsync'

const router = Router()

// ✅ GET /api/search/creators?q=keyword
router.get(
  '/creators',
  authenticateToken,
  wrapAsync(async (req: Request, res: Response) => {
    const query = req.query.q as string
    const results = await searchCreators(query)
    res.json(results)
  })
)

// ✅ GET /api/search/campaigns?q=keyword
router.get(
  '/campaigns',
  authenticateToken,
  wrapAsync(async (req: Request, res: Response) => {
    const query = req.query.q as string
    const results = await searchCampaigns(query)
    res.json(results)
  })
)

// ✅ GET /api/search/suggestions?q=keyword (no auth required)
router.get(
  '/suggestions',
  wrapAsync(async (req: Request, res: Response) => {
    const query = req.query.q as string
    const suggestions = await searchSuggestions(query)
    res.json(suggestions)
  })
)

// ✅ POST /api/search/track
router.post(
  '/track',
  authenticateToken,
  wrapAsync(async (req: Request, res: Response) => {
    const user = (req as AuthRequest).user
    const { query } = req.body

    if (!query) {
      return res.status(400).json({ error: 'Query is required' })
    }

    await logSearch(user?.id || '', query)
    res.json({ success: true })
  })
)

export default router

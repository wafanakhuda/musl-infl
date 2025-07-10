// src/routes/conversationRoutes.ts

import { Router, Request, Response } from 'express'
import { authenticateToken } from '../middlewares/authMiddleware'
import { AuthRequest } from '../types/AuthRequest'
import {
  getUserConversations,
  createConversation,
  getConversationById
} from '../services/conversationService'

const router = Router()

// ✅ GET /api/conversations - get current user's conversations
router.get('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const user = (req as AuthRequest).user
  if (!user) {
   res.status(401).json({ error: 'Unauthorized' })
   return}

  try {
    const conversations = await getUserConversations(user.id)
    res.json(conversations)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// ✅ GET /api/conversations/:id - get single conversation
router.get('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const user = (req as AuthRequest).user
  if (!user) {
     res.status(401).json({ error: 'Unauthorized' })
  
  return}

  try {
    const conversation = await getConversationById(req.params.id, user.id)
    if (!conversation) {
       res.status(404).json({ error: 'Conversation not found' })
    return}

    res.json(conversation)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// ✅ POST /api/conversations - create a conversation
router.post('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const user = (req as AuthRequest).user
  if (!user) {
   res.status(401).json({ error: 'Unauthorized' })
  return}

  try {
    const { participantId, campaignId } = req.body
    const conversation = await createConversation(user.id, participantId, campaignId)
    res.status(201).json(conversation)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

export default router

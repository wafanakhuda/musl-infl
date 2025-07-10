// src/routes/messageRoutes.ts

import { Router, Request, Response } from 'express'
import { authenticateToken } from '../middlewares/authMiddleware'
import { AuthRequest } from '../types/AuthRequest'
import {
  sendMessage,
  getMessagesByConversationId
} from '../services/messageService'
import { wrapAsync } from '../utils/wrapAsync'

const router = Router()

// ✅ POST /api/messages/:conversationId
router.post(
  '/:conversationId',
  authenticateToken,
  wrapAsync(async (req: Request, res: Response) => {
    const user = (req as AuthRequest).user
    const { content } = req.body
    const { conversationId } = req.params

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (!content) {
      return res.status(400).json({ error: 'Message content is required' })
    }

    const message = await sendMessage(user.id, conversationId, content)
    res.status(201).json(message)
  })
)

// ✅ GET /api/messages/:conversationId
router.get(
  '/:conversationId',
  authenticateToken,
  wrapAsync(async (req: Request, res: Response) => {
    const user = (req as AuthRequest).user
    const { conversationId } = req.params

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const messages = await getMessagesByConversationId(conversationId, user.id)
    res.json(messages)
  })
)

export default router

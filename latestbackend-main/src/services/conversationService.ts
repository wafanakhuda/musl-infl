import prisma from '../lib/prisma'
import { Prisma } from '@prisma/client'

// ✅ Create a new conversation between two users for a campaign
export const createConversation = async (
  userId1: string,
  userId2: string,
  campaignId: string
) => {
  // Basic validation
  if (!userId1 || !userId2 || !campaignId) {
    throw new Error('Missing user or campaign ID')
  }

  if (userId1 === userId2) {
    throw new Error("You can't create a conversation with yourself.")
  }

  // Check if a conversation already exists between both users for this campaign
  const existing = await prisma.conversation.findFirst({
    where: {
      campaignId,
      participants: {
        some: { userId: userId1 },
      },
      AND: {
        participants: {
          some: { userId: userId2 },
        },
      },
    },
    include: {
      campaign: true,
      participants: {
        include: { user: true }
      },
      messages: {
        orderBy: { created_at: 'asc' },
        include: { sender: true }
      }
    },
  })

  if (existing) return existing

  // Create new conversation
  return await prisma.conversation.create({
    data: {
      campaignId,
      participants: {
        create: [
          { userId: userId1 },
          { userId: userId2 },
        ]
      }
    },
    include: {
      campaign: true,
      participants: {
        include: { user: true }
      },
      messages: {
        orderBy: { created_at: 'asc' },
        include: { sender: true }
      }
    }
  })
}

// ✅ Get all conversations for a specific user
export const getUserConversations = async (userId: string) => {
  if (!userId) {
    throw new Error('User ID is required')
  }

  return await prisma.conversation.findMany({
    where: {
      participants: {
        some: { userId }
      }
    },
    include: {
      campaign: true,
      participants: {
        include: {
          user: true
        }
      },
      messages: {
        orderBy: { created_at: 'desc' },
        take: 1
      }
    },
    orderBy: { updated_at: 'desc' }
  })
}

// ✅ Get a single conversation by ID (with participant access control)
export const getConversationById = async (id: string, userId: string) => {
  if (!id || !userId) {
    throw new Error('Missing conversation ID or user ID')
  }

  const result = await prisma.conversation.findUnique({
    where: { id },
    include: {
      campaign: true,
      participants: {
        include: { user: true }
      },
      messages: {
        orderBy: { created_at: 'asc' },
        include: { sender: true }
      }
    }
  }) as Prisma.ConversationGetPayload<{
    include: {
      campaign: true
      participants: {
        include: { user: true }
      }
      messages: {
        orderBy: { created_at: 'asc' }
        include: { sender: true }
      }
    }
  }> | null

  if (!result) throw new Error('Conversation not found')

  const isParticipant = result.participants.some(p => p.userId === userId)
  if (!isParticipant) throw new Error('Access denied: not a participant')

  return result
}

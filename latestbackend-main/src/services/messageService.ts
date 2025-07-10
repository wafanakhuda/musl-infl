// src/services/messageService.ts
import prisma from '../lib/prisma'

export const sendMessage = async (
  senderId: string,
  conversationId: string,
  content: string
) => {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { participants: true },
  })

  if (!conversation) throw new Error('Conversation not found')

  const isParticipant = conversation.participants.some(
    (p) => p.userId === senderId
  )
  if (!isParticipant) throw new Error('User not a participant in this conversation')

  const message = await prisma.message.create({
    data: {
      content,
      senderId: senderId,
      conversationId: conversationId,
    },
    include: {
      sender: true,
    },
  })

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updated_at: new Date() },
  })

  return message
}

export const getMessagesByConversationId = async (
  conversationId: string,
  userId: string
) => {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { participants: true },
  })

  if (!conversation) throw new Error('Conversation not found')

  const isParticipant = conversation.participants.some(
    (p) => p.userId === userId
  )
  if (!isParticipant) throw new Error('Access denied')

  return prisma.message.findMany({
    where: { conversationId: conversationId },
    orderBy: { created_at: 'asc' },
    include: {
      sender: true,
    },
  })
}

export const saveMessage = async (
  conversationId: string,
  senderId: string,
  content: string
) => {
  return await prisma.message.create({
    data: {
      conversationId: conversationId,
      senderId: senderId,
      content,
    },
    include: {
      sender: true,
    },
  })
}

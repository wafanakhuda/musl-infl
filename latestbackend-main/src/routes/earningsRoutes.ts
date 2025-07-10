// src/services/earningsService.ts
import prisma from '../lib/prisma'

export const getCreatorEarnings = async (creatorId: string) => {
  return await prisma.transaction.aggregate({
    where: {
      creatorId,
      status: 'succeeded',
    },
    _sum: {
      amount: true,
    },
  })
}

export const getRecentEarnings = async (creatorId: string) => {
  return await prisma.transaction.findMany({
    where: {
      creatorId,
      status: 'succeeded',
    },
    orderBy: { created_at: 'desc' },
    take: 10,
  })
}

export const getTransactionsByUser = async (creatorId: string) => {
  return await prisma.transaction.findMany({
    where: {
      creatorId,
    },
    orderBy: {
      created_at: 'desc',
    },
  })
} 

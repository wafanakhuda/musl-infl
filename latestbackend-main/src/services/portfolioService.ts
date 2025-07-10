import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Get all portfolio items by creatorId
export async function getUserPortfolio(creatorId: string) {
  return prisma.portfolioItem.findMany({
    where: { creatorId },
    orderBy: { created_at: 'desc' },
  })
}

// Add a new portfolio item
export async function addPortfolioItem(
  creatorId: string,
  data: { title: string; description?: string; mediaUrl: string }
) {
  return prisma.portfolioItem.create({
    data: {
      creatorId,
      title: data.title,
      description: data.description || '',
      mediaUrl: data.mediaUrl,
    },
  })
}

// Update a portfolio item
export async function updatePortfolioItem(
  id: string,
  data: { title: string; description?: string; mediaUrl: string },
  creatorId: string
) {
  const existing = await prisma.portfolioItem.findUnique({ where: { id } })
  if (!existing || existing.creatorId !== creatorId) {
    throw new Error('Unauthorized or not found')
  }

  return prisma.portfolioItem.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description || '',
      mediaUrl: data.mediaUrl,
    },
  })
}

// Delete a portfolio item
export async function deletePortfolioItem(id: string, creatorId: string) {
  const existing = await prisma.portfolioItem.findUnique({ where: { id } })
  if (!existing || existing.creatorId !== creatorId) {
    throw new Error('Unauthorized or not found')
  }

  return prisma.portfolioItem.delete({ where: { id } })
}

// Get a single item with auth check
export async function getPortfolioItemById(id: string, creatorId: string) {
  const item = await prisma.portfolioItem.findUnique({ where: { id } })
  if (!item || item.creatorId !== creatorId) {
    throw new Error('Unauthorized or not found')
  }
  return item
}

// Get all items for a creator (public or private use)
export async function getPortfolioItemsByUserId(creatorId: string) {
  return prisma.portfolioItem.findMany({
    where: { creatorId },
    orderBy: { created_at: 'desc' },
  })
}

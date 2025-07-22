"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPortfolio = getUserPortfolio;
exports.addPortfolioItem = addPortfolioItem;
exports.updatePortfolioItem = updatePortfolioItem;
exports.deletePortfolioItem = deletePortfolioItem;
exports.getPortfolioItemById = getPortfolioItemById;
exports.getPortfolioItemsByUserId = getPortfolioItemsByUserId;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function getUserPortfolio(creatorId) {
    return prisma.portfolioItem.findMany({
        where: { creatorId },
        orderBy: { created_at: 'desc' },
    });
}
async function addPortfolioItem(creatorId, data) {
    return prisma.portfolioItem.create({
        data: {
            creatorId,
            title: data.title,
            description: data.description || '',
            mediaUrl: data.mediaUrl,
        },
    });
}
async function updatePortfolioItem(id, data, creatorId) {
    const existing = await prisma.portfolioItem.findUnique({ where: { id } });
    if (!existing || existing.creatorId !== creatorId) {
        throw new Error('Unauthorized or not found');
    }
    return prisma.portfolioItem.update({
        where: { id },
        data: {
            title: data.title,
            description: data.description || '',
            mediaUrl: data.mediaUrl,
        },
    });
}
async function deletePortfolioItem(id, creatorId) {
    const existing = await prisma.portfolioItem.findUnique({ where: { id } });
    if (!existing || existing.creatorId !== creatorId) {
        throw new Error('Unauthorized or not found');
    }
    return prisma.portfolioItem.delete({ where: { id } });
}
async function getPortfolioItemById(id, creatorId) {
    const item = await prisma.portfolioItem.findUnique({ where: { id } });
    if (!item || item.creatorId !== creatorId) {
        throw new Error('Unauthorized or not found');
    }
    return item;
}
async function getPortfolioItemsByUserId(creatorId) {
    return prisma.portfolioItem.findMany({
        where: { creatorId },
        orderBy: { created_at: 'desc' },
    });
}

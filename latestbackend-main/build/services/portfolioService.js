"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPortfolio = getUserPortfolio;
exports.addPortfolioItem = addPortfolioItem;
exports.updatePortfolioItem = updatePortfolioItem;
exports.deletePortfolioItem = deletePortfolioItem;
exports.getPortfolioItemById = getPortfolioItemById;
exports.getPortfolioItemsByUserId = getPortfolioItemsByUserId;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get all portfolio items by creatorId
function getUserPortfolio(creatorId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.portfolioItem.findMany({
            where: { creatorId },
            orderBy: { created_at: 'desc' },
        });
    });
}
// Add a new portfolio item
function addPortfolioItem(creatorId, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.portfolioItem.create({
            data: {
                creatorId,
                title: data.title,
                description: data.description || '',
                mediaUrl: data.mediaUrl,
            },
        });
    });
}
// Update a portfolio item
function updatePortfolioItem(id, data, creatorId) {
    return __awaiter(this, void 0, void 0, function* () {
        const existing = yield prisma.portfolioItem.findUnique({ where: { id } });
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
    });
}
// Delete a portfolio item
function deletePortfolioItem(id, creatorId) {
    return __awaiter(this, void 0, void 0, function* () {
        const existing = yield prisma.portfolioItem.findUnique({ where: { id } });
        if (!existing || existing.creatorId !== creatorId) {
            throw new Error('Unauthorized or not found');
        }
        return prisma.portfolioItem.delete({ where: { id } });
    });
}
// Get a single item with auth check
function getPortfolioItemById(id, creatorId) {
    return __awaiter(this, void 0, void 0, function* () {
        const item = yield prisma.portfolioItem.findUnique({ where: { id } });
        if (!item || item.creatorId !== creatorId) {
            throw new Error('Unauthorized or not found');
        }
        return item;
    });
}
// Get all items for a creator (public or private use)
function getPortfolioItemsByUserId(creatorId) {
    return __awaiter(this, void 0, void 0, function* () {
        return prisma.portfolioItem.findMany({
            where: { creatorId },
            orderBy: { created_at: 'desc' },
        });
    });
}

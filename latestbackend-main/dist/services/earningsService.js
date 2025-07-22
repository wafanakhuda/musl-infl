"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentEarnings = exports.getCampaignEarnings = exports.getCreatorEarnings = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getCreatorEarnings = async (creatorId) => {
    return await prisma_1.default.transaction.aggregate({
        where: {
            creatorId,
            status: 'succeeded',
        },
        _sum: {
            amount: true,
        },
    });
};
exports.getCreatorEarnings = getCreatorEarnings;
const getCampaignEarnings = async (campaignId) => {
    return null;
};
exports.getCampaignEarnings = getCampaignEarnings;
const getRecentEarnings = async (creatorId) => {
    return await prisma_1.default.transaction.findMany({
        where: {
            creatorId,
            status: 'succeeded',
        },
        orderBy: { created_at: 'desc' },
        take: 10,
    });
};
exports.getRecentEarnings = getRecentEarnings;

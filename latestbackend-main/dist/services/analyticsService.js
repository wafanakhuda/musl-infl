"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlatformStats = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getPlatformStats = async () => {
    const totalUsers = await prisma_1.default.user.count();
    const totalCreators = await prisma_1.default.user.count({ where: { user_type: 'creator' } });
    const totalBrands = await prisma_1.default.user.count({ where: { user_type: 'brand' } });
    const totalCampaigns = await prisma_1.default.campaign.count();
    const totalRevenue = await prisma_1.default.transaction.aggregate({
        where: { status: 'succeeded' },
        _sum: { amount: true },
    });
    return {
        users: {
            total: totalUsers,
            creators: totalCreators,
            brands: totalBrands,
        },
        campaigns: {
            total: totalCampaigns,
            active: null,
            completed: null,
        },
        revenue: {
            total: totalRevenue._sum.amount ?? 0,
        },
    };
};
exports.getPlatformStats = getPlatformStats;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredCreators = getFilteredCreators;
const prisma_1 = __importDefault(require("../lib/prisma"));
async function getFilteredCreators(query) {
    const { search, niche, platform, min_followers, max_followers, min_price, max_price, } = query;
    const whereCondition = {
        user_type: "creator",
        ...(niche && { niche: { contains: niche, mode: "insensitive" } }),
        ...(platform && { platforms: { has: platform } }),
        ...(min_followers && { followers: { gte: parseInt(min_followers) } }),
        ...(max_followers && { followers: { lte: parseInt(max_followers) } }),
        ...(min_price && { price_min: { gte: parseInt(min_price) } }),
        ...(max_price && { price_max: { lte: parseInt(max_price) } }),
    };
    if (search && search.trim()) {
        whereCondition.OR = [
            { full_name: { contains: search, mode: "insensitive" } },
            { bio: { contains: search, mode: "insensitive" } },
            { niche: { contains: search, mode: "insensitive" } },
            { platforms: { has: search } },
        ];
    }
    const creators = await prisma_1.default.user.findMany({
        where: whereCondition,
        select: {
            id: true,
            full_name: true,
            avatar_url: true,
            bio: true,
            niche: true,
            platforms: true,
            price_min: true,
            price_max: true,
            followers: true,
            engagement: true,
            _count: {
                select: {
                    campaigns: true,
                    createdCampaignApplications: true,
                },
            },
        }
    });
    return creators;
}

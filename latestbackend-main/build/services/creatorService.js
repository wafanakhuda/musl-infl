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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilteredCreators = getFilteredCreators;
// src/services/creatorService.ts
const prisma_1 = __importDefault(require("../lib/prisma"));
function getFilteredCreators(query) {
    return __awaiter(this, void 0, void 0, function* () {
        const { niche, platform, min_followers, max_followers, min_price, max_price, } = query;
        const creators = yield prisma_1.default.user.findMany({
            where: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ user_type: "creator" }, (niche && { niche: { contains: niche, mode: "insensitive" } })), (platform && { platforms: { has: platform } })), (min_followers && { followers: { gte: parseInt(min_followers) } })), (max_followers && { followers: { lte: parseInt(max_followers) } })), (min_price && { price_min: { gte: parseInt(min_price) } })), (max_price && { price_max: { lte: parseInt(max_price) } })),
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
                        createdCampaignApplications: true, // ✅ this replaces `applications`
                    },
                },
            }
        });
        return creators;
    });
}

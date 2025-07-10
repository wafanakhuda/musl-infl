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
exports.searchBrands = exports.searchCreators = exports.logSearch = exports.searchSuggestions = exports.searchCampaigns = void 0;
// src/services/searchService.ts
const prisma_1 = __importDefault(require("../lib/prisma"));
const searchCampaigns = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.campaign.findMany({
        where: {
            OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { niche: { has: query } },
                { platforms: { has: query } },
            ],
        },
    });
});
exports.searchCampaigns = searchCampaigns;
const searchSuggestions = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const campaigns = yield prisma_1.default.campaign.findMany({
        where: {
            OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { niche: { has: query } },
                { platforms: { has: query } },
            ],
        },
        select: {
            title: true,
            description: true,
            niche: true,
            platforms: true,
        },
    });
    return [...new Set(campaigns.flatMap((t) => {
            var _a, _b;
            return [
                ...((_a = t.niche) !== null && _a !== void 0 ? _a : []),
                ...((_b = t.platforms) !== null && _b !== void 0 ? _b : []),
                t.title,
                t.description,
            ];
        }))];
});
exports.searchSuggestions = searchSuggestions;
const logSearch = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.searchLog.create({
        data: {
            userId,
            query,
            timestamp: new Date(),
        },
    });
});
exports.logSearch = logSearch;
const searchCreators = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.user.findMany({
        where: {
            user_type: 'creator',
            OR: [
                { full_name: { contains: query, mode: 'insensitive' } },
                { bio: { contains: query, mode: 'insensitive' } },
                { niche: { contains: query, mode: 'insensitive' } },
                { platforms: { has: query } },
            ],
        },
        select: {
            id: true,
            full_name: true,
            avatar_url: true,
            bio: true,
            niche: true,
            platforms: true,
            followers: true,
            price_min: true,
            price_max: true,
        },
    });
});
exports.searchCreators = searchCreators;
const searchBrands = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.user.findMany({
        where: {
            user_type: 'brand',
            OR: [
                { full_name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
            ],
        },
        select: {
            id: true,
            full_name: true,
            avatar_url: true,
            email: true,
        },
    });
});
exports.searchBrands = searchBrands;

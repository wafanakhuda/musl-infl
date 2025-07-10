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
exports.applyToCampaign = exports.deleteCampaign = exports.updateCampaign = exports.createCampaign = exports.getCampaignById = exports.getAllCampaigns = void 0;
// src/services/campaignService.ts
const prisma_1 = __importDefault(require("../lib/prisma"));
const getAllCampaigns = (creatorId, limit) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.campaign.findMany({
        where: creatorId
            ? {
                applications: {
                    some: {
                        creatorId,
                    },
                },
            }
            : undefined,
        take: limit,
        include: {
            brand: {
                select: {
                    id: true,
                    full_name: true,
                    avatar_url: true,
                    email: true,
                },
            },
        },
        orderBy: { created_at: 'desc' },
    });
});
exports.getAllCampaigns = getAllCampaigns;
const getCampaignById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.campaign.findUnique({
        where: { id },
        include: {
            brand: {
                select: {
                    id: true,
                    full_name: true,
                    avatar_url: true,
                    email: true,
                },
            },
        },
    });
});
exports.getCampaignById = getCampaignById;
const createCampaign = (brandId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const estimatedReach = 1000 +
        (data.followers_min || 0) * 5 +
        (data.influencers_needed || 1) * 100 +
        Math.floor(Math.random() * 1000);
    return prisma_1.default.campaign.create({
        data: {
            title: data.title,
            description: data.description,
            category: data.category || '',
            campaign_type: data.campaign_type,
            deliverables: data.deliverables,
            budget_min: data.budget_min,
            budget_max: data.budget_max,
            deadline: new Date(data.deadline),
            start_date: data.start_date ? new Date(data.start_date) : undefined,
            end_date: data.end_date ? new Date(data.end_date) : undefined,
            gender: Array.isArray(data.gender) ? data.gender : data.gender ? [data.gender] : [],
            age_range: data.age_range,
            language: Array.isArray(data.language) ? data.language : data.language ? [data.language] : [],
            country: Array.isArray(data.country) ? data.country : data.country ? [data.country] : [],
            city: Array.isArray(data.city) ? data.city : data.city ? [data.city] : [],
            niche: Array.isArray(data.niche) ? data.niche : data.niche ? [data.niche] : [],
            platforms: Array.isArray(data.platform) ? data.platform : data.platform ? [data.platform] : [],
            followers_min: data.followers_min,
            followers_max: data.followers_max,
            influencers_needed: data.influencers_needed,
            requirements: data.requirements || '',
            target_audience: data.target_audience || [],
            estimated_reach: estimatedReach,
            brandId,
        },
    });
});
exports.createCampaign = createCampaign;
const updateCampaign = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.campaign.update({
        where: { id },
        data: {
            title: data.title,
            description: data.description,
            category: data.category,
            campaign_type: data.campaign_type,
            deliverables: data.deliverables,
            budget_min: data.budget_min,
            budget_max: data.budget_max,
            deadline: data.deadline ? new Date(data.deadline) : undefined,
            start_date: data.start_date ? new Date(data.start_date) : undefined,
            end_date: data.end_date ? new Date(data.end_date) : undefined,
            gender: Array.isArray(data.gender) ? data.gender : data.gender ? [data.gender] : [],
            age_range: data.age_range,
            language: Array.isArray(data.language) ? data.language : data.language ? [data.language] : [],
            country: Array.isArray(data.country) ? data.country : data.country ? [data.country] : [],
            city: Array.isArray(data.city) ? data.city : data.city ? [data.city] : [],
            niche: Array.isArray(data.niche) ? data.niche : data.niche ? [data.niche] : [],
            platforms: Array.isArray(data.platform) ? data.platform : data.platform ? [data.platform] : [],
            followers_min: data.followers_min,
            followers_max: data.followers_max,
            influencers_needed: data.influencers_needed,
            requirements: data.requirements,
            target_audience: data.target_audience,
        },
    });
});
exports.updateCampaign = updateCampaign;
const deleteCampaign = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.campaign.delete({
        where: { id },
    });
});
exports.deleteCampaign = deleteCampaign;
const applyToCampaign = (campaignId, userId, creatorId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.campaignApplication.create({
        data: {
            campaignId,
            userId,
            creatorId,
            applied_at: new Date(),
        },
    });
});
exports.applyToCampaign = applyToCampaign;

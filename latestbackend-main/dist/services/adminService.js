"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moderateCampaign = exports.moderateUser = exports.getAllCampaigns = exports.getAllUsers = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getAllUsers = async () => {
    return await prisma_1.default.user.findMany();
};
exports.getAllUsers = getAllUsers;
const getAllCampaigns = async () => {
    return await prisma_1.default.campaign.findMany({
        include: { brand: true },
    });
};
exports.getAllCampaigns = getAllCampaigns;
const moderateUser = async (userId, action) => {
    let isActive;
    switch (action) {
        case 'approve':
            isActive = true;
            break;
        case 'ban':
        case 'reject':
            isActive = false;
            break;
        default:
            throw new Error('Invalid user moderation action');
    }
    return await prisma_1.default.user.update({
        where: { id: userId },
        data: {
            is_active: isActive,
        },
    });
};
exports.moderateUser = moderateUser;
const moderateCampaign = async (campaignId, action) => {
    if (!['approve', 'ban', 'reject'].includes(action)) {
        throw new Error('Invalid campaign moderation action');
    }
    const isActive = action === 'approve';
    return await prisma_1.default.campaign.update({
        where: { id: campaignId },
        data: {},
    });
};
exports.moderateCampaign = moderateCampaign;

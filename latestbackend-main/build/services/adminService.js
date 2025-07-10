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
exports.moderateCampaign = exports.moderateUser = exports.getAllCampaigns = exports.getAllUsers = void 0;
// src/services/adminService.ts
const prisma_1 = __importDefault(require("../lib/prisma"));
// Get all users (admin view)
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.user.findMany();
});
exports.getAllUsers = getAllUsers;
// Get all campaigns with brand details
const getAllCampaigns = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.campaign.findMany({
        include: { brand: true },
    });
});
exports.getAllCampaigns = getAllCampaigns;
// Moderate user (approve = active, ban/reject = inactive)
const moderateUser = (userId, action) => __awaiter(void 0, void 0, void 0, function* () {
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
    return yield prisma_1.default.user.update({
        where: { id: userId },
        data: {
            is_active: isActive,
        },
    });
});
exports.moderateUser = moderateUser;
// Moderate campaign (approve, ban, reject)
const moderateCampaign = (campaignId, action) => __awaiter(void 0, void 0, void 0, function* () {
    // Since the schema does NOT have `moderation_status`, we skip it
    if (!['approve', 'ban', 'reject'].includes(action)) {
        throw new Error('Invalid campaign moderation action');
    }
    const isActive = action === 'approve';
    return yield prisma_1.default.campaign.update({
        where: { id: campaignId },
        data: {
        // You can implement status logic if schema supports it
        // Otherwise, no-op or soft delete by brand
        },
    });
});
exports.moderateCampaign = moderateCampaign;

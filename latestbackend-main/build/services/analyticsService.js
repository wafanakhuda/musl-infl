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
exports.getPlatformStats = void 0;
// src/services/analyticsService.ts
const prisma_1 = __importDefault(require("../lib/prisma"));
const getPlatformStats = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const totalUsers = yield prisma_1.default.user.count();
    const totalCreators = yield prisma_1.default.user.count({ where: { user_type: 'creator' } });
    const totalBrands = yield prisma_1.default.user.count({ where: { user_type: 'brand' } });
    const totalCampaigns = yield prisma_1.default.campaign.count();
    // Since 'status' does not exist in Campaign schema, skip active/completed
    const totalRevenue = yield prisma_1.default.transaction.aggregate({
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
            active: null, // Not tracked in schema
            completed: null, // Not tracked in schema
        },
        revenue: {
            total: (_a = totalRevenue._sum.amount) !== null && _a !== void 0 ? _a : 0,
        },
    };
});
exports.getPlatformStats = getPlatformStats;

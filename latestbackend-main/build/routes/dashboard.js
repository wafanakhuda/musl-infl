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
// src/routes/dashboard.ts
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const prisma_1 = __importDefault(require("../lib/prisma"));
const dayjs_1 = __importDefault(require("dayjs"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const router = (0, express_1.Router)();
// GET /api/dashboard/stats
router.get("/stats", authMiddleware_1.authenticateToken, (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const dbUser = yield prisma_1.default.user.findUnique({
        where: { id: user.id },
        include: {
            createdCampaignApplications: { include: { campaign: true } },
            messages: true,
            transactions: true,
            campaigns: true,
        },
    });
    if (!dbUser) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    if (user.user_type === "creator") {
        const totalEarnings = dbUser.transactions.reduce((sum, txn) => sum + Number(txn.amount), 0);
        const pendingApplications = dbUser.createdCampaignApplications.filter(a => a.status === "pending").length;
        const totalApplications = dbUser.createdCampaignApplications.length;
        const completedApplications = dbUser.createdCampaignApplications.filter(a => a.status === "completed").length;
        const completionRate = totalApplications === 0 ? 0 : Math.round((completedApplications / totalApplications) * 100);
        res.json({
            userType: "creator",
            total_earnings: totalEarnings,
            active_campaigns: totalApplications,
            profile_views: 0,
            unread_messages: dbUser.messages.length,
            completion_rate: completionRate,
            rating: 0,
            total_reviews: 0,
            pending_applications: pendingApplications,
            appliedCampaigns: dbUser.createdCampaignApplications.map(a => a.campaign),
        });
        return;
    }
    if (user.user_type === "brand") {
        res.json({
            userType: "brand",
            campaignsCount: dbUser.campaigns.length,
            messagesCount: dbUser.messages.length,
            transactionsCount: dbUser.transactions.length,
            campaigns: dbUser.campaigns,
        });
        return;
    }
    res.status(400).json({ error: "Invalid user type" });
})));
// GET /api/dashboard/earnings (creator only)
router.get("/earnings", authMiddleware_1.authenticateToken, (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    if (!user || user.user_type !== "creator") {
        res.status(403).json({ error: "Only creators can access earnings" });
        return;
    }
    const sixMonthsAgo = (0, dayjs_1.default)().subtract(5, "month").startOf("month").toDate();
    const transactions = yield prisma_1.default.transaction.findMany({
        where: {
            creatorId: user.id,
            created_at: { gte: sixMonthsAgo },
        },
        select: { amount: true, created_at: true },
    });
    const earningsByMonth = {};
    for (const txn of transactions) {
        const month = (0, dayjs_1.default)(txn.created_at).format("MMM");
        earningsByMonth[month] = (earningsByMonth[month] || 0) + Number(txn.amount);
    }
    const months = Array.from({ length: 6 }).map((_, i) => (0, dayjs_1.default)().subtract(5 - i, "month").format("MMM"));
    const earnings = months.map(month => ({
        month,
        amount: earningsByMonth[month] || 0,
    }));
    res.json(earnings);
})));
// GET /api/stats/platform
router.get("/platform", (0, express_async_handler_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const totalCreators = yield prisma_1.default.user.count({
        where: { user_type: "creator" },
    });
    const totalBrands = yield prisma_1.default.user.count({
        where: { user_type: "brand" },
    });
    const totalCampaigns = yield prisma_1.default.campaign.count();
    const totalEarnings = yield prisma_1.default.transaction.aggregate({
        _sum: { amount: true },
    });
    res.json({
        total_creators: totalCreators,
        total_brands: totalBrands,
        total_campaigns: totalCampaigns,
        total_earnings: totalEarnings._sum.amount || 0,
    });
})));
exports.default = router;

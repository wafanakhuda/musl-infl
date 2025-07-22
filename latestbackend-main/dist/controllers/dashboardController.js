"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEarningsData = exports.getDashboardStats = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const dayjs_1 = __importDefault(require("dayjs"));
const getDashboardStats = async (req, res) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const userType = user.user_type;
    const userId = user.id;
    const dbUser = await prisma_1.default.user.findUnique({
        where: { id: userId },
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
    if (userType === "creator") {
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
    if (userType === "brand") {
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
};
exports.getDashboardStats = getDashboardStats;
const getEarningsData = async (req, res) => {
    const user = req.user;
    if (!user || user.user_type !== "creator") {
        res.status(403).json({ error: "Only creators can access earnings" });
        return;
    }
    const sixMonthsAgo = (0, dayjs_1.default)().subtract(5, "month").startOf("month").toDate();
    const transactions = await prisma_1.default.transaction.findMany({
        where: {
            creatorId: user.id,
            created_at: { gte: sixMonthsAgo },
        },
        select: {
            amount: true,
            created_at: true,
        },
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
};
exports.getEarningsData = getEarningsData;

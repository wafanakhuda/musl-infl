"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const adminService_1 = require("../services/adminService");
const wrapAsync_1 = require("../utils/wrapAsync");
const router = (0, express_1.Router)();
router.get('/users', authMiddleware_1.authenticateToken, (0, wrapAsync_1.wrapAsync)(async (req, res) => {
    if (!(0, authMiddleware_1.isAuthenticated)(req) || req.user?.user_type !== 'admin') {
        return res.status(403).json({ error: 'Admin access only' });
    }
    const users = await (0, adminService_1.getAllUsers)();
    res.json(users);
}));
router.get('/campaigns', authMiddleware_1.authenticateToken, (0, wrapAsync_1.wrapAsync)(async (req, res) => {
    if (!(0, authMiddleware_1.isAuthenticated)(req) || req.user?.user_type !== 'admin') {
        return res.status(403).json({ error: 'Admin access only' });
    }
    const campaigns = await (0, adminService_1.getAllCampaigns)();
    res.json(campaigns);
}));
router.post('/users/:id/moderate', authMiddleware_1.authenticateToken, (0, wrapAsync_1.wrapAsync)(async (req, res) => {
    if (!(0, authMiddleware_1.isAuthenticated)(req) || req.user?.user_type !== 'admin') {
        return res.status(403).json({ error: 'Admin access only' });
    }
    const { action } = req.body;
    const updatedUser = await (0, adminService_1.moderateUser)(req.params.id, action);
    res.json(updatedUser);
}));
router.post('/campaigns/:id/moderate', authMiddleware_1.authenticateToken, (0, wrapAsync_1.wrapAsync)(async (req, res) => {
    if (!(0, authMiddleware_1.isAuthenticated)(req) || req.user?.user_type !== 'admin') {
        return res.status(403).json({ error: 'Admin access only' });
    }
    const { action } = req.body;
    const updatedCampaign = await (0, adminService_1.moderateCampaign)(req.params.id, action);
    res.json(updatedCampaign);
}));
exports.default = router;

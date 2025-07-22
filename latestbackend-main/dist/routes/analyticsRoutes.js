"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const analyticsService_1 = require("../services/analyticsService");
const wrapAsync_1 = require("../utils/wrapAsync");
const authMiddleware_2 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.authenticateToken, (0, wrapAsync_1.wrapAsync)(async (req, res) => {
    if (!(0, authMiddleware_2.isAuthenticated)(req)) {
        return res.status(403).json({ error: "Admin access only" });
    }
    const user = req.user;
    if (user.user_type !== "admin") {
        return res.status(403).json({ error: "Admin access only" });
    }
    const stats = await (0, analyticsService_1.getPlatformStats)();
    res.json(stats);
}));
exports.default = router;

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
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/analyticsRoutes.ts
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const analyticsService_1 = require("../services/analyticsService");
const wrapAsync_1 = require("../utils/wrapAsync");
const authMiddleware_2 = require("../middlewares/authMiddleware"); // ✅ correct import
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.authenticateToken, (0, wrapAsync_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, authMiddleware_2.isAuthenticated)(req)) {
        return res.status(403).json({ error: "Admin access only" });
    }
    const user = req.user; // or use: const user = (req as AuthRequest).user;
    if (user.user_type !== "admin") {
        return res.status(403).json({ error: "Admin access only" });
    }
    const stats = yield (0, analyticsService_1.getPlatformStats)();
    res.json(stats);
})));
exports.default = router;

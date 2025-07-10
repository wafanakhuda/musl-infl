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
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const adminService_1 = require("../services/adminService");
const wrapAsync_1 = require("../utils/wrapAsync");
const router = (0, express_1.Router)();
router.get('/users', authMiddleware_1.authenticateToken, (0, wrapAsync_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!(0, authMiddleware_1.isAuthenticated)(req) || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.user_type) !== 'admin') {
        return res.status(403).json({ error: 'Admin access only' });
    }
    const users = yield (0, adminService_1.getAllUsers)();
    res.json(users);
})));
router.get('/campaigns', authMiddleware_1.authenticateToken, (0, wrapAsync_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!(0, authMiddleware_1.isAuthenticated)(req) || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.user_type) !== 'admin') {
        return res.status(403).json({ error: 'Admin access only' });
    }
    const campaigns = yield (0, adminService_1.getAllCampaigns)();
    res.json(campaigns);
})));
router.post('/users/:id/moderate', authMiddleware_1.authenticateToken, (0, wrapAsync_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!(0, authMiddleware_1.isAuthenticated)(req) || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.user_type) !== 'admin') {
        return res.status(403).json({ error: 'Admin access only' });
    }
    const { action } = req.body;
    const updatedUser = yield (0, adminService_1.moderateUser)(req.params.id, action);
    res.json(updatedUser);
})));
router.post('/campaigns/:id/moderate', authMiddleware_1.authenticateToken, (0, wrapAsync_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!(0, authMiddleware_1.isAuthenticated)(req) || ((_a = req.user) === null || _a === void 0 ? void 0 : _a.user_type) !== 'admin') {
        return res.status(403).json({ error: 'Admin access only' });
    }
    const { action } = req.body;
    const updatedCampaign = yield (0, adminService_1.moderateCampaign)(req.params.id, action);
    res.json(updatedCampaign);
})));
exports.default = router;

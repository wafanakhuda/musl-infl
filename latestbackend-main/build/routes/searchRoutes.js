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
// src/routes/searchRoutes.ts
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const searchService_1 = require("../services/searchService");
const wrapAsync_1 = require("../utils/wrapAsync");
const router = (0, express_1.Router)();
// ✅ GET /api/search/creators?q=keyword
router.get('/creators', authMiddleware_1.authenticateToken, (0, wrapAsync_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.q;
    const results = yield (0, searchService_1.searchCreators)(query);
    res.json(results);
})));
// ✅ GET /api/search/campaigns?q=keyword
router.get('/campaigns', authMiddleware_1.authenticateToken, (0, wrapAsync_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.q;
    const results = yield (0, searchService_1.searchCampaigns)(query);
    res.json(results);
})));
// ✅ GET /api/search/suggestions?q=keyword (no auth required)
router.get('/suggestions', (0, wrapAsync_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.q;
    const suggestions = yield (0, searchService_1.searchSuggestions)(query);
    res.json(suggestions);
})));
// ✅ POST /api/search/track
router.post('/track', authMiddleware_1.authenticateToken, (0, wrapAsync_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { query } = req.body;
    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }
    yield (0, searchService_1.logSearch)((user === null || user === void 0 ? void 0 : user.id) || '', query);
    res.json({ success: true });
})));
exports.default = router;

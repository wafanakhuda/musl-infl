"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const searchService_1 = require("../services/searchService");
const wrapAsync_1 = require("../utils/wrapAsync");
const router = (0, express_1.Router)();
router.get('/creators', authMiddleware_1.authenticateToken, (0, wrapAsync_1.wrapAsync)(async (req, res) => {
    const query = req.query.q;
    const results = await (0, searchService_1.searchCreators)(query);
    res.json(results);
}));
router.get('/campaigns', authMiddleware_1.authenticateToken, (0, wrapAsync_1.wrapAsync)(async (req, res) => {
    const query = req.query.q;
    const results = await (0, searchService_1.searchCampaigns)(query);
    res.json(results);
}));
router.get('/suggestions', (0, wrapAsync_1.wrapAsync)(async (req, res) => {
    const query = req.query.q;
    const suggestions = await (0, searchService_1.searchSuggestions)(query);
    res.json(suggestions);
}));
router.post('/track', authMiddleware_1.authenticateToken, (0, wrapAsync_1.wrapAsync)(async (req, res) => {
    const user = req.user;
    const { query } = req.body;
    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }
    await (0, searchService_1.logSearch)(user?.id || '', query);
    res.json({ success: true });
}));
exports.default = router;

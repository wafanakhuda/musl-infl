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
const portfolioService_1 = require("../services/portfolioService");
const router = (0, express_1.Router)();
// ✅ GET /api/portfolio - Get current user's portfolio
router.get('/', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const items = yield (0, portfolioService_1.getUserPortfolio)(user.id);
        res.json(items);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
// ✅ POST /api/portfolio - Add new portfolio item
router.post('/', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const { title, description, mediaUrl } = req.body;
    if (!title || !mediaUrl) {
        res.status(400).json({ error: 'Title and mediaUrl are required' });
        return;
    }
    try {
        const newItem = yield (0, portfolioService_1.addPortfolioItem)(user.id, {
            title,
            description,
            mediaUrl // ✅ Correct field name for service
        });
        res.status(201).json(newItem);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}));
// ✅ PUT /api/portfolio/:id - Update portfolio item
router.put('/:id', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const { title, description, mediaUrl } = req.body;
    try {
        const updated = yield (0, portfolioService_1.updatePortfolioItem)(req.params.id, {
            title,
            description,
            mediaUrl // ✅ Correct field name for service
        }, user.id);
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}));
// ✅ DELETE /api/portfolio/:id - Delete portfolio item
router.delete('/:id', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        yield (0, portfolioService_1.deletePortfolioItem)(req.params.id, user.id);
        res.status(204).send();
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}));
exports.default = router;

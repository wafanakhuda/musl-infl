"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const portfolioService_1 = require("../services/portfolioService");
const router = (0, express_1.Router)();
router.get('/', authMiddleware_1.authenticateToken, async (req, res) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const items = await (0, portfolioService_1.getUserPortfolio)(user.id);
        res.json(items);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post('/', authMiddleware_1.authenticateToken, async (req, res) => {
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
        const newItem = await (0, portfolioService_1.addPortfolioItem)(user.id, {
            title,
            description,
            mediaUrl
        });
        res.status(201).json(newItem);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.put('/:id', authMiddleware_1.authenticateToken, async (req, res) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const { title, description, mediaUrl } = req.body;
    try {
        const updated = await (0, portfolioService_1.updatePortfolioItem)(req.params.id, {
            title,
            description,
            mediaUrl
        }, user.id);
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
router.delete('/:id', authMiddleware_1.authenticateToken, async (req, res) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        await (0, portfolioService_1.deletePortfolioItem)(req.params.id, user.id);
        res.status(204).send();
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.default = router;

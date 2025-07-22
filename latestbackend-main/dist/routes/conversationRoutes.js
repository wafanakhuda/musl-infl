"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const conversationService_1 = require("../services/conversationService");
const router = (0, express_1.Router)();
router.get('/', authMiddleware_1.authenticateToken, async (req, res) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const conversations = await (0, conversationService_1.getUserConversations)(user.id);
        res.json(conversations);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get('/:id', authMiddleware_1.authenticateToken, async (req, res) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const conversation = await (0, conversationService_1.getConversationById)(req.params.id, user.id);
        if (!conversation) {
            res.status(404).json({ error: 'Conversation not found' });
            return;
        }
        res.json(conversation);
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
    try {
        const { participantId, campaignId } = req.body;
        const conversation = await (0, conversationService_1.createConversation)(user.id, participantId, campaignId);
        res.status(201).json(conversation);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});
exports.default = router;

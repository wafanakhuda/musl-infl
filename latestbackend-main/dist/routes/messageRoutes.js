"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const messageService_1 = require("../services/messageService");
const wrapAsync_1 = require("../utils/wrapAsync");
const router = (0, express_1.Router)();
router.post('/:conversationId', authMiddleware_1.authenticateToken, (0, wrapAsync_1.wrapAsync)(async (req, res) => {
    const user = req.user;
    const { content } = req.body;
    const { conversationId } = req.params;
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!content) {
        return res.status(400).json({ error: 'Message content is required' });
    }
    const message = await (0, messageService_1.sendMessage)(user.id, conversationId, content);
    res.status(201).json(message);
}));
router.get('/:conversationId', authMiddleware_1.authenticateToken, (0, wrapAsync_1.wrapAsync)(async (req, res) => {
    const user = req.user;
    const { conversationId } = req.params;
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const messages = await (0, messageService_1.getMessagesByConversationId)(conversationId, user.id);
    res.json(messages);
}));
exports.default = router;

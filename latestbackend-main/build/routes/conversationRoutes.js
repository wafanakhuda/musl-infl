"use strict";
// src/routes/conversationRoutes.ts
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
const conversationService_1 = require("../services/conversationService");
const router = (0, express_1.Router)();
// ✅ GET /api/conversations - get current user's conversations
router.get('/', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const conversations = yield (0, conversationService_1.getUserConversations)(user.id);
        res.json(conversations);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
// ✅ GET /api/conversations/:id - get single conversation
router.get('/:id', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const conversation = yield (0, conversationService_1.getConversationById)(req.params.id, user.id);
        if (!conversation) {
            res.status(404).json({ error: 'Conversation not found' });
            return;
        }
        res.json(conversation);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
// ✅ POST /api/conversations - create a conversation
router.post('/', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const { participantId, campaignId } = req.body;
        const conversation = yield (0, conversationService_1.createConversation)(user.id, participantId, campaignId);
        res.status(201).json(conversation);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}));
exports.default = router;

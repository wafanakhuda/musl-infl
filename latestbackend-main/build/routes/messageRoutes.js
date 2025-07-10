"use strict";
// src/routes/messageRoutes.ts
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
const messageService_1 = require("../services/messageService");
const wrapAsync_1 = require("../utils/wrapAsync");
const router = (0, express_1.Router)();
// ✅ POST /api/messages/:conversationId
router.post('/:conversationId', authMiddleware_1.authenticateToken, (0, wrapAsync_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { content } = req.body;
    const { conversationId } = req.params;
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!content) {
        return res.status(400).json({ error: 'Message content is required' });
    }
    const message = yield (0, messageService_1.sendMessage)(user.id, conversationId, content);
    res.status(201).json(message);
})));
// ✅ GET /api/messages/:conversationId
router.get('/:conversationId', authMiddleware_1.authenticateToken, (0, wrapAsync_1.wrapAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { conversationId } = req.params;
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const messages = yield (0, messageService_1.getMessagesByConversationId)(conversationId, user.id);
    res.json(messages);
})));
exports.default = router;

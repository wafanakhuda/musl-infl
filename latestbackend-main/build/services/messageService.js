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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMessage = exports.getMessagesByConversationId = exports.sendMessage = void 0;
// src/services/messageService.ts
const prisma_1 = __importDefault(require("../lib/prisma"));
const sendMessage = (senderId, conversationId, content) => __awaiter(void 0, void 0, void 0, function* () {
    const conversation = yield prisma_1.default.conversation.findUnique({
        where: { id: conversationId },
        include: { participants: true },
    });
    if (!conversation)
        throw new Error('Conversation not found');
    const isParticipant = conversation.participants.some((p) => p.userId === senderId);
    if (!isParticipant)
        throw new Error('User not a participant in this conversation');
    const message = yield prisma_1.default.message.create({
        data: {
            content,
            senderId: senderId,
            conversationId: conversationId,
        },
        include: {
            sender: true,
        },
    });
    yield prisma_1.default.conversation.update({
        where: { id: conversationId },
        data: { updated_at: new Date() },
    });
    return message;
});
exports.sendMessage = sendMessage;
const getMessagesByConversationId = (conversationId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const conversation = yield prisma_1.default.conversation.findUnique({
        where: { id: conversationId },
        include: { participants: true },
    });
    if (!conversation)
        throw new Error('Conversation not found');
    const isParticipant = conversation.participants.some((p) => p.userId === userId);
    if (!isParticipant)
        throw new Error('Access denied');
    return prisma_1.default.message.findMany({
        where: { conversationId: conversationId },
        orderBy: { created_at: 'asc' },
        include: {
            sender: true,
        },
    });
});
exports.getMessagesByConversationId = getMessagesByConversationId;
const saveMessage = (conversationId, senderId, content) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.message.create({
        data: {
            conversationId: conversationId,
            senderId: senderId,
            content,
        },
        include: {
            sender: true,
        },
    });
});
exports.saveMessage = saveMessage;

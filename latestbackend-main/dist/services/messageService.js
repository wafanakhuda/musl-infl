"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMessage = exports.getMessagesByConversationId = exports.sendMessage = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const sendMessage = async (senderId, conversationId, content) => {
    const conversation = await prisma_1.default.conversation.findUnique({
        where: { id: conversationId },
        include: { participants: true },
    });
    if (!conversation)
        throw new Error('Conversation not found');
    const isParticipant = conversation.participants.some((p) => p.userId === senderId);
    if (!isParticipant)
        throw new Error('User not a participant in this conversation');
    const message = await prisma_1.default.message.create({
        data: {
            content,
            senderId: senderId,
            conversationId: conversationId,
        },
        include: {
            sender: true,
        },
    });
    await prisma_1.default.conversation.update({
        where: { id: conversationId },
        data: { updated_at: new Date() },
    });
    return message;
};
exports.sendMessage = sendMessage;
const getMessagesByConversationId = async (conversationId, userId) => {
    const conversation = await prisma_1.default.conversation.findUnique({
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
};
exports.getMessagesByConversationId = getMessagesByConversationId;
const saveMessage = async (conversationId, senderId, content) => {
    return await prisma_1.default.message.create({
        data: {
            conversationId: conversationId,
            senderId: senderId,
            content,
        },
        include: {
            sender: true,
        },
    });
};
exports.saveMessage = saveMessage;

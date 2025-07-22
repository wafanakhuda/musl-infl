"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversationById = exports.getUserConversations = exports.createConversation = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const createConversation = async (userId1, userId2, campaignId) => {
    if (!userId1 || !userId2 || !campaignId) {
        throw new Error('Missing user or campaign ID');
    }
    if (userId1 === userId2) {
        throw new Error("You can't create a conversation with yourself.");
    }
    const existing = await prisma_1.default.conversation.findFirst({
        where: {
            campaignId,
            participants: {
                some: { userId: userId1 },
            },
            AND: {
                participants: {
                    some: { userId: userId2 },
                },
            },
        },
        include: {
            campaign: true,
            participants: {
                include: { user: true }
            },
            messages: {
                orderBy: { created_at: 'asc' },
                include: { sender: true }
            }
        },
    });
    if (existing)
        return existing;
    return await prisma_1.default.conversation.create({
        data: {
            campaignId,
            participants: {
                create: [
                    { userId: userId1 },
                    { userId: userId2 },
                ]
            }
        },
        include: {
            campaign: true,
            participants: {
                include: { user: true }
            },
            messages: {
                orderBy: { created_at: 'asc' },
                include: { sender: true }
            }
        }
    });
};
exports.createConversation = createConversation;
const getUserConversations = async (userId) => {
    if (!userId) {
        throw new Error('User ID is required');
    }
    return await prisma_1.default.conversation.findMany({
        where: {
            participants: {
                some: { userId }
            }
        },
        include: {
            campaign: true,
            participants: {
                include: {
                    user: true
                }
            },
            messages: {
                orderBy: { created_at: 'desc' },
                take: 1
            }
        },
        orderBy: { updated_at: 'desc' }
    });
};
exports.getUserConversations = getUserConversations;
const getConversationById = async (id, userId) => {
    if (!id || !userId) {
        throw new Error('Missing conversation ID or user ID');
    }
    const result = await prisma_1.default.conversation.findUnique({
        where: { id },
        include: {
            campaign: true,
            participants: {
                include: { user: true }
            },
            messages: {
                orderBy: { created_at: 'asc' },
                include: { sender: true }
            }
        }
    });
    if (!result)
        throw new Error('Conversation not found');
    const isParticipant = result.participants.some(p => p.userId === userId);
    if (!isParticipant)
        throw new Error('Access denied: not a participant');
    return result;
};
exports.getConversationById = getConversationById;

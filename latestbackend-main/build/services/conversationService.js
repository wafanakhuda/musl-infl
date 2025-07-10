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
exports.getConversationById = exports.getUserConversations = exports.createConversation = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
// ✅ Create a new conversation between two users for a campaign
const createConversation = (userId1, userId2, campaignId) => __awaiter(void 0, void 0, void 0, function* () {
    // Basic validation
    if (!userId1 || !userId2 || !campaignId) {
        throw new Error('Missing user or campaign ID');
    }
    if (userId1 === userId2) {
        throw new Error("You can't create a conversation with yourself.");
    }
    // Check if a conversation already exists between both users for this campaign
    const existing = yield prisma_1.default.conversation.findFirst({
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
    // Create new conversation
    return yield prisma_1.default.conversation.create({
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
});
exports.createConversation = createConversation;
// ✅ Get all conversations for a specific user
const getUserConversations = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new Error('User ID is required');
    }
    return yield prisma_1.default.conversation.findMany({
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
});
exports.getUserConversations = getUserConversations;
// ✅ Get a single conversation by ID (with participant access control)
const getConversationById = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id || !userId) {
        throw new Error('Missing conversation ID or user ID');
    }
    const result = yield prisma_1.default.conversation.findUnique({
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
});
exports.getConversationById = getConversationById;

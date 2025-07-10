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
exports.getTransactionsByUser = exports.getRecentEarnings = exports.getCreatorEarnings = void 0;
// src/services/earningsService.ts
const prisma_1 = __importDefault(require("../lib/prisma"));
const getCreatorEarnings = (creatorId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.transaction.aggregate({
        where: {
            creatorId,
            status: 'succeeded',
        },
        _sum: {
            amount: true,
        },
    });
});
exports.getCreatorEarnings = getCreatorEarnings;
const getRecentEarnings = (creatorId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.transaction.findMany({
        where: {
            creatorId,
            status: 'succeeded',
        },
        orderBy: { created_at: 'desc' },
        take: 10,
    });
});
exports.getRecentEarnings = getRecentEarnings;
const getTransactionsByUser = (creatorId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.transaction.findMany({
        where: {
            creatorId,
        },
        orderBy: {
            created_at: 'desc',
        },
    });
});
exports.getTransactionsByUser = getTransactionsByUser;

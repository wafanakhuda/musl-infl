"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = globalThis.prisma ?? new client_1.PrismaClient();
if (process.env.NODE_ENV !== 'production')
    globalThis.prisma = prisma;
exports.default = prisma;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.isAuthenticated = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await prisma_1.default.user.findUnique({
            where: { id: payload.id },
        });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        req.user = {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            user_type: user.user_type,
            avatar_url: user.avatar_url ?? null,
            verified: user.verified,
        };
        next();
    }
    catch (err) {
        res.status(403).json({ error: 'Invalid token' });
    }
};
exports.authenticateToken = authenticateToken;
const isAuthenticated = (req) => {
    const user = req.user;
    return (typeof user === 'object' &&
        user !== null &&
        typeof user.id === 'string' &&
        typeof user.user_type === 'string');
};
exports.isAuthenticated = isAuthenticated;
const isAdmin = (req) => {
    return req.user?.user_type === 'admin';
};
exports.isAdmin = isAdmin;

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
exports.isAdmin = exports.isAuthenticated = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../lib/prisma"));
/**
 * Middleware to authenticate JWT and attach user info to request
 */
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const authHeader = req.headers.authorization;
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield prisma_1.default.user.findUnique({
            where: { id: payload.id },
        });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        // Safe assignment of user object to req
        req.user = {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            user_type: user.user_type,
            avatar_url: (_a = user.avatar_url) !== null && _a !== void 0 ? _a : null,
            verified: user.verified,
        };
        next();
    }
    catch (err) {
        res.status(403).json({ error: 'Invalid token' });
    }
});
exports.authenticateToken = authenticateToken;
/**
 * Type guard: Checks if user is authenticated
 */
const isAuthenticated = (req) => {
    const user = req.user;
    return (typeof user === 'object' &&
        user !== null &&
        typeof user.id === 'string' &&
        typeof user.user_type === 'string');
};
exports.isAuthenticated = isAuthenticated;
/**
 * Type guard: Checks if user is an admin
 */
const isAdmin = (req) => {
    var _a;
    return ((_a = req.user) === null || _a === void 0 ? void 0 : _a.user_type) === 'admin';
};
exports.isAdmin = isAdmin;

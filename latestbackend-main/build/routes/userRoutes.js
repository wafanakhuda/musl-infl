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
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware"); // ✅ Correct path
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
// ✅ GET /api/users/me - Fetch current logged-in user (EXISTING - UNCHANGED)
router.get('/me', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const foundUser = yield prisma_1.default.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                email: true,
                full_name: true,
                user_type: true,
                avatar_url: true,
                bio: true,
                location: true,
                niche: true,
                followers: true,
                price_min: true,
                price_max: true,
                platforms: true,
                email_verified: true,
                verified: true,
            },
        });
        if (!foundUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(foundUser);
    }
    catch (error) {
        console.error('Error in /users/me:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}));
// ✅ PUT /api/users/me - Update creator profile (EXISTING - UNCHANGED)
router.put('/me', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const { full_name, avatar_url, bio, location, niche, followers, price_min, price_max, platforms, } = req.body;
    try {
        const updatedUser = yield prisma_1.default.user.update({
            where: { id: user.id },
            data: {
                full_name,
                avatar_url,
                bio,
                location,
                niche,
                followers,
                price_min,
                price_max,
                platforms,
            },
        });
        res.json(updatedUser);
    }
    catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Failed to update user profile' });
    }
}));
// ✅ NEW: PUT /api/users/profile - Enhanced profile update for OAuth onboarding
router.put('/profile', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user; // ✅ Use AuthRequest type
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    console.log(`📝 Updating profile for user: ${user.id}`);
    const { bio, location, niche, platforms, website, price_min, price_max, followers } = req.body;
    try {
        // ✅ Validate required fields for profile completion
        const errors = [];
        if (!(bio === null || bio === void 0 ? void 0 : bio.trim()))
            errors.push("Bio is required");
        if (!(location === null || location === void 0 ? void 0 : location.trim()))
            errors.push("Location is required");
        if (!(niche === null || niche === void 0 ? void 0 : niche.trim()))
            errors.push("Niche is required");
        if (!platforms || platforms.length === 0)
            errors.push("At least one content type is required");
        if (errors.length > 0) {
            res.status(400).json({
                error: "Profile validation failed",
                details: errors
            });
            return;
        }
        // ✅ Update user profile
        const updatedUser = yield prisma_1.default.user.update({
            where: { id: user.id },
            data: {
                bio: bio === null || bio === void 0 ? void 0 : bio.trim(),
                location: location === null || location === void 0 ? void 0 : location.trim(),
                niche: niche === null || niche === void 0 ? void 0 : niche.trim(),
                platforms: Array.isArray(platforms) ? platforms : [],
                website: (website === null || website === void 0 ? void 0 : website.trim()) || null,
                price_min: price_min ? parseInt(price_min) : null,
                price_max: price_max ? parseInt(price_max) : null,
                followers: followers ? parseInt(followers) : null,
            },
            // ✅ Select fields to return (excluding password)
            select: {
                id: true,
                email: true,
                full_name: true,
                user_type: true,
                avatar_url: true,
                bio: true,
                location: true,
                niche: true,
                followers: true,
                price_min: true,
                price_max: true,
                platforms: true,
                website: true,
                email_verified: true,
                verified: true,
                created_at: true,
            }
        });
        console.log(`✅ Profile updated successfully for user: ${user.id}`);
        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    }
    catch (error) {
        console.error("❌ Profile update error:", error);
        res.status(500).json({
            error: "Failed to update profile",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}));
// ✅ NEW: GET /api/users/profile-status - Check profile completion status
router.get('/profile-status', authMiddleware_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = req.user; // ✅ Use AuthRequest type
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const foundUser = yield prisma_1.default.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                email: true,
                full_name: true,
                user_type: true,
                bio: true,
                location: true,
                niche: true,
                platforms: true,
                avatar_url: true,
                created_at: true,
            }
        });
        if (!foundUser) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        // ✅ Check profile completion status
        const isProfileComplete = !!(foundUser.bio &&
            foundUser.location &&
            foundUser.niche &&
            foundUser.platforms &&
            foundUser.platforms.length > 0);
        const completionPercentage = [
            foundUser.bio,
            foundUser.location,
            foundUser.niche,
            ((_a = foundUser.platforms) === null || _a === void 0 ? void 0 : _a.length) > 0,
            foundUser.avatar_url
        ].filter(Boolean).length * 20; // 5 fields = 100%
        res.status(200).json({
            user: foundUser,
            profile_complete: isProfileComplete,
            completion_percentage: completionPercentage,
            missing_fields: {
                bio: !foundUser.bio,
                location: !foundUser.location,
                niche: !foundUser.niche,
                platforms: !foundUser.platforms || foundUser.platforms.length === 0,
                avatar: !foundUser.avatar_url
            }
        });
    }
    catch (error) {
        console.error("❌ Profile status error:", error);
        res.status(500).json({ error: "Failed to get profile status" });
    }
}));
exports.default = router;

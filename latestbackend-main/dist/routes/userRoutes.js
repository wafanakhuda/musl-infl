"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
router.get('/me', authMiddleware_1.authenticateToken, async (req, res) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const foundUser = await prisma_1.default.user.findUnique({
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
});
router.put('/me', authMiddleware_1.authenticateToken, async (req, res) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const { full_name, avatar_url, bio, location, niche, followers, price_min, price_max, platforms, } = req.body;
    try {
        const updatedUser = await prisma_1.default.user.update({
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
});
router.put('/profile', authMiddleware_1.authenticateToken, async (req, res) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    console.log(`📝 Updating profile for user: ${user.id}`);
    const { bio, location, niche, platforms, website, price_min, price_max, followers } = req.body;
    try {
        const errors = [];
        if (!bio?.trim())
            errors.push("Bio is required");
        if (!location?.trim())
            errors.push("Location is required");
        if (!niche?.trim())
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
        const updatedUser = await prisma_1.default.user.update({
            where: { id: user.id },
            data: {
                bio: bio?.trim(),
                location: location?.trim(),
                niche: niche?.trim(),
                platforms: Array.isArray(platforms) ? platforms : [],
                website: website?.trim() || null,
                price_min: price_min ? parseInt(price_min) : null,
                price_max: price_max ? parseInt(price_max) : null,
                followers: followers ? parseInt(followers) : null,
            },
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
});
router.get('/profile-status', authMiddleware_1.authenticateToken, async (req, res) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const foundUser = await prisma_1.default.user.findUnique({
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
        const isProfileComplete = !!(foundUser.bio &&
            foundUser.location &&
            foundUser.niche &&
            foundUser.platforms &&
            foundUser.platforms.length > 0);
        const completionPercentage = [
            foundUser.bio,
            foundUser.location,
            foundUser.niche,
            foundUser.platforms?.length > 0,
            foundUser.avatar_url
        ].filter(Boolean).length * 20;
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
});
exports.default = router;

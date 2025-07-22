"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_BASE_URL}/auth/google/callback`,
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
            console.error('❌ No email found in Google profile');
            return done(null, false);
        }
        console.log(`🔐 Processing Google OAuth for email: ${email}`);
        const userType = (req.session?.oauth_user_type) || "creator";
        console.log(`📋 User type from session: ${userType}`);
        let user = await prisma.user.findUnique({ where: { email } });
        let isNewUser = false;
        if (!user) {
            isNewUser = true;
            console.log(`👤 Creating new ${userType} user for: ${email}`);
            const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, '');
            const username = `${baseUsername}-${Math.floor(Math.random() * 10000)}`;
            user = await prisma.user.create({
                data: {
                    email,
                    full_name: profile.displayName || "No Name",
                    user_type: userType,
                    email_verified: true,
                    password: "",
                    username: username,
                    bio: null,
                    location: null,
                    niche: null,
                    platforms: [],
                    avatar_url: profile.photos?.[0]?.value || null,
                    created_at: new Date(),
                },
            });
            console.log(`✅ Created new user: ${user.id}`);
        }
        else {
            console.log(`🔄 Existing user found: ${user.id}`);
            if (profile.photos?.[0]?.value && !user.avatar_url) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        avatar_url: profile.photos[0].value,
                        updated_at: new Date()
                    }
                });
                console.log(`🖼️ Updated avatar for user: ${user.id}`);
            }
        }
        let isProfileComplete = true;
        let needsOnboarding = false;
        if (user.user_type === "creator") {
            const hasRequiredFields = !!(user.bio &&
                user.location &&
                user.niche &&
                user.platforms &&
                user.platforms.length > 0);
            isProfileComplete = hasRequiredFields;
            needsOnboarding = !hasRequiredFields;
            console.log(`📊 Creator profile check:`, {
                hasBio: !!user.bio,
                hasLocation: !!user.location,
                hasNiche: !!user.niche,
                hasPlatforms: !!(user.platforms && user.platforms.length > 0),
                isComplete: isProfileComplete,
                needsOnboarding: needsOnboarding
            });
        }
        else if (user.user_type === "brand") {
            isProfileComplete = !!(user.full_name && user.email);
            needsOnboarding = false;
            console.log(`🏢 Brand profile check: complete = ${isProfileComplete}`);
        }
        const tokenPayload = {
            id: user.id,
            user_type: user.user_type,
            email: user.email,
            profile_complete: isProfileComplete,
            is_new_oauth_user: isNewUser
        };
        const token = jsonwebtoken_1.default.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });
        console.log(`🎫 Generated JWT for user ${user.id}:`, {
            userType: user.user_type,
            profileComplete: isProfileComplete,
            isNewUser: isNewUser,
            needsOnboarding: needsOnboarding
        });
        const authResult = {
            token,
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                user_type: user.user_type,
                username: user.username,
                avatar_url: user.avatar_url,
                bio: user.bio,
                location: user.location,
                niche: user.niche,
                platforms: user.platforms,
                email_verified: user.email_verified
            },
            profile_complete: isProfileComplete,
            is_new_oauth_user: isNewUser,
            needs_onboarding: needsOnboarding
        };
        return done(null, authResult);
    }
    catch (err) {
        console.error("❌ Google OAuth strategy error:", err);
        return done(err);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user.token || user.id);
});
passport_1.default.deserializeUser(async (tokenOrId, done) => {
    try {
        if (tokenOrId.includes('.')) {
            const decoded = jsonwebtoken_1.default.verify(tokenOrId, JWT_SECRET);
            const user = await prisma.user.findUnique({ where: { id: decoded.id } });
            return done(null, user);
        }
        else {
            const user = await prisma.user.findUnique({ where: { id: tokenOrId } });
            return done(null, user);
        }
    }
    catch (error) {
        console.error("❌ Passport deserialize error:", error);
        return done(error);
    }
});
exports.default = passport_1.default;

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
// auth/google.ts
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
// ✅ Enhanced Google OAuth Strategy with Profile Completion Detection
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_BASE_URL}/auth/google/callback`,
    passReqToCallback: true // ✅ Enable access to request object for session data
}, (req, accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
        const email = (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
        if (!email) {
            console.error('❌ No email found in Google profile');
            return done(null, false);
        }
        console.log(`🔐 Processing Google OAuth for email: ${email}`);
        // ✅ Get user type from session (set in /google route)
        const userType = ((_c = req.session) === null || _c === void 0 ? void 0 : _c.oauth_user_type) || "creator";
        console.log(`📋 User type from session: ${userType}`);
        let user = yield prisma.user.findUnique({ where: { email } });
        let isNewUser = false;
        if (!user) {
            isNewUser = true;
            console.log(`👤 Creating new ${userType} user for: ${email}`);
            // ✅ Generate unique username
            const baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, '');
            const username = `${baseUsername}-${Math.floor(Math.random() * 10000)}`;
            user = yield prisma.user.create({
                data: {
                    email,
                    full_name: profile.displayName || "No Name",
                    user_type: userType,
                    email_verified: true,
                    password: "", // Placeholder for OAuth users
                    username: username,
                    // ✅ OAuth users start with minimal profile data
                    bio: null,
                    location: null,
                    niche: null,
                    platforms: [],
                    avatar_url: ((_e = (_d = profile.photos) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.value) || null,
                    // ✅ Set created timestamp
                    created_at: new Date(),
                },
            });
            console.log(`✅ Created new user: ${user.id}`);
        }
        else {
            console.log(`🔄 Existing user found: ${user.id}`);
            // ✅ Update avatar if it's from Google and user doesn't have one
            if (((_g = (_f = profile.photos) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.value) && !user.avatar_url) {
                yield prisma.user.update({
                    where: { id: user.id },
                    data: {
                        avatar_url: profile.photos[0].value,
                        updated_at: new Date()
                    }
                });
                console.log(`🖼️ Updated avatar for user: ${user.id}`);
            }
        }
        // ✅ Check profile completion status (especially for creators)
        let isProfileComplete = true;
        let needsOnboarding = false;
        if (user.user_type === "creator") {
            // ✅ Check if creator has completed essential profile fields
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
            // ✅ For brands, basic info is usually sufficient from OAuth
            // But you could add brand-specific requirements here
            isProfileComplete = !!(user.full_name && user.email);
            needsOnboarding = false;
            console.log(`🏢 Brand profile check: complete = ${isProfileComplete}`);
        }
        // ✅ Generate JWT with comprehensive user data
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
        // ✅ Return comprehensive auth result
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
})));
// ✅ Passport serialization (required for session support)
passport_1.default.serializeUser((user, done) => {
    done(null, user.token || user.id);
});
passport_1.default.deserializeUser((tokenOrId, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // If it looks like a JWT token, verify it
        if (tokenOrId.includes('.')) {
            const decoded = jsonwebtoken_1.default.verify(tokenOrId, JWT_SECRET);
            const user = yield prisma.user.findUnique({ where: { id: decoded.id } });
            return done(null, user);
        }
        else {
            // Otherwise treat as user ID
            const user = yield prisma.user.findUnique({ where: { id: tokenOrId } });
            return done(null, user);
        }
    }
    catch (error) {
        console.error("❌ Passport deserialize error:", error);
        return done(error);
    }
}));
exports.default = passport_1.default;

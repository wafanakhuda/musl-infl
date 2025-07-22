"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.verifyOtp = verifyOtp;
exports.loginUser = loginUser;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const email_1 = require("../utils/email");
const otpUtils_1 = require("../utils/otpUtils");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
function createToken(user) {
    return jsonwebtoken_1.default.sign({ id: user.id, user_type: user.user_type }, JWT_SECRET, {
        expiresIn: "7d",
    });
}
async function registerUser(data) {
    try {
        console.log("📝 Processing registration for:", data.email);
        console.log("📝 Registration data:", {
            email: data.email,
            user_type: data.user_type,
            hasLocation: !!data.location,
            hasBio: !!data.bio,
            hasUsername: !!(data.username || data.profile?.username),
            platformsCount: data.platforms?.length || 0
        });
        const existing = await prisma.user.findUnique({ where: { email: data.email } });
        if (existing) {
            throw new Error("Email already registered.");
        }
        const username = data.profile?.username || data.username || `user_${Date.now()}`;
        const location = data.location?.trim() || "Not specified";
        const bio = data.bio?.trim() || `${data.user_type === 'creator' ? 'Content creator' : 'Brand'} on MuslimInfluencers.io`;
        console.log("📝 Creating user with:", {
            username,
            location,
            bio: bio.substring(0, 50) + "...",
            platforms: data.platforms
        });
        const hashed = await bcryptjs_1.default.hash(data.password, 10);
        const user = await prisma.user.create({
            data: {
                email: data.email.trim(),
                password: hashed,
                full_name: data.full_name.trim(),
                user_type: data.user_type,
                location: location,
                bio: bio,
                avatar_url: data.avatar_url,
                email_verified: false,
                username: username,
                followers: data.followers || null,
                price_min: data.price_min || null,
                price_max: data.price_max || null,
                niche: data.niche || null,
                platforms: data.platforms || [],
                gender: data.gender || null,
            },
        });
        const otp = (0, otpUtils_1.generateOtp)();
        otpUtils_1.otpStore[data.email] = otp;
        console.log("📧 Sending OTP to:", data.email);
        await (0, email_1.sendEmail)({
            to: data.email,
            subject: "Verify Your MuslimInfluencers.io Account",
            text: `Welcome to MuslimInfluencers.io!\n\nYour verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't create an account, please ignore this email.`,
        });
        console.log("✅ Registration successful for user:", user.id);
        return {
            message: "Registration successful. Please check your email for the OTP verification code.",
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                user_type: user.user_type,
            },
        };
    }
    catch (error) {
        console.error("❌ Registration error:", error.message);
        throw error;
    }
}
async function verifyOtp(data) {
    try {
        console.log("🔍 Verifying OTP for:", data.email);
        const stored = otpUtils_1.otpStore[data.email];
        if (!stored || stored !== data.otp) {
            console.log("❌ Invalid OTP - Stored:", stored, "Provided:", data.otp);
            throw new Error("Invalid or expired OTP.");
        }
        const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
        if (!existingUser) {
            throw new Error("User not found");
        }
        const user = await prisma.user.update({
            where: { id: existingUser.id },
            data: { email_verified: true },
        });
        delete otpUtils_1.otpStore[data.email];
        const token = createToken(user);
        console.log("✅ Email verification successful for user:", user.id);
        return {
            message: "Email verified successfully. Welcome to MuslimInfluencers.io!",
            token,
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                user_type: user.user_type,
                username: user.username,
                email_verified: true,
                bio: user.bio,
                location: user.location,
                niche: user.niche,
                platforms: user.platforms,
                avatar_url: user.avatar_url,
            },
        };
    }
    catch (error) {
        console.error("❌ OTP verification error:", error.message);
        throw error;
    }
}
async function loginUser(data) {
    try {
        const { email, password } = data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
            throw new Error("Invalid email or password.");
        }
        if (!user.email_verified) {
            throw new Error("Please verify your email first. Check your inbox for the OTP.");
        }
        const token = createToken(user);
        console.log("✅ Login successful for user:", user.id);
        return {
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                user_type: user.user_type,
                username: user.username,
                email_verified: user.email_verified,
                avatar_url: user.avatar_url,
                bio: user.bio,
                location: user.location,
                niche: user.niche,
                platforms: user.platforms,
                verified: user.verified,
            },
        };
    }
    catch (error) {
        console.error("❌ Login error:", error.message);
        throw error;
    }
}

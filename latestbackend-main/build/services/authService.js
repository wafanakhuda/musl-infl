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
exports.registerUser = registerUser;
exports.verifyOtp = verifyOtp;
exports.loginUser = loginUser;
// src/services/authService.ts
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
// ✅ Register new user with flexible validation
function registerUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            console.log("📝 Processing registration for:", data.email);
            // Check if user already exists
            const existing = yield prisma.user.findUnique({ where: { email: data.email } });
            if (existing) {
                throw new Error("Email already registered.");
            }
            // ✅ Extract username from profile or use fallback
            const username = ((_a = data.profile) === null || _a === void 0 ? void 0 : _a.username) || data.username || `user_${Date.now()}`;
            // ✅ Provide defaults for required fields
            const location = ((_b = data.location) === null || _b === void 0 ? void 0 : _b.trim()) || "Not specified";
            const bio = ((_c = data.bio) === null || _c === void 0 ? void 0 : _c.trim()) || "Content creator on MuslimInfluencers.io";
            console.log("📝 Creating user with username:", username);
            const hashed = yield bcryptjs_1.default.hash(data.password, 10);
            const user = yield prisma.user.create({
                data: {
                    email: data.email.trim(),
                    password: hashed,
                    full_name: data.full_name.trim(),
                    user_type: data.user_type,
                    location: location,
                    bio: bio,
                    avatar_url: data.avatar_url,
                    email_verified: false,
                    username: username, // ✅ Always provide a username
                    followers: data.followers || null,
                    price_min: data.price_min || null,
                    price_max: data.price_max || null,
                    niche: data.niche || null,
                    platforms: data.platforms || [],
                    gender: data.gender || null,
                },
            });
            // Generate and store OTP
            const otp = (0, otpUtils_1.generateOtp)();
            otpUtils_1.otpStore[data.email] = otp;
            console.log("📧 Sending OTP to:", data.email);
            // Send verification email
            yield (0, email_1.sendEmail)({
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
    });
}
// ✅ Verify email OTP
function verifyOtp(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("🔍 Verifying OTP for:", data.email);
            const stored = otpUtils_1.otpStore[data.email];
            if (!stored || stored !== data.otp) {
                console.log("❌ Invalid OTP - Stored:", stored, "Provided:", data.otp);
                throw new Error("Invalid or expired OTP.");
            }
            const existingUser = yield prisma.user.findUnique({ where: { email: data.email } });
            if (!existingUser) {
                throw new Error("User not found");
            }
            // Update user as verified
            const user = yield prisma.user.update({
                where: { id: existingUser.id },
                data: { email_verified: true },
            });
            // Clean up OTP
            delete otpUtils_1.otpStore[data.email];
            // Generate auth token
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
                },
            };
        }
        catch (error) {
            console.error("❌ OTP verification error:", error.message);
            throw error;
        }
    });
}
// ✅ Login user
function loginUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = data;
            const user = yield prisma.user.findUnique({ where: { email } });
            if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
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
                },
            };
        }
        catch (error) {
            console.error("❌ Login error:", error.message);
            throw error;
        }
    });
}

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
const authService_1 = require("../services/authService");
const otpUtils_1 = require("../utils/otpUtils");
const email_1 = require("../utils/email");
const prisma_1 = __importDefault(require("../lib/prisma"));
const router = (0, express_1.Router)();
// ✅ Enhanced Creator Registration with better validation
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("📝 Registration request received");
        console.log("Headers:", req.headers);
        console.log("Body keys:", Object.keys(req.body));
        console.log("Full payload:", JSON.stringify(req.body, null, 2));
        const { email, password, full_name, user_type, location, bio, avatar_url, profile, platforms, gender, niche, username, // Direct username field
         } = req.body;
        // ✅ Basic validation with more helpful error messages
        const errors = [];
        if (!(email === null || email === void 0 ? void 0 : email.trim()))
            errors.push("Email is required");
        if (!password)
            errors.push("Password is required");
        if (!(full_name === null || full_name === void 0 ? void 0 : full_name.trim()))
            errors.push("Full name is required");
        if (!user_type)
            errors.push("User type is required");
        // ✅ For creators, we need either location/bio OR we'll provide defaults
        if (user_type === "creator") {
            console.log("👤 Creator registration detected");
            // We'll provide defaults in the service if not provided
        }
        if (errors.length > 0) {
            console.log("❌ Validation errors:", errors);
            res.status(400).json({
                error: "Validation failed",
                details: errors,
                message: `Missing required fields: ${errors.join(", ")}`
            });
            return;
        }
        // ✅ Prepare payload for registration service
        const registrationData = {
            email: email.trim(),
            password,
            full_name: full_name.trim(),
            user_type,
            location: location === null || location === void 0 ? void 0 : location.trim(),
            bio: bio === null || bio === void 0 ? void 0 : bio.trim(),
            avatar_url,
            profile, // Pass the entire profile object
            username, // Direct username if provided
            platforms: Array.isArray(platforms) ? platforms : [],
            gender,
            niche,
        };
        console.log("📝 Calling registerUser with:", {
            email: registrationData.email,
            user_type: registrationData.user_type,
            hasProfile: !!registrationData.profile,
            hasUsername: !!registrationData.username,
            platformsCount: registrationData.platforms.length
        });
        const result = yield (0, authService_1.registerUser)(registrationData);
        console.log("✅ Registration successful, sending response");
        res.status(201).json(result);
    }
    catch (error) {
        console.error("❌ Registration error:", error.message);
        console.error("Full error:", error);
        // Provide more specific error messages
        let errorMessage = error.message;
        if (error.message.includes("Email already")) {
            errorMessage = "This email is already registered. Please login instead.";
        }
        else if (error.message.includes("validation")) {
            errorMessage = "Please check your input and try again.";
        }
        else if (!errorMessage || errorMessage === "Internal server error") {
            errorMessage = "Registration failed. Please try again later.";
        }
        res.status(500).json({
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}));
// ✅ Login with better error handling
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required." });
            return;
        }
        console.log("🔐 Login attempt for:", email);
        const result = yield (0, authService_1.loginUser)({ email: email.trim(), password });
        console.log("✅ Login successful for:", email);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("❌ Login error:", error.message);
        let errorMessage = error.message;
        if (error.message.includes("Invalid")) {
            errorMessage = "Invalid email or password.";
        }
        else if (error.message.includes("verify")) {
            errorMessage = "Please verify your email first. Check your inbox for the OTP.";
        }
        res.status(401).json({ error: errorMessage });
    }
}));
// ✅ Send OTP (for initial registration)
router.post("/send-otp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ error: "Email is required." });
            return;
        }
        const otp = (0, otpUtils_1.generateOtp)();
        otpUtils_1.otpStore[email] = otp;
        yield (0, email_1.sendEmail)({
            to: email,
            subject: "Your MuslimInfluencers.io OTP Code",
            text: `Your verification code is: ${otp}\n\nThis code will expire in 10 minutes.`,
        });
        console.log("📧 OTP sent to:", email);
        res.status(200).json({ message: "OTP sent successfully." });
    }
    catch (error) {
        console.error("❌ Send OTP error:", error.message);
        res.status(500).json({ error: "Failed to send OTP. Please try again." });
    }
}));
// ✅ Verify OTP with enhanced logging
router.post("/verify-otp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log("🔍 OTP verification request received");
        console.log("Payload:", { email: req.body.email, otpLength: (_a = req.body.otp) === null || _a === void 0 ? void 0 : _a.length });
        const { email, otp } = req.body;
        if (!email || !otp) {
            res.status(400).json({ error: "Email and OTP are required." });
            return;
        }
        if (otp.length !== 6) {
            res.status(400).json({ error: "OTP must be 6 digits." });
            return;
        }
        const result = yield (0, authService_1.verifyOtp)({ email: email.trim(), otp: otp.trim() });
        console.log("✅ OTP verification successful for:", email);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("❌ OTP verification error:", error.message);
        let errorMessage = error.message;
        if (error.message.includes("Invalid or expired")) {
            errorMessage = "Invalid or expired OTP. Please request a new one.";
        }
        else if (error.message.includes("User not found")) {
            errorMessage = "Account not found. Please register first.";
        }
        res.status(400).json({ error: errorMessage });
    }
}));
// ✅ Resend OTP with better error handling
router.post("/resend-otp", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ error: "Email is required." });
            return;
        }
        // Check if user exists
        const user = yield prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            res.status(404).json({ error: "No account found with this email address." });
            return;
        }
        if (user.email_verified) {
            res.status(400).json({ error: "Email is already verified. Please login." });
            return;
        }
        // Generate new OTP
        const otp = (0, otpUtils_1.generateOtp)();
        otpUtils_1.otpStore[email] = otp;
        yield (0, email_1.sendEmail)({
            to: email,
            subject: "Your New OTP Code - MuslimInfluencers.io",
            text: `Your new verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`,
        });
        console.log("📧 OTP resent to:", email);
        res.status(200).json({ message: "New OTP sent successfully. Please check your email." });
    }
    catch (error) {
        console.error("❌ Resend OTP error:", error.message);
        res.status(500).json({ error: "Failed to resend OTP. Please try again." });
    }
}));
// ✅ Health check endpoint
router.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Auth service is running",
        timestamp: new Date().toISOString()
    });
});
exports.default = router;

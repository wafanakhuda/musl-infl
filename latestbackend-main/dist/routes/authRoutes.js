"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authService_1 = require("../services/authService");
const otpUtils_1 = require("../utils/otpUtils");
const email_1 = require("../utils/email");
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = (0, express_1.Router)();
router.post("/register", async (req, res) => {
    try {
        console.log("📝 Registration request received");
        console.log("📝 Request body keys:", Object.keys(req.body));
        console.log("📝 Full payload:", JSON.stringify(req.body, null, 2));
        const { email, password, full_name, user_type, location, bio, avatar_url, profile, platforms, gender, niche, username, } = req.body;
        const errors = [];
        if (!email?.trim())
            errors.push("Email is required");
        if (!password)
            errors.push("Password is required");
        if (!full_name?.trim())
            errors.push("Full name is required");
        if (!user_type)
            errors.push("User type is required");
        if (errors.length > 0) {
            console.log("❌ Validation errors:", errors);
            res.status(400).json({
                error: "Validation failed",
                details: errors,
                message: `Missing required fields: ${errors.join(", ")}`
            });
            return;
        }
        const registrationData = {
            email: email.trim(),
            password,
            full_name: full_name.trim(),
            user_type,
            location: location?.trim(),
            bio: bio?.trim(),
            avatar_url,
            profile,
            username,
            platforms: Array.isArray(platforms) ? platforms : [],
            gender,
            niche,
        };
        console.log("📝 Calling registerUser");
        const result = await (0, authService_1.registerUser)(registrationData);
        console.log("✅ Registration successful, sending response");
        res.status(201).json(result);
    }
    catch (error) {
        console.error("❌ Registration error:", error.message);
        let errorMessage = error.message;
        if (error.message.includes("Email already")) {
            errorMessage = "This email is already registered. Please login instead.";
        }
        else if (!errorMessage || errorMessage === "Internal server error") {
            errorMessage = "Registration failed. Please try again later.";
        }
        res.status(500).json({
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Email and password are required." });
            return;
        }
        console.log("🔐 Login attempt for:", email);
        const result = await (0, authService_1.loginUser)({ email: email.trim(), password });
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
});
router.post("/send-otp", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ error: "Email is required." });
            return;
        }
        const otp = (0, otpUtils_1.generateOtp)();
        otpUtils_1.otpStore[email] = otp;
        await (0, email_1.sendEmail)({
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
});
router.post("/verify-otp", async (req, res) => {
    try {
        console.log("🔍 OTP verification request received");
        console.log("📝 Payload:", { email: req.body.email, otpLength: req.body.otp?.length });
        const { email, otp } = req.body;
        if (!email || !otp) {
            res.status(400).json({ error: "Email and OTP are required." });
            return;
        }
        if (otp.length !== 6) {
            res.status(400).json({ error: "OTP must be 6 digits." });
            return;
        }
        const result = await (0, authService_1.verifyOtp)({ email: email.trim(), otp: otp.trim() });
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
});
router.post("/resend-otp", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ error: "Email is required." });
            return;
        }
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            res.status(404).json({ error: "No account found with this email address." });
            return;
        }
        if (user.email_verified) {
            res.status(400).json({ error: "Email is already verified. Please login." });
            return;
        }
        const otp = (0, otpUtils_1.generateOtp)();
        otpUtils_1.otpStore[email] = otp;
        await (0, email_1.sendEmail)({
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
});
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email?.trim()) {
            res.status(400).json({ error: "Email is required." });
            return;
        }
        console.log("🔑 Password reset requested for:", email);
        const user = await prisma_1.default.user.findUnique({ where: { email: email.trim() } });
        if (!user) {
            res.status(200).json({ message: "If an account with this email exists, you will receive a password reset code." });
            return;
        }
        const resetOtp = (0, otpUtils_1.generateOtp)();
        otpUtils_1.otpStore[`reset_${email.trim()}`] = resetOtp;
        console.log("📧 Sending password reset OTP to:", email);
        await (0, email_1.sendEmail)({
            to: email.trim(),
            subject: "Reset Your MuslimInfluencers.io Password",
            text: `You requested a password reset for your MuslimInfluencers.io account.\n\nYour password reset code is: ${resetOtp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email and your password will remain unchanged.`,
        });
        res.status(200).json({
            message: "If an account with this email exists, you will receive a password reset code."
        });
    }
    catch (error) {
        console.error("❌ Forgot password error:", error.message);
        res.status(500).json({ error: "Failed to process password reset request. Please try again." });
    }
});
router.post("/reset-password", async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email?.trim() || !otp?.trim() || !newPassword) {
            res.status(400).json({ error: "Email, OTP, and new password are required." });
            return;
        }
        if (newPassword.length < 6) {
            res.status(400).json({ error: "Password must be at least 6 characters long." });
            return;
        }
        console.log("🔑 Password reset verification for:", email);
        const resetKey = `reset_${email.trim()}`;
        const storedOtp = otpUtils_1.otpStore[resetKey];
        if (!storedOtp || storedOtp !== otp.trim()) {
            res.status(400).json({ error: "Invalid or expired reset code." });
            return;
        }
        const user = await prisma_1.default.user.findUnique({ where: { email: email.trim() } });
        if (!user) {
            res.status(404).json({ error: "User not found." });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });
        delete otpUtils_1.otpStore[resetKey];
        console.log("✅ Password reset successful for user:", user.id);
        res.status(200).json({
            message: "Password reset successful. You can now login with your new password."
        });
    }
    catch (error) {
        console.error("❌ Reset password error:", error.message);
        res.status(500).json({ error: "Failed to reset password. Please try again." });
    }
});
router.post("/resend-reset-otp", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email?.trim()) {
            res.status(400).json({ error: "Email is required." });
            return;
        }
        console.log("🔄 Resending password reset OTP for:", email);
        const user = await prisma_1.default.user.findUnique({ where: { email: email.trim() } });
        if (!user) {
            res.status(200).json({ message: "If an account with this email exists, you will receive a new password reset code." });
            return;
        }
        const resetOtp = (0, otpUtils_1.generateOtp)();
        otpUtils_1.otpStore[`reset_${email.trim()}`] = resetOtp;
        await (0, email_1.sendEmail)({
            to: email.trim(),
            subject: "New Password Reset Code - MuslimInfluencers.io",
            text: `You requested a new password reset code for your MuslimInfluencers.io account.\n\nYour new password reset code is: ${resetOtp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.`,
        });
        console.log("📧 New password reset OTP sent to:", email);
        res.status(200).json({
            message: "If an account with this email exists, you will receive a new password reset code."
        });
    }
    catch (error) {
        console.error("❌ Resend reset OTP error:", error.message);
        res.status(500).json({ error: "Failed to resend password reset code. Please try again." });
    }
});
router.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Auth service is running",
        timestamp: new Date().toISOString()
    });
});
exports.default = router;

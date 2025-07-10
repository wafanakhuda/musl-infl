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
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
function sendEmail(_a) {
    return __awaiter(this, arguments, void 0, function* ({ to, subject, text, }) {
        try {
            const transporter = nodemailer_1.default.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT) || 587,
                secure: false, // false for STARTTLS, true if using port 465
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
                tls: {
                    rejectUnauthorized: false, // ✅ useful for dev or self-signed certs
                },
            });
            const mailOptions = {
                from: `"MuslimInfluencers.io" <${process.env.SMTP_USER}>`,
                to,
                subject,
                text,
            };
            const info = yield transporter.sendMail(mailOptions);
            console.log("✅ Email sent to:", to);
            console.log("📧 Message ID:", info.messageId);
            console.log("📨 Server response:", info.response);
        }
        catch (err) {
            console.error("❌ Failed to send email:", err.message);
            throw new Error("Email service failed");
        }
    });
}

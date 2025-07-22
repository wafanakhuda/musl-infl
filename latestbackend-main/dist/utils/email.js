"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
async function sendEmail({ to, subject, text, }) {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
        const mailOptions = {
            from: `"MuslimInfluencers.io" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent to:", to);
        console.log("📧 Message ID:", info.messageId);
        console.log("📨 Server response:", info.response);
    }
    catch (err) {
        console.error("❌ Failed to send email:", err.message);
        throw new Error("Email service failed");
    }
}

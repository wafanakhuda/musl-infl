"use strict";
// src/utils/otpUtils.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpStore = void 0;
exports.generateOtp = generateOtp;
exports.otpStore = {};
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

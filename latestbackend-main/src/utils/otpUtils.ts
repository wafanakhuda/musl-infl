// src/utils/otpUtils.ts

export const otpStore: Record<string, string> = {}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

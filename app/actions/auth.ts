"use server";

import { checkRateLimit } from "@/lib/rate-limit";

/**
 * Server Action to send OTP with rate limiting
 *
 * Rate limit: 3 requests per 15 minutes per phone number
 * Prevents SMS bombing and abuse
 */
export async function sendOTPWithRateLimit(phoneNumber: string) {
  // Rate limit: 3 OTP requests per 15 minutes
  const rateLimitResult = checkRateLimit(phoneNumber, {
    maxRequests: 3,
    windowMs: 15 * 60 * 1000, // 15 minutes
  });

  if (!rateLimitResult.success) {
    const waitMinutes = Math.ceil(
      (rateLimitResult.resetTime - Date.now()) / (60 * 1000)
    );

    return {
      success: false,
      error: `Demasiados intentos. Por favor, esperá ${waitMinutes} minuto${waitMinutes !== 1 ? "s" : ""} antes de intentar nuevamente.`,
      resetTime: rateLimitResult.resetTime,
    };
  }

  // Rate limit passed - return success with metadata
  return {
    success: true,
    remaining: rateLimitResult.remaining,
    resetTime: rateLimitResult.resetTime,
  };
}

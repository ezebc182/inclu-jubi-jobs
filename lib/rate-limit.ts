/**
 * Simple in-memory rate limiter
 *
 * PRODUCTION NOTE: Replace this with Redis-based rate limiting for:
 * - Distributed systems (multiple servers)
 * - Persistence across restarts
 * - Better performance at scale
 *
 * Recommended libraries:
 * - @upstash/ratelimit (Vercel Edge compatible)
 * - rate-limiter-flexible (Redis, Node.js)
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 10 minutes
setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  },
  10 * 60 * 1000
);

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed within the window
   */
  maxRequests: number;

  /**
   * Time window in milliseconds
   */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
}

/**
 * Check if a request should be rate limited
 *
 * @param identifier - Unique identifier for the requester (e.g., phone number, IP address)
 * @param config - Rate limit configuration
 * @returns Rate limit result with success status and metadata
 *
 * @example
 * ```ts
 * const result = checkRateLimit(phoneNumber, {
 *   maxRequests: 3,
 *   windowMs: 15 * 60 * 1000, // 15 minutes
 * });
 *
 * if (!result.success) {
 *   throw new Error(`Too many requests. Try again in ${Math.ceil((result.resetTime - Date.now()) / 1000)} seconds`);
 * }
 * ```
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // No previous requests or window expired
  if (!entry || now > entry.resetTime) {
    const resetTime = now + config.windowMs;
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime,
    });

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetTime,
    };
  }

  // Within window - check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(identifier, entry);

  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Reset rate limit for a specific identifier
 * Useful for testing or manual override
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

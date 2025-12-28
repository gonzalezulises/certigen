import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Check if Upstash Redis is configured
const isConfigured = !!(
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
);

// Create Redis client only if configured
const redis = isConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

/**
 * General rate limiter: 10 requests per minute per IP
 * Used for validation and general API endpoints
 */
export const generalRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      analytics: true,
      prefix: 'certigen:general',
    })
  : null;

/**
 * Strict rate limiter: 5 requests per minute per IP
 * Used for certificate generation (more expensive operation)
 */
export const generateRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, '1 m'),
      analytics: true,
      prefix: 'certigen:generate',
    })
  : null;

/**
 * Admin rate limiter: 20 requests per minute per IP
 * Used for admin operations like revocation
 */
export const adminRatelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, '1 m'),
      analytics: true,
      prefix: 'certigen:admin',
    })
  : null;

/**
 * Get client IP from request headers
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  return 'unknown';
}

/**
 * Check rate limit and return result
 * Returns null if rate limiting is not configured (graceful degradation)
 */
export async function checkRateLimit(
  ratelimiter: Ratelimit | null,
  identifier: string
): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number } | null> {
  if (!ratelimiter) {
    // Rate limiting not configured, allow request
    return null;
  }

  const result = await ratelimiter.limit(identifier);
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

/**
 * Create rate limit exceeded response
 */
export function rateLimitExceededResponse(reset?: number) {
  const retryAfter = reset ? Math.ceil((reset - Date.now()) / 1000) : 60;
  return new Response(
    JSON.stringify({
      error: 'Rate limit exceeded. Please try again later.',
      retry_after: retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfter),
      },
    }
  );
}

/**
 * Rate limiting middleware for Azure Functions
 * Prevents abuse and DDoS attacks
 */

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
  keyGenerator?: (req: any) => string // Custom key generator (IP, user ID, etc.)
}

interface RequestRecord {
  count: number
  resetTime: number
}

const store = new Map<string, RequestRecord>()

/**
 * Get client identifier (IP address or custom key)
 */
function getClientKey(req: any, keyGenerator?: (req: any) => string): string {
  if (keyGenerator) {
    return keyGenerator(req)
  }
  return req.headers?.['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown'
}

/**
 * Rate limit middleware for Express/Node
 */
export function rateLimit(config: RateLimitConfig) {
  return (req: any, res: any, next: any) => {
    const key = getClientKey(req, config.keyGenerator)
    const now = Date.now()

    // Get or create record
    let record = store.get(key)

    if (!record || now > record.resetTime) {
      // Window expired, create new record
      record = {
        count: 1,
        resetTime: now + config.windowMs,
      }
      store.set(key, record)
    } else {
      record.count++
    }

    // Set rate limit headers
    res.set('X-RateLimit-Limit', config.maxRequests.toString())
    res.set('X-RateLimit-Remaining', Math.max(0, config.maxRequests - record.count).toString())
    res.set('X-RateLimit-Reset', record.resetTime.toString())

    // Check if limit exceeded
    if (record.count > config.maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        message: `You have exceeded the rate limit of ${config.maxRequests} requests per ${config.windowMs / 1000} seconds.`,
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      })
    }

    next()
  }
}

/**
 * Rate limit configurations for different endpoints
 */
export const rateLimitConfigs = {
  // Auth endpoints - strict
  login: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts
  },
  signup: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 sign-ups per hour
  },
  passwordReset: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 reset attempts
  },

  // API endpoints - moderate
  general: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
  },
  heavyCompute: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 heavy requests per minute
  },

  // Public endpoints - lenient
  publicApi: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 1000, // 1000 requests per minute
  },

  // Admin endpoints - strict
  admin: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 50, // 50 admin actions per minute
  },
}

// Cleanup old records periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of store.entries()) {
    if (now > record.resetTime) {
      store.delete(key)
    }
  }
}, 60 * 1000) // Clean up every minute

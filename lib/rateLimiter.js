/**
 * Client-Side Rate Limiter
 * Prevents abuse and brute-force attacks on API endpoints
 * 
 * 🔒 SECURITY: Defense-in-depth measure (backend should also rate limit)
 */

class RateLimiter {
  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
    this.requests = new Map() // Store: { key: [timestamp1, timestamp2, ...] }
  }

  /**
   * Check if a request is allowed based on rate limit
   * @param {string} key - Unique identifier (e.g., 'POST:/api/v1/auth/login')
   * @returns {Promise<boolean>} - True if allowed, false if rate limited
   * @throws {Error} - If rate limit exceeded
   */
  async checkLimit(key) {
    const now = Date.now()
    const windowStart = now - this.windowMs

    // Initialize request history for this key
    if (!this.requests.has(key)) {
      this.requests.set(key, [])
    }

    // Get existing timestamps and filter out old ones (outside window)
    const timestamps = this.requests.get(key).filter(t => t > windowStart)

    // Check if limit exceeded
    if (timestamps.length >= this.maxRequests) {
      const oldestTimestamp = timestamps[0]
      const retryAfter = Math.ceil((oldestTimestamp + this.windowMs - now) / 1000)
      
      throw new Error(
        `Too many requests. Please wait ${retryAfter} seconds and try again.`
      )
    }

    // Add current timestamp
    timestamps.push(now)
    this.requests.set(key, timestamps)

    return true
  }

  /**
   * Get remaining requests for a key
   * @param {string} key
   * @returns {number}
   */
  getRemainingRequests(key) {
    const now = Date.now()
    const windowStart = now - this.windowMs
    
    if (!this.requests.has(key)) {
      return this.maxRequests
    }

    const timestamps = this.requests.get(key).filter(t => t > windowStart)
    return Math.max(0, this.maxRequests - timestamps.length)
  }

  /**
   * Reset rate limit for a specific key
   * @param {string} key
   */
  reset(key) {
    this.requests.delete(key)
  }

  /**
   * Clear all rate limit data
   */
  clearAll() {
    this.requests.clear()
  }
}

// Export singleton instances for different use cases

/**
 * General API rate limiter - 10 requests per minute
 */
export const apiRateLimiter = new RateLimiter(10, 60000)

/**
 * Auth rate limiter - 5 attempts per 15 minutes (stricter for login/register)
 */
export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000)

/**
 * Payment rate limiter - 3 attempts per 5 minutes (very strict)
 */
export const paymentRateLimiter = new RateLimiter(3, 5 * 60 * 1000)

/**
 * Default export
 */
export default RateLimiter

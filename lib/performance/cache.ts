/**
 * Performance Optimization - Caching Utilities
 * In-memory and server-side caching with TTL support
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class MemoryCache {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // Run cleanup every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  /**
   * Get item from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) {
      return null
    }

    // Check if expired
    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * Set item in cache with TTL (in milliseconds)
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  /**
   * Delete item from cache
   */
  delete(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Get or set pattern: fetch data if not in cache
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 5 * 60 * 1000
  ): Promise<T> {
    const cached = this.get<T>(key)

    if (cached !== null) {
      return cached
    }

    const data = await fetcher()
    this.set(key, data, ttl)
    return data
  }

  /**
   * Remove expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    const keysToDelete: string[] = []

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key)
      }
    }

    for (const key of keysToDelete) {
      this.cache.delete(key)
    }

    if (keysToDelete.length > 0) {
      console.log(`[Cache] Cleaned up ${keysToDelete.length} expired entries`)
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }

  /**
   * Destroy cache and cleanup interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.clear()
  }
}

// Export singleton instance
export const cache = new MemoryCache()

/**
 * Common TTL values
 */
export const TTL = {
  ONE_MINUTE: 60 * 1000,
  FIVE_MINUTES: 5 * 60 * 1000,
  TEN_MINUTES: 10 * 60 * 1000,
  THIRTY_MINUTES: 30 * 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000,
  ONE_WEEK: 7 * 24 * 60 * 60 * 1000,
}

/**
 * Cache key generators for common patterns
 */
export const CacheKeys = {
  user: (userId: string) => `user:${userId}`,
  userProfile: (userId: string) => `user:${userId}:profile`,
  downline: (userId: string) => `downline:${userId}`,
  commissions: (userId: string, month?: string) =>
    month ? `commissions:${userId}:${month}` : `commissions:${userId}`,
  matrixPosition: (userId: string) => `matrix:${userId}`,
  dashboard: (userId: string) => `dashboard:${userId}`,
  rankings: () => 'rankings:global',
  products: () => 'products:all',
  product: (productId: string) => `product:${productId}`,
  settings: () => 'settings:global',
  testimonials: () => 'testimonials:published',
  videos: (category?: string) => (category ? `videos:${category}` : 'videos:all'),
  faqs: (category?: string) => (category ? `faqs:${category}` : 'faqs:all'),
  pageContent: (slug: string) => `page:${slug}`,
  reports: (type: string, dateRange: string) => `reports:${type}:${dateRange}`,
}

/**
 * Cache invalidation helpers
 */
export const InvalidateCache = {
  user: (userId: string) => {
    cache.delete(CacheKeys.user(userId))
    cache.delete(CacheKeys.userProfile(userId))
    cache.delete(CacheKeys.dashboard(userId))
  },

  commissions: (userId: string) => {
    cache.delete(CacheKeys.commissions(userId))
    cache.delete(CacheKeys.dashboard(userId))
    // Also invalidate monthly caches
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    for (const month of months) {
      cache.delete(CacheKeys.commissions(userId, `2024-${month}`))
      cache.delete(CacheKeys.commissions(userId, `2025-${month}`))
    }
  },

  downline: (userId: string) => {
    cache.delete(CacheKeys.downline(userId))
    cache.delete(CacheKeys.dashboard(userId))
  },

  products: () => {
    cache.delete(CacheKeys.products())
  },

  product: (productId: string) => {
    cache.delete(CacheKeys.product(productId))
    cache.delete(CacheKeys.products())
  },

  content: () => {
    cache.delete(CacheKeys.testimonials())
    cache.delete(CacheKeys.videos())
    cache.delete(CacheKeys.faqs())
  },

  settings: () => {
    cache.delete(CacheKeys.settings())
  },

  all: () => {
    cache.clear()
  },
}

/**
 * Decorator for caching function results
 */
export function Cached(keyGenerator: (...args: any[]) => string, ttl: number = TTL.FIVE_MINUTES) {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const key = keyGenerator(...args)
      const cached = cache.get(key)

      if (cached !== null) {
        return cached
      }

      const result = await originalMethod.apply(this, args)
      cache.set(key, result, ttl)
      return result
    }

    return descriptor
  }
}

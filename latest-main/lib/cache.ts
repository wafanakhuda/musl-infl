// Advanced caching utilities
interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  maxSize?: number // Maximum cache size
  serialize?: boolean // Whether to serialize complex objects
}

class AdvancedCache {
  private cache = new Map<string, { value: any; expires: number; hits: number }>()
  private maxSize: number
  private defaultTTL: number

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || 1000
    this.defaultTTL = options.ttl || 5 * 60 * 1000 // 5 minutes default
  }

  set(key: string, value: any, ttl?: number): void {
    // Evict expired entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictExpired()

      // If still full, evict least recently used
      if (this.cache.size >= this.maxSize) {
        this.evictLRU()
      }
    }

    const expires = Date.now() + (ttl || this.defaultTTL)
    this.cache.set(key, { value, expires, hits: 0 })
  }

  get(key: string): any {
    const entry = this.cache.get(key)

    if (!entry) return null

    if (Date.now() > entry.expires) {
      this.cache.delete(key)
      return null
    }

    entry.hits++
    return entry.value
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    if (!entry) return false

    if (Date.now() > entry.expires) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  private evictExpired(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        this.cache.delete(key)
      }
    }
  }

  private evictLRU(): void {
    let lruKey = ""
    let lruHits = Number.POSITIVE_INFINITY

    for (const [key, entry] of this.cache.entries()) {
      if (entry.hits < lruHits) {
        lruHits = entry.hits
        lruKey = key
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey)
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: this.calculateHitRate(),
    }
  }

  private calculateHitRate(): number {
    let totalHits = 0
    let totalEntries = 0

    for (const entry of this.cache.values()) {
      totalHits += entry.hits
      totalEntries++
    }

    return totalEntries > 0 ? totalHits / totalEntries : 0
  }
}

// Global cache instances
export const apiCache = new AdvancedCache({ ttl: 5 * 60 * 1000, maxSize: 500 }) // 5 minutes
export const userCache = new AdvancedCache({ ttl: 15 * 60 * 1000, maxSize: 100 }) // 15 minutes
export const staticCache = new AdvancedCache({ ttl: 60 * 60 * 1000, maxSize: 200 }) // 1 hour

// React hook for caching
export function useCache(cacheInstance: AdvancedCache = apiCache) {
  return {
    get: cacheInstance.get.bind(cacheInstance),
    set: cacheInstance.set.bind(cacheInstance),
    has: cacheInstance.has.bind(cacheInstance),
    delete: cacheInstance.delete.bind(cacheInstance),
    clear: cacheInstance.clear.bind(cacheInstance),
  }
}

// Cached API client wrapper
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  cacheKey: (args: Parameters<T>) => string,
  ttl?: number,
): T {
  return (async (...args: Parameters<T>) => {
    const key = cacheKey(args)

    // Check cache first
    if (apiCache.has(key)) {
      return apiCache.get(key)
    }

    // Execute function and cache result
    try {
      const result = await fn(...args)
      apiCache.set(key, result, ttl)
      return result
    } catch (error) {
      // Don't cache errors
      throw error
    }
  }) as T
}

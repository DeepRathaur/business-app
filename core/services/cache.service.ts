/**
 * Simple in-memory cache for configuration and other data
 */

const cache = new Map<string, { value: unknown; timestamp: number }>();

/** Default TTL 5 minutes (ms) */
const DEFAULT_TTL = 5 * 60 * 1000;

class CacheService {
  get<T>(key: string): T | null {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > DEFAULT_TTL) {
      cache.delete(key);
      return null;
    }
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlMs = DEFAULT_TTL): void {
    cache.set(key, { value, timestamp: Date.now() });
  }

  clear(key?: string): void {
    if (key) cache.delete(key);
    else cache.clear();
  }
}

export const cacheService = new CacheService();

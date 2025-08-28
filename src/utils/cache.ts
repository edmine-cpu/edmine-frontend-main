// Simple in-memory cache with TTL
class SimpleCache {
  private cache = new Map<string, { data: any; expires: number }>();

  set(key: string, data: any, ttlMs: number = 5 * 60 * 1000) {
    const expires = Date.now() + ttlMs;
    this.cache.set(key, { data, expires });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }
}

export const cache = new SimpleCache();

// Cache wrapper for API calls
export async function cachedFetch(
  url: string,
  options: RequestInit = {},
  ttlMs: number = 5 * 60 * 1000
): Promise<any> {
  const cacheKey = `${url}_${JSON.stringify(options)}`;
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch data
  try {
    const response = await fetch(url, {
      credentials: 'include',
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Cache successful responses
    cache.set(cacheKey, data, ttlMs);
    
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// Prefetch utility for critical data
export function prefetchData(url: string, options: RequestInit = {}) {
  // Use requestIdleCallback if available, otherwise setTimeout
  if (typeof window !== 'undefined') {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        cachedFetch(url, options).catch(() => {
          // Ignore prefetch errors
        });
      });
    } else {
      setTimeout(() => {
        cachedFetch(url, options).catch(() => {
          // Ignore prefetch errors
        });
      }, 100);
    }
  }
}

// Invalidate cache for specific patterns
export function invalidateCache(pattern: string) {
  const keys = Array.from(cache['cache'].keys());
  keys.forEach(key => {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  });
}

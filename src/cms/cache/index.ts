import type { CacheEntry, CacheConfig } from "@/cms/types"

const DEFAULT_CONFIG: CacheConfig = {
  ttl: 60_000,
  maxSize: 500,
}

export class CacheLayer {
  private store = new Map<string, CacheEntry<unknown>>()
  private config: CacheConfig

  constructor(config?: Partial<CacheConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key)
    if (!entry) return undefined
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return undefined
    }
    return entry.value as T
  }

  set<T>(key: string, value: T, ttl?: number): void {
    if (this.store.size >= this.config.maxSize) {
      const firstKey = this.store.keys().next().value
      if (firstKey) this.store.delete(firstKey)
    }
    this.store.set(key, {
      value,
      expiresAt: Date.now() + (ttl ?? this.config.ttl),
    })
  }

  getOrSet<T>(key: string, fn: () => T, ttl?: number): T {
    const cached = this.get<T>(key)
    if (cached !== undefined) return cached
    const value = fn()
    this.set(key, value, ttl)
    return value
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.store.clear()
      return
    }
    const regex = new RegExp(pattern)
    for (const key of this.store.keys()) {
      if (regex.test(key)) this.store.delete(key)
    }
  }

  get size(): number {
    return this.store.size
  }
}

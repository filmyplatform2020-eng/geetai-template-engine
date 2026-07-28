import type { Product } from "@/engine/product/types"

export type ProviderId = "local" | "json" | "markdown" | "mdx" | "yaml" | "headless" | "rest" | "graphql" | "supabase" | "postgresql"

export interface ProviderConfig {
  id: ProviderId
  name: string
  options?: Record<string, unknown>
}

export interface ProductProvider {
  readonly id: ProviderId
  readonly name: string

  getProduct(slug: string): Product | null
  getAllProducts(): Product[]
  getProductsByCategory(category: string): Product[]
  getProductsByBrand(brand: string): Product[]
  searchProducts(query: string): Product[]
  getCategories(): string[]
  getBrands(): string[]
  getProductCount(): number

  createProduct?(product: Product): Product
  updateProduct?(slug: string, data: Partial<Product>): Product | null
  deleteProduct?(slug: string): boolean
}

export interface CacheEntry<T> {
  value: T
  expiresAt: number
}

export interface CacheConfig {
  ttl: number
  maxSize: number
}

export interface CMSConfig {
  provider: ProviderConfig
  cache: CacheConfig
}

export type { Product }

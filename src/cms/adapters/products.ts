import { cmsConfig } from "@/cms/config"
import { createProvider } from "@/cms/providers"
import { CacheLayer } from "@/cms/cache"
import type { Product } from "@/cms/types"

const cache = new CacheLayer(cmsConfig.cache)
const provider = createProvider(cmsConfig.provider.id)

function cacheKey(prefix: string, slug?: string): string {
  return slug ? `product:${prefix}:${slug}` : `product:${prefix}`
}

export function getProduct(slug: string): Product | null {
  return cache.getOrSet(cacheKey("single", slug), () => provider.getProduct(slug))
}

export function getAllProducts(): Product[] {
  return cache.getOrSet(cacheKey("all"), () => provider.getAllProducts())
}

export function getProductsByCategory(category: string): Product[] {
  return cache.getOrSet(cacheKey("category", category), () => provider.getProductsByCategory(category))
}

export function getProductsByBrand(brand: string): Product[] {
  return cache.getOrSet(cacheKey("brand", brand), () => provider.getProductsByBrand(brand))
}

export function searchProducts(query: string): Product[] {
  return provider.searchProducts(query)
}

export function getCategories(): string[] {
  return cache.getOrSet(cacheKey("categories"), () => provider.getCategories())
}

export function getBrands(): string[] {
  return cache.getOrSet(cacheKey("brands"), () => provider.getBrands())
}

export function getProductCount(): number {
  return cache.getOrSet(cacheKey("count"), () => provider.getProductCount())
}

export function createProduct(product: Product): Product {
  const result = provider.createProduct!(product)
  cache.invalidate()
  return result
}

export function updateProduct(slug: string, data: Partial<Product>): Product | null {
  const result = provider.updateProduct!(slug, data)
  if (result) cache.invalidate()
  return result
}

export function deleteProduct(slug: string): boolean {
  const result = provider.deleteProduct!(slug)
  if (result) cache.invalidate()
  return result
}

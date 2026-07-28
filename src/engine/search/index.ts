import type { Product } from "@/engine/product/types"

export interface SearchResult {
  product: Product
  score: number
}

export function searchProducts(
  products: Product[],
  query: string,
  filters?: {
    category?: string
    brand?: string
    minPrice?: number
    maxPrice?: number
    minRating?: number
    tags?: string[]
  }
): SearchResult[] {
  const q = query.toLowerCase().trim()

  let results: SearchResult[] = []

  if (!q) {
    results = products.map((product) => ({ product, score: 0 }))
  } else {
    results = products
      .map((product) => {
        const nameScore = product.product.toLowerCase().includes(q) ? 10 : 0
        const brandScore = product.brand.toLowerCase().includes(q) ? 8 : 0
        const descScore = product.description.toLowerCase().includes(q) ? 4 : 0
        const tagScore = product.tags.some((t) => t.toLowerCase().includes(q)) ? 6 : 0
        const categoryScore = product.category.toLowerCase().includes(q) ? 5 : 0
        const featureScore = product.features.some(
          (f) => f.title.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)
        )
          ? 3
          : 0

        const score = nameScore + brandScore + descScore + tagScore + categoryScore + featureScore
        return { product, score }
      })
      .filter((r) => r.score > 0)
  }

  if (filters) {
    results = results.filter((r) => {
      const p = r.product
      if (filters.category && p.category !== filters.category) return false
      if (filters.brand && p.brand !== filters.brand) return false
      if (filters.minPrice !== undefined && p.price < filters.minPrice) return false
      if (filters.maxPrice !== undefined && p.price > filters.maxPrice) return false
      if (filters.minRating !== undefined && p.rating < filters.minRating) return false
      if (filters.tags?.length && !filters.tags.some((t) => p.tags.includes(t))) return false
      return true
    })
  }

  return results.sort((a, b) => b.score - a.score)
}

export function getUniqueCategories(products: Product[]): string[] {
  return [...new Set(products.map((p) => p.category))]
}

export function getUniqueBrands(products: Product[]): string[] {
  return [...new Set(products.map((p) => p.brand))]
}

export function getPriceRange(products: Product[]): { min: number; max: number } {
  const prices = products.map((p) => p.price)
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }
}

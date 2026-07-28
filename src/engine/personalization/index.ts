import type { Product } from "@/engine/product/types"

const RECENT_KEY = "geetai_recently_viewed"
const MAX_RECENT = 12

export function addToRecentlyViewed(slug: string): void {
  if (typeof window === "undefined") return
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    const viewed: string[] = raw ? JSON.parse(raw) : []
    const updated = [slug, ...viewed.filter((s) => s !== slug)].slice(0, MAX_RECENT)
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated))
  } catch {}
}

export function getRecentlyViewed(allProducts: Product[]): Product[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    if (!raw) return []
    const slugs: string[] = JSON.parse(raw)
    const map = new Map(allProducts.map((p) => [p.slug, p]))
    return slugs.map((s) => map.get(s)).filter(Boolean) as Product[]
  } catch {
    return []
  }
}

export function getRelatedProducts(product: Product, allProducts: Product[], limit = 4): Product[] {
  return allProducts
    .filter((p) => p.slug !== product.slug)
    .map((p) => {
      let score = 0
      if (p.category === product.category) score += 4
      const sharedTags = p.tags.filter((t) => product.tags.includes(t))
      score += sharedTags.length * 2
      if (Math.abs(p.price - product.price) / product.price < 0.3) score += 1
      return { product: p, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.product)
}

export function getTrendingProducts(products: Product[], limit = 4): Product[] {
  return [...products]
    .sort((a, b) => {
      const aScore = a.rating * a.reviewCount
      const bScore = b.rating * b.reviewCount
      return bScore - aScore
    })
    .slice(0, limit)
}

export function getAlsoViewed(product: Product, allProducts: Product[], limit = 4): Product[] {
  return allProducts
    .filter((p) => p.slug !== product.slug)
    .filter((p) => p.category === product.category)
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, limit)
}

export function getRecommendedAccessories(product: Product, allProducts: Product[], limit = 6): Product[] {
  const accessorySlugs = new Set(product.accessories.map((a) => a.slug))
  return allProducts
    .filter((p) => accessorySlugs.has(p.slug))
    .slice(0, limit)
}

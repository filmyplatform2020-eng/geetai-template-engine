/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest"
import { getRelatedProducts, getTrendingProducts } from "../index"

const base = { tagline: "", description: "", images: [], features: [], pros: [], cons: [], specifications: [], reviews: [], faq: [], comparison: { with: "", items: [] }, buyLinks: [], alternatives: [], accessories: [], verdict: "", guide: { sections: [] }, seo: { title: "", description: "", keywords: [] }, currency: "$" }

const products: any[] = [
  { ...base, slug: "a", product: "Alpha", brand: "X", category: "laptops", tags: ["apple", "pro"], price: 2000, rating: 4.8, reviewCount: 500 },
  { ...base, slug: "b", product: "Beta", brand: "Y", category: "laptops", tags: ["apple"], price: 1500, rating: 4.5, reviewCount: 300 },
  { ...base, slug: "c", product: "Gamma", brand: "Z", category: "phones", tags: ["android"], price: 800, rating: 4.2, reviewCount: 100 },
]

describe("getRelatedProducts", () => {
  it("ranks same-category products higher", () => {
    const result = getRelatedProducts(products[0], products)
    expect(result[0].slug).toBe("b")
  })

  it("excludes the source product", () => {
    const result = getRelatedProducts(products[0], products)
    expect(result.find((p) => p.slug === "a")).toBeUndefined()
  })
})

describe("getTrendingProducts", () => {
  it("sorts by rating * reviewCount descending", () => {
    const result = getTrendingProducts(products)
    expect(result[0].slug).toBe("a")
    expect(result[2].slug).toBe("c")
  })
})

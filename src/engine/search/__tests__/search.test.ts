/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest"
import { searchProducts } from "../index"

const base = { tagline: "", images: [], pros: [], cons: [], specifications: [], reviews: [], faq: [], comparison: { with: "", items: [] }, buyLinks: [], alternatives: [], accessories: [], verdict: "", guide: { sections: [] }, seo: { title: "", description: "", keywords: [] }, currency: "$" }

const products: any[] = [
  { ...base, slug: "mbp", product: "MacBook Pro", brand: "Apple", category: "laptops", tags: ["apple", "pro"], price: 2499, rating: 4.8, description: "Powerful laptop", features: [{ title: "M4 Chip", description: "Fast" }] },
  { ...base, slug: "iphone", product: "iPhone 16", brand: "Apple", category: "phones", tags: ["apple", "phone"], price: 999, rating: 4.7, description: "Latest iPhone", features: [] },
]

describe("searchProducts", () => {
  it("finds by product name", () => {
    const r = searchProducts(products, "MacBook")
    expect(r).toHaveLength(1)
    expect(r[0].product.slug).toBe("mbp")
  })

  it("finds by brand", () => {
    const r = searchProducts(products, "Apple")
    expect(r).toHaveLength(2)
  })

  it("scores exact name matches highest", () => {
    const r = searchProducts(products, "iPhone")
    expect(r[0].product.slug).toBe("iphone")
  })

  it("filters by category", () => {
    const r = searchProducts(products, "", { category: "laptops" })
    expect(r).toHaveLength(1)
  })
})

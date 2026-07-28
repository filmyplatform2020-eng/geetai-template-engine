/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest"
import { generateSEO } from "../index"

const mockProduct: any = {
  slug: "test-product",
  product: "Test Product",
  brand: "TestBrand",
  tagline: "Test tagline",
  description: "A great product for testing.",
  price: 999,
  currency: "$",
  rating: 4.5,
  reviewCount: 100,
  images: [{ src: "/test.jpg", alt: "test" }],
  category: "laptops",
  tags: ["test"],
  features: [],
  pros: [],
  cons: [],
  specifications: [],
  reviews: [],
  faq: [],
  comparison: { with: "", items: [] },
  buyLinks: [],
  alternatives: [],
  accessories: [],
  verdict: "",
  guide: { sections: [] },
  seo: {
    title: "Test SEO",
    description: "SEO description",
    keywords: ["test", "seo"],
  },
}

describe("generateSEO", () => {
  it("generates title with product name", () => {
    const seo = generateSEO(mockProduct)
    expect(seo.title).toContain("Test Product")
  })

  it("generates OG tags", () => {
    const seo = generateSEO(mockProduct)
    expect(seo.ogTitle).toContain("Test Product")
    expect(seo.ogImage).toBe("/test.jpg")
  })

  it("generates canonical URL", () => {
    const seo = generateSEO(mockProduct)
    expect(seo.canonical).toBe("https://geetai.com/review/test-product")
  })

  it("generates keywords string", () => {
    const seo = generateSEO(mockProduct)
    expect(seo.keywords).toContain("test")
  })
})

import { describe, it, expect } from "vitest"
import { validateGeneratedProduct, validateProduct } from "../validator"
import { slugify } from "../enricher"
import { detectCategory } from "../extractor"
import type { Product } from "@/engine/product/types"
import type { GeneratedProduct } from "@/engine/ai/types"

describe("slugify", () => {
  it("converts product name to slug", () => {
    expect(slugify("MacBook Pro 16 M4")).toBe("macbook-pro-16-m4")
  })

  it("handles special characters", () => {
    expect(slugify("Sony WH-1000XM6!")).toBe("sony-wh-1000xm6")
  })

  it("trims whitespace", () => {
    expect(slugify("  iPhone 16  ")).toBe("iphone-16")
  })
})

describe("validateGeneratedProduct", () => {
  it("accepts valid product", () => {
    const valid: GeneratedProduct = {
      slug: "test", product: "Test", brand: "T",
      tagline: "Tag", description: "Desc",
      price: 999, currency: "$", rating: 4.5,
      reviewCount: 100, category: "laptops", tags: ["test"],
      features: [], pros: [], cons: [],
      specifications: [], reviews: [], faq: [],
      comparison: { with: "", items: [] },
      buyLinks: [], alternatives: [],
      accessories: [], verdict: "Verdict",
      guideSections: [], seo: { title: "T", description: "D", keywords: [] },
    }
    const result = validateGeneratedProduct(valid)
    expect(result.valid).toBe(true)
  })

  it("rejects missing required fields", () => {
    const result = validateGeneratedProduct({})
    expect(result.valid).toBe(false)
    expect(result.issues.some((i) => i.field === "slug")).toBe(true)
  })

  it("rejects invalid rating", () => {
    const base: GeneratedProduct = {
      slug: "test", product: "Test", brand: "T",
      tagline: "Tag", description: "Desc",
      price: 999, currency: "$", rating: 6,
      reviewCount: 100, category: "laptops", tags: [],
      features: [], pros: [], cons: [],
      specifications: [], reviews: [], faq: [],
      comparison: { with: "", items: [] },
      buyLinks: [], alternatives: [],
      accessories: [], verdict: "V",
      guideSections: [], seo: { title: "T", description: "D", keywords: [] },
    }
    const result = validateGeneratedProduct(base)
    expect(result.valid).toBe(false)
  })

  it("warns on non-positive price", () => {
    const base: GeneratedProduct = {
      slug: "test", product: "Test", brand: "T",
      tagline: "Tag", description: "Desc",
      price: 0, currency: "$", rating: 4,
      reviewCount: 100, category: "laptops", tags: [],
      features: [], pros: [], cons: [],
      specifications: [], reviews: [], faq: [],
      comparison: { with: "", items: [] },
      buyLinks: [], alternatives: [],
      accessories: [], verdict: "V",
      guideSections: [], seo: { title: "T", description: "D", keywords: [] },
    }
    const result = validateGeneratedProduct(base)
    expect(result.valid).toBe(true)
    expect(result.issues.some((i) => i.field === "price")).toBe(true)
  })
})

describe("validateProduct", () => {
  it("checks for missing content", () => {
    const p: Product = {
      slug: "test", product: "Test", brand: "T",
      tagline: "T", description: "D",
      price: 100, currency: "$", rating: 4, reviewCount: 10,
      images: [], features: [], pros: [], cons: [],
      specifications: [], reviews: [], faq: [],
      comparison: { with: "", items: [] },
      buyLinks: [], category: "laptops", tags: [],
      alternatives: [], accessories: [],
      verdict: "", guide: { sections: [] },
      seo: { title: "", description: "", keywords: [] },
    }
    const issues = validateProduct(p)
    expect(issues.length).toBeGreaterThan(0)
    expect(issues.some((i) => i.field === "images")).toBe(true)
    expect(issues.some((i) => i.field === "buyLinks")).toBe(true)
    expect(issues.some((i) => i.field === "reviews")).toBe(true)
  })
})

describe("detectCategory", () => {
  it("detects laptops", () => {
    expect(detectCategory("MacBook Pro 2025", "powerful laptop")).toBe("laptops")
  })

  it("detects phones", () => {
    expect(detectCategory("iPhone 16 Pro Max", "smartphone")).toBe("phones")
  })

  it("detects cameras", () => {
    expect(detectCategory("Sony A7 V Mirrorless", "camera review")).toBe("cameras")
  })

  it("detects wearables", () => {
    expect(detectCategory("Apple Watch Ultra 3", "fitness tracker watch")).toBe("wearables")
  })

  it("defaults to laptops", () => {
    expect(detectCategory("Generic Gadget", "some device")).toBe("laptops")
  })
})

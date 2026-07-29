import { GeminiEngine } from "@/engine/ai"
import type { GeneratedProduct } from "@/engine/ai/types"
import { appendAffiliateTag } from "@/engine/affiliate"
import { validateGeneratedProduct } from "./validator"
import type { ScrapedData } from "./types"

export interface EnrichResult {
  product?: GeneratedProduct
  error?: string
  warnings: string[]
}

export async function enrichProduct(
  scraped: ScrapedData,
  gemini?: GeminiEngine
): Promise<EnrichResult> {
  const warnings: string[] = []

  if (gemini && scraped.productName) {
    try {
      const aiResult = await gemini.generateProduct(
        scraped.productName,
        scraped.brand || "Unknown",
        scraped.category
      )

      const merged = mergeScrapedWithAI(scraped, aiResult)
      const validation = validateGeneratedProduct(merged)
      warnings.push(...validation.issues.map((i) => `[${i.severity}] ${i.field}: ${i.message}`))

      if (validation.product) {
        return { product: validation.product, warnings }
      }
    } catch (e: unknown) {
      warnings.push(`AI enrichment failed: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  const basic = buildBasicProduct(scraped)
  return { product: basic, warnings }
}

function mergeScrapedWithAI(scraped: ScrapedData, ai: GeneratedProduct): GeneratedProduct {
  return {
    ...ai,
    slug: ai.slug || slugify(scraped.productName),
    product: scraped.productName || ai.product,
    brand: scraped.brand || ai.brand,
    price: scraped.price || ai.price,
    currency: scraped.currency || ai.currency,
    description: scraped.description || ai.description,
    category: scraped.category || ai.category,
    tagline: ai.tagline || `${scraped.productName} - ${scraped.brand}`,
    reviews: ai.reviews || [],
    faq: ai.faq || [],
    comparison: ai.comparison || { with: "", items: [] },
    buyLinks: [
      { store: "Amazon", url: appendAffiliateTag(scraped.url, "Amazon"), price: scraped.price || ai.price, currency: scraped.currency || ai.currency, available: true, badge: "Best Price" },
      ...(ai.buyLinks || []).filter((l) => l.url !== scraped.url).map((l) => ({ ...l, url: appendAffiliateTag(l.url, l.store) })),
    ],
    alternatives: ai.alternatives || [],
    accessories: ai.accessories || [],
    verdict: ai.verdict || "Coming soon.",
    guideSections: ai.guideSections || [],
    seo: ai.seo || { title: `${scraped.productName} Review`, description: scraped.description.slice(0, 155), keywords: [scraped.productName, scraped.brand] },
  }
}

function buildBasicProduct(scraped: ScrapedData): GeneratedProduct {
  const slug = slugify(scraped.productName)
  return {
    slug,
    product: scraped.productName,
    brand: scraped.brand || "Unknown",
    tagline: `${scraped.productName} - Complete Review`,
    description: scraped.description || "Detailed review coming soon.",
    price: scraped.price || 0,
    currency: scraped.currency || "$",
    rating: scraped.rating || 0,
    reviewCount: scraped.reviewCount || 0,
    category: scraped.category || "laptops",
    tags: [scraped.productName, scraped.brand || "", "review"].filter(Boolean),
    features: [],
    pros: [],
    cons: [],
    specifications: [],
    reviews: [],
    faq: [],
    comparison: { with: "", items: [] },
    buyLinks: scraped.url ? [{ store: "Amazon", url: appendAffiliateTag(scraped.url, "Amazon"), price: scraped.price || 0, currency: scraped.currency || "$", available: true, badge: "Best Price" }] : [],
    alternatives: [],
    accessories: [],
    verdict: "Review pending.",
    guideSections: [],
    seo: { title: `${scraped.productName} Review`, description: scraped.description?.slice(0, 155) || `${scraped.productName} detailed review`, keywords: [scraped.productName, scraped.brand || ""] },
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

export function deriveRelatedProducts(category: string, excludeSlug: string): { name: string; slug: string; description: string; rating: number; price: number }[] {
  try {
    const { getProductsByCategory } = require("@/data/products")
    const sameCategory = getProductsByCategory(category) as { slug: string; product: string; description: string; rating: number; price: number }[]
    if (!Array.isArray(sameCategory)) return []

    return sameCategory
      .filter((p) => p.slug !== excludeSlug)
      .slice(0, 3)
      .map((p) => ({
        name: p.product,
        slug: p.slug,
        description: (p.description || "").slice(0, 120),
        rating: p.rating || 0,
        price: p.price || 0,
      }))
  } catch {
    return []
  }
}

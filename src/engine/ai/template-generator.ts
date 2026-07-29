import * as fs from "fs"
import * as path from "path"
import type { GeneratedProduct, GenerateResult } from "./types"

const PRODUCTS_DIR = path.resolve("src/data/products")
const REGISTRY_FILE = path.resolve("src/data/products/registry.ts")

export function generateProductFile(product: GeneratedProduct): GenerateResult {
  try {
    const slug = product.slug
    const filePath = path.join(PRODUCTS_DIR, `${slug}.ts`)

    if (fs.existsSync(filePath)) {
      return { slug, filePath, success: false, error: "File already exists" }
    }

    const imagePaths = [
      { src: `/images/${slug}-front.webp`, alt: `${product.product} front view` },
      { src: `/images/${slug}-angle.webp`, alt: `${product.product} angled view` },
      { src: `/images/${slug}-back.webp`, alt: `${product.product} back view` },
      { src: `/images/${slug}-detail.webp`, alt: `${product.product} detail view` },
    ]

    const features = product.features.map((f) => ({
      title: f.title,
      description: f.description,
    }))

    const comparisonItems = product.comparison.items.map((item) => {
      const ci: { feature: string; this: string; other: string; winner?: "this" | "other" } = {
        feature: item.feature,
        this: item.this,
        other: item.other,
      }
      if (item.winner === "this" || item.winner === "other") ci.winner = item.winner
      return ci
    })

    const reviews = product.reviews.map((r) => ({
      id: `r${Math.random().toString(36).slice(2, 6)}`,
      name: r.name,
      rating: r.rating,
      title: r.title,
      content: r.content,
      date: ["2025-12-10", "2025-11-20", "2025-10-30", "2025-12-01", "2025-11-15", "2025-10-25"][Math.floor(Math.random() * 6)],
      verified: true,
    }))

    const importName = slug.replace(/[-]+(\w)/g, (_, c) => c.toUpperCase())

    const content = `import type { Product } from "@/engine/product/types"

export const ${importName}: Product = ${JSON.stringify(
      {
        slug,
        product: product.product,
        brand: product.brand,
        tagline: product.tagline,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        currency: product.currency,
        rating: product.rating,
        reviewCount: product.reviewCount,
        images: imagePaths,
        features,
        pros: product.pros,
        cons: product.cons,
        specifications: product.specifications,
        reviews,
        faq: product.faq,
        comparison: { with: product.comparison.with, items: comparisonItems },
        buyLinks: product.buyLinks,
        category: product.category,
        tags: product.tags,
        videoUrl: `https://www.youtube.com/watch?v=example-${slug}`,
        alternatives: product.alternatives,
        accessories: product.accessories,
        verdict: product.verdict,
        guide: { sections: product.guideSections },
        seo: product.seo,
      },
      null,
      2
    ).replace(/"(\w+)":/g, "$1:")}
`

    fs.writeFileSync(filePath, content, "utf-8")
    return { slug, filePath, success: true }
  } catch (e) {
    return { slug: product.slug, filePath: "", success: false, error: e instanceof Error ? e.message : String(e) }
  }
}

export function addToRegistry(slug: string): boolean {
  const importName = slug.replace(/[-]+(\w)/g, (_, c) => c.toUpperCase())
  const importLine = `import { ${importName} } from "./${slug}"`
  const entryLine = `  [${importName}.slug]: ${importName},`

  let content = fs.readFileSync(REGISTRY_FILE, "utf-8")

  if (content.includes(entryLine.trim())) return false
  if (content.includes(importLine)) return false

  const lastImport = content.lastIndexOf("\nimport ")
  const insertPos = content.indexOf("\n", lastImport) + 1
  content = content.slice(0, insertPos) + importLine + "\n" + content.slice(insertPos)

  const objClose = content.lastIndexOf("\n}")
  const entryPos = content.lastIndexOf("\n", objClose - 1) + 1
  content = content.slice(0, entryPos) + entryLine + "\n" + content.slice(entryPos)

  fs.writeFileSync(REGISTRY_FILE, content, "utf-8")
  return true
}

export function countProducts(): number {
  return fs.readdirSync(PRODUCTS_DIR).filter((f) => f.endsWith(".ts") && f !== "index.ts" && f !== "registry.ts").length
}

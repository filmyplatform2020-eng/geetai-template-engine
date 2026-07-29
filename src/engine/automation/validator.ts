import type { Product } from "@/engine/product/types"
import type { GeneratedProduct } from "@/engine/ai/types"

export interface ValidationIssue {
  field: string
  message: string
  severity: "error" | "warning"
}

export function validateGeneratedProduct(data: unknown): { valid: boolean; issues: ValidationIssue[]; product?: GeneratedProduct } {
  const issues: ValidationIssue[] = []

  if (!data || typeof data !== "object") {
    issues.push({ field: "root", message: "Input is not an object", severity: "error" })
    return { valid: false, issues }
  }

  const d = data as Record<string, unknown>

  const required: [string, string][] = [
    ["slug", "string"], ["product", "string"], ["brand", "string"],
    ["tagline", "string"], ["description", "string"],
    ["price", "number"], ["currency", "string"], ["rating", "number"],
    ["category", "string"],
  ]

  for (const [field, type] of required) {
    if (d[field] == null) {
      issues.push({ field, message: `Missing required field: ${field}`, severity: "error" })
    } else if (typeof d[field] !== type) {
      issues.push({ field, message: `${field} should be ${type}, got ${typeof d[field]}`, severity: "error" })
    }
  }

  for (const arr of ["features", "pros", "cons", "specifications", "reviews", "faq", "buyLinks", "tags", "alternatives", "accessories", "guideSections"]) {
    if (d[arr] != null && !Array.isArray(d[arr])) {
      issues.push({ field: arr, message: `${arr} should be an array`, severity: "error" })
    }
  }

  if (d.price != null && typeof d.price === "number" && d.price <= 0) {
    issues.push({ field: "price", message: "Price should be positive", severity: "warning" })
  }

  if (d.rating != null && typeof d.rating === "number" && (d.rating < 0 || d.rating > 5)) {
    issues.push({ field: "rating", message: "Rating should be 0-5", severity: "error" })
  }

  if (d.comparison && typeof d.comparison === "object") {
    const cmp = d.comparison as Record<string, unknown>
    if (!cmp.with || !Array.isArray(cmp.items)) {
      issues.push({ field: "comparison", message: "Comparison must have `with` string and `items` array", severity: "warning" })
    }
  }

  if (!d.seo || typeof d.seo !== "object") {
    issues.push({ field: "seo", message: "Missing seo object", severity: "warning" })
  }

  const hasError = issues.some((i) => i.severity === "error")
  return { valid: !hasError, issues, product: hasError ? undefined : (data as GeneratedProduct) }
}

export function validateProduct(product: Product): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  if (!product.images?.length) {
    issues.push({ field: "images", message: "No images defined", severity: "warning" })
  }

  if (!product.buyLinks?.length) {
    issues.push({ field: "buyLinks", message: "No buy links — product can't be purchased", severity: "warning" })
  }

  const badLinks = product.buyLinks?.filter((l) => !l.url || l.url === "#" || l.url.startsWith("https://example"))
  if (badLinks?.length) {
    issues.push({ field: "buyLinks", message: `${badLinks.length} buy link(s) have placeholder URLs`, severity: "warning" })
  }

  if (!product.reviews?.length) {
    issues.push({ field: "reviews", message: "No reviews", severity: "warning" })
  }

  if (!product.faq?.length) {
    issues.push({ field: "faq", message: "No FAQ items", severity: "warning" })
  }

  if (!product.specifications?.length) {
    issues.push({ field: "specifications", message: "No specifications", severity: "warning" })
  }

  if (!product.seo?.title) {
    issues.push({ field: "seo.title", message: "Missing SEO title", severity: "warning" })
  }

  if (!product.seo?.description) {
    issues.push({ field: "seo.description", message: "Missing SEO description", severity: "warning" })
  }

  if (!product.verdict) {
    issues.push({ field: "verdict", message: "Missing verdict", severity: "warning" })
  }

  return issues
}

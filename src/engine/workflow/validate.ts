import type { Product } from "@/engine/product/types"
import type { ValidationResult, ValidationError } from "./types"

export function validateProduct(product: Product): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  // Required text fields
  const requiredFields: [string, string | undefined][] = [
    ["slug", product.slug],
    ["product (name)", product.product],
    ["brand", product.brand],
    ["tagline", product.tagline],
    ["description", product.description],
    ["category", product.category],
    ["verdict", product.verdict],
  ]

  for (const [field, value] of requiredFields) {
    if (!value || value.trim() === "") {
      errors.push({ field, message: `${field} is required`, severity: "error" })
    }
    if (value && value.length < 10 && field !== "slug" && field !== "brand") {
      warnings.push({ field, message: `${field} is very short (${value.length} chars)`, severity: "warning" })
    }
  }

  // Numeric fields
  if (typeof product.price !== "number" || product.price <= 0) {
    errors.push({ field: "price", message: "Price must be a positive number", severity: "error" })
  }
  if (typeof product.rating !== "number" || product.rating < 0 || product.rating > 5) {
    errors.push({ field: "rating", message: "Rating must be between 0 and 5", severity: "error" })
  }
  if (typeof product.reviewCount !== "number" || product.reviewCount < 0) {
    errors.push({ field: "reviewCount", message: "Review count must be a non-negative number", severity: "error" })
  }

  if (!product.currency || product.currency.trim() === "") {
    errors.push({ field: "currency", message: "Currency is required", severity: "error" })
  }

  // Images
  if (!product.images || product.images.length < 1) {
    errors.push({ field: "images", message: "At least 1 image is required", severity: "error" })
  } else if (product.images.length < 2) {
    warnings.push({ field: "images", message: "Recommend at least 2 images", severity: "warning" })
  }

  for (const img of product.images) {
    if (!img.src || img.src.trim() === "") {
      errors.push({ field: "images", message: "Image src is required for all images", severity: "error" })
    }
    if (!img.alt || img.alt.trim() === "") {
      warnings.push({ field: "images", message: "Image alt text is recommended for accessibility", severity: "warning" })
    }
  }

  // Features
  if (!product.features || product.features.length < 2) {
    errors.push({ field: "features", message: "At least 2 features required", severity: "error" })
  }

  // Pros & Cons
  if (!product.pros || product.pros.length < 1) {
    errors.push({ field: "pros", message: "At least 1 pro is required", severity: "error" })
  }
  if (!product.cons || product.cons.length < 1) {
    errors.push({ field: "cons", message: "At least 1 con is required", severity: "error" })
  }

  // Specifications
  if (!product.specifications || product.specifications.length < 2) {
    errors.push({ field: "specifications", message: "At least 2 specifications required", severity: "error" })
  }

  // SEO
  if (!product.seo) {
    errors.push({ field: "seo", message: "SEO metadata is required", severity: "error" })
  } else {
    if (!product.seo.title || product.seo.title.trim() === "") {
      errors.push({ field: "seo.title", message: "SEO title is required", severity: "error" })
    }
    if (!product.seo.description || product.seo.description.trim() === "") {
      errors.push({ field: "seo.description", message: "SEO description is required", severity: "error" })
    }
    if (!product.seo.keywords || product.seo.keywords.length < 2) {
      warnings.push({ field: "seo.keywords", message: "At least 2 SEO keywords recommended", severity: "warning" })
    }
  }

  // Affiliate links
  if (!product.buyLinks || product.buyLinks.length < 1) {
    errors.push({ field: "buyLinks", message: "At least 1 buy link is required", severity: "error" })
  } else {
    for (const link of product.buyLinks) {
      if (!link.url || link.url.trim() === "") {
        errors.push({ field: "buyLinks", message: "Buy link URL is required", severity: "error" })
      } else if (!link.url.startsWith("https://")) {
        warnings.push({ field: "buyLinks", message: `Buy link should use HTTPS: ${link.url}`, severity: "warning" })
      }
      if (!link.store || link.store.trim() === "") {
        errors.push({ field: "buyLinks", message: "Buy link store name is required", severity: "error" })
      }
    }
  }

  // Reviews
  if (!product.reviews || product.reviews.length < 1) {
    warnings.push({ field: "reviews", message: "At least 1 review recommended", severity: "warning" })
  }

  // FAQ
  if (!product.faq || product.faq.length < 1) {
    warnings.push({ field: "faq", message: "At least 1 FAQ recommended", severity: "warning" })
  }

  // Comparison
  if (!product.comparison) {
    errors.push({ field: "comparison", message: "Comparison data is required", severity: "error" })
  } else {
    if (!product.comparison.with) {
      errors.push({ field: "comparison.with", message: "Comparison competitor name is required", severity: "error" })
    }
    if (!product.comparison.items || product.comparison.items.length < 2) {
      errors.push({ field: "comparison.items", message: "At least 2 comparison items required", severity: "error" })
    }
  }

  // Tags
  if (!product.tags || product.tags.length < 1) {
    warnings.push({ field: "tags", message: "At least 1 tag recommended", severity: "warning" })
  }

  // Alternatives
  if (!product.alternatives || product.alternatives.length < 1) {
    warnings.push({ field: "alternatives", message: "At least 1 alternative recommended", severity: "warning" })
  }

  // Guide
  if (!product.guide || !product.guide.sections || product.guide.sections.length < 1) {
    warnings.push({ field: "guide", message: "At least 1 buying guide section recommended", severity: "warning" })
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

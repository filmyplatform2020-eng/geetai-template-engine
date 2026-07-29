import type { Product } from "@/engine/product/types"

export interface SEOData {
  title: string
  description: string
  keywords: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  ogUrl: string
  twitterCard: string
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
  canonical: string
  robots: string
}

export function generateSEO(product: Product, baseUrl = "https://geetai.com"): SEOData {
  const slug = product.slug
  const title = `${product.product} ${product.brand} Review (2025) | GeetAI`
  const description = product.seo?.description ?? product.description.slice(0, 155)
  const keywords = (product.seo?.keywords ?? [product.product, product.brand, "review"]).join(", ")
  const url = `${baseUrl}/review/${slug}`
  const rawImage = product.images[0]?.src
  const image = rawImage && !rawImage.includes("placeholder") ? `${baseUrl}${rawImage}` : `${baseUrl}/og-default.jpg`

  return {
    title,
    description,
    keywords,
    ogTitle: `${product.product} Review - Is It Worth Buying?`,
    ogDescription: description,
    ogImage: image,
    ogUrl: url,
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
    canonical: url,
    robots: "index, follow",
  }
}

export function generateBreadcrumbs(product: Product) {
  return [
    { name: "Home", url: "/" },
    { name: product.category.charAt(0).toUpperCase() + product.category.slice(1), url: `/${product.category}` },
    { name: product.product, url: `/review/${product.slug}` },
  ]
}

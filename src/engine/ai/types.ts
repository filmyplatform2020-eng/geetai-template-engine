export type AiModel = "gemini-2.5-flash" | "gemini-2.5-pro"

export interface AiConfig {
  apiKey: string
  model?: AiModel
}

export interface GeneratedProduct {
  slug: string
  product: string
  brand: string
  tagline: string
  description: string
  price: number
  originalPrice?: number
  currency: string
  rating: number
  reviewCount: number
  category: string
  tags: string[]
  features: { title: string; description: string }[]
  pros: string[]
  cons: string[]
  specifications: { label: string; value: string; category: string }[]
  reviews: { name: string; rating: number; title: string; content: string }[]
  faq: { question: string; answer: string }[]
  comparison: { with: string; items: { feature: string; this: string; other: string; winner?: "this" | "other" }[] }
  buyLinks: { store: string; url: string; price: number; currency: string; available: boolean; badge: string }[]
  alternatives: { name: string; description: string; rating: number; price: number }[]
  accessories: { name: string; description: string; price: number; category: string }[]
  verdict: string
  guideSections: { title: string; content: string; bullets: string[] }[]
  seo: { title: string; description: string; keywords: string[] }
}

export interface GenerateResult {
  slug: string
  filePath: string
  success: boolean
  error?: string
}

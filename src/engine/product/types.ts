export interface ProductImage {
  src: string
  alt: string
  width?: number
  height?: number
}

export interface ProductFeature {
  title: string
  description: string
  icon?: string
}

export interface Specification {
  label: string
  value: string
  category?: string
}

export interface Review {
  id: string
  name: string
  avatar?: string
  rating: number
  title: string
  content: string
  date: string
  verified: boolean
}

export interface FAQItem {
  question: string
  answer: string
}

export interface ComparisonItem {
  feature: string
  this: string
  other: string
  winner?: "this" | "other"
}

export interface BuyLink {
  store: string
  url: string
  price: number
  currency: string
  available: boolean
  badge?: string
}

export interface Alternative {
  name: string
  slug: string
  description: string
  rating: number
  price: number
  pros?: string[]
  cons?: string[]
}

export interface Accessory {
  name: string
  slug: string
  description: string
  price: number
  image?: string
  category: string
}

export interface BuyingGuideSection {
  title: string
  content: string
  bullets?: string[]
}

export interface Product {
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
  images: ProductImage[]
  features: ProductFeature[]
  pros: string[]
  cons: string[]
  specifications: Specification[]
  reviews: Review[]
  faq: FAQItem[]
  comparison: {
    with: string
    items: ComparisonItem[]
  }
  buyLinks: BuyLink[]
  category: string
  tags: string[]
  videoUrl?: string
  alternatives: Alternative[]
  accessories: Accessory[]
  verdict: string
  guide: {
    sections: BuyingGuideSection[]
  }
  seo: {
    title: string
    description: string
    keywords: string[]
  }
}

export type ProductCatalog = Record<string, Product>

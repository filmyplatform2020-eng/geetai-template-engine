import type { Product, BuyLink, ProductImage, Specification } from "@/engine/product/types"

export interface Variant {
  id: string
  label: string
  type: "color" | "storage" | "ram" | "bundle"
  color?: string
  price?: number
  originalPrice?: number
  images?: ProductImage[]
  specifications?: Specification[]
  buyLinks?: BuyLink[]
}

export interface VariantGroup {
  type: "color" | "storage" | "ram" | "bundle"
  label: string
  variants: Variant[]
}

export function applyVariant(product: Product, variant: Variant | null): Product {
  if (!variant) return product

  return {
    ...product,
    price: variant.price ?? product.price,
    originalPrice: variant.originalPrice ?? product.originalPrice,
    images: variant.images ?? product.images,
    specifications: variant.specifications ?? product.specifications,
    buyLinks: variant.buyLinks ?? product.buyLinks,
  }
}

export function getDefaultVariant(groups: VariantGroup[]): Variant | null {
  for (const group of groups) {
    if (group.variants.length) return group.variants[0]
  }
  return null
}

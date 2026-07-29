"use client"

import type { Product } from "@/engine/product/types"
import { addToRecentlyViewed } from "@/engine/personalization"
import { useEffect } from "react"
import ProductPageTemplateV8 from "@/components/templates/ProductPageTemplateV8"

interface Props {
  product: Product
  allProducts: Product[]
}

export default function ReviewPageClient({ product, allProducts }: Props) {
  useEffect(() => {
    addToRecentlyViewed(product.slug)
  }, [product.slug])

  return (
    <ProductPageTemplateV8
      product={product}
      allProducts={allProducts}
    />
  )
}

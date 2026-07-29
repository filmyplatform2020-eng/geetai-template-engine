"use client"

import { useState } from "react"
import type { Product } from "@/engine/product/types"
import type { StyleVariation } from "@/data/styles"
import ProductPageTemplate from "@/components/templates/ProductPageTemplate"

interface Props {
  product: Product
  allProducts: Product[]
  variations: StyleVariation[]
}

export default function ShowcaseClient({ product, allProducts, variations }: Props) {
  const [activeVariation, setActiveVariation] = useState(0)

  return (
    <div className="min-h-screen">
      <nav
        className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-full px-3 py-2"
        style={{
          background: "rgba(255,255,255,0.35)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow: "0 4px 24px rgba(138,158,216,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
        }}
      >
        <div className="flex items-center gap-1">
          {variations.map((v, i) => (
            <button
              key={v.id}
              onClick={() => setActiveVariation(i)}
              className="relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all"
              style={{
                background: i === activeVariation ? v.accent : "transparent",
                color: i === activeVariation ? "#fff" : "#4a4a7a",
              }}
              title={v.label}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </nav>

      <ProductPageTemplate
        product={product}
        allProducts={allProducts}
        styleOverride={variations[activeVariation]}
      />
    </div>
  )
}

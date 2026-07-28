"use client"

import { ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BuyLink } from "@/engine/product/types"

interface StickyMobileCTAProps {
  buyLinks: BuyLink[]
  price: number
  currency: string
}

export default function StickyMobileCTA({
  buyLinks,
  price,
  currency,
}: StickyMobileCTAProps) {
  const best = buyLinks.find((l) => l.available) ?? buyLinks[0]

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.06] bg-[#06060e]/95 backdrop-blur-xl",
        "lg:hidden"
      )}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-xs text-white/40">Starting from</p>
          <p className="text-lg font-bold text-white">
            {currency}
            {price.toLocaleString()}
          </p>
        </div>
        <a
          href={best.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe] px-5 text-sm font-medium text-white shadow-lg shadow-[#6c5ce7]/25"
        >
          <ShoppingCart className="h-4 w-4" />
          Buy Now
        </a>
      </div>
    </div>
  )
}

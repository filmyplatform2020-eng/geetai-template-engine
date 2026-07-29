"use client"

import { motion } from "framer-motion"
import { ShoppingCart, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BuyLink } from "@/engine/product/types"

interface StickyMobileCTAProps {
  productName: string
  buyLinks: BuyLink[]
}

export default function StickyMobileCTA({
  productName,
  buyLinks,
}: StickyMobileCTAProps) {
  if (!buyLinks.length) return null

  const bestDeal = buyLinks.reduce((best, link) =>
    link.price < best.price ? link : best
  )

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-default bg-background/90 backdrop-blur-xl md:hidden"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <div className="text-xs text-secondary">{productName}</div>
          <div className="text-base font-bold text-primary">
            {bestDeal.currency === "USD" ? "$" : bestDeal.currency}
            {bestDeal.price.toLocaleString()}
          </div>
        </div>
        <a
          href={bestDeal.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#06060e] transition-all duration-300 hover:bg-white/95 hover:shadow-lg hover:shadow-white/10 active:scale-[0.97]"
        >
          <ShoppingCart className="h-4 w-4" />
          Buy Now
        </a>
      </div>
    </motion.div>
  )
}

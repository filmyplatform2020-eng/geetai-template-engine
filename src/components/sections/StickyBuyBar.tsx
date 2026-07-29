"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ShoppingCart, Tag, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { sortBuyLinks, getLowestPrice, getSavings, formatPrice } from "@/engine/affiliate"
import type { Product } from "@/engine/product/types"

interface StickyBuyBarProps {
  product: Product
}

export default function StickyBuyBar({ product }: StickyBuyBarProps) {
  const sorted = sortBuyLinks(product.buyLinks)
  const bestPrice = getLowestPrice(product.buyLinks)
  const savings = getSavings(product)
  const bestLink = sorted.find((l) => l.available) ?? sorted[0]

  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [500, 650], [0, 1])
  const y = useTransform(scrollY, [500, 650], [24, 0])

  if (!bestLink) return null

  return (
    <motion.div
      style={{ opacity, y }}
      className="fixed inset-x-0 top-0 z-50 bg-background/85 backdrop-blur-2xl"
    >
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: product name + price */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="hidden sm:block min-w-0">
            <p className="truncate text-sm font-medium text-primary">
              {product.product}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted">
                {product.rating.toFixed(1)} ★
              </span>
              <span className="text-[10px] text-muted">&middot;</span>
              <span className="text-[11px] text-muted">
                {product.reviewCount.toLocaleString()} reviews
              </span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <div className="h-5 w-px bg-white/[0.06]" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-primary">
                {product.currency === "USD" ? "$" : product.currency}
                {product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xs text-muted line-through">
                    {product.currency === "USD" ? "$" : product.currency}
                    {product.originalPrice.toLocaleString()}
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                    Save {savings}%
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: merchants + CTA */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Merchant avatars */}
          <div className="hidden items-center md:flex">
            {sorted.slice(0, 3).map((link, i) => (
              <div
                key={link.store}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border text-[9px] font-bold uppercase transition-colors hover:z-10",
                  "border-default bg-white/[0.04] text-secondary hover:border-strong hover:text-primary",
                  i > 0 && "-ml-2"
                )}
                title={`${link.store}: ${formatPrice(link.price, link.currency === "USD" ? "$" : link.currency)}`}
              >
                {link.store.charAt(0)}
              </div>
            ))}
            {sorted.length > 3 && (
              <div className="-ml-2 flex h-7 w-7 items-center justify-center rounded-full border border-default bg-white/[0.02] text-[9px] text-muted">
                +{sorted.length - 3}
              </div>
            )}
            <div className="mx-3 h-5 w-px bg-white/[0.06]" />
          </div>

          {/* Quick merchant comparison (mobile) */}
          <div className="flex items-center gap-2 sm:hidden">
            <Tag className="h-3.5 w-3.5 text-muted" />
            <span className="text-[11px] text-secondary">
              from {bestLink.store}
            </span>
          </div>

          <a
            href={bestLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-1.5 text-sm font-semibold text-[#06060e] transition-all duration-300 hover:bg-white/90 hover:shadow-lg active:scale-[0.97]"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Buy Now
            <span className="text-[11px] text-black/50">
              {formatPrice(bestPrice ?? product.price, product.currency === "USD" ? "$" : product.currency)}
            </span>
          </a>
        </div>
      </div>
    </motion.div>
  )
}

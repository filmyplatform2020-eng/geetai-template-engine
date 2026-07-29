"use client"

import { motion } from "framer-motion"
import { ShoppingCart, ChevronRight, BadgeCheck, Zap, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import SectionTitle from "@/components/ui/SectionTitle"
import AnimatedSection from "@/components/animations/AnimatedSection"
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer"
import { sortBuyLinks, getLowestPrice, getSavings, formatPrice } from "@/engine/affiliate"
import type { Product } from "@/engine/product/types"

interface MerchantComparisonProps {
  product: Product
}

const storeMeta: Record<string, { icon: string; color: string; features: string[] }> = {
  "Apple": {
    icon: "A",
    color: "from-white to-white/80",
    features: ["Free engraving", "Free shipping", "14-day returns", "AppleCare+"],
  },
  "Amazon": {
    icon: "Az",
    color: "from-[#FF9900] to-[#FF9900]/80",
    features: ["Prime shipping", "Easy returns", "Price matches"],
  },
  "Best Buy": {
    icon: "BB",
    color: "from-[#0046BE] to-[#0046BE]/80",
    features: ["In-store pickup", "Geek Squad", "Price match"],
  },
  "B&H Photo": {
    icon: "BH",
    color: "from-[#000] to-[#000]/80",
    features: ["No tax (NY)", "Expert support", "Trade-in"],
  },
  "Flipkart": {
    icon: "FK",
    color: "from-[#2874F0] to-[#2874F0]/80",
    features: ["Flash sales", "CoD available", "Exchange offer"],
  },
  "Croma": {
    icon: "CR",
    color: "from-[#E4002B] to-[#E4002B]/80",
    features: ["Store pickup", "Financing"],
  },
  "Reliance Digital": {
    icon: "RD",
    color: "from-[#0078D4] to-[#0078D4]/80",
    features: ["Store pickup", "Financing"],
  },
}

export default function MerchantComparison({ product }: MerchantComparisonProps) {
  const sorted = sortBuyLinks(product.buyLinks)
  const lowest = getLowestPrice(product.buyLinks)
  const savings = getSavings(product)

  if (!sorted.length) return null

  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Compare Merchants"
          subtitle={`Find the best deal on the ${product.product}`}
          badge="Pricing"
        />

        {/* Savings banner */}
        {savings != null && (
          <AnimatedSection type="fadeInUp">
            <div className="mx-auto mb-8 flex max-w-lg items-center justify-center gap-3 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] px-5 py-3">
              <BadgeCheck className="h-5 w-5 text-emerald-400" />
              <p className="text-sm text-secondary">
                Save up to <span className="font-semibold text-emerald-400">{savings}%</span> by choosing the right merchant
              </p>
            </div>
          </AnimatedSection>
        )}

        <StaggerContainer className="mx-auto grid max-w-3xl gap-3">
          {sorted.map((link, i) => {
            const meta = storeMeta[link.store] ?? {
              icon: link.store.charAt(0),
              color: "from-white/[0.08] to-white/[0.04]",
              features: [],
            }
            const isBest = link.available && link.price === lowest

            return (
              <StaggerItem key={link.store}>
                <motion.a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group relative grid grid-cols-[auto_1fr_auto] items-center gap-4 overflow-hidden rounded-2xl border p-4 transition-all duration-500 sm:gap-6 sm:p-5",
                    isBest
                      ? "border-[var(--color-accent)]/30 hover:border-[var(--color-accent)]/50 hover:shadow-lg hover:shadow-[var(--color-accent)]/10 bg-gradient-to-r from-[var(--color-accent)]/5 to-transparent"
                      : !link.available
                        ? "border-default bg-white/[0.01] opacity-50"
                        : "border-default bg-white/[0.02] hover:border-default hover:bg-white/[0.04]"
                  )}
                  whileHover={link.available ? { x: 4 } : undefined}
                >
                  {/* Store icon */}
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold tracking-tight transition-transform duration-300 group-hover:scale-105",
                      meta.color,
                      "text-primary"
                    )}
                  >
                    {meta.icon}
                  </div>

                  {/* Store info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-primary group-hover:text-primary">
                        {link.store}
                      </span>
                      {isBest && (
                        <span className="rounded-full px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase" style={{ background: "color-mix(in srgb, var(--color-accent) 15%, transparent)", color: "var(--color-accent-light)" }}>
                          Best Deal
                        </span>
                      )}
                      {link.badge && (
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold tracking-wider text-emerald-400 uppercase">
                          {link.badge}
                        </span>
                      )}
                    </div>
                    {meta.features.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                        {meta.features.map((f) => (
                          <span key={f} className="text-[11px] text-muted">
                            &bull; {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      {link.available ? (
                        <>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-bold text-primary">
                              {link.currency === "USD" ? "$" : link.currency}
                              {link.price.toLocaleString()}
                            </span>
                            {isBest && lowest != null && product.price > lowest && (
                              <span className="text-[10px] text-muted line-through">
                                {product.currency === "USD" ? "$" : product.currency}
                                {product.price.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <span className="text-sm text-muted">Unavailable</span>
                      )}
                    </div>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface transition-all duration-300 group-hover:bg-[var(--color-accent)]/20 group-hover:scale-110">
                      <ChevronRight className="h-4 w-4 text-secondary transition-colors group-hover:text-[var(--color-accent-light)]" />
                    </div>
                  </div>
                </motion.a>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}

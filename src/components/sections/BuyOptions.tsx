"use client"

import { motion } from "framer-motion"
import { ShoppingCart, ChevronRight, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import SectionTitle from "@/components/ui/SectionTitle"
import AnimatedSection from "@/components/animations/AnimatedSection"
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer"
import type { BuyLink } from "@/engine/product/types"

interface BuyOptionsProps {
  title: string
  subtitle?: string
  buyLinks: BuyLink[]
  productName: string
}

const storeIcons: Record<string, React.ReactNode> = {
  Apple: <Zap className="h-5 w-5" />,
  Amazon: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M13.883 2.41c.76.482 1.26 1.32 1.26 2.223 0 .632-.366 1.205-.922 1.48l-.061.031v-1.79c.003-.274-.002-.549-.015-.822h-2.49v5.866H9.04V1.531h4.655c.071.28.12.576.138.883l.048-.004zM5.07 9.73c-1.073 0-2.07.36-2.886 1.055l.456.619c.7-.56 1.56-.88 2.52-.88.318 0 .62.04.89.13l.107.038v-1.79c-.345-.105-.7-.172-1.087-.172zm5.948-1.114c-.594 0-1.145.227-1.546.638l.45.565c.287-.3.68-.48 1.096-.48.577 0 1.14.32 1.444.823l.07.108-1.436.88c-.602.384-.99.99-.99 1.697 0 .655.285 1.242.78 1.632.439.346.992.532 1.606.532.652 0 1.218-.195 1.742-.597l.148-.127.038.523h1.955v-2.943c0-1.58-1.07-2.754-3.357-2.754zm.668 4.48c-.221 0-.42-.06-.588-.175-.184-.126-.298-.316-.298-.54 0-.24.123-.454.333-.58l.038-.024 1.18-.668v.936c-.242.322-.448.56-.665.767-.152.16-.32.285-.586.285zm7.525-.96c-.144.165-.316.318-.5.46l-.03.024v-1.943h.03c.184.142.356.296.5.46.211.244.38.53.38.506 0-.024-.169.29-.38.534v-.041zM22.5 17.232c-3.454 2.633-8.238 4.04-12.626 4.04-4.645 0-8.838-1.583-12.083-4.302-.68-.57-.06-1.278.718-.83 3.642 2.21 8.176 3.542 12.845 3.542 3.837 0 8.076-1.37 11.23-3.575.699-.49 1.344.235.726.873z" />
    </svg>
  ),
  "Best Buy": (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <circle cx="12" cy="12" r="10" />
      <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#06060e">BB</text>
    </svg>
  ),
}

export default function BuyOptions({
  title,
  subtitle,
  buyLinks,
  productName,
}: BuyOptionsProps) {
  if (!buyLinks.length) return null

  const bestDeal = buyLinks.reduce((best, link) =>
    link.price < best.price ? link : best
  )

  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={title}
          subtitle={subtitle}
          badge="Buying"
        />
        <StaggerContainer className="mx-auto grid max-w-2xl gap-4">
          {buyLinks.map((link) => {
            const isBest = link.store === bestDeal.store && link.price === bestDeal.price
            const isApple = link.store === "Apple"

            return (
              <StaggerItem key={link.store}>
                <motion.a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "group relative flex items-center justify-between overflow-hidden rounded-2xl border p-5 transition-all duration-500",
                    isBest
                      ? "border-[#6c5ce7]/30 bg-gradient-to-r from-[#6c5ce7]/10 via-[#6c5ce7]/5 to-transparent hover:border-[#6c5ce7]/50 hover:shadow-lg hover:shadow-[#6c5ce7]/10"
                      : "border-default bg-white/[0.02] hover:border-default hover:bg-white/[0.04]"
                  )}
                  whileHover={{ x: 4 }}
                >
                  {/* Store icon */}
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300",
                        isApple
                          ? "bg-white text-[#06060e]"
                          : "bg-white/10 text-primary group-hover:bg-white/15"
                      )}
                    >
                      {storeIcons[link.store] ?? (
                        <ShoppingCart className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-primary">
                          {link.store}
                        </span>
                        {link.badge && (
                          <span className="rounded-full bg-[#6c5ce7]/15 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#a29bfe] uppercase">
                            {link.badge}
                          </span>
                        )}
                        {isBest && !link.badge && (
                          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
                            Best Price
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-secondary">
                        {productName}
                      </span>
                    </div>
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        {link.currency === "USD" ? "$" : link.currency}
                        {link.price.toLocaleString()}
                      </div>
                      <span className="text-[11px] text-muted">{isBest ? "Lowest" : "Purchase"}</span>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface transition-all duration-300 group-hover:bg-[#6c5ce7]/20 group-hover:scale-110">
                      <ChevronRight className="h-4 w-4 text-secondary transition-colors group-hover:text-[#a29bfe]" />
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

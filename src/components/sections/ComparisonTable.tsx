"use client"

import { motion } from "framer-motion"
import { Check, X, Minus, Trophy } from "lucide-react"
import SectionTitle from "@/components/ui/SectionTitle"
import AnimatedSection from "@/components/animations/AnimatedSection"
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer"
import type { ComparisonItem } from "@/engine/product/types"

interface ComparisonTableProps {
  title: string
  subtitle?: string
  productName: string
  with: string
  items: ComparisonItem[]
}

export default function ComparisonTable({
  title,
  subtitle,
  productName,
  with: competitor,
  items,
}: ComparisonTableProps) {
  if (!items.length) return null

  const productWins = items.filter((i) => i.winner === "this").length
  const competitorWins = items.filter((i) => i.winner === "other").length

  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={title}
          subtitle={subtitle}
          badge="Comparison"
        />

        {/* Score banner */}
        <AnimatedSection type="fadeInUp">
          <div className="mx-auto mb-8 flex max-w-lg items-stretch justify-center overflow-hidden rounded-2xl border border-default bg-white/[0.02]">
            <div className="flex flex-1 flex-col items-center gap-1 px-6 py-4">
              <span className="text-xs font-medium tracking-wider text-muted uppercase">Wins</span>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4" style={{ color: "var(--color-accent-light)" }} />
                <span className="text-2xl font-bold text-primary">{productWins}</span>
              </div>
              <span className="text-xs text-secondary truncate max-w-[120px]">{productName}</span>
            </div>
            <div className="w-px self-stretch bg-white/[0.06]" />
            <div className="flex flex-1 flex-col items-center gap-1 px-6 py-4">
              <span className="text-xs font-medium tracking-wider text-muted uppercase">Wins</span>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-muted" />
                <span className="text-2xl font-bold text-secondary">{competitorWins}</span>
              </div>
              <span className="text-xs text-muted truncate max-w-[120px]">{competitor}</span>
            </div>
          </div>
        </AnimatedSection>

        {/* Comparison table */}
        <AnimatedSection type="fadeInUp" delay={0.1}>
          <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-default">
            {/* Header */}
            <div className="grid grid-cols-3 gap-px bg-white/[0.06]">
              <div className="bg-background px-4 py-3.5 text-[11px] font-semibold tracking-wider text-muted uppercase">
                Feature
              </div>
              <div className="bg-background px-4 py-3.5 text-center text-[11px] font-semibold tracking-wider uppercase" style={{ color: "var(--color-accent-light)" }}>
                {productName}
              </div>
              <div className="bg-background px-4 py-3.5 text-center text-[11px] font-semibold tracking-wider text-muted uppercase">
                {competitor}
              </div>
            </div>

            {/* Rows */}
            <StaggerContainer className="divide-y divide-white/[0.04]">
              {items.map((item) => (
                <StaggerItem
                  key={item.feature}
                  className="grid grid-cols-3 gap-px transition-colors hover:bg-white/[0.02]"
                >
                  <div className="bg-background px-4 py-4 text-sm text-secondary">
                    {item.feature}
                  </div>
                  <div className="flex items-center justify-center bg-background px-4 py-4">
                    {item.winner === "this" ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-green-400/80">Winner</span>
                        <Check className="h-4 w-4 text-green-400" />
                      </div>
                    ) : (
                      <X className="h-4 w-4 text-red-400/40" />
                    )}
                  </div>
                  <div className="flex items-center justify-center bg-background px-4 py-4">
                    {item.winner === "other" ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-green-400/80">Winner</span>
                        <Check className="h-4 w-4 text-green-400" />
                      </div>
                    ) : (
                      <X className="h-4 w-4 text-red-400/40" />
                    )}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </AnimatedSection>

        {/* Win bar */}
        <AnimatedSection type="fadeInUp" delay={0.2}>
          <div className="mx-auto mt-6 max-w-3xl">
            <div className="flex h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "var(--color-accent-grad)" }}
                initial={{ width: 0 }}
                whileInView={{ width: `${(productWins / items.length) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
              />
            </div>
            <p className="mt-2 text-center text-xs text-muted">
              {productName} wins {Math.round((productWins / items.length) * 100)}% of categories
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

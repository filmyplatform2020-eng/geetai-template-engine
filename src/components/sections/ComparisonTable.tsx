"use client"

import { Check, X, Minus } from "lucide-react"
import Container from "@/components/ui/Container"
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

  return (
    <Container>
      <SectionTitle title={title} subtitle={subtitle} />
      <AnimatedSection type="fadeInUp">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/[0.06]">
          <div className="grid grid-cols-3 gap-px bg-white/[0.06]">
            <div className="bg-[#06060e] px-4 py-3 text-xs font-semibold text-white/40">
              Feature
            </div>
            <div className="bg-[#06060e] px-4 py-3 text-center text-xs font-semibold text-[#a29bfe]">
              {productName}
            </div>
            <div className="bg-[#06060e] px-4 py-3 text-center text-xs font-semibold text-white/40">
              {competitor}
            </div>
          </div>
          <StaggerContainer className="divide-y divide-white/[0.04]">
            {items.map((item) => (
              <StaggerItem
                key={item.feature}
                className="grid grid-cols-3 gap-px"
              >
                <div className="bg-[#06060e] px-4 py-3.5 text-sm text-white/50">
                  {item.feature}
                </div>
                <div className="flex items-center justify-center bg-[#06060e] px-4 py-3.5">
                  {item.winner === "this" ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : item.winner === "other" ? (
                    <X className="h-4 w-4 text-red-400" />
                  ) : (
                    <Minus className="h-4 w-4 text-white/30" />
                  )}
                </div>
                <div className="flex items-center justify-center bg-[#06060e] px-4 py-3.5">
                  {item.winner === "other" ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : item.winner === "this" ? (
                    <X className="h-4 w-4 text-red-400" />
                  ) : (
                    <Minus className="h-4 w-4 text-white/30" />
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </AnimatedSection>
    </Container>
  )
}

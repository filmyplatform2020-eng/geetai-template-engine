"use client"

import Container from "@/components/ui/Container"
import SectionTitle from "@/components/ui/SectionTitle"
import AnimatedSection from "@/components/animations/AnimatedSection"
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer"
import type { Specification } from "@/engine/product/types"

interface SpecificationsProps {
  title: string
  subtitle?: string
  specifications: Specification[]
}

export default function Specifications({
  title,
  subtitle,
  specifications,
}: SpecificationsProps) {
  if (!specifications.length) return null

  const grouped = specifications.reduce<Record<string, Specification[]>>(
    (acc, spec) => {
      const cat = spec.category ?? "General"
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(spec)
      return acc
    },
    {}
  )

  return (
    <Container>
      <SectionTitle title={title} subtitle={subtitle} />
      <div className="mx-auto max-w-3xl">
        {Object.entries(grouped).map(([category, specs]) => (
          <AnimatedSection key={category} type="fadeInUp" className="mb-8">
            <h3 className="mb-4 text-xs font-semibold tracking-widest uppercase text-white/30">
              {category}
            </h3>
            <StaggerContainer className="divide-y divide-white/[0.04] rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              {specs.map((spec) => (
                <StaggerItem
                  key={spec.label}
                  className="flex items-center justify-between px-5 py-3.5 sm:px-6"
                >
                  <span className="text-sm text-white/40">{spec.label}</span>
                  <span className="text-right text-sm font-medium text-white/70">
                    {spec.value}
                  </span>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </AnimatedSection>
        ))}
      </div>
    </Container>
  )
}

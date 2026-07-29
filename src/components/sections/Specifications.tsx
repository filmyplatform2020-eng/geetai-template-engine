"use client"

import { motion } from "framer-motion"
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
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={title}
          subtitle={subtitle}
          badge="Specifications"
        />
        <div className="mx-auto max-w-3xl">
          {Object.entries(grouped).map(([category, specs], groupIdx) => (
            <AnimatedSection key={category} type="fadeInUp" delay={groupIdx * 0.1}>
              <div className="mb-10">
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px flex-1 bg-gradient-to-r from-white/[0.06] to-transparent" />
                  <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted">
                    {category}
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-l from-white/[0.06] to-transparent" />
                </div>
                <StaggerContainer className="divide-y divide-white/[0.04] overflow-hidden rounded-2xl border border-default bg-white/[0.02]">
                  {specs.map((spec, i) => {
                    const barWidth = Math.max(30, 100 - i * 5)
                    return (
                      <StaggerItem
                        key={spec.label}
                        className="group flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-white/[0.02] sm:px-6"
                      >
                        <span className="text-sm text-secondary transition-colors group-hover:text-secondary">
                          {spec.label}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className="text-right text-sm font-medium text-primary transition-colors group-hover:text-primary">
                            {spec.value}
                          </span>
                          {/* Spec bar */}
                            <div className="hidden h-[3px] w-16 overflow-hidden rounded-full bg-white/[0.06] sm:block">
                            <motion.div
                              className="h-full rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${barWidth}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
                              style={{ background: "var(--color-accent-grad)" }}
                            />
                          </div>
                        </div>
                      </StaggerItem>
                    )
                  })}
                </StaggerContainer>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

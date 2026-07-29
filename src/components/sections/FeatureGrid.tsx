"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import SectionTitle from "@/components/ui/SectionTitle"
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer"
import { scaleCheck } from "@/engine/animation"
import type { ProductFeature } from "@/engine/product/types"

const iconMap: Record<string, string> = {
  "M4 Pro Chip": "",
  "Liquid Retina XDR": "",
  "Up to 22 Hours": "",
  "Thunderbolt 5": "",
  "MagSafe 3": "",
  "36GB Unified Memory": "",
}

const gradientBgs = [
  "from-[#6c5ce7]/10 via-[#a29bfe]/5 to-transparent",
  "from-[#a29bfe]/10 via-[#6c5ce7]/5 to-transparent",
  "from-[#7c3aed]/10 via-[#6c5ce7]/5 to-transparent",
  "from-[#8b5cf6]/10 via-[#a29bfe]/5 to-transparent",
  "from-[#6c5ce7]/10 via-[#7c3aed]/5 to-transparent",
  "from-[#a29bfe]/10 via-[#8b5cf6]/5 to-transparent",
]

interface FeatureGridProps {
  title: string
  subtitle?: string
  features: ProductFeature[]
}

export default function FeatureGrid({ title, subtitle, features }: FeatureGridProps) {
  if (!features.length) return null

  const containerClass = "mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8"

  return (
    <section className="relative py-24 lg:py-32">
      <div className={containerClass}>
        <SectionTitle
          title={title}
          subtitle={subtitle}
          badge="Features"
        />
        <StaggerContainer className="grid gap-px sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {features.map((f, i) => (
            <StaggerItem key={f.title}>
              <motion.div
                className={cn(
    "group relative h-full overflow-hidden rounded-2xl border border-default bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-6 transition-all duration-500",
                    "hover:border-[var(--color-accent)]/20 hover:shadow-lg hover:shadow-[var(--color-accent)]/5"
                )}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
              >
                {/* Background gradient */}
                <div
                  className={cn(
                    "pointer-events-none absolute -inset-x-4 -inset-y-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                    "bg-gradient-to-br",
                    gradientBgs[i % gradientBgs.length]
                  )}
                />

                {/* Icon */}
                <div className="relative mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent)]/10 ring-1 ring-[var(--color-accent)]/20 transition-all duration-300 group-hover:bg-[var(--color-accent)]/20 group-hover:ring-[var(--color-accent)]/30">
                  <motion.svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    variants={scaleCheck}
                    initial="hidden"
                    whileInView="visible"
                    style={{ color: "var(--color-accent-light)" }}
                  >
                    <path d="M20 7L10 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </div>

                {/* Content */}
                <h3 className="relative mb-2 text-base font-semibold text-primary">
                  {f.title}
                </h3>
                <p className="relative text-sm leading-relaxed text-secondary">
                  {f.description}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import AnimatedSection from "@/components/animations/AnimatedSection"

interface CTAProps {
  productName: string
  tagline: string
  href: string
  storeName?: string
}

export default function CTA({
  productName,
  tagline,
  href,
  storeName = "Apple",
}: CTAProps) {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <AnimatedSection type="fadeInUp">
          <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mx-auto flex max-w-2xl flex-col items-center overflow-hidden rounded-3xl px-8 py-12 text-center sm:px-16 sm:py-16"
            style={{
              border: "1px solid color-mix(in srgb, var(--color-accent) 20%, transparent)",
              background: "linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 20%, transparent), color-mix(in srgb, var(--color-accent) 10%, transparent), transparent)",
            }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.4 }}
          >
            {/* Glow effect */}
            <div className="pointer-events-none absolute -inset-20 bg-[var(--color-accent)]/5 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />

            {/* Background shimmer */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
            </div>

            <Sparkles className="relative mb-4 h-8 w-8" style={{ color: "var(--color-accent-light)" }} />

            <h2 className="relative mb-3 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              {productName}
            </h2>
            <p className="relative mb-8 text-sm leading-relaxed text-secondary sm:text-base">
              {tagline}
            </p>

            <div className="relative inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 transition-all duration-300 group-hover:bg-white/95 group-hover:shadow-lg group-hover:shadow-white/10">
              <span className="text-sm font-semibold text-[#06060e]">
                Buy from {storeName}
              </span>
              <ArrowRight className="h-4 w-4 text-[#06060e] transition-transform duration-300 group-hover:translate-x-0.5" />
            </div>

            <p className="relative mt-3 text-[11px] tracking-wider text-muted uppercase">
              Free shipping &bull; No tax
            </p>
          </motion.a>
        </AnimatedSection>
      </div>
    </section>
  )
}

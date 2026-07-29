"use client"

import { motion } from "framer-motion"
import { ThumbsUp, ThumbsDown, Check, X } from "lucide-react"
import SectionTitle from "@/components/ui/SectionTitle"
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer"

interface ProsConsProps {
  title: string
  subtitle?: string
  pros: string[]
  cons: string[]
}

export default function ProsCons({ title, subtitle, pros, cons }: ProsConsProps) {
  if (!pros.length && !cons.length) return null

  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={title}
          subtitle={subtitle}
          badge="Verdict"
        />
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          {/* Pros column */}
          <motion.div
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-2xl border border-emerald-500/10 bg-gradient-to-b from-emerald-500/[0.04] to-transparent p-6 transition-all duration-500 hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/5"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                <ThumbsUp className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-primary">Pros</h3>
                <p className="text-xs text-muted">{pros.length} advantages</p>
              </div>
            </div>
            <StaggerContainer className="space-y-3.5">
              {pros.map((pro) => (
                <StaggerItem key={pro} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                    <Check className="h-3 w-3 text-emerald-400" />
                  </span>
                  <span className="text-sm leading-relaxed text-secondary">{pro}</span>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </motion.div>

          {/* Cons column */}
          <motion.div
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-2xl border border-red-500/10 bg-gradient-to-b from-red-500/[0.04] to-transparent p-6 transition-all duration-500 hover:border-red-500/20 hover:shadow-lg hover:shadow-red-500/5"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 ring-1 ring-red-500/20">
                <ThumbsDown className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-primary">Cons</h3>
                <p className="text-xs text-muted">{cons.length} drawbacks</p>
              </div>
            </div>
            <StaggerContainer className="space-y-3.5">
              {cons.map((con) => (
                <StaggerItem key={con} className="flex items-start gap-3">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                    <X className="h-3 w-3 text-red-400" />
                  </span>
                  <span className="text-sm leading-relaxed text-secondary">{con}</span>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

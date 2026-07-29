"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, HelpCircle } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import SectionTitle from "@/components/ui/SectionTitle"
import AnimatedSection from "@/components/animations/AnimatedSection"
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer"
import type { FAQItem } from "@/engine/product/types"

interface FAQProps {
  title: string
  subtitle?: string
  faq: FAQItem[]
}

export default function FAQ({ title, subtitle, faq }: FAQProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  if (!faq.length) return null

  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={title}
          subtitle={subtitle}
          badge="FAQ"
        />
        <AnimatedSection type="fadeInUp" className="mx-auto max-w-2xl">
          <StaggerContainer className="divide-y divide-white/[0.04] overflow-hidden rounded-2xl border border-default bg-white/[0.02]">
            {faq.map((item, i) => {
              const isOpen = openIdx === i
              return (
                <StaggerItem key={i}>
                  <div className="group">
                    <button
                      onClick={() => setOpenIdx(isOpen ? null : i)}
                      className={cn(
                        "flex w-full items-center justify-between px-5 py-4 text-left transition-colors sm:px-6",
                        "hover:bg-white/[0.02]",
                        isOpen && "bg-white/[0.02]"
                      )}
                    >
                      <span className="flex items-center gap-3 text-sm font-medium text-primary transition-colors group-hover:text-primary">
                        <HelpCircle className="h-4 w-4 shrink-0" style={{ color: "var(--color-accent)", opacity: 0.6 }} />
                        {item.question}
                      </span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                      >
                        <ChevronDown className="h-4 w-4 text-muted" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-default px-5 py-4 sm:px-6">
                            <p className="text-sm leading-relaxed text-secondary">
                              {item.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </AnimatedSection>
      </div>
    </section>
  )
}

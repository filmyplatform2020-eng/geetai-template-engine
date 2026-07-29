"use client"

import { motion } from "framer-motion"
import { Star, Quote, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import SectionTitle from "@/components/ui/SectionTitle"
import AnimatedSection from "@/components/animations/AnimatedSection"
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer"
import type { Review } from "@/engine/product/types"

interface CustomerReviewsProps {
  title: string
  subtitle?: string
  reviews: Review[]
  averageRating: number
  reviewCount: number
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < Math.round(rating)
              ? "fill-[var(--color-accent-light)] text-[var(--color-accent-light)]"
              : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  )
}

const gradientAvatars = [
  "from-[#6c5ce7] to-[#a29bfe]",
  "from-[#a29bfe] to-[#7c3aed]",
  "from-[#7c3aed] to-[#8b5cf6]",
  "from-[#8b5cf6] to-[#6c5ce7]",
  "from-[#a29bfe] to-[#6c5ce7]",
]

export default function CustomerReviews({
  title,
  subtitle,
  reviews,
  averageRating,
  reviewCount,
}: CustomerReviewsProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  if (!reviews.length) return null

  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={title}
          subtitle={subtitle}
          badge="Reviews"
        />

        {/* Average rating display */}
        <AnimatedSection type="fadeInUp">
          <div className="mx-auto mb-10 flex max-w-xs items-center justify-center gap-4 rounded-2xl border border-default bg-white/[0.02] px-6 py-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center">
                <StarRating rating={averageRating} />
              </div>
            </div>
            <div className="h-10 w-px bg-white/[0.06]" />
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{reviewCount}</div>
              <div className="text-[11px] tracking-wider text-muted uppercase">Reviews</div>
            </div>
          </div>
        </AnimatedSection>

        {/* Featured review card */}
        <AnimatedSection type="fadeInUp" delay={0.1}>
          <div className="mx-auto max-w-2xl">
            <div className="relative overflow-hidden rounded-2xl border border-default bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-6 sm:p-8">
              <Quote className="absolute -right-2 -top-2 h-16 w-16 rotate-12 text-muted" />

              <motion.div
                key={reviews[activeIdx].id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-4 flex items-center gap-4">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-[13px] font-bold text-primary",
                      gradientAvatars[activeIdx % gradientAvatars.length]
                    )}
                  >
                    {reviews[activeIdx].name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-primary">
                        {reviews[activeIdx].name}
                      </span>
                      {reviews[activeIdx].verified && (
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      )}
                    </div>
                    <StarRating rating={reviews[activeIdx].rating} />
                  </div>
                </div>

                <h4 className="mb-2 text-base font-semibold text-primary">
                  {reviews[activeIdx].title}
                </h4>
                <p className="text-sm leading-relaxed text-secondary">
                  {reviews[activeIdx].content}
                </p>
                <div className="mt-4 text-[11px] text-muted">
                  {reviews[activeIdx].date}
                </div>
              </motion.div>

              {/* Navigation */}
              {reviews.length > 1 && (
                <div className="mt-6 flex items-center justify-between border-t border-default pt-4">
                  <div className="flex gap-1.5">
                    {reviews.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveIdx(i)}
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-500",
                          i === activeIdx
                            ? "w-6"
                            : "w-1.5 bg-white/[0.12] hover:bg-white/[0.2]"
                        )}
                        style={
                          i === activeIdx
                            ? { background: "var(--color-accent)" }
                            : undefined
                        }
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveIdx((i) => (i > 0 ? i - 1 : reviews.length - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04] transition-colors hover:bg-white/[0.08]"
                    >
                      <ChevronLeft className="h-4 w-4 text-secondary" />
                    </button>
                    <button
                      onClick={() => setActiveIdx((i) => (i < reviews.length - 1 ? i + 1 : 0))}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04] transition-colors hover:bg-white/[0.08]"
                    >
                      <ChevronRight className="h-4 w-4 text-secondary" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* All reviews */}
        <StaggerContainer className="mx-auto mt-6 grid max-w-2xl gap-3">
          {reviews.map((review) => (
            <StaggerItem key={review.id}>
              <div className="rounded-xl border border-default bg-white/[0.015] p-5 transition-colors hover:bg-white/[0.03]">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-[11px] font-bold text-primary",
                      gradientAvatars[Math.abs(hashCode(review.id)) % gradientAvatars.length]
                    )}
                  >
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-primary">{review.name}</span>
                      {review.verified && <ShieldCheck className="h-3 w-3 text-emerald-400" />}
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted line-clamp-2">{review.content}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

function hashCode(s: string): number {
  let hash = 0
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

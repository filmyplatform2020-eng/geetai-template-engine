"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRight, Star, Shield, Clock, Award } from "lucide-react"
import AuroraBackground from "./AuroraBackground"
import ParticleField from "./ParticleField"
import MouseGlow from "./MouseGlow"
import FloatingMacbook from "./FloatingMacbook"
import Button from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"
import Rating from "@/components/ui/Rating"
import type { Product } from "@/engine/product/types"
import { sortBuyLinks } from "@/engine/affiliate"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface HeroProps {
  product?: Product
  variant?: "default" | "review"
  showCards?: boolean
}

export default function Hero({
  product,
  variant = "default",
  showCards = true,
}: HeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.92])
  const y = useTransform(scrollYProgress, [0, 0.8], [0, 60])

  const isReview = variant === "review"
  const sortedLinks = product ? sortBuyLinks(product.buyLinks) : []
  const bestLink = sortedLinks.find((l) => l.available) ?? sortedLinks[0]

  return (
    <motion.section
      ref={sectionRef}
      id="hero-section"
      style={{ opacity, scale, y }}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
    >
      <AuroraBackground />
      <ParticleField />
      <MouseGlow />

      <div className="relative z-20 flex w-full flex-1 flex-col items-center justify-center px-4 pt-28 pb-12">
        {isReview && product ? (
          <>
            {/* Top badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-default bg-white/[0.03] px-4 py-1.5 text-xs font-medium tracking-wide text-secondary backdrop-blur-md"
            >
              <Star className="h-3 w-3 text-[#a29bfe]" />
              {product.brand} {product.product} — In-depth Review
            </motion.div>

            {/* Product name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mb-2 text-center text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
            >
              <span className="text-primary">{product.product}</span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mx-auto mb-8 max-w-2xl text-balance text-center text-lg leading-relaxed text-secondary sm:text-xl"
            >
              {product.tagline}
            </motion.p>

            {/* Quick stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-8 flex flex-wrap items-center justify-center gap-6"
            >
              <div className="flex items-center gap-2">
                <Rating value={product.rating} size="md" count={product.reviewCount} />
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted">
                <Shield className="h-3.5 w-3.5" />
                <span>1 Year Warranty</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted">
                <Clock className="h-3.5 w-3.5" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted">
                <Award className="h-3.5 w-3.5" />
                <span>Editors&rsquo; Choice</span>
              </div>
            </motion.div>

            {/* Pricing and CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="flex flex-col items-center gap-6"
            >
              {/* Price display */}
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold tracking-tight text-primary">
                  {product.currency}{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-2xl text-muted line-through">
                      {product.currency}{product.originalPrice.toLocaleString()}
                    </span>
                    <Badge variant="success" size="md">
                      Save {product.currency}{(product.originalPrice - product.price).toLocaleString()}
                    </Badge>
                  </>
                )}
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col items-center gap-3 sm:flex-row">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="h-4 w-4" />}
                  href={bestLink?.url ?? "#"}
                  external
                >
                  {bestLink?.badge ? `${bestLink.badge} — ` : ""}Buy at {bestLink?.store ?? "Store"} — {product.currency}{bestLink?.price.toLocaleString() ?? product.price.toLocaleString()}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  href={`/guide/${product.slug}`}
                >
                  Read Buying Guide
                </Button>
              </div>

              {/* Savings note */}
              {product.originalPrice && (
                <p className="text-xs text-muted">
                  You save {product.currency}{(product.originalPrice - product.price).toLocaleString()} compared to MSRP
                </p>
              )}
            </motion.div>
          </>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-default bg-white/[0.03] px-4 py-1.5 text-xs font-medium tracking-wide text-secondary backdrop-blur-md"
            >
              <Star className="h-3 w-3 text-[#6c5ce7]" />
              Introducing GeetAI Template Engine
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-4 text-center text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
            >
              <span className="text-primary">Build Something</span>
              <br />
              <span className="bg-gradient-to-r from-[#6c5ce7] via-[#a29bfe] to-[#6c5ce7] bg-clip-text text-transparent">
                Extraordinary
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mx-auto mb-10 max-w-2xl text-balance text-center text-lg leading-relaxed text-secondary sm:text-xl"
            >
              Ship production-ready apps at lightning speed with our premium template engine. Beautiful, scalable, and built for the modern web.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Button variant="primary" size="lg" icon={<ArrowRight className="h-4 w-4" />}>
                Get Started Free
              </Button>
              <Button variant="secondary" size="lg">
                View Documentation
              </Button>
            </motion.div>
          </>
        )}

        {/* Product visualization */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 w-full max-w-4xl px-4"
        >
          <FloatingMacbook />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs font-medium tracking-widest text-muted uppercase">
            Scroll
          </span>
          <div className="h-8 w-[1px] bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </motion.div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-40"
        style={{
          background: "linear-gradient(to top, #06060e 0%, transparent 100%)",
        }}
      />
    </motion.section>
  )
}

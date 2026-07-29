"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import type { Product } from "@/engine/product/types"
import Button from "@/components/ui/Button"

interface HeroHeadingProps {
  product?: Product
  variant?: "default" | "review"
}

export default function HeroHeading({ product, variant = "default" }: HeroHeadingProps) {
  const isDefault = variant === "default"

  return (
    <div className="relative z-20 mx-auto max-w-4xl px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-default bg-white/[0.03] px-4 py-1.5 text-xs font-medium tracking-wide text-secondary backdrop-blur-md"
      >
        <Sparkles className="h-3 w-3 text-[#6c5ce7]" />
        {isDefault
          ? "Introducing GeetAI Template Engine"
          : `${product?.brand ?? "Premium"} ${product?.product ?? "Product"} Review`}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        className="mb-4 text-balance text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
      >
        {isDefault ? (
          <>
            <span className="text-primary">Build Something</span>
            <br />
            <span className="bg-gradient-to-r from-[#6c5ce7] via-[#a29bfe] to-[#6c5ce7] bg-clip-text text-transparent">
              Extraordinary
            </span>
          </>
        ) : (
          <>
            <span className="text-primary">{product?.tagline?.split(" ")[0] ?? "The"}</span>
            <br />
            <span className="bg-gradient-to-r from-[#6c5ce7] via-[#a29bfe] to-[#6c5ce7] bg-clip-text text-transparent">
              {product?.tagline?.slice(product.tagline.indexOf(" "))?.trim() ?? "Ultimate Review"}
            </span>
          </>
        )}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="mx-auto mb-10 max-w-2xl text-balance text-lg leading-relaxed text-secondary sm:text-xl"
      >
        {isDefault
          ? "Ship production-ready apps at lightning speed with our premium template engine. Beautiful, scalable, and built for the modern web."
          : product?.description ?? "Our comprehensive analysis covers everything you need to know."}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex flex-col items-center justify-center gap-4 sm:flex-row"
      >
        {isDefault ? (
          <>
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight className="h-4 w-4" />}
            >
              Get Started Free
            </Button>
            <Button variant="secondary" size="lg">
              View Documentation
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight className="h-4 w-4" />}
              href={product?.buyLinks?.[0]?.url ?? "#"}
            >
              Check Price — {product?.currency}
              {product?.price.toLocaleString()}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href={`/guide/${product?.slug}`}
            >
              Read Buying Guide
            </Button>
          </>
        )}
      </motion.div>
    </div>
  )
}

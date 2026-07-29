"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import type { Product } from "@/engine/product/types"
import ImageWithFallback from "@/components/ui/ImageWithFallback"

interface CoverSectionProps {
  product: Product
}

export default function CoverSection({ product }: CoverSectionProps) {
  const coverImage = product.images[0]?.src

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-28 pb-16">
      {/* Product image in floating glass card */}
      {coverImage && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 flex items-center justify-center w-full max-w-xl"
        >
          <div
            className="relative overflow-hidden rounded-2xl p-8 w-full"
            style={{
              background: "var(--glass-bg, rgba(255,255,255,0.35))",
              backdropFilter: "blur(var(--glass-blur, 24px))",
              WebkitBackdropFilter: "blur(var(--glass-blur, 24px))",
              border: "1px solid var(--glass-border, rgba(255,255,255,0.5))",
              boxShadow: "0 8px 60px rgba(var(--shadow-default, 138,158,216), var(--shadow-intensity, 0.12)), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.7)",
            }}
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-xl" style={{ background: "color-mix(in srgb, var(--surface, #ffffff) 60%, transparent)" }}>
              <ImageWithFallback
                src={coverImage}
                alt={product.product}
                productName={product.product}
                brand={product.brand}
                fill
                className="object-contain p-4"
                priority
                sizes="(max-width: 768px) 100vw, 560px"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Hero content — always below the image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-8 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ color: "var(--text-primary, #0a0a1a)" }}>
          {product.product}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-lg leading-relaxed sm:text-xl"
          style={{ color: "var(--text-secondary, #2a2a5a)" }}>
          {product.tagline}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm"
          style={{ color: "var(--text-muted, #4a4a7a)" }}>
          <span className="font-semibold">{product.rating.toFixed(1)} ★</span>
          <span>{product.reviewCount.toLocaleString()} reviews</span>
          <span className="font-bold text-2xl" style={{ color: "var(--text-primary, #0a0a1a)" }}>
            {product.currency}{product.price.toLocaleString()}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="#product-content"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-xl"
            style={{
              backgroundColor: "var(--button-primary-bg, #5a6aae)",
              color: "var(--button-primary-text, #ffffff)",
              borderRadius: "var(--style-button-radius, 9999px)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--button-primary-hover, #4a5a9e)" }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--button-primary-bg, #5a6aae)" }}
          >
            View Full Review
          </Link>
          {product.buyLinks[0] && (
            <Link
              href={product.buyLinks[0].url}
              target="_blank"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5"
              style={{
                background: "var(--button-secondary-bg, rgba(255,255,255,0.35))",
                color: "var(--button-secondary-text, var(--text-primary, #0a0a1a))",
                borderRadius: "var(--style-button-radius, 9999px)",
                backdropFilter: "blur(var(--glass-blur, 24px))",
                border: "1px solid var(--glass-border, rgba(255,255,255,0.5))",
              }}
            >
              Buy at {product.buyLinks[0].store}
            </Link>
          )}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-medium tracking-[0.2em] uppercase"
            style={{ color: "var(--text-muted, rgba(10,10,26,0.25))" }}>
            Scroll
          </span>
          <div className="h-6 w-px" style={{ background: "linear-gradient(to bottom, var(--border-default, rgba(0,0,0,0.2)), transparent)" }} />
        </motion.div>
      </motion.div>
    </section>
  )
}

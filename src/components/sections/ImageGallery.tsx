"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import SectionTitle from "@/components/ui/SectionTitle"
import AnimatedSection from "@/components/animations/AnimatedSection"
import ImageWithFallback from "@/components/ui/ImageWithFallback"
import type { ProductImage } from "@/engine/product/types"

interface ImageGalleryProps {
  title: string
  subtitle?: string
  images: ProductImage[]
  productName: string
}

export default function ImageGallery({
  title,
  subtitle,
  images,
  productName,
}: ImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  if (!images.length) return null

  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={title}
          subtitle={subtitle}
          badge="Gallery"
        />
        <AnimatedSection type="fadeInUp">
          {/* Main image */}
          <div className="mx-auto mb-4 max-w-3xl overflow-hidden rounded-2xl border border-default bg-gradient-to-b from-white/[0.03] to-white/[0.01]">
            <div className="relative aspect-video">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="flex h-full w-full items-center justify-center"
                >
                  <ImageWithFallback
                    src={images[activeIdx].src}
                    alt={images[activeIdx].alt}
                    productName={productName}
                    fill
                    className="rounded-2xl"
                    sizes="(max-width: 768px) 100vw, 720px"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="mx-auto flex max-w-3xl justify-center gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={cn(
                  "group relative h-14 w-20 overflow-hidden rounded-lg border transition-all duration-300 sm:h-16 sm:w-24",
                  i === activeIdx
                    ? "border-[var(--color-accent)]/40 ring-1 ring-[var(--color-accent)]/30"
                    : "border-default opacity-60 hover:opacity-100"
                )}
              >
                <ImageWithFallback
                  src={img.src}
                  alt={img.alt}
                  productName={productName}
                  fill
                  className="object-cover"
                />
                {i === activeIdx && (
                  <motion.div
                    layoutId="thumb-indicator"
                    className="absolute inset-0"
                    style={{ background: "var(--color-accent)", opacity: 0.05 }}
                  />
                )}
              </button>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

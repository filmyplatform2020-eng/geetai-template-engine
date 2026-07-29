"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import type { Product } from "@/engine/product/types"
import type { VariantGroup } from "@/engine/variant"
import { applyVariant } from "@/engine/variant"
import { styleVariations, type StyleVariation } from "@/data/styles"
import { sortBuyLinks } from "@/engine/affiliate"

import AuroraBackground from "@/components/hero/AuroraBackground"
import ParticleField from "@/components/hero/ParticleField"
import CoverSection from "@/components/sections/CoverSection"
import StickyBuyBar from "@/components/sections/StickyBuyBar"
import TrustBar from "@/components/sections/TrustBar"
import VariantPicker from "@/components/sections/VariantPicker"
import MerchantComparison from "@/components/sections/MerchantComparison"
import FeatureGrid from "@/components/sections/FeatureGrid"
import ImageGallery from "@/components/sections/ImageGallery"
import VideoSection from "@/components/sections/VideoSection"
import Specifications from "@/components/sections/Specifications"
import ProsCons from "@/components/sections/ProsCons"
import ComparisonTable from "@/components/sections/ComparisonTable"
import CustomerReviews from "@/components/sections/CustomerReviews"
import FAQ from "@/components/sections/FAQ"
import CTA from "@/components/sections/CTA"
import Verdict from "@/components/sections/Verdict"
import StickyMobileCTA from "@/components/sections/StickyMobileCTA"
import RelatedProducts from "@/components/personalization/RelatedProducts"
import Breadcrumbs from "@/components/seo/Breadcrumbs"
import Button from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"
import Rating from "@/components/ui/Rating"
import { ArrowRight, Shield, Clock, Award } from "lucide-react"

interface ProductPageTemplateProps {
  product: Product
  allProducts: Product[]
  variantGroups?: VariantGroup[]
  styleOverride?: StyleVariation
}

const defaultVariantGroups: VariantGroup[] = [
  {
    type: "color",
    label: "Color",
    variants: [
      { id: "space-black", label: "Space Black", type: "color", color: "#1a1a1e" },
      { id: "silver", label: "Silver", type: "color", color: "#e0e0e0" },
    ],
  },
  {
    type: "storage",
    label: "Storage",
    variants: [
      { id: "512gb", label: "512GB", type: "storage", price: 0 },
      { id: "1tb", label: "1TB", type: "storage", price: 200 },
      { id: "2tb", label: "2TB", type: "storage", price: 600 },
    ],
  },
  {
    type: "ram",
    label: "RAM",
    variants: [
      { id: "36gb", label: "36GB", type: "ram", price: 0 },
      { id: "48gb", label: "48GB", type: "ram", price: 400 },
    ],
  },
]

const pages = [
  { label: "Cover", id: "page-cover" },
  { label: "Product", id: "page-product" },
  { label: "Verdict", id: "page-verdict" },
]

export default function ProductPageTemplate({
  product,
  allProducts,
  variantGroups = defaultVariantGroups,
  styleOverride,
}: ProductPageTemplateProps) {
  const [, setSelectedVariants] = useState<Record<string, string>>({})
  const mainRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: mainRef, offset: ["start start", "end end"] })
  const progressScaleX = useTransform(scrollYProgress, [0, 0.03], [0, 1])
  const progressOpacity = useTransform(scrollYProgress, [0, 0.03, 0.9, 1], [0, 1, 1, 0])

  const [activePage, setActivePage] = useState(0)

  useEffect(() => {
    const root = document.getElementById("template-content")
    if (!root) return
    const sections = root.querySelectorAll<HTMLElement>("[data-page]")
    const observers: IntersectionObserver[] = []
    sections.forEach((el) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const idx = Number(el.dataset.page)
            if (!isNaN(idx)) setActivePage(idx)
          }
        },
        { rootMargin: "-40% 0px -40% 0px" }
      )
      observer.observe(el)
      observers.push(observer)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const handleVariantSelect = (type: string, id: string) => {
    setSelectedVariants((prev) => ({ ...prev, [type]: id }))
  }

  const variant = null
  const effectiveProduct = applyVariant(product, variant)

  const scrollToPage = (i: number) => {
    const el = document.querySelector<HTMLElement>(`[data-page="${i}"]`)
    el?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const productIndex = allProducts.findIndex((p) => p.slug === product.slug)
  const style: StyleVariation = styleOverride ?? styleVariations[productIndex >= 0 ? productIndex % styleVariations.length : 0]

  const sortedLinks = sortBuyLinks(product.buyLinks)
  const bestLink = sortedLinks.find((l) => l.available) ?? sortedLinks[0]

  return (
    <>
      <style>{`
        ${style.bgColor ? `:root { --bg: ${style.bgColor}; }` : ''}
        ${style.textPrimary ? `:root { --text-primary: ${style.textPrimary}; }` : ''}
        ${style.textSecondary ? `:root { --text-secondary: ${style.textSecondary}; }` : ''}
        ${style.textMuted ? `:root { --text-muted: ${style.textMuted}; }` : ''}
        ${style.surfaceColor ? `:root { --surface: ${style.surfaceColor}; }` : ''}
        ${style.borderColor ? `:root { --border-default: ${style.borderColor}; }` : ''}
        .product-theme {
          --color-accent: ${style.accent};
          --color-accent-light: ${style.accentLight};
          --color-accent-secondary: ${style.accentSecondary};
          --color-accent-soft: ${style.accentSoft};
          --color-accent-grad: ${style.gradientPrimary};
          --color-accent-grad-soft: ${style.gradientAccent};
          --style-card-radius: ${style.cardRadius};
          --style-button-radius: ${style.buttonRadius};
          --style-glass-blur: ${style.glassBlur};
          --style-glass-opacity: ${style.glassOpacity};
          --style-glass-border-opacity: ${style.glassBorderOpacity};
          --style-shadow-color: ${style.shadowColor};
          --style-shadow-intensity: ${style.shadowIntensity};
          --style-animation-intensity: ${style.animationIntensity};
          --style-card-bg: rgba(255,255,255,${style.glassOpacity});
          --style-card-border: rgba(255,255,255,${style.glassBorderOpacity});
          --style-card-shadow: 0 8px 32px rgba(${style.shadowColor}, ${style.shadowIntensity})${style.shadowHighlight ? ', ' + style.shadowHighlight : ''};
          --style-hero-from: ${style.heroBgFrom};
          --style-hero-via: ${style.heroBgVia};
          --style-hero-to: ${style.heroBgTo};
        }
        .scroll-progress-bar {
          background: ${style.gradientPrimary};
        }
        .nav-dot-active {
          background: ${style.accent};
          box-shadow: 0 0 8px ${style.accent}66;
        }
        .nav-dot-inactive {
          background: rgba(0,0,0,0.08);
        }
        .page-separator-line {
          background: linear-gradient(to right, transparent, ${style.accent}40, transparent);
        }
        .page-separator-dot {
          background: ${style.accent};
          box-shadow: 0 0 6px ${style.accent}40;
        }
      `}</style>

      {/* Soft background overlay — determined by style variation */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, var(--style-hero-from) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, var(--style-hero-via) 0%, transparent 50%)",
        }}
      />

      {/* Scroll progress bar */}
      <motion.div
        className="scroll-progress-bar fixed top-0 left-0 right-0 z-[70] h-[2px] origin-left"
        style={{ scaleX: progressScaleX, opacity: progressOpacity }}
      />

      {/* Page nav (desktop) — minimal dots only, no text labels */}
      <nav className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex">
        {pages.map((_page, i) => (
          <button
            key={i}
            onClick={() => scrollToPage(i)}
            className={cn(
              "block rounded-full transition-all duration-500",
              i === activePage
                ? "h-3 w-3"
                : "h-2 w-2 bg-black/10 hover:bg-black/20"
            )}
            style={i === activePage ? { background: "#5a6aae", boxShadow: "0 0 6px rgba(90,106,174,0.4)" } : {}}
            aria-label={`Section ${i + 1}`}
          />
        ))}
      </nav>

      {/* PAGE 1 — Cover */}
      <CoverSection product={effectiveProduct} />

      {/* Sticky buy bar (appears on scroll) */}
      <StickyBuyBar product={effectiveProduct} />

      {/* Main content */}
      <div ref={mainRef} id="product-content" className="product-theme relative z-10">

        {/* === PAGE 2 — Product Information === */}
        <section data-page="1" className="relative">

          <TrustBar productName={effectiveProduct.product} />

          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <Breadcrumbs product={product} />
            </div>

            {/* Review header — rating, price, CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <div className="mb-6 flex flex-wrap items-center gap-6">
                <Rating value={product.rating} size="md" count={product.reviewCount} />
                <div className="flex items-center gap-1.5 text-sm text-[#1a1a1e]/40">
                  <Shield className="h-3.5 w-3.5" />
                  <span>1 Year Warranty</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-[#1a1a1e]/40">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-[#1a1a1e]/40">
                  <Award className="h-3.5 w-3.5" />
                  <span>Editors&rsquo; Choice</span>
                </div>
              </div>

              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold tracking-tight text-[#1a1a1e]/90">
                    {product.currency}{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-xl text-[#1a1a1e]/25 line-through">
                        {product.currency}{product.originalPrice.toLocaleString()}
                      </span>
                      <Badge variant="success" size="md">
                        Save {product.currency}{(product.originalPrice - product.price).toLocaleString()}
                      </Badge>
                    </>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="primary"
                    size="lg"
                    icon={<ArrowRight className="h-4 w-4" />}
                    href={bestLink?.url ?? "#"}
                    external
                  >
                    {bestLink?.badge ? `${bestLink.badge} — ` : ""}Buy at {bestLink?.store ?? "Store"}
                  </Button>
                  <Button variant="secondary" size="lg" href={`/guide/${product.slug}`}>
                    Read Buying Guide
                  </Button>
                </div>
              </div>
            </motion.div>

            <VariantPicker
              groups={variantGroups}
              activeVariant="space-black"
              onSelect={handleVariantSelect}
            />
          </div>

          <SectionSpacer />

          <FeatureGrid
            title="Everything You Need"
            subtitle={`The ${effectiveProduct.product} delivers on every front.`}
            features={effectiveProduct.features}
          />

          <SectionSpacer />

          <ImageGallery
            title="Designed to Impress"
            subtitle="Every angle tells a story of precision engineering."
            images={effectiveProduct.images}
            productName={effectiveProduct.product}
          />

          {product.videoUrl && (
            <>
              <SectionSpacer />
              <VideoSection
                title="See It in Action"
                subtitle="Watch the full review."
                videoUrl={product.videoUrl}
                productName={effectiveProduct.product}
              />
            </>
          )}

          <SectionSpacer />

          <Specifications
            title="Technical Specifications"
            subtitle="Every detail, quantified."
            specifications={effectiveProduct.specifications}
          />

          <SectionSpacer />

          <MerchantComparison product={effectiveProduct} />

          <SectionSpacer />

          <div className="pb-16 lg:pb-20">
            <CTA
              productName={effectiveProduct.product}
              tagline={effectiveProduct.tagline}
              href={effectiveProduct.buyLinks[0]?.url ?? "#"}
              storeName={effectiveProduct.buyLinks[0]?.store}
            />
          </div>
        </section>

        {/* === Page Separator === */}
        <PageSeparator />

        {/* === PAGE 3 — Verdict & Conclusion === */}
        <section data-page="2" className="relative pb-24">

          <Verdict
            verdict={effectiveProduct.verdict}
            pros={effectiveProduct.pros}
            cons={effectiveProduct.cons}
            productName={effectiveProduct.product}
          />

          <SectionSpacer />

          <ProsCons
            title="The Good & The Bad"
            subtitle="An honest look at what works and what doesn't."
            pros={effectiveProduct.pros}
            cons={effectiveProduct.cons}
          />

          <SectionSpacer />

          <ComparisonTable
            title="How It Stacks Up"
            subtitle={`${effectiveProduct.product} vs ${product.comparison.with}`}
            productName={effectiveProduct.product}
            with={product.comparison.with}
            items={product.comparison.items}
          />

          <SectionSpacer />

          <CustomerReviews
            title="Real Reviews from Real Users"
            subtitle={`What ${product.reviewCount.toLocaleString()} buyers are saying.`}
            reviews={product.reviews}
            averageRating={product.rating}
            reviewCount={product.reviewCount}
          />

          <SectionSpacer />

          <FAQ
            title="Frequently Asked Questions"
            subtitle="Everything you need to know."
            faq={product.faq}
          />

          <SectionSpacer />

          <div className="py-16 lg:py-20">
            <RelatedProducts product={product} allProducts={allProducts} />
          </div>
        </section>
      </div>

      {/* Mobile page dots */}
      <nav className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 md:hidden">
        <div className="flex items-center gap-2 rounded-full border border-default bg-background/80 px-3 py-2 backdrop-blur-xl">
          {pages.map((page, i) => (
            <button
              key={page.id}
              onClick={() => scrollToPage(i)}
              className={cn(
                "rounded-full transition-all duration-500",
                i === activePage
                  ? "h-2 w-2 nav-dot-active"
                  : "h-1.5 w-1.5 nav-dot-inactive"
              )}
              aria-label={page.label}
            />
          ))}
        </div>
      </nav>

      {/* Mobile sticky CTA */}
      <StickyMobileCTA
        productName={effectiveProduct.product}
        buyLinks={effectiveProduct.buyLinks}
      />
    </>
  )
}

function PageLabel({ number, total, label, style }: { number: number; total: number; label: string; style: StyleVariation }) {
  return (
    <div className="flex items-center justify-center pt-12 sm:pt-16">
      <div className="flex items-center gap-3 text-xs font-medium tracking-widest uppercase text-muted">
        <span>Page {number}</span>
        <span className="text-muted">/</span>
        <span>{total}</span>
        <span className="ml-2 h-px w-8" style={{ background: `linear-gradient(to right, ${style.accent}60, transparent)` }} />
        <span className="ml-1 text-muted">{label}</span>
      </div>
    </div>
  )
}

function PageSeparator() {
  return (
    <div className="relative flex items-center justify-center py-16">
      <div className="page-separator-line h-px w-32 sm:w-48" />
      <div className="page-separator-dot mx-3 h-1.5 w-1.5 rounded-full" />
      <div className="page-separator-line h-px w-32 sm:w-48" />
    </div>
  )
}

function SectionSpacer() {
  return (
    <div className="relative flex items-center justify-center py-6 lg:py-8">
      <div className="h-px w-6 bg-gradient-to-r from-transparent via-border-default to-transparent" />
      <div className="mx-2 h-1 w-1 rounded-full bg-border-default" />
      <div className="h-px w-6 bg-gradient-to-r from-transparent via-border-default to-transparent" />
    </div>
  )
}

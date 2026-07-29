"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import type { Product } from "@/engine/product/types"
import type { VariantGroup } from "@/engine/variant"
import { applyVariant } from "@/engine/variant"
import { styleVariations, type StyleVariation } from "@/data/styles"
import { sortBuyLinks, getLowestPrice, getSavings } from "@/engine/affiliate"

import CoverSection from "@/components/sections/CoverSection"
import StickyMobileCTA from "@/components/sections/StickyMobileCTA"
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
import RelatedProducts from "@/components/personalization/RelatedProducts"
import Breadcrumbs from "@/components/seo/Breadcrumbs"
import Button from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"
import Rating from "@/components/ui/Rating"
import { ArrowRight, Shield, Clock, Award, ShoppingCart } from "lucide-react"

const HEADER_LAYER_1 = 48
const HEADER_LAYER_2 = 56
const FIXED_HEADER_HEIGHT = HEADER_LAYER_1 + HEADER_LAYER_2
const HEADER_LAYER_3 = 48
const TOTAL_SCROLL_OFFSET = FIXED_HEADER_HEIGHT + HEADER_LAYER_3

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

const pageTabs = [
  { id: "section-features", label: "Features" },
  { id: "section-gallery", label: "Gallery" },
  { id: "section-specs", label: "Specifications" },
  { id: "section-pricing", label: "Pricing" },
  { id: "section-reviews", label: "Reviews" },
  { id: "section-faq", label: "FAQ" },
]

export default function ProductPageTemplateV5({
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

  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    const sectionIds = pageTabs.map((t) => t.id)
    const observers: IntersectionObserver[] = []

    sectionIds.forEach((id, idx) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveTab(idx)
        },
        { rootMargin: `-${TOTAL_SCROLL_OFFSET}px 0px -35% 0px` }
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

  const scrollToTab = (id: string) => {
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const productIndex = allProducts.findIndex((p) => p.slug === product.slug)
  const style: StyleVariation = styleOverride ?? styleVariations[productIndex >= 0 ? productIndex % styleVariations.length : 0]

  const sortedLinks = sortBuyLinks(product.buyLinks)
  const bestLink = sortedLinks.find((l) => l.available) ?? sortedLinks[0]
  const bestPrice = getLowestPrice(product.buyLinks)
  const savings = getSavings(product)

  return (
    <>
      <style>{`
        ${style.bgColor ? `:root { --bg: ${style.bgColor}; }` : ""}
        ${style.textPrimary ? `:root { --text-primary: ${style.textPrimary}; }` : ""}
        ${style.textSecondary ? `:root { --text-secondary: ${style.textSecondary}; }` : ""}
        ${style.textMuted ? `:root { --text-muted: ${style.textMuted}; }` : ""}
        ${style.surfaceColor ? `:root { --surface: ${style.surfaceColor}; }` : ""}
        ${style.borderColor ? `:root { --border-default: ${style.borderColor}; }` : ""}
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
          --style-card-bg: rgba(255,255,255,${style.glassOpacity});
          --style-card-border: rgba(255,255,255,${style.glassBorderOpacity});
          --style-card-shadow: 0 8px 32px rgba(${style.shadowColor}, ${style.shadowIntensity})${style.shadowHighlight ? ", " + style.shadowHighlight : ""};
          --style-hero-from: ${style.heroBgFrom};
          --style-hero-via: ${style.heroBgVia};
          --style-hero-to: ${style.heroBgTo};
          --header-layer-1: ${HEADER_LAYER_1}px;
          --header-layer-2: ${HEADER_LAYER_2}px;
          --header-layer-3: ${HEADER_LAYER_3}px;
          --fixed-header-height: ${FIXED_HEADER_HEIGHT}px;
          --scroll-offset: ${TOTAL_SCROLL_OFFSET}px;
        }
        .scroll-progress-bar {
          background: ${style.gradientPrimary};
        }
        .page-separator-line {
          background: linear-gradient(to right, transparent, ${style.accent}40, transparent);
        }
        .page-separator-dot {
          background: ${style.accent};
          box-shadow: 0 0 6px ${style.accent}40;
        }
        .scroll-target {
          scroll-margin-top: var(--scroll-offset);
        }
      `}</style>

      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, var(--style-hero-from) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, var(--style-hero-via) 0%, transparent 50%)",
        }}
      />

      <motion.div
        className="scroll-progress-bar fixed top-0 left-0 right-0 z-[70] h-[2px] origin-left"
        style={{ scaleX: progressScaleX, opacity: progressOpacity }}
      />

      <header
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl"
        style={{ height: HEADER_LAYER_1 }}
      >
        <div className="mx-auto flex h-full max-w-[1200px] items-center px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-muted/40">
            GeetAI
          </span>
        </div>
      </header>

      <div
        className="fixed left-0 right-0 z-50 border-b border-white/5 bg-background/85 backdrop-blur-2xl"
        style={{ top: HEADER_LAYER_1, height: HEADER_LAYER_2 }}
      >
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 min-w-0">
            <div className="hidden sm:block min-w-0">
              <p className="truncate text-sm font-medium text-primary">
                {effectiveProduct.product}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-muted">
                  {effectiveProduct.rating.toFixed(1)} ★
                </span>
                <span className="text-[10px] text-muted">&middot;</span>
                <span className="text-[10px] text-muted">
                  {effectiveProduct.reviewCount.toLocaleString()} reviews
                </span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <div className="h-5 w-px bg-white/[0.06]" />
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-bold text-primary">
                  {effectiveProduct.currency === "USD" ? "$" : effectiveProduct.currency}
                  {effectiveProduct.price.toLocaleString()}
                </span>
                {effectiveProduct.originalPrice && effectiveProduct.originalPrice > effectiveProduct.price && (
                  <>
                    <span className="text-xs text-muted line-through">
                      {effectiveProduct.currency === "USD" ? "$" : effectiveProduct.currency}
                      {effectiveProduct.originalPrice.toLocaleString()}
                    </span>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                      Save {savings}%
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center sm:hidden">
              <span className="text-[11px] text-secondary">
                from {bestLink?.store ?? "Store"}
              </span>
            </div>

            <a
              href={bestLink?.url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-1.5 text-sm font-semibold text-[#06060e] transition-all duration-300 hover:bg-white/90 hover:shadow-lg active:scale-[0.97]"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Buy Now
              <span className="text-[11px] text-black/50">
                {effectiveProduct.currency === "USD" ? "$" : effectiveProduct.currency}
                {bestPrice ?? effectiveProduct.price}
              </span>
            </a>
          </div>
        </div>
      </div>

      <nav
        className="sticky z-40 border-b border-white/5 bg-background/55 backdrop-blur-2xl px-2 py-1.5"
        style={{ top: FIXED_HEADER_HEIGHT }}
      >
        <div className="mx-auto max-w-2xl flex items-center justify-center gap-0.5 rounded-full px-1 py-1"
          style={{
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 2px 20px rgba(138,158,216,0.08), 0 1px 4px rgba(0,0,0,0.04)",
          }}>
          {pageTabs.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => scrollToTab(tab.id)}
              className="shrink-0 rounded-full px-3 py-2 text-xs sm:text-sm font-semibold tracking-tight transition-all duration-300"
              style={{
                background: i === activeTab ? "rgba(90,106,174,0.15)" : "transparent",
                color: i === activeTab ? "#3a4a8a" : "#6a7a9a",
                boxShadow: i === activeTab ? "0 2px 8px rgba(90,106,174,0.15)" : "none",
                transform: i === activeTab ? "scale(1.02)" : "scale(1)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <div
        ref={mainRef}
        id="product-content"
        className="product-theme relative z-10"
        style={{ paddingTop: FIXED_HEADER_HEIGHT }}
      >

        <CoverSection product={effectiveProduct} />

        <section data-page="1" className="relative">

          <TrustBar productName={effectiveProduct.product} />

          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <Breadcrumbs product={product} />
            </div>

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

          <div id="section-features" className="scroll-target">
          <FeatureGrid
            title="Everything You Need"
            subtitle={`The ${effectiveProduct.product} delivers on every front.`}
            features={effectiveProduct.features}
          />
          </div>

          <SectionSpacer />

          <div id="section-gallery" className="scroll-target">
          <ImageGallery
            title="Designed to Impress"
            subtitle="Every angle tells a story of precision engineering."
            images={effectiveProduct.images}
            productName={effectiveProduct.product}
          />
          </div>

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

          <div id="section-specs" className="scroll-target">
          <Specifications
            title="Technical Specifications"
            subtitle="Every detail, quantified."
            specifications={effectiveProduct.specifications}
          />
          </div>

          <SectionSpacer />

          <div id="section-pricing" className="scroll-target">
          <MerchantComparison product={effectiveProduct} />
          </div>

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

        <PageSeparator />

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

          <div id="section-reviews" className="scroll-target">
          <CustomerReviews
            title="Real Reviews from Real Users"
            subtitle={`What ${product.reviewCount.toLocaleString()} buyers are saying.`}
            reviews={product.reviews}
            averageRating={product.rating}
            reviewCount={product.reviewCount}
          />
          </div>

          <SectionSpacer />

          <div id="section-faq" className="scroll-target">
          <FAQ
            title="Frequently Asked Questions"
            subtitle="Everything you need to know."
            faq={product.faq}
          />
          </div>

          <SectionSpacer />

          <div className="py-16 lg:py-20">
            <RelatedProducts product={product} allProducts={allProducts} />
          </div>
        </section>
      </div>

      <StickyMobileCTA
        productName={effectiveProduct.product}
        buyLinks={effectiveProduct.buyLinks}
      />
    </>
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

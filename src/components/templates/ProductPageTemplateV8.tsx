"use client"

import { useRef, useState, useEffect, useMemo } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import type { Product } from "@/engine/product/types"
import type { VariantGroup } from "@/engine/variant"
import { applyVariant } from "@/engine/variant"
import type { StyleVariation } from "@/data/styles"
import { sortBuyLinks, getLowestPrice, getSavings } from "@/engine/affiliate"
import { templateEngine, type ResolvedTemplate } from "@/engine/templates"

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

const STICKY_HEADER_HEIGHT = 112

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
  { id: "section-overview", label: "Overview" },
  { id: "section-features", label: "Features" },
  { id: "section-gallery", label: "Gallery" },
  { id: "section-video", label: "Video" },
  { id: "section-specs", label: "Specifications" },
  { id: "section-pricing", label: "Pricing" },
  { id: "section-cta", label: "Buy Now" },
  { id: "section-verdict", label: "Verdict" },
  { id: "section-pros-cons", label: "Pros & Cons" },
  { id: "section-comparison", label: "Comparison" },
  { id: "section-reviews", label: "Reviews" },
  { id: "section-faq", label: "FAQ" },
  { id: "section-related", label: "Related" },
]

export default function ProductPageTemplateV8({
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

  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const barOpacity = Math.min(1, Math.max(0, (scrollY - 500) / 150))
  const barY = (1 - barOpacity) * 24

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
        { rootMargin: `-${STICKY_HEADER_HEIGHT}px 0px -40% 0px` }
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
    if (id === "section-overview") {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const resolved = useMemo(
    () => templateEngine.resolve(product, allProducts, styleOverride),
    [product, allProducts, styleOverride],
  )
  const { style, palette, cssVars } = resolved

  const sortedLinks = sortBuyLinks(product.buyLinks)
  const bestLink = sortedLinks.find((l) => l.available) ?? sortedLinks[0]
  const bestPrice = getLowestPrice(product.buyLinks)
  const savings = getSavings(product)

  const shadowRgb = style.shadowColor
  const shadowIntensity = parseFloat(style.shadowIntensity)

  return (
    <>
      <style>{`
        .product-theme-v8 {
          ${Object.entries(cssVars).map(([k, v]) => `${k}: ${v};`).join("\n          ")}
          --style-card-radius: ${style.cardRadius};
          --style-button-radius: ${style.buttonRadius};
          --style-hero-from: ${style.heroBgFrom};
          --style-hero-via: ${style.heroBgVia};
          --style-hero-to: ${style.heroBgTo};
        }
        .product-theme-v8 .scroll-progress-bar {
          background: ${style.gradientPrimary};
        }
        .product-theme-v8 .page-separator-line {
          background: linear-gradient(to right, transparent, var(--color-accent)40, transparent);
        }
        .product-theme-v8 .page-separator-dot {
          background: var(--color-accent);
          box-shadow: 0 0 6px var(--color-accent)60;
        }
        .product-theme-v8 .glass,
        .product-theme-v8 .glass-sm,
        .product-theme-v8 .glass-card,
        .product-theme-v8 .glass-lg,
        .product-theme-v8 .glass-xl {
          background-color: var(--glass-bg) !important;
          backdrop-filter: blur(var(--glass-blur)) !important;
          -webkit-backdrop-filter: blur(var(--glass-blur)) !important;
          border: 1px solid var(--glass-border) !important;
        }
        .product-theme-v8 .glass-card {
          box-shadow: 0 8px 32px rgba(${shadowRgb}, ${shadowIntensity})${style.shadowHighlight ? ", " + style.shadowHighlight : ""} !important;
        }
        .product-theme-v8 .glass {
          box-shadow: 0 4px 24px rgba(${shadowRgb}, ${shadowIntensity * 0.8}), inset 0 1px 0 rgba(255,255,255,0.7) !important;
        }
        html {
          scroll-padding-top: 112px;
        }
      `}</style>

      <div className="product-theme-v8">

        {/* Skip-to-content link — first focusable element */}
        <a
          href="#product-content"
          className="fixed left-4 top-4 z-[100] -translate-y-20 rounded-xl px-4 py-2 text-sm font-semibold shadow-lg transition-transform focus:translate-y-0 focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-accent)]"
          style={{
            background: "var(--button-primary-bg, #5a6aae)",
            color: "var(--button-primary-text, #ffffff)",
          }}
        >
          Skip to content
        </a>

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

        <div id="section-overview">
          <CoverSection product={effectiveProduct} />
        </div>

        <div className="sticky top-0 z-50">
          <motion.div
            style={{
              opacity: barOpacity,
              y: barY,
              backgroundColor: "var(--glass-bg)",
              backdropFilter: "blur(calc(var(--glass-blur) * 2))",
              WebkitBackdropFilter: "blur(calc(var(--glass-blur) * 2))",
            }}
          >
            <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-4 min-w-0">
                <div className="hidden sm:block min-w-0">
                  <p className="truncate text-sm" style={{ color: "var(--text-primary)" }}>
                    {effectiveProduct.product}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                      {effectiveProduct.rating.toFixed(1)} ★
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>&middot;</span>
                    <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                      {effectiveProduct.reviewCount.toLocaleString()} reviews
                    </span>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-3">
                  <div style={{ width: "1px", height: "20px", background: "var(--border-default)" }} />
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                      {effectiveProduct.currency === "USD" ? "$" : effectiveProduct.currency}
                      {effectiveProduct.price.toLocaleString()}
                    </span>
                    {effectiveProduct.originalPrice && effectiveProduct.originalPrice > effectiveProduct.price && (
                      <>
                        <span className="text-xs line-through" style={{ color: "var(--text-muted)" }}>
                          {effectiveProduct.currency === "USD" ? "$" : effectiveProduct.currency}
                          {effectiveProduct.originalPrice.toLocaleString()}
                        </span>
                        <Badge variant="success" size="sm">
                          Save {savings}%
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <div className="flex items-center sm:hidden">
                  <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                    from {bestLink?.store ?? "Store"}
                  </span>
                </div>

                <a
                  href={bestLink?.url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-1.5 text-sm font-semibold transition-all duration-300 active:scale-[0.97]"
                  style={{
                    backgroundColor: palette.button.primary.bg,
                    color: palette.button.primary.text,
                    borderRadius: "var(--style-button-radius, 9999px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = palette.button.primary.hover
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = palette.button.primary.bg
                  }}
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Buy Now
                  <span style={{
                    fontSize: "11px",
                    color: palette.button.primary.text,
                    opacity: 0.8,
                  }}>
                    {effectiveProduct.currency === "USD" ? "$" : effectiveProduct.currency}
                    {bestPrice ?? effectiveProduct.price}
                  </span>
                </a>
              </div>
            </div>
          </motion.div>

          <nav className="py-1.5 overflow-x-auto scrollbar-none">
            <div className="mx-auto w-fit flex items-center justify-center gap-0.5 rounded-full px-1 py-1"
              style={{
                background: palette.nav.capsule.bg,
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                boxShadow: palette.nav.capsule.shadow,
              }}>
              {pageTabs.map((tab, i) => {
                const isActive = i === activeTab
                return (
                  <button
                    key={tab.id}
                    onClick={() => scrollToTab(tab.id)}
                    className="shrink-0 rounded-full px-2.5 py-2 text-[11px] sm:text-sm sm:px-3 font-semibold tracking-tight transition-all duration-300"
                    style={{
                      background: isActive ? palette.nav.active.bg : "transparent",
                      color: isActive ? palette.nav.active.text : palette.nav.inactive.text,
                      boxShadow: isActive ? palette.nav.active.shadow : "none",
                      transform: isActive ? "scale(1.02)" : "scale(1)",
                    }}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </nav>
        </div>

        <div ref={mainRef} id="product-content">

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
                  <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <Shield className="h-3.5 w-3.5" />
                    <span>1 Year Warranty</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <Clock className="h-3.5 w-3.5" />
                    <span>Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <Award className="h-3.5 w-3.5" />
                    <span>Editors&rsquo; Choice</span>
                  </div>
                </div>

                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                      {product.currency}{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <>
                        <span className="text-xl line-through" style={{ color: "var(--text-muted)" }}>
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
                <div id="section-video">
                <VideoSection
                  title="See It in Action"
                  subtitle="Watch the full review."
                  videoUrl={product.videoUrl}
                  productName={effectiveProduct.product}
                />
                </div>
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

            <div id="section-cta" className="pb-16 lg:pb-20">
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

            <div id="section-verdict">
            <Verdict
              verdict={effectiveProduct.verdict}
              pros={effectiveProduct.pros}
              cons={effectiveProduct.cons}
              productName={effectiveProduct.product}
            />
            </div>

            <SectionSpacer />

            <div id="section-pros-cons">
            <ProsCons
              title="The Good & The Bad"
              subtitle="An honest look at what works and what doesn't."
              pros={effectiveProduct.pros}
              cons={effectiveProduct.cons}
            />
            </div>

            <SectionSpacer />

            <div id="section-comparison">
            <ComparisonTable
              title="How It Stacks Up"
              subtitle={`${effectiveProduct.product} vs ${product.comparison.with}`}
              productName={effectiveProduct.product}
              with={product.comparison.with}
              items={product.comparison.items}
            />
            </div>

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

            <div id="section-related" className="py-16 lg:py-20">
              <RelatedProducts product={product} allProducts={allProducts} />
            </div>
          </section>
        </div>

        <StickyMobileCTA
          productName={effectiveProduct.product}
          buyLinks={effectiveProduct.buyLinks}
        />
      </div>
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
      <div className="h-px w-6" style={{
        background: "linear-gradient(to right, transparent, var(--border-default), transparent)"
      }} />
      <div className="mx-2 h-1 w-1 rounded-full" style={{ background: "var(--border-default)" }} />
      <div className="h-px w-6" style={{
        background: "linear-gradient(to right, transparent, var(--border-default), transparent)"
      }} />
    </div>
  )
}

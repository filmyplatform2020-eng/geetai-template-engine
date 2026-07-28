"use client"

import { useState } from "react"
import type { Product } from "@/engine/product/types"
import type { VariantGroup } from "@/engine/variant"
import { applyVariant } from "@/engine/variant"
import Hero from "@/components/hero/Hero"
import FeatureGrid from "@/components/sections/FeatureGrid"
import TrustBar from "@/components/sections/TrustBar"
import ImageGallery from "@/components/sections/ImageGallery"
import VideoSection from "@/components/sections/VideoSection"
import Specifications from "@/components/sections/Specifications"
import ProsCons from "@/components/sections/ProsCons"
import ComparisonTable from "@/components/sections/ComparisonTable"
import CustomerReviews from "@/components/sections/CustomerReviews"
import FAQ from "@/components/sections/FAQ"
import CTA from "@/components/sections/CTA"
import StickyMobileCTA from "@/components/sections/StickyMobileCTA"
import BuyOptions from "@/components/sections/BuyOptions"
import VariantPicker from "@/components/sections/VariantPicker"
import Breadcrumbs from "@/components/seo/Breadcrumbs"

interface Props {
  product: Product
}

const variantGroups: VariantGroup[] = [
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
    label: "Memory",
    variants: [
      { id: "36gb", label: "36GB", type: "ram", price: 0 },
      { id: "48gb", label: "48GB", type: "ram", price: 400 },
    ],
  },
]

export default function ReviewPageClient({ product }: Props) {
  const [, setSelectedVariants] = useState<Record<string, string>>({})

  const handleVariantSelect = (type: string, id: string) => {
    setSelectedVariants((prev) => ({ ...prev, [type]: id }))
  }

  const variant = null
  const effectiveProduct = applyVariant(product, variant)

  return (
    <>
      <Hero product={effectiveProduct} variant="review" showCards={false} />

      <div className="relative z-10">
        <TrustBar />

        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <Breadcrumbs product={product} />
          <VariantPicker
            groups={variantGroups}
            activeVariant="space-black"
            onSelect={handleVariantSelect}
          />
        </div>

        <FeatureGrid
          title="Everything You Need"
          subtitle={`The ${effectiveProduct.product} delivers on every front.`}
          features={effectiveProduct.features}
        />

        <ImageGallery
          title="Designed to Impress"
          subtitle="Every angle tells a story of precision engineering."
          images={effectiveProduct.images}
        />

        <VideoSection title="See It in Action" videoUrl={product.videoUrl} />

        <Specifications
          title="Technical Specifications"
          subtitle="Every detail, quantified."
          specifications={effectiveProduct.specifications}
        />

        <ProsCons
          title="The Good & The Bad"
          subtitle="An honest look at what works and what doesn't."
          pros={effectiveProduct.pros}
          cons={effectiveProduct.cons}
        />

        <ComparisonTable
          title="How It Stacks Up"
          subtitle={`${effectiveProduct.product} vs ${product.comparison.with}`}
          productName={effectiveProduct.product}
          with={product.comparison.with}
          items={product.comparison.items}
        />

        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <BuyOptions product={effectiveProduct} />
        </div>

        <CustomerReviews
          title="Real Reviews from Real Users"
          subtitle={`What ${product.reviewCount.toLocaleString()} buyers are saying.`}
          reviews={product.reviews}
        />

        <FAQ title="Frequently Asked Questions" items={product.faq} />

        <CTA
          title="Ready to Buy?"
          description={`The ${effectiveProduct.product} is the best investment you can make.`}
          buttonText={`Buy ${effectiveProduct.product} — $${effectiveProduct.price}`}
          buttonHref={effectiveProduct.buyLinks[0]?.url ?? "#"}
        />
      </div>

      <StickyMobileCTA
        buyLinks={effectiveProduct.buyLinks}
        price={effectiveProduct.price}
        currency={effectiveProduct.currency}
      />
    </>
  )
}

"use client"

import { ArrowRight, ShoppingCart } from "lucide-react"
import type { Product } from "@/engine/product/types"
import Container from "@/components/ui/Container"
import SectionTitle from "@/components/ui/SectionTitle"
import Card from "@/components/ui/Card"
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer"
import Button from "@/components/ui/Button"
import Badge from "@/components/ui/Badge"
import Rating from "@/components/ui/Rating"

interface Props {
  products: Product[]
}

export default function HomeCatalog({ products }: Props) {
  if (!products.length) return null

  return (
    <Container>
      <SectionTitle
        title="Latest Reviews"
        subtitle="In-depth analysis of the best products on the market."
      />
      <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <StaggerItem key={product.slug}>
            <Card className="flex h-full flex-col p-5 sm:p-6">
              <div className="mb-4 flex aspect-video items-center justify-center rounded-xl bg-white/[0.02] ring-1 ring-white/[0.06]">
                <div className="text-center">
                  <div className="mx-auto mb-2 h-10 w-10 rounded-lg bg-gradient-to-br from-[#6c5ce7]/30 to-[#a29bfe]/30" />
                  <p className="text-xs text-white/20">{product.brand}</p>
                </div>
              </div>

              <div className="mb-1 flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold text-white/80">
                  {product.product}
                </h3>
                <Badge variant="primary" size="sm">
                  {product.currency}
                  {product.price.toLocaleString()}
                </Badge>
              </div>

              <p className="mb-3 text-xs leading-relaxed text-white/35 line-clamp-2">
                {product.tagline}
              </p>

              <Rating
                value={product.rating}
                count={product.reviewCount}
                size="sm"
              />

              <div className="mt-auto flex gap-2 pt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  href={`/review/${product.slug}`}
                >
                  Read Review
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  href={product.buyLinks[0]?.url ?? "#"}
                  icon={<ShoppingCart className="h-3 w-3" />}
                >
                  Buy Now
                </Button>
              </div>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <div className="mt-10 text-center">
        <Button
          variant="secondary"
          icon={<ArrowRight className="h-4 w-4" />}
          href="/"
        >
          View All Reviews
        </Button>
      </div>
    </Container>
  )
}

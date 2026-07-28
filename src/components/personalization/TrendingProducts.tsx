import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Product } from "@/engine/product/types"
import { getTrendingProducts } from "@/engine/personalization"
import Container from "@/components/ui/Container"
import SectionTitle from "@/components/ui/SectionTitle"
import Card from "@/components/ui/Card"
import Rating from "@/components/ui/Rating"

interface TrendingProductsProps {
  allProducts: Product[]
}

export default function TrendingProducts({ allProducts }: TrendingProductsProps) {
  const trending = getTrendingProducts(allProducts)

  if (!trending.length) return null

  return (
    <Container>
      <SectionTitle
        title="Trending Now"
        subtitle="Most popular products this month."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {trending.map((p, i) => (
          <Link key={p.slug} href={`/review/${p.slug}`}>
            <Card className="flex h-full flex-col p-5">
              <span className="mb-2 text-xs text-white/20">#{i + 1}</span>
              <p className="mb-1 text-sm font-medium text-white/80">{p.product}</p>
              <p className="mb-2 text-xs text-white/30">{p.brand}</p>
              <Rating value={p.rating} count={p.reviewCount} size="sm" />
              <div className="mt-auto flex items-center gap-1 pt-3 text-xs text-white/30">
                View <ArrowRight className="h-3 w-3" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  )
}

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Product } from "@/engine/product/types"
import { getRelatedProducts } from "@/engine/personalization"
import Container from "@/components/ui/Container"
import SectionTitle from "@/components/ui/SectionTitle"
import Card from "@/components/ui/Card"
import Rating from "@/components/ui/Rating"
import Badge from "@/components/ui/Badge"

interface RelatedProductsProps {
  product: Product
  allProducts: Product[]
}

export default function RelatedProducts({ product, allProducts }: RelatedProductsProps) {
  const related = getRelatedProducts(product, allProducts)

  if (!related.length) return null

  return (
    <Container>
      <SectionTitle title="Related Products" subtitle="You might also like these." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((p) => (
          <Link key={p.slug} href={`/review/${p.slug}`}>
            <Card className="flex h-full flex-col p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs text-muted">{p.brand}</span>
                <Badge variant="primary" size="sm">
                  {p.currency}{p.price.toLocaleString()}
                </Badge>
              </div>
              <p className="mb-2 text-sm font-medium text-primary">{p.product}</p>
              <Rating value={p.rating} count={p.reviewCount} size="sm" />
              <div className="mt-auto flex items-center gap-1 pt-3 text-xs text-muted">
                Read Review <ArrowRight className="h-3 w-3" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  )
}

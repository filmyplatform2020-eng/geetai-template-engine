import Link from "next/link"
import { ChevronRight } from "lucide-react"
import type { Product } from "@/engine/product/types"

interface BreadcrumbsProps {
  product: Product
}

export default function Breadcrumbs({ product }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1.5 text-xs text-muted">
        <li>
          <Link href="/" className="transition-colors hover:text-secondary">
            Home
          </Link>
        </li>
        <ChevronRight className="h-3 w-3" />
        <li>
          <Link
            href={`/${product.category}`}
            className="transition-colors hover:text-secondary"
          >
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </Link>
        </li>
        <ChevronRight className="h-3 w-3" />
        <li className="text-secondary truncate max-w-[200px]">
          {product.product}
        </li>
      </ol>
    </nav>
  )
}

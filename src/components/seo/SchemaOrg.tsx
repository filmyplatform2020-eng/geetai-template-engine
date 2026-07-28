import type { Product } from "@/engine/product/types"
import { productSchema } from "@/engine/seo/schema"

interface SchemaOrgProps {
  product: Product
}

export default function SchemaOrg({ product }: SchemaOrgProps) {
  const schema = productSchema(product)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

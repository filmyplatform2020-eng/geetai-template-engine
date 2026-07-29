import { getAllProducts } from "@/cms/adapters"
import ProductPageTemplateV8 from "@/components/templates/ProductPageTemplateV8"

export const dynamic = "force-static"

export default async function PreviewV8Page() {
  const products = await getAllProducts()
  const product = products.find((p) => p.slug === "macbook-pro-16-m4")
  if (!product) return <div className="p-8 text-primary">Product not found</div>

  return (
    <>
      <ProductPageTemplateV8
        product={product}
        allProducts={products}
      />
    </>
  )
}

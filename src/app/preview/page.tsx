import { getAllProducts } from "@/cms/adapters"
import { getStyleById } from "@/data/styles"
import ProductPageTemplate from "@/components/templates/ProductPageTemplate"

export const dynamic = "force-static"

export default async function PreviewPage() {
  const products = await getAllProducts()
  const product = products.find((p) => p.slug === "macbook-pro-16-m4")
  if (!product) return <div className="p-8">Product not found</div>

  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-[20%] -top-[20%] h-[80%] w-[80%] opacity-40"
          style={{ background: "radial-gradient(circle, rgba(200,210,250,0.376) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute -bottom-[10%] -right-[10%] h-[70%] w-[60%] opacity-35"
          style={{ background: "radial-gradient(circle, rgba(255,210,255,0.376) 0%, transparent 70%)", filter: "blur(50px)" }} />
        <div className="absolute left-[40%] top-[30%] h-[40%] w-[40%] opacity-25"
          style={{ background: "radial-gradient(circle, rgba(200,210,250,0.25) 0%, transparent 70%)", filter: "blur(45px)" }} />
      </div>
      <ProductPageTemplate
        product={product}
        allProducts={products}
        styleOverride={getStyleById("image-derived")!}
      />
    </>
  )
}

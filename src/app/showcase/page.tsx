import { getAllProducts } from "@/cms/adapters"
import { styleVariations } from "@/data/styles"
import ShowcaseClient from "./ShowcaseClient"

export const dynamic = "force-static"

export default async function ShowcasePage() {
  const products = await getAllProducts()
  const product = products.find((p) => p.slug === "macbook-pro-16-m4")
  if (!product) return <div className="p-8 text-white/50">Product not found</div>

  return <ShowcaseClient product={product} allProducts={products} variations={styleVariations} />
}

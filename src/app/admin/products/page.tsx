import { getAllProducts } from "@/cms/adapters"
import ProductsClient from "./ProductsClient"

export default function ProductsPage() {
  const products = getAllProducts()
  return <ProductsClient products={products} />
}

import Hero from "@/components/hero/Hero"
import TrustBar from "@/components/sections/TrustBar"
import { getAllProducts } from "@/data/products"
import HomeCatalog from "./HomeCatalog"

export default function Home() {
  const products = getAllProducts()

  return (
    <>
      <Hero />
      <div className="relative z-10">
        <TrustBar />
        <HomeCatalog products={products} />
      </div>
    </>
  )
}

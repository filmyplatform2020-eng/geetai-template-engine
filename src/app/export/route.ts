import { getAllProducts } from "@/data/products"

export async function GET() {
  const products = getAllProducts()

  const exportData = products.map((p) => ({
    slug: p.slug,
    product: p.product,
    brand: p.brand,
    price: p.price,
    currency: p.currency,
    rating: p.rating,
    reviewCount: p.reviewCount,
    category: p.category,
    tags: p.tags,
    tagline: p.tagline,
    description: p.description,
    image: p.images[0]?.src ?? null,
    buyLinks: p.buyLinks.map((l) => ({
      store: l.store,
      url: l.url,
      price: l.price,
      currency: l.currency,
      available: l.available,
    })),
    seo: p.seo,
    comparison: { with: p.comparison.with },
  }))

  return Response.json({ count: exportData.length, products: exportData })
}

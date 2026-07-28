import type { MetadataRoute } from "next"
import { getAllProducts } from "@/data/products"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://geetai.com"
  const products = getAllProducts()

  const productEntries: MetadataRoute.Sitemap = products.flatMap((p) => [
    {
      url: `${baseUrl}/review/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guide/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ])

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...productEntries,
  ]
}

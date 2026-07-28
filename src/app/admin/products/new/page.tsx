"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Product } from "@/engine/product/types"

export default function NewProductPage() {
  const router = useRouter()
  const [slug, setSlug] = useState("")
  const [product, setProduct] = useState("")
  const [brand, setBrand] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const newProduct: Partial<Product> = {
      slug,
      product,
      brand,
      price: Number(price),
      category,
      currency: "$",
      rating: 0,
      reviewCount: 0,
      images: [],
      features: [],
      pros: [],
      cons: [],
      specifications: [],
      reviews: [],
      faq: [],
      comparison: { with: "", items: [] },
      buyLinks: [],
      tags: [],
      alternatives: [],
      accessories: [],
      verdict: "",
      guide: { sections: [] },
      seo: { title: "", description: "", keywords: [] },
      tagline: "",
      description: "",
    }
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      })
      if (res.ok) router.push("/admin/products")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-white/90">New Product</h1>
      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="mb-1 block text-xs text-white/50">Slug</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 outline-none focus:border-white/20" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/50">Product Name</label>
          <input value={product} onChange={(e) => setProduct(e.target.value)} required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 outline-none focus:border-white/20" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs text-white/50">Brand</label>
            <input value={brand} onChange={(e) => setBrand(e.target.value)} required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 outline-none focus:border-white/20" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-white/50">Price ($)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 outline-none focus:border-white/20" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/50">Category</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} required
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 outline-none focus:border-white/20" />
        </div>
        <button type="submit" disabled={saving}
          className="rounded-lg bg-white/10 px-6 py-2 text-sm text-white/80 hover:bg-white/20 disabled:opacity-50 transition-colors">
          {saving ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  )
}

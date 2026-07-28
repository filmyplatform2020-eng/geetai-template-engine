"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Product } from "@/engine/product/types"

interface Props {
  product: Product
}

export default function EditProductClient({ product }: Props) {
  const router = useRouter()
  const [name, setName] = useState(product.product)
  const [price, setPrice] = useState(String(product.price))
  const [description, setDescription] = useState(product.description)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/products/${product.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: name, price: Number(price), description }),
      })
      if (res.ok) router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-white/90">
        Edit: {product.product}
      </h1>
      <div className="max-w-xl space-y-4">
        <div>
          <label className="mb-1 block text-xs text-white/50">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 outline-none focus:border-white/20" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/50">Price ($)</label>
          <input value={price} onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 outline-none focus:border-white/20" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-white/50">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 outline-none focus:border-white/20" />
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-white/40">Slug: <span className="text-white/60">{product.slug}</span></p>
          <p className="text-xs text-white/40">Brand: <span className="text-white/60">{product.brand}</span></p>
          <p className="text-xs text-white/40">Category: <span className="text-white/60">{product.category}</span></p>
          <p className="text-xs text-white/40">Rating: <span className="text-white/60">{product.rating} ({product.reviewCount} reviews)</span></p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving}
            className="rounded-lg bg-white/10 px-6 py-2 text-sm text-white/80 hover:bg-white/20 disabled:opacity-50 transition-colors">
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button onClick={() => router.push("/admin/products")}
            className="rounded-lg border border-white/10 px-6 py-2 text-sm text-white/50 hover:bg-white/5 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

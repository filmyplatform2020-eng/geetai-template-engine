"use client"

import { useMemo } from "react"
import { getAllProducts } from "@/cms/adapters"
import { generateSEO } from "@/engine/seo"
import { productSchema } from "@/engine/seo/schema"

export default function SEOPage() {
  const products = useMemo(() => getAllProducts(), [])

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-white/90">SEO</h1>
      <p className="mb-6 text-sm text-white/50">
        {products.length} products with auto-generated SEO metadata.
      </p>
      <div className="space-y-3">
        {products.map((p) => {
          const seo = generateSEO(p)
          const schema = productSchema(p)
          return (
            <details key={p.slug} className="group rounded-xl border border-white/10 bg-white/[0.03]">
              <summary className="cursor-pointer px-5 py-4 text-sm font-medium text-white/70 hover:text-white/90">
                {p.product}
              </summary>
              <div className="space-y-3 border-t border-white/10 px-5 py-4">
                <div>
                  <p className="mb-1 text-xs text-white/40">Title</p>
                  <p className="text-sm text-white/70">{seo.title}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-white/40">Description</p>
                  <p className="text-sm text-white/70">{seo.description}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-white/40">Canonical</p>
                  <p className="text-sm text-white/70">{seo.canonical}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-white/40">Robots</p>
                  <p className="text-sm text-white/70">{seo.robots}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-white/40">Schema.org</p>
                  <pre className="max-h-48 overflow-auto rounded-lg bg-white/5 p-3 text-xs text-white/50">
                    {JSON.stringify(schema, null, 2)}
                  </pre>
                </div>
              </div>
            </details>
          )
        })}
      </div>
    </div>
  )
}

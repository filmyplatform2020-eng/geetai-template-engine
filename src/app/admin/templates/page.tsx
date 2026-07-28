"use client"

import { useMemo } from "react"
import { getAllProducts } from "@/cms/adapters"
import { getTemplateForCategory } from "@/engine/templates"

export default function TemplatesPage() {
  const products = useMemo(() => getAllProducts(), [])
  const categories = [...new Set(products.map((p) => p.category))]

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-white/90">Templates</h1>
      <p className="mb-6 text-sm text-white/50">
        Each category auto-selects a template. {categories.length} categories active.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const tmpl = getTemplateForCategory(cat)
          return (
            <div key={cat} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-white/40">{cat}</p>
              <p className="mt-2 text-lg font-semibold text-white/80">{tmpl.id}</p>
              <p className="mt-1 text-xs text-white/40">{tmpl.label}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/40">
                  {tmpl.heroLayout}
                </span>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/40">
                  {tmpl.galleryStyle}
                </span>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/40">
                  {tmpl.ctaStyle}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

"use client"

import { useMemo } from "react"
import { getAllProducts, getCategories } from "@/cms/adapters"
import DataTable from "@/admin/components/DataTable"

export default function CategoriesPage() {
  const products = useMemo(() => getAllProducts(), [])
  const categories = useMemo(() => getCategories(), [])
  const data = categories.map((cat) => ({
    name: cat,
    count: products.filter((p) => p.category === cat).length,
    avgRating: (() => {
      const catProducts = products.filter((p) => p.category === cat)
      return catProducts.length ? (catProducts.reduce((s, p) => s + p.rating, 0) / catProducts.length).toFixed(1) : "—"
    })(),
  }))

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-white/90">Categories</h1>
      <DataTable
        data={data as unknown as Record<string, unknown>[]}
        columns={[
          { key: "name", label: "Name", sortable: true },
          { key: "count", label: "Products", sortable: true },
          { key: "avgRating", label: "Avg Rating", sortable: true },
        ]}
        keyExtractor={(d) => d.name as string}
        searchable
        searchKeys={["name"]}
      />
    </div>
  )
}

"use client"

import { useMemo } from "react"
import { getAllProducts, getBrands } from "@/cms/adapters"
import DataTable from "@/admin/components/DataTable"

export default function BrandsPage() {
  const products = useMemo(() => getAllProducts(), [])
  const brands = useMemo(() => getBrands(), [])
  const data = brands.map((brand) => ({
    name: brand,
    count: products.filter((p) => p.brand === brand).length,
    avgRating: (() => {
      const brandProducts = products.filter((p) => p.brand === brand)
      return brandProducts.length ? (brandProducts.reduce((s, p) => s + p.rating, 0) / brandProducts.length).toFixed(1) : "—"
    })(),
  }))

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-white/90">Brands</h1>
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

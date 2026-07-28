"use client"

import { useMemo } from "react"
import { getAllProducts, getCategories, getBrands } from "@/cms/adapters"
import StatCard from "@/admin/components/StatCard"
import DataTable from "@/admin/components/DataTable"

export default function AdminDashboard() {
  const products = useMemo(() => getAllProducts(), [])
  const categories = useMemo(() => getCategories(), [])
  const brands = useMemo(() => getBrands(), [])
  const totalReviews = products.reduce((sum, p) => sum + p.reviews.length, 0)
  const avgRating = products.length ? products.reduce((s, p) => s + p.rating, 0) / products.length : 0
  const totalAffiliates = [...new Set(products.flatMap((p) => p.buyLinks.map((l) => l.store)))].length
  const lowStock = products.filter((p) => p.buyLinks.every((l) => !l.available)).length

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-white/90">Dashboard</h1>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Products" value={products.length} />
        <StatCard label="Categories" value={categories.length} />
        <StatCard label="Brands" value={brands.length} />
        <StatCard label="Total Reviews" value={totalReviews} />
        <StatCard label="Avg Rating" value={avgRating.toFixed(1)} change={avgRating >= 4 ? "Excellent" : "Needs improvement"} positive={avgRating >= 4} />
        <StatCard label="Affiliate Stores" value={totalAffiliates} />
        <StatCard label="Low Stock Items" value={lowStock} change={lowStock > 0 ? "Review needed" : "All good"} positive={lowStock === 0} />
        <StatCard label="Total Products" value={products.length} change={`${categories.length} categories`} />
      </div>
      <h2 className="mb-4 text-lg font-semibold text-white/80">All Products</h2>
      <DataTable
        data={products as unknown as Record<string, unknown>[]}
        columns={[
          { key: "product", label: "Product", sortable: true },
          { key: "brand", label: "Brand", sortable: true },
          { key: "category", label: "Category", sortable: true },
          { key: "price", label: "Price", sortable: true, render: (p: Record<string, unknown>) => `$${p.price}` },
          { key: "rating", label: "Rating", sortable: true },
          { key: "reviewCount", label: "Reviews", sortable: true },
        ]}
        keyExtractor={(p) => p.slug as string}
        searchable
        searchKeys={["product", "brand", "category"]}
        pageSize={5}
      />
    </div>
  )
}

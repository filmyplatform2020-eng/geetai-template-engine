"use client"

import Link from "next/link"
import DataTable from "@/admin/components/DataTable"
import type { Product } from "@/engine/product/types"

interface Props {
  products: Product[]
}

export default function ProductsClient({ products }: Props) {
  const columns = [
    { key: "product" as keyof Product, label: "Name", sortable: true },
    { key: "brand" as keyof Product, label: "Brand", sortable: true },
    { key: "category" as keyof Product, label: "Category", sortable: true },
    { key: "price" as keyof Product, label: "Price", sortable: true, render: (p: Product) => `${p.currency}${p.price}` },
    { key: "rating" as keyof Product, label: "Rating", sortable: true },
    { key: "reviewCount" as keyof Product, label: "Reviews", sortable: true },
    { key: "actions" as keyof Product, label: "Actions", render: (p: Product) => (
      <Link href={`/admin/products/${p.slug}`} className="text-blue-400 hover:text-blue-300 transition-colors text-xs">
        Edit
      </Link>
    )},
  ]

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white/90">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/20 transition-colors"
        >
          + New Product
        </Link>
      </div>
      <DataTable
        data={products as unknown as Record<string, unknown>[]}
        columns={columns as { key: string; label: string; sortable?: boolean; render?: (item: Record<string, unknown>) => React.ReactNode }[]}
        keyExtractor={(p) => p.slug as string}
        searchable
        searchKeys={["product", "brand", "category", "slug"]}
        pageSize={15}
      />
    </div>
  )
}

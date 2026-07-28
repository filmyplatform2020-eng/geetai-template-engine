"use client"

import { affiliateService } from "@/admin/services/affiliateService"
import StatCard from "@/admin/components/StatCard"
import DataTable from "@/admin/components/DataTable"

export default function AffiliatePage() {
  const links = affiliateService.getAllLinks()
  const stats = affiliateService.getStats()

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-white/90">Affiliate Links</h1>
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <StatCard label="Total Links" value={stats.total} />
        <StatCard label="Available" value={stats.available} change={`${((stats.available / stats.total) * 100).toFixed(0)}%`} positive />
        <StatCard label="Unavailable" value={stats.unavailable} change={stats.unavailable > 0 ? "Review needed" : "All good"} positive={stats.unavailable === 0} />
        <StatCard label="Avg Price" value={`$${stats.avgPrice.toFixed(0)}`} />
      </div>
      <DataTable
        data={links as unknown as Record<string, unknown>[]}
        columns={[
          { key: "store", label: "Store", sortable: true },
          { key: "productName", label: "Product", sortable: true },
          { key: "productSlug", label: "Slug" },
          { key: "price", label: "Price", sortable: true, render: (l: Record<string, unknown>) => `$${l.price}` },
          {
            key: "available",
            label: "Status",
            render: (l: Record<string, unknown>) => (
              <span className={l.available ? "text-emerald-400" : "text-red-400"}>
                {l.available ? "Available" : "Unavailable"}
              </span>
            ),
          },
          { key: "badge", label: "Badge" },
        ]}
        keyExtractor={(l) => `${l.productSlug}-${l.store}` as string}
        searchable
        searchKeys={["store", "productName"]}
        pageSize={15}
      />
    </div>
  )
}

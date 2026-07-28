"use client"

import { useMemo } from "react"
import { analyticsService } from "@/admin/services/analyticsService"
import StatCard from "@/admin/components/StatCard"

export default function AnalyticsPage() {
  const summary = useMemo(() => analyticsService.getSummary(), [])

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-white/90">Analytics</h1>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Products" value={summary.totalProducts} />
        <StatCard label="Categories" value={summary.totalCategories} />
        <StatCard label="Total Reviews" value={summary.totalReviews} />
        <StatCard label="Avg Rating" value={summary.avgRating.toFixed(1)} />
        <StatCard label="Total Brands" value={summary.totalBrands} />
        <StatCard label="Buy Links" value={summary.totalBuyLinks} />
        <StatCard label="Affiliate Stores" value={summary.activeAffiliates} />
        <StatCard label="Page Views" value={summary.pageViews || "—"} />
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-white/40">Analytics Providers</p>
        <p className="mt-2 text-sm text-white/50">
          GA4, GTM, Clarity, Meta Pixel, Pinterest configured. Connect environment variables to activate.
        </p>
      </div>
    </div>
  )
}

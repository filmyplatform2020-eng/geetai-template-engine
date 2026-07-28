import * as cms from "@/cms/adapters"
import type { AnalyticsSummary } from "@/admin/types"

export const analyticsService = {
  getSummary(): AnalyticsSummary {
    const products = cms.getAllProducts()
    const allReviews = products.flatMap((p) => p.reviews)
    const totalRating = products.reduce((sum, p) => sum + p.rating, 0)

    return {
      totalProducts: products.length,
      totalCategories: cms.getCategories().length,
      totalBrands: cms.getBrands().length,
      totalReviews: allReviews.length,
      avgRating: products.length ? totalRating / products.length : 0,
      totalBuyLinks: products.reduce((sum, p) => sum + p.buyLinks.length, 0),
      activeAffiliates: [...new Set(products.flatMap((p) => p.buyLinks.map((l) => l.store)))].length,
      pageViews: 0,
    }
  },
}

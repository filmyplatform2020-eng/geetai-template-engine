import * as cms from "@/cms/adapters"
import type { BuyLink } from "@/engine/product/types"

export interface AffiliateLink extends BuyLink {
  productSlug: string
  productName: string
}

export const affiliateService = {
  getAllLinks(): AffiliateLink[] {
    return cms.getAllProducts().flatMap((p) =>
      p.buyLinks.map((l) => ({
        ...l,
        productSlug: p.slug,
        productName: p.product,
      }))
    )
  },

  getStores(): string[] {
    return [...new Set(cms.getAllProducts().flatMap((p) => p.buyLinks.map((l) => l.store)))]
  },

  getStats() {
    const links = this.getAllLinks()
    const total = links.length
    const available = links.filter((l) => l.available).length
    const avgPrice = total ? links.reduce((s, l) => s + l.price, 0) / total : 0
    return { total, available, unavailable: total - available, avgPrice }
  },
}

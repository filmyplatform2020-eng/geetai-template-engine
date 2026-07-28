import type { BuyLink, Product } from "@/engine/product/types"

export const MERCHANT_PRIORITY: Record<string, number> = {
  "Amazon": 1,
  "Apple Store": 1,
  "Flipkart": 1,
  "Croma": 2,
  "Reliance Digital": 2,
  "Best Buy": 2,
  "B&H Photo": 3,
}

export function sortBuyLinks(links: BuyLink[]): BuyLink[] {
  return [...links].sort((a, b) => {
    if (a.available && !b.available) return -1
    if (!a.available && b.available) return 1
    const pa = MERCHANT_PRIORITY[a.store] ?? 99
    const pb = MERCHANT_PRIORITY[b.store] ?? 99
    if (pa !== pb) return pa - pb
    return a.price - b.price
  })
}

export function getLowestPrice(links: BuyLink[]): number | null {
  const available = links.filter((l) => l.available)
  if (!available.length) return null
  return Math.min(...available.map((l) => l.price))
}

export function getSavings(product: Product): number | null {
  if (!product.originalPrice) return null
  const lowest = getLowestPrice(product.buyLinks)
  if (!lowest) return null
  return Math.round(((product.originalPrice - lowest) / product.originalPrice) * 100)
}

export function hasCoupon(link: BuyLink): boolean {
  return !!link.badge?.toLowerCase().includes("coupon") || !!link.badge?.toLowerCase().includes("code")
}

export function formatPrice(amount: number, currency = "$"): string {
  return `${currency}${amount.toLocaleString()}`
}

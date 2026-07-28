import { regions, type CurrencyCode, type RegionConfig } from "./config"

const FALLBACK_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83,
  JPY: 150,
  AUD: 1.55,
  CAD: 1.37,
  SGD: 1.34,
}

export function getRegion(regionCode: string): RegionConfig {
  return regions[regionCode] ?? regions["us"]
}

export function convertPrice(priceUSD: number, targetCurrency: CurrencyCode): number {
  const rate = FALLBACK_RATES[targetCurrency] ?? 1
  return Math.round(priceUSD * rate)
}

export function formatPriceLocalized(
  priceUSD: number,
  regionCode: string,
  showTax = false
): { raw: number; formatted: string; tax: number } {
  const region = getRegion(regionCode)
  const converted = convertPrice(priceUSD, region.currency)
  const tax = showTax ? Math.round(converted * region.taxRate) : 0
  const formatter = new Intl.NumberFormat(region.locale, {
    style: "currency",
    currency: region.currency,
  })
  return { raw: converted, formatted: formatter.format(converted), tax }
}

export function getRegionalAffiliateUrl(baseUrl: string, regionCode: string): string {
  const region = getRegion(regionCode)
  try {
    const url = new URL(baseUrl)
    if (url.hostname.includes("amazon")) {
      url.hostname = region.affiliatePrefix
    }
    return url.toString()
  } catch {
    return baseUrl
  }
}

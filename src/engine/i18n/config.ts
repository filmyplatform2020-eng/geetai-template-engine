export type CurrencyCode = "USD" | "EUR" | "GBP" | "INR" | "JPY" | "AUD" | "CAD" | "SGD"
export type LocaleCode = "en-US" | "en-GB" | "en-IN" | "en-AU" | "de-DE" | "fr-FR" | "ja-JP"

export interface RegionConfig {
  locale: LocaleCode
  currency: CurrencyCode
  currencySymbol: string
  country: string
  taxRate: number
  taxLabel: string
  affiliatePrefix: string
}

export const regions: Record<string, RegionConfig> = {
  "us": {
    locale: "en-US",
    currency: "USD",
    currencySymbol: "$",
    country: "United States",
    taxRate: 0.08,
    taxLabel: "incl. estimated tax",
    affiliatePrefix: "amazon.com",
  },
  "gb": {
    locale: "en-GB",
    currency: "GBP",
    currencySymbol: "£",
    country: "United Kingdom",
    taxRate: 0.20,
    taxLabel: "incl. VAT",
    affiliatePrefix: "amazon.co.uk",
  },
  "in": {
    locale: "en-IN",
    currency: "INR",
    currencySymbol: "₹",
    country: "India",
    taxRate: 0.18,
    taxLabel: "incl. GST",
    affiliatePrefix: "amazon.in",
  },
  "de": {
    locale: "de-DE",
    currency: "EUR",
    currencySymbol: "€",
    country: "Germany",
    taxRate: 0.19,
    taxLabel: "incl. MwSt",
    affiliatePrefix: "amazon.de",
  },
  "au": {
    locale: "en-AU",
    currency: "AUD",
    currencySymbol: "A$",
    country: "Australia",
    taxRate: 0.10,
    taxLabel: "incl. GST",
    affiliatePrefix: "amazon.com.au",
  },
  "jp": {
    locale: "ja-JP",
    currency: "JPY",
    currencySymbol: "¥",
    country: "Japan",
    taxRate: 0.10,
    taxLabel: "incl. tax",
    affiliatePrefix: "amazon.co.jp",
  },
}

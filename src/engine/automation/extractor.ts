import ogs from "open-graph-scraper"
import * as cheerio from "cheerio"
import type { ScrapedData, ProductSource } from "./types"

export interface ExtractResult {
  data?: ScrapedData
  error?: string
}

export async function extractFromURL(url: string): Promise<ExtractResult> {
  try {
    const ogResult = await ogs({ url, timeout: 15 })
    const og = ogResult.result

    const productName = og.ogTitle ?? ""
    const description = og.ogDescription ?? ""
    const images = (og.ogImage ?? []).map((img) => (typeof img === "string" ? img : img.url)).filter(Boolean) as string[]

    let price = extractPrice(og)
    let currency = extractCurrency(og)

    if (!price) {
      const scraped = await scrapeHTML(url)
      price = scraped.price || price
      currency = scraped.currency || currency
    }

    const brand = extractBrand(productName, og)

    return {
      data: {
        productName,
        brand,
        price,
        currency,
        description,
        images,
        category: detectCategory(productName, description),
        url,
      },
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    return { error: `Failed to extract from URL: ${message}` }
  }
}

function extractPrice(og: Record<string, unknown>): number {
  if (og.ogPrice) return Number(og.ogPrice)
  if (og["product:price:amount"]) return Number(og["product:price:amount"])
  return 0
}

async function scrapeHTML(url: string): Promise<{ price: number; currency: string }> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(10_000),
    })
    const html = await res.text()
    const $ = cheerio.load(html)

    const { price: ldPrice, currency: ldCurrency } = parseJSONLD($)
    if (ldPrice > 0) return { price: ldPrice, currency: ldCurrency || "$" }

    const patterns = [
      { sel: '[property="product:price:amount"]', attr: "content" },
      { sel: '[itemprop="price"]', attr: "content" },
      { sel: '[data-price]', attr: "data-price" },
      { sel: ".price", text: true },
      { sel: "[class*='price']", text: true },
      { sel: ".a-price .a-offscreen", text: true },
      { sel: ".a-price-whole", text: true },
      { sel: "[class*='Price']", text: true },
    ]

    let priceVal = 0
    for (const p of patterns) {
      const el = $(p.sel).first()
      if (!el.length) continue
      const raw = p.attr ? el.attr(p.attr) : el.text()
      if (!raw) continue
      const cleaned = raw.replace(/[^0-9.]/g, "")
      if (cleaned) {
        priceVal = parseFloat(cleaned)
        if (priceVal > 0) break
      }
    }

    let currencyVal = ldCurrency
    if (!currencyVal) {
      const currEl = $('[property="product:price:currency"]').first().attr("content")
        || $('[itemprop="priceCurrency"]').first().attr("content")
      if (currEl) currencyVal = currEl
    }
    if (!currencyVal && html.includes("\u20B9")) currencyVal = "INR"

    return { price: priceVal || ldPrice, currency: currencyVal || "$" }
  } catch {
    return { price: 0, currency: "" }
  }
}

function parseJSONLD($: cheerio.CheerioAPI): { price: number; currency: string } {
  const result = { price: 0, currency: "" }
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).text())
      const items = Array.isArray(data) ? data : [data]
      for (const item of items) {
        if (item["@type"] === "Product" || item["@type"]?.endsWith("Product")) {
          if (item.offers) {
            const offers = Array.isArray(item.offers) ? item.offers : [item.offers]
            for (const offer of offers) {
              if (offer.price && Number(offer.price) > 0) {
                result.price = Number(offer.price)
                if (offer.priceCurrency) result.currency = offer.priceCurrency
                return
              }
            }
          }
          if (item.price || item.price > 0) {
            result.price = Number(item.price)
          }
        }
      }
    } catch {}
  })
  return result
}

function extractCurrency(og: Record<string, unknown>): string {
  if (og["product:price:currency"]) return String(og["product:price:currency"])
  return "$"
}

function extractBrand(title: string, og: Record<string, unknown>): string {
  if (og["og:brand"]) return String(og["og:brand"])
  if (og["product:brand"]) return String(og["product:brand"])
  const known: Record<string, string> = {
    amazon: "Amazon", flipkart: "Flipkart", apple: "Apple",
    samsung: "Samsung", sony: "Sony", dell: "Dell",
    lg: "LG", lenovo: "Lenovo",     google: "Google", pixel: "Google",
  }
  const lower = title.toLowerCase()
  for (const [key, val] of Object.entries(known)) {
    if (lower.includes(key)) return val
  }
  return title.split(" ")[0] ?? ""
}

export function detectCategory(title: string, desc: string): string {
  const text = `${title} ${desc}`.toLowerCase()
  if (/\b(laptop|notebook|computer|macbook)\b/.test(text)) return "laptops"
  if (/\b(phone|smartphone|iphone|galaxy|oneplus|pixel)\b/.test(text)) return "phones"
  if (/\b(earbuds|earphones|headphone|airpods)\b/.test(text)) return "earbuds"
  if (/\b(camera|dslr|mirrorless|lens)\b/.test(text)) return "cameras"
  if (/\b(watch|wearable|smartwatch|fitness tracker)\b/.test(text)) return "wearables"
  if (/\b(tv|monitor|display|oled|qled)\b/.test(text)) return "monitors"
  if (/\b(gaming|console|playstation|xbox|nintendo)\b/.test(text)) return "gaming"
  if (/\b(drone|quadcopter|gimbal)\b/.test(text)) return "drones"
  if (/\b(speaker|soundbar|smart speaker)\b/.test(text)) return "speakers"
  if (/\b(tablet|ipad)\b/.test(text)) return "tablets"
  if (/\b(ereader|kindle|kobo)\b/.test(text)) return "ereaders"
  if (/\b(vr|headset|quest|mixed reality)\b/.test(text)) return "vr-headsets"
  if (/\b(audio|sound|music)\b/.test(text)) return "audio"
  if (/\b(accessory|cable|case|charger)\b/.test(text)) return "accessories"
  return "laptops"
}

export function extractFromJSON(data: Record<string, unknown>): ExtractResult {
  const productName = String(data.name ?? data.title ?? data.productName ?? "")
  if (!productName) return { error: "No product name found in JSON" }

  return {
    data: {
      productName,
      brand: String(data.brand ?? extractBrand(productName, {})),
      price: Number(data.price ?? 0),
      currency: String(data.currency ?? "$"),
      description: String(data.description ?? data.desc ?? ""),
      images: extractImages(data),
      category: String(data.category ?? detectCategory(productName, "")),
      url: String(data.url ?? ""),
    },
  }
}

function extractImages(og: Record<string, unknown>): string[] {
  const imgs = og.ogImage ?? og["og:image"] ?? og.image ?? og.images ?? []
  if (typeof imgs === "string") return [imgs]
  if (Array.isArray(imgs)) return imgs.filter((i): i is string => typeof i === "string")
  if (typeof og.image === "string") return [og.image]
  return []
}

export async function extractProduct(source: ProductSource): Promise<ExtractResult> {
  switch (source.type) {
    case "url":
      return extractFromURL(source.url)
    case "json":
      return extractFromJSON(source.data)
    case "ai":
      return {
        data: {
          productName: source.productName,
          brand: source.brand,
          price: 0,
          currency: "$",
          description: "",
          images: [],
          category: source.category,
          url: "",
        },
      }
    default:
      return { error: "Unknown source type" }
  }
}

import type { AnalyticsConfig, TrackEvent } from "./config"

type PushFn = (config: AnalyticsConfig, event: TrackEvent) => void

function ga4Push(config: AnalyticsConfig, event: TrackEvent): void {
  if (!config.ga4 || typeof window === "undefined") return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gtag = (window as any).gtag
  if (!gtag) return
  gtag("event", event.name, event.properties ?? {})
}

function gtmPush(_config: AnalyticsConfig, event: TrackEvent): void {
  if (typeof window === "undefined") return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataLayer = (window as any).dataLayer
  if (!dataLayer) return
  dataLayer.push({ event: event.name, ...event.properties })
}

function clarityPush(config: AnalyticsConfig, event: TrackEvent): void {
  if (!config.clarity || typeof window === "undefined") return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clarity = (window as any).clarity
  if (!clarity) return
  clarity("event", event.name)
}

function metaPush(config: AnalyticsConfig, event: TrackEvent): void {
  if (!config.meta || typeof window === "undefined") return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fbq = (window as any).fbq
  if (!fbq) return
  const eventMap: Record<string, string> = {
    product_view: "ViewContent",
    affiliate_click: "AddToCart",
    cta_click: "Lead",
    search: "Search",
  }
  const mapped = eventMap[event.name] ?? "ViewContent"
  fbq("track", mapped, event.properties ?? {})
}

function pinterestPush(config: AnalyticsConfig, event: TrackEvent): void {
  if (!config.pinterest || typeof window === "undefined") return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pintrk = (window as any).pintrk
  if (!pintrk) return
  pintrk("track", event.name, event.properties ?? {})
}

const providers: PushFn[] = [ga4Push, gtmPush, clarityPush, metaPush, pinterestPush]

export function trackEvent(config: AnalyticsConfig, event: TrackEvent): void {
  providers.forEach((fn) => fn(config, event))
}

export function trackProductView(config: AnalyticsConfig, slug: string, name: string, price: number): void {
  trackEvent(config, {
    name: "product_view",
    properties: { slug, name, price, currency: "USD" },
  })
}

export function trackAffiliateClick(config: AnalyticsConfig, store: string, slug: string, price: number): void {
  trackEvent(config, {
    name: "affiliate_click",
    properties: { store, slug, price, currency: "USD" },
  })
}

export function trackSearch(config: AnalyticsConfig, query: string, results: number): void {
  trackEvent(config, {
    name: "search",
    properties: { query, results },
  })
}

export function trackScrollDepth(config: AnalyticsConfig, depth: number): void {
  trackEvent(config, {
    name: "scroll_depth",
    properties: { depth },
  })
}

export function trackCtaClick(config: AnalyticsConfig, label: string): void {
  trackEvent(config, {
    name: "cta_click",
    properties: { label },
  })
}

export function trackVariantChange(config: AnalyticsConfig, variant: string, product: string): void {
  trackEvent(config, {
    name: "variant_change",
    properties: { variant, product },
  })
}

export function trackGalleryClick(config: AnalyticsConfig, index: number, product: string): void {
  trackEvent(config, {
    name: "gallery_click",
    properties: { index, product },
  })
}

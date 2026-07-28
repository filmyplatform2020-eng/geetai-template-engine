export interface AnalyticsConfig {
  ga4?: { measurementId: string }
  gtm?: { containerId: string }
  clarity?: { projectId: string }
  meta?: { pixelId: string }
  pinterest?: { tagId: string }
}

export interface TrackEvent {
  name: EventName
  properties?: Record<string, string | number | boolean | undefined>
}

export type EventName =
  | "product_view"
  | "gallery_click"
  | "affiliate_click"
  | "variant_change"
  | "scroll_depth"
  | "cta_click"
  | "search"
  | "outbound_link"
  | "page_view"

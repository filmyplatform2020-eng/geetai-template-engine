export interface ResourceHint {
  rel: "preload" | "prefetch" | "preconnect" | "dns-prefetch"
  href: string
  as?: "image" | "script" | "style" | "font" | "document"
  crossOrigin?: "anonymous" | "use-credentials"
}

export interface PerformanceConfig {
  preconnectOrigins: string[]
  prefetchRoutes: string[]
  priorityImages: string[]
  criticalStyles: string[]
}

export function generateResourceHints(images: string[]): ResourceHint[] {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    { rel: "preconnect", href: "https://www.googletagmanager.com" },
    { rel: "dns-prefetch", href: "https://www.googletagmanager.com" },
    ...images.slice(0, 2).map((src) => ({
      rel: "preload" as const,
      href: src,
      as: "image" as const,
    })),
  ]
}

export function getCriticalPath(slug: string): string[] {
  return [`/review/${slug}`, `/guide/${slug}`, "/"]
}

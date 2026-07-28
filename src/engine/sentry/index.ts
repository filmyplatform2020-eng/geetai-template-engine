export interface SentryConfig {
  dsn: string
  environment: string
  tracesSampleRate: number
  enabled: boolean
}

export const sentryConfig: SentryConfig = {
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN ?? "",
  environment: process.env.NODE_ENV ?? "development",
  tracesSampleRate: 0.1,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
}

export function captureError(error: Error, context?: Record<string, unknown>): void {
  if (!sentryConfig.enabled) return
  if (typeof window === "undefined") return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Sentry = (window as any).Sentry
  if (!Sentry) return
  Sentry.captureException(error, { extra: context })
}

export function capture404(url: string): void {
  captureError(new Error(`404: ${url}`), { url, type: "404" })
}

export function captureBrokenImage(src: string): void {
  captureError(new Error(`Broken image: ${src}`), { src, type: "broken_image" })
}

export function captureAffiliateFailure(store: string, url: string): void {
  captureError(new Error(`Affiliate link failed: ${store}`), { store, url, type: "affiliate" })
}

export function captureHydrationMismatch(component: string): void {
  captureError(new Error(`Hydration mismatch in ${component}`), { component, type: "hydration" })
}

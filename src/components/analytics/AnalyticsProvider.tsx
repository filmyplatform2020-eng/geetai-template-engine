"use client"

import { useEffect, useRef, type ReactNode } from "react"
import type { AnalyticsConfig } from "@/engine/analytics/config"
import { injectScripts } from "@/engine/analytics/scripts"

export const analyticsConfig: AnalyticsConfig = {
  // GA4:   { measurementId: process.env.NEXT_PUBLIC_GA4_ID ?? "" },
  // GTM:   { containerId: process.env.NEXT_PUBLIC_GTM_ID ?? "" },
  // Clarity: { projectId: process.env.NEXT_PUBLIC_CLARITY_ID ?? "" },
  // Meta:  { pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "" },
  // Pinterest: { tagId: process.env.NEXT_PUBLIC_PINTEREST_TAG_ID ?? "" },
}

interface AnalyticsProviderProps {
  config?: AnalyticsConfig
  children: ReactNode
}

export const AnalyticsContext = typeof window !== "undefined"
  ? { current: analyticsConfig }
  : { current: analyticsConfig }

export default function AnalyticsProvider({ config, children }: AnalyticsProviderProps) {
  const cfg = config ?? analyticsConfig
  const injected = useRef(false)

  useEffect(() => {
    if (injected.current) return
    injected.current = true

    const srcs = injectScripts(cfg)
    srcs.forEach((s) => {
      if (s.startsWith("http")) {
        const el = document.createElement("script")
        el.src = s
        el.async = true
        document.head.appendChild(el)
      } else {
        const el = document.createElement("script")
        el.textContent = s
        document.head.appendChild(el)
      }
    })
  }, [cfg])

  return <>{children}</>
}

"use client"

import { useEffect, useRef } from "react"
import { analyticsConfig } from "./AnalyticsProvider"
import { trackScrollDepth } from "@/engine/analytics/provider"

const THRESHOLDS = [25, 50, 75, 90, 100]

export default function TrackScroll() {
  const fired = useRef(new Set<number>())

  useEffect(() => {
    function handle() {
      const scrollPct = Math.round(
        (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
      )
      THRESHOLDS.forEach((t) => {
        if (scrollPct >= t && !fired.current.has(t)) {
          fired.current.add(t)
          trackScrollDepth(analyticsConfig, t)
        }
      })
    }
    window.addEventListener("scroll", handle, { passive: true })
    return () => window.removeEventListener("scroll", handle)
  }, [])

  return null
}

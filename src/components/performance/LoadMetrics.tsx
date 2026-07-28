"use client"

import { useEffect } from "react"

export default function LoadMetrics() {
  useEffect(() => {
    if (typeof window === "undefined") return

    const metrics: Record<string, number> = {}

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === "largest-contentful-paint") {
          metrics.lcp = entry.startTime
        }
        if (entry.entryType === "first-input") {
          const fi = entry as PerformanceEventTiming
          metrics.fid = fi.processingStart - fi.startTime
        }
      })
    })

    try {
      observer.observe({ type: "largest-contentful-paint", buffered: true })
      observer.observe({ type: "first-input", buffered: true })
    } catch {}

    new Promise((r) => {
      if (document.readyState === "complete") r(true)
      else window.addEventListener("load", () => r(true))
    }).then(() => {
      setTimeout(() => {
        const cls = performance.getEntriesByType("layout-shift")
          .reduce((acc: number, entry: PerformanceEntry) => acc + ((entry as unknown as Record<string, number>).value || 0), 0)
        metrics.cls = cls
      }, 3000)
    })
  }, [])

  return null
}

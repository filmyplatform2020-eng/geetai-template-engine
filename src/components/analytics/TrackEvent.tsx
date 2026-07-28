"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { analyticsConfig } from "./AnalyticsProvider"
import { trackEvent } from "@/engine/analytics/provider"
import type { EventName } from "@/engine/analytics/config"

interface TrackEventProps {
  event: EventName
  properties?: Record<string, string | number | boolean | undefined>
  once?: boolean
  children?: ReactNode
}

export default function TrackEvent({ event, properties, once, children }: TrackEventProps) {
  const tracked = useRef(false)

  useEffect(() => {
    if (once && tracked.current) return
    tracked.current = true
    trackEvent(analyticsConfig, { name: event, properties })
  }, [event, properties, once])

  return <>{children}</>
}

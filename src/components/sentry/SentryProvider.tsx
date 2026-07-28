"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { sentryConfig } from "@/engine/sentry"

interface SentryProviderProps {
  children: ReactNode
}

export default function SentryProvider({ children }: SentryProviderProps) {
  const injected = useRef(false)

  useEffect(() => {
    if (!sentryConfig.dsn || injected.current) return
    injected.current = true

    const script = document.createElement("script")
    script.src = `https://js.sentry-cdn.com/${sentryConfig.dsn.replace(/^https:\/\//, "").replace(/\/\d+$/, "")}.min.js`
    script.crossOrigin = "anonymous"
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Sentry = (window as any).Sentry
      if (!Sentry) return
      Sentry.init({
        dsn: sentryConfig.dsn,
        environment: sentryConfig.environment,
        tracesSampleRate: sentryConfig.tracesSampleRate,
      })
    }
    document.head.appendChild(script)
  }, [])

  return <>{children}</>
}

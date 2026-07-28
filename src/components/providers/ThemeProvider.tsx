"use client"

import { useEffect, type ReactNode } from "react"
import { theme } from "@/engine/theme"

export default function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement
    const { colors, glass, typography, animation, layout, radius } = theme

    Object.entries(colors).forEach(([key, val]) => {
      root.style.setProperty(`--theme-${key}`, val)
    })

    Object.entries(glass).forEach(([key, val]) => {
      root.style.setProperty(`--glass-${key}`, val)
    })

    Object.entries(typography).forEach(([key, val]) => {
      root.style.setProperty(`--font-${key}`, val)
    })

    Object.entries(animation).forEach(([key, val]) => {
      root.style.setProperty(
        `--anim-${key}`,
        typeof val === "number" ? String(val) : val
      )
    })

    Object.entries(layout).forEach(([key, val]) => {
      root.style.setProperty(`--layout-${key}`, val)
    })

    root.style.setProperty("--radius", radius)
  }, [])

  return <>{children}</>
}

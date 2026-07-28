"use client"

import { useEffect, useState } from "react"

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  )

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")

    function handle(e: MediaQueryListEvent) {
      setReduced(e.matches)
    }

    mq.addEventListener("change", handle)
    return () => mq.removeEventListener("change", handle)
  }, [])

  return reduced
}

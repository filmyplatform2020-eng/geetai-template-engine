"use client"

import { useRef, useState, useEffect, type ReactNode } from "react"

interface LazySectionProps {
  children: ReactNode
  threshold?: number
  rootMargin?: string
  placeholder?: ReactNode
}

export default function LazySection({
  children,
  threshold = 0,
  rootMargin = "200px",
  placeholder,
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return (
    <div ref={ref} className="min-h-[1px]">
      {visible ? children : placeholder ?? null}
    </div>
  )
}

"use client"

import { useEffect, useState, useCallback } from "react"

export default function MouseGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)

  const handleMouse = useCallback((e: MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY })
    if (!visible) setVisible(true)
  }, [visible])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouse)
    return () => window.removeEventListener("mousemove", handleMouse)
  }, [handleMouse])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-1000"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div
        className="absolute h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: pos.x,
          top: pos.y,
          background:
            "radial-gradient(circle at center, rgba(108,92,231,0.08) 0%, rgba(108,92,231,0.04) 25%, transparent 60%)",
        }}
      />
      <div
        className="absolute h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          left: pos.x,
          top: pos.y,
          background:
            "radial-gradient(circle at center, rgba(162,155,254,0.06) 0%, transparent 50%)",
        }}
      />
    </div>
  )
}

"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export default function FloatingMacbook() {
  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(mouseY, { stiffness: 60, damping: 20 })
  const rotateY = useSpring(mouseX, { stiffness: 60, damping: 20 })

  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })

  useEffect(() => {
    function handleMouse(e: MouseEvent) {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = (e.clientX - centerX) / rect.width
      const deltaY = (e.clientY - centerY) / rect.height

      mouseX.set(deltaX * 10)
      mouseY.set(deltaY * -10)

      const gx = ((e.clientX - rect.left) / rect.width) * 100
      const gy = ((e.clientY - rect.top) / rect.height) * 100
      setGlowPos({ x: gx, y: gy })
    }

    window.addEventListener("mousemove", handleMouse)
    return () => window.removeEventListener("mousemove", handleMouse)
  }, [mouseX, mouseY])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative mx-auto w-full max-w-[520px]"
      style={{
        perspective: 1200,
      }}
    >
      <motion.div
        className="animate-float relative"
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="relative mx-auto aspect-[1.55] w-full">
          <div
            className="absolute inset-0 overflow-hidden rounded-[10px] border border-default"
            style={{
              background:
                "linear-gradient(135deg, rgba(15,15,25,0.95) 0%, rgba(20,18,35,0.98) 100%)",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(108,92,231,0.06)",
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(108,92,231,0.12) 0%, transparent 60%)`,
              }}
            />

            <div className="flex h-full flex-col p-4 sm:p-6">
              <div className="mb-auto flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500/60" />
                <div className="h-2 w-2 rounded-full bg-yellow-500/60" />
                <div className="h-2 w-2 rounded-full bg-green-500/60" />
              </div>

              <div className="mb-2 flex items-center justify-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe]" />
                <span className="text-sm font-semibold tracking-tight text-primary">
                  GeetAI
                </span>
              </div>

              <div className="space-y-2">
                <div className="h-2 w-3/4 rounded-full bg-white/[0.06]" />
                <div className="h-2 w-1/2 rounded-full bg-white/[0.04]" />
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-default bg-surface p-2"
                  >
                    <div className="mx-auto mb-1 h-4 w-4 rounded bg-gradient-to-br from-[#6c5ce7]/40 to-[#a29bfe]/40" />
                    <div className="h-1.5 w-2/3 rounded-full bg-white/[0.04] mx-auto" />
                  </div>
                ))}
              </div>
            </div>

            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 40%, rgba(108,92,231,0.03) 100%)",
              }}
            />
          </div>

          <div
            className="absolute -bottom-[8%] left-[2%] right-[2%] h-[12%] overflow-hidden rounded-b-[12px] border border-default border-t-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(20,18,35,0.95) 0%, rgba(15,15,25,0.98) 100%)",
            }}
          >
            <div className="mx-auto h-full w-[55%] border-x border-default" />
          </div>
        </div>

        <div className="mx-auto mt-[-2%] h-[3px] w-[55%] rounded-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />

        <div
          className="mx-auto mt-2 h-[1px] w-[80%] animate-pulse-soft rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(108,92,231,0.15), transparent)",
          }}
        />
      </motion.div>
    </motion.div>
  )
}

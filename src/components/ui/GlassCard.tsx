"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  gradient?: boolean
}

export default function GlassCard({
  children,
  className,
  gradient = false,
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/[0.06]",
        "bg-gradient-to-b from-white/[0.04] to-white/[0.02]",
        "backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
        gradient && "before:absolute before:inset-0 before:-translate-x-full",
        gradient &&
          "before:bg-gradient-to-r before:from-transparent before:via-white/[0.04] before:to-transparent",
        gradient && "before:animate-[shimmer_3s_infinite]",
        className
      )}
    >
      {children}
    </motion.div>
  )
}

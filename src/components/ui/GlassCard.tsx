"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  gradient?: boolean
  intensity?: "sm" | "md" | "lg"
  hover?: boolean
  shimmer?: boolean
}

export default function GlassCard({
  children,
  className,
  gradient = false,
  intensity = "md",
  hover = true,
  shimmer = false,
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const glassClass = {
    sm: "glass-sm",
    md: "glass",
    lg: "glass-lg",
  }[intensity]

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "relative overflow-hidden rounded-2xl transition-all duration-500",
        glassClass,
        gradient && "glass-gradient",
        hover && "glass-hover",
        shimmer && "glass-shimmer",
        className
      )}
    >
      {children}
    </motion.div>
  )
}

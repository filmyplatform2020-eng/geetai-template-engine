"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassSectionProps {
  children: React.ReactNode
  className?: string
  intensity?: "sm" | "md" | "lg"
  gradient?: boolean
  shimmer?: boolean
  id?: string
}

export default function GlassSection({
  children,
  className,
  intensity = "md",
  gradient = false,
  shimmer = false,
  id,
}: GlassSectionProps) {
  const glassClass = {
    sm: "glass-sm",
    md: "glass",
    lg: "glass-lg",
  }[intensity]

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn(
        "relative overflow-hidden rounded-3xl",
        glassClass,
        gradient && "glass-gradient",
        shimmer && "glass-shimmer",
        className
      )}
    >
      {children}
    </motion.section>
  )
}

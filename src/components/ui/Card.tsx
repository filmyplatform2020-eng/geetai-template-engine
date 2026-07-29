"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glass?: boolean
  gradient?: boolean
  elevated?: boolean
  intensity?: "sm" | "md" | "lg"
  shimmer?: boolean
  onClick?: () => void
}

export default function Card({
  children,
  className,
  hover = true,
  glass = true,
  gradient = false,
  elevated = false,
  intensity = "md",
  shimmer = false,
  onClick,
}: CardProps) {
  const glassClass = {
    sm: "glass-sm",
    md: "glass",
    lg: "glass-lg",
  }[intensity]

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl transition-all duration-500",
        glass && glassClass,
        glass && gradient && "glass-gradient",
        elevated && !glass && "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
        glass && hover && "glass-hover",
        shimmer && "glass-shimmer",
        onClick && "cursor-pointer",
        className
      )}
      whileHover={hover ? { y: -6, scale: 1.01, transition: { type: "spring", stiffness: 200, damping: 15 } } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

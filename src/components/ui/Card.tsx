"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glass?: boolean
  gradient?: boolean
  onClick?: () => void
}

export default function Card({
  children,
  className,
  hover = true,
  glass = true,
  gradient = false,
  onClick,
}: CardProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        glass &&
          "border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-white/[0.02] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
        gradient &&
          "before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/[0.04] before:to-transparent before:animate-[shimmer_3s_infinite]",
        hover && "transition-all duration-500",
        onClick && "cursor-pointer",
        className
      )}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

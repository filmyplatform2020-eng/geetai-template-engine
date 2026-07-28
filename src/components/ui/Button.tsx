"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline"
type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps {
  children: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  icon?: React.ReactNode
  href?: string
  onClick?: () => void
  disabled?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-[#6c5ce7] to-[#a29bfe] text-white shadow-lg shadow-[#6c5ce7]/25 hover:shadow-xl hover:shadow-[#6c5ce7]/30",
  secondary:
    "border border-white/[0.08] bg-white/[0.03] text-white/60 backdrop-blur-sm hover:border-white/[0.15] hover:text-white/80",
  ghost: "text-white/40 hover:text-white/70 hover:bg-white/[0.04]",
  outline:
    "border border-white/[0.12] text-white/70 hover:bg-white/[0.04] hover:border-white/[0.2]",
}

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-sm gap-2",
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  icon,
  href,
  onClick,
  disabled,
}: ButtonProps) {
  const cls = cn(
    "relative inline-flex items-center justify-center rounded-full font-medium transition-all duration-300",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c5ce7]/50",
    disabled && "pointer-events-none opacity-50",
    variants[variant],
    sizes[size],
    className
  )

  if (href) {
    return (
      <motion.a
        href={href}
        className={cls}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      className={cls}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </motion.button>
  )
}

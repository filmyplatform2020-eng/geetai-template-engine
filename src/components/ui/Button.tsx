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
  external?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--button-primary-bg,var(--color-accent))] text-[var(--button-primary-text,white)] shadow-lg hover:shadow-xl hover:brightness-110",
  secondary:
    "glass border-[var(--border-default,rgba(0,0,0,0.06))] text-[var(--text-secondary,#1a1a1e99)] hover:text-[var(--text-primary,#1a1a1e)] hover:bg-[var(--button-secondary-hover,rgba(255,255,255,0.7))]",
  ghost: "text-[var(--text-muted,#1a1a1e66)] hover:text-[var(--text-secondary,#1a1a1e99)] hover:bg-[var(--state-hover,rgba(0,0,0,0.04))]",
  outline:
    "border-[var(--border-default,rgba(0,0,0,0.1))] text-[var(--text-secondary,#1a1a1e99)] hover:bg-[var(--state-hover,rgba(0,0,0,0.04))] hover:border-[var(--border-hover,rgba(0,0,0,0.2))]",
}

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-xs gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-7 text-sm gap-2.5",
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
  external,
}: ButtonProps) {
  const cls = cn(
    "relative inline-flex items-center justify-center font-medium transition-all duration-300",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
    disabled && "pointer-events-none opacity-50",
    variants[variant],
    sizes[size],
    className
  )

  const styleOverride = { borderRadius: "var(--style-button-radius, 9999px)" } as React.CSSProperties

  if (href) {
    return (
      <motion.a
        href={href}
        className={cls}
        style={styleOverride}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      className={cls}
      style={styleOverride}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </motion.button>
  )
}

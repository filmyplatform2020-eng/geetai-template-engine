import { cn } from "@/lib/utils"

type BadgeVariant = "default" | "primary" | "success" | "warning" | "error" | "outline" | "premium"

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
  size?: "sm" | "md"
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-[var(--state-hover,transparent)] text-[var(--text-muted,#1a1a1e80)] border-[var(--border-default,rgba(0,0,0,0.06))]",
  primary: "bg-[var(--color-accent)]/15 text-[var(--color-accent)] border border-[var(--color-accent)]/20",
  success: "bg-[var(--badge-success-bg,#065f4620)] text-[var(--badge-success-text,#065f46)] border-[var(--badge-success-border,#065f4630)]",
  warning: "bg-[var(--badge-warning-bg,#92400e20)] text-[var(--badge-warning-text,#92400e)] border-[var(--badge-warning-border,#92400e30)]",
  error: "bg-[var(--badge-danger-bg,#991b1b20)] text-[var(--badge-danger-text,#991b1b)] border-[var(--badge-danger-border,#991b1b30)]",
  outline: "border-[var(--border-default,rgba(0,0,0,0.1))] text-[var(--text-muted,#1a1a1e80)]",
  premium: "glass-sm text-[var(--text-secondary,#1a1a1e99)] border-[var(--border-default,rgba(0,0,0,0.04))]",
}

const sizes: Record<string, string> = {
  sm: "px-2.5 py-0.5 text-[10px]",
  md: "px-3.5 py-1 text-xs",
}

export default function Badge({
  children,
  variant = "default",
  className,
  size = "sm",
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium tracking-wide",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}

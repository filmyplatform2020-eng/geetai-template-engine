import { cn } from "@/lib/utils"

type BadgeVariant = "default" | "primary" | "success" | "warning" | "error" | "outline"

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
  size?: "sm" | "md"
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-white/[0.06] text-white/60 border border-white/[0.06]",
  primary: "bg-[#6c5ce7]/20 text-[#a29bfe] border border-[#6c5ce7]/20",
  success: "bg-green-500/20 text-green-400 border border-green-500/20",
  warning: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20",
  error: "bg-red-500/20 text-red-400 border border-red-500/20",
  outline: "border border-white/[0.12] text-white/50",
}

const sizes: Record<string, string> = {
  sm: "px-2.5 py-0.5 text-[10px]",
  md: "px-3 py-1 text-xs",
}

export default function Badge({ children, variant = "default", className, size = "sm" }: BadgeProps) {
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

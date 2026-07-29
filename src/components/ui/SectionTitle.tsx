import AnimatedSection from "@/components/animations/AnimatedSection"
import { cn } from "@/lib/utils"

interface SectionTitleProps {
  title: string
  subtitle?: string
  align?: "left" | "center"
  className?: string
  as?: "h1" | "h2" | "h3"
  badge?: string
}

export default function SectionTitle({
  title,
  subtitle,
  align = "center",
  className,
  as: Tag = "h2",
  badge,
}: SectionTitleProps) {
  return (
    <AnimatedSection
      type="fadeInUp"
      className={cn(
        "mb-14 max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {badge && (
        <span className="mb-4 inline-flex items-center rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 px-3 py-1 text-xs font-medium tracking-wide" style={{ color: "var(--color-accent-light)" }}>
          {badge}
        </span>
      )}
      <Tag
        className={cn(
          "text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl leading-[1.1]",
          align === "center" && "text-balance"
        )}
      >
        {title}
      </Tag>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed text-secondary sm:text-lg",
            align === "center" && "text-balance"
          )}
        >
          {subtitle}
        </p>
      )}
    </AnimatedSection>
  )
}

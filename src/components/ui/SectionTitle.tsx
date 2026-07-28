import AnimatedSection from "@/components/animations/AnimatedSection"
import { cn } from "@/lib/utils"

interface SectionTitleProps {
  title: string
  subtitle?: string
  align?: "left" | "center"
  className?: string
  as?: "h1" | "h2" | "h3"
}

export default function SectionTitle({
  title,
  subtitle,
  align = "center",
  className,
  as: Tag = "h2",
}: SectionTitleProps) {
  return (
    <AnimatedSection
      type="fadeInUp"
      className={cn(
        "mb-12 max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <Tag
        className={cn(
          "text-3xl font-bold tracking-tight text-white/90 sm:text-4xl lg:text-5xl",
          align === "center" && "text-balance"
        )}
      >
        {title}
      </Tag>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed text-white/40",
            align === "center" && "text-balance"
          )}
        >
          {subtitle}
        </p>
      )}
    </AnimatedSection>
  )
}

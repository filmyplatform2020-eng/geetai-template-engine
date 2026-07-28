import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingProps {
  value: number
  count?: number
  size?: "sm" | "md" | "lg"
  showCount?: boolean
  className?: string
}

const sizes = { sm: "h-3 w-3", md: "h-4 w-4", lg: "h-5 w-5" }
const textSizes = { sm: "text-xs", md: "text-sm", lg: "text-base" }

export default function Rating({
  value,
  count,
  size = "md",
  showCount = true,
  className,
}: RatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1)

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5">
        {stars.map((star) => {
          const fill = Math.min(Math.max(value - (star - 1), 0), 1)
          return (
            <span key={star} className="relative">
              <Star className={cn(sizes[size], "text-white/[0.08]")} />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star
                  className={cn(sizes[size], "fill-[#fbbf24] text-[#fbbf24]")}
                />
              </span>
            </span>
          )
        })}
      </div>
      <span className={cn("font-medium text-white/50", textSizes[size])}>
        {value.toFixed(1)}
      </span>
      {showCount && count !== undefined && (
        <span className={cn("text-white/30", textSizes[size])}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  )
}

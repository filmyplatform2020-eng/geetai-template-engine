import Image from "next/image"
import { cn } from "@/lib/utils"
import { getPlaceholderBlur } from "@/engine/image"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  containerClassName?: string
}

export default function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 600,
  className,
  priority = false,
  fill = false,
  sizes = "(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw",
  containerClassName,
}: OptimizedImageProps) {
  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={fill ? sizes : undefined}
        className={cn(
          "object-cover transition-all duration-700",
          "data-[loaded=false]:scale-110 data-[loaded=false]:blur-xl",
          className
        )}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        placeholder="blur"
        blurDataURL={getPlaceholderBlur(width, height)}
        quality={85}
      />
    </div>
  )
}

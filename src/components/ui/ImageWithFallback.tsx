"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { getPlaceholderBlur } from "@/engine/image"

interface ImageWithFallbackProps {
  src: string
  alt: string
  productName: string
  brand?: string
  width?: number
  height?: number
  className?: string
  containerClassName?: string
  fill?: boolean
  sizes?: string
  priority?: boolean
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}

const gradientPairs = [
  ["#1a1a2e", "#16213e"],
  ["#0f0c29", "#302b63"],
  ["#1e1b4b", "#312e81"],
  ["#0d0d1a", "#1a1a3e"],
  ["#111827", "#1f2937"],
  ["#0a0a1a", "#1a1a2e"],
  ["#1c1917", "#292524"],
  ["#020617", "#0f172a"],
]

export default function ImageWithFallback({
  src,
  alt,
  productName,
  brand,
  width = 800,
  height = 600,
  className,
  containerClassName,
  fill = false,
  sizes = "(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw",
  priority = false,
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  if (!src || hasError) {
    const initials = getInitials(productName)
    const gradientIndex =
      productName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % gradientPairs.length
    const [from, to] = gradientPairs[gradientIndex]

    return (
      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center overflow-hidden",
          containerClassName,
          className
        )}
      >
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
        />

        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`grid-${gradientIndex}`} width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#grid-${gradientIndex})`} />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.06] ring-1 ring-white/[0.08] backdrop-blur-sm">
            <svg className="h-6 w-6 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-muted">{initials}</span>
          {brand && <span className="-mt-2 text-[10px] font-medium tracking-wider text-muted uppercase">{brand}</span>}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/[0.02]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 animate-pulse rounded-2xl bg-white/[0.05] ring-1 ring-white/[0.08]" />
            <span className="text-xs text-muted">{alt || productName}</span>
          </div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={fill ? sizes : undefined}
        className={cn(
          "object-cover transition-all duration-700",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        placeholder="blur"
        blurDataURL={getPlaceholderBlur(width, height)}
        quality={85}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  )
}

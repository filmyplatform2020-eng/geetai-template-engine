"use client"

import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Badge from "./Badge"
import Button from "./Button"

interface PriceCardProps {
  name: string
  price: string
  originalPrice?: string
  description: string
  features: { text: string; included: boolean }[]
  cta: string
  href: string
  featured?: boolean
  badge?: string
  className?: string
}

export default function PriceCard({
  name,
  price,
  originalPrice,
  description,
  features,
  cta,
  href,
  featured,
  badge,
  className,
}: PriceCardProps) {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-6 sm:p-8",
        featured
          ? "border-[#6c5ce7]/30 bg-gradient-to-b from-[#6c5ce7]/[0.08] to-white/[0.02] shadow-xl shadow-[#6c5ce7]/10"
          : "border-default bg-gradient-to-b from-white/[0.04] to-white/[0.02] backdrop-blur-xl",
        className
      )}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {(badge || featured) && (
        <div className="mb-4">
          <Badge variant={featured ? "primary" : "default"} size="md">
            {badge || "Most Popular"}
          </Badge>
        </div>
      )}

      <h3 className="text-lg font-semibold text-primary">{name}</h3>
      <p className="mt-1 text-sm text-secondary">{description}</p>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl font-bold tracking-tight text-primary">
          {price}
        </span>
        {originalPrice && (
          <span className="text-lg text-muted line-through">
            {originalPrice}
          </span>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {features.map((f) => (
          <div key={f.text} className="flex items-start gap-3">
            {f.included ? (
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
            ) : (
              <X className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
            )}
            <span
              className={cn(
                "text-sm",
                f.included ? "text-secondary" : "text-muted"
              )}
            >
              {f.text}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Button
          variant={featured ? "primary" : "secondary"}
          className="w-full"
          href={href}
        >
          {cta}
        </Button>
      </div>
    </motion.div>
  )
}

"use client"

import { useMemo } from "react"
import { formatPriceLocalized } from "@/engine/i18n/pricing"

interface CurrencyDisplayProps {
  priceUSD: number
  region?: string
  showTax?: boolean
  className?: string
}

export default function CurrencyDisplay({ priceUSD, region = "us", showTax = false, className = "" }: CurrencyDisplayProps) {
  const display = useMemo(
    () => formatPriceLocalized(priceUSD, region, showTax),
    [priceUSD, region, showTax]
  )

  return (
    <span className={className}>
      {display.formatted}
      {showTax && display.tax > 0 && (
        <span className="ml-1 text-xs text-muted">
          {display.tax > 0 ? `+${display.tax} tax` : ""}
        </span>
      )}
    </span>
  )
}

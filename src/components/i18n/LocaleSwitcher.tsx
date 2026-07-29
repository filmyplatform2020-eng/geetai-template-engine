"use client"

import { useState } from "react"
import { Globe } from "lucide-react"
import { regions, localeLabels } from "@/engine/i18n"
import { cn } from "@/lib/utils"

interface LocaleSwitcherProps {
  current?: string
  onChange?: (region: string) => void
  className?: string
}

export default function LocaleSwitcher({ current = "us", onChange, className }: LocaleSwitcherProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-default px-3 py-1.5 text-xs text-secondary transition-colors hover:border-strong hover:text-primary"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="uppercase">{current}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-xl border border-default bg-background p-1 shadow-2xl">
            {Object.entries(regions).map(([code, region]) => (
              <button
                key={code}
                onClick={() => {
                  onChange?.(code)
                  setOpen(false)
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors",
                  code === current
                    ? "bg-surface text-primary"
                    : "text-secondary hover:bg-surface hover:text-primary"
                )}
              >
                <span>{localeLabels[region.locale] ?? region.country}</span>
                <span className="text-muted">{region.currencySymbol}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

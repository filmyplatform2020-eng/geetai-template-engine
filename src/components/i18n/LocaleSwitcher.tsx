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
        className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/50 transition-colors hover:border-white/20 hover:text-white/70"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="uppercase">{current}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-xl border border-white/10 bg-[#0a0a12] p-1 shadow-2xl">
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
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:bg-white/5 hover:text-white/70"
                )}
              >
                <span>{localeLabels[region.locale] ?? region.country}</span>
                <span className="text-white/20">{region.currencySymbol}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

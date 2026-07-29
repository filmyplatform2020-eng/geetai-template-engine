"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { VariantGroup } from "@/engine/variant"

interface VariantPickerProps {
  groups: VariantGroup[]
  activeVariant: string
  onSelect: (groupId: string, variantId: string) => void
}

const typeLabels: Record<string, string> = {
  color: "Color",
  storage: "Storage",
  ram: "Memory",
  bundle: "Bundle",
}

export default function VariantPicker({
  groups,
  activeVariant,
  onSelect,
}: VariantPickerProps) {
  if (!groups.length) return null

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.type}>
          <div className="mb-3 flex items-center gap-3">
            <span className="text-[11px] font-semibold tracking-[0.15em] text-muted uppercase">
              {group.label || typeLabels[group.type] || group.type}
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-border-default to-transparent" />
          </div>
          <div className="flex flex-wrap gap-2">
            {group.variants.map((v) => {
              const isActive = activeVariant === v.id
              const isColor = group.type === "color"

              return (
                <button
                  key={v.id}
                  onClick={() => onSelect(group.type, v.id)}
                  className={cn(
                    "group relative flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm transition-all duration-300",
                    isActive
                      ? "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-primary shadow-sm shadow-[var(--color-accent)]/5"
                      : "border-default bg-white/[0.02] text-secondary hover:border-white/[0.16] hover:text-secondary"
                  )}
                >
                  {isColor && v.color && (
                    <span
                      className="relative inline-block h-5 w-5 rounded-full ring-1 ring-white/[0.08] ring-offset-1 ring-offset-[#06060e]"
                      style={{ backgroundColor: v.color }}
                    >
                      {/* Color dot active ring */}
                      {isActive && (
                        <motion.span
                          layoutId={`color-ring-${group.type}`}
                          className="absolute inset-[-3px] rounded-full border-2 border-[var(--color-accent)]/40"
                        />
                      )}
                    </span>
                  )}
                  <span>{v.label}</span>
                  {v.price != null && v.price > 0 && (
                    <span className="text-[10px] text-muted">
                      +${v.price}
                    </span>
                  )}
                  {isActive && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <Check className="h-3.5 w-3.5" style={{ color: "var(--color-accent-light)" }} />
                    </motion.span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

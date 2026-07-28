"use client"

import { Check } from "lucide-react"
import type { VariantGroup } from "@/engine/variant"

interface VariantPickerProps {
  groups: VariantGroup[]
  activeVariant: string
  onSelect: (groupId: string, variantId: string) => void
}

export default function VariantPicker({ groups, activeVariant, onSelect }: VariantPickerProps) {
  if (!groups.length) return null

  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <div key={group.type}>
          <p className="mb-3 text-xs font-medium text-white/40 uppercase tracking-wider">
            {group.label}
          </p>
          <div className="flex flex-wrap gap-2">
            {group.variants.map((v) => {
              const isActive = activeVariant === v.id
              const isColor = group.type === "color"

              return (
                <button
                  key={v.id}
                  onClick={() => onSelect(group.type, v.id)}
                  className={`relative flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-all ${
                    isActive
                      ? "border-white/30 bg-white/10 text-white"
                      : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/60"
                  }`}
                >
                  {isColor && v.color && (
                    <span
                      className="h-5 w-5 rounded-full border border-white/10"
                      style={{ backgroundColor: v.color }}
                    />
                  )}
                  <span>{v.label}</span>
                  {v.price && (
                    <span className="text-xs text-white/30">
                      +${v.price}
                    </span>
                  )}
                  {isActive && (
                    <Check className="h-3.5 w-3.5 text-green-400" />
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

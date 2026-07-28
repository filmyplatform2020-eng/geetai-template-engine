"use client"

import { useState } from "react"
import { themes } from "@/engine/theme/themes"
import type { ThemeName } from "@/engine/theme/types"
import { ACTIVE_THEME } from "@/engine/theme/config"

export default function ThemesPage() {
  const [active, setActive] = useState<ThemeName>(ACTIVE_THEME)
  const themeList = Object.entries(themes)

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold text-white/90">Themes</h1>
      <p className="mb-6 text-sm text-white/50">
        Active theme: <span className="font-medium text-white/80">{active}</span>
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {themeList.map(([id, theme]) => {
          const isActive = id === active
          return (
            <button
              key={id}
              onClick={() => setActive(id as ThemeName)}
              className={`rounded-xl border p-5 text-left transition-all ${
                isActive
                  ? "border-white/30 bg-white/10"
                  : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-white/80">{theme.name}</p>
                {isActive && <span className="text-[10px] text-emerald-400">ACTIVE</span>}
              </div>
              <div className="mt-3 flex gap-2">
                <div className="h-6 w-6 rounded-full" style={{ background: theme.colors.primary }} />
                <div className="h-6 w-6 rounded-full" style={{ background: theme.colors.secondary }} />
                <div className="h-6 w-6 rounded-full" style={{ background: theme.colors.accent }} />
              </div>
              <p className="mt-2 text-xs text-white/40">{theme.name} theme</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

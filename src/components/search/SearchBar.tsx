"use client"

import { Search } from "lucide-react"
import { useSearch } from "./SearchProvider"

export default function SearchBar() {
  const { open } = useSearch()

  return (
    <button
      onClick={open}
      aria-label="Open search"
      className="glass-sm flex items-center gap-2.5 px-4 py-2 text-sm transition-all hover:opacity-80"
      style={{ color: "var(--text-secondary, #2a2a5a)" }}
    >
      <Search className="h-4 w-4" />
      <span className="hidden sm:inline">Search...</span>
      <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded px-1.5 text-[10px]"
        style={{
          border: "1px solid var(--border-default, rgba(0,0,0,0.06))",
          background: "var(--surface, rgba(255,255,255,0.35))",
          color: "var(--text-muted, rgba(10,10,26,0.25))",
        }}>
        ⌘K
      </kbd>
    </button>
  )
}

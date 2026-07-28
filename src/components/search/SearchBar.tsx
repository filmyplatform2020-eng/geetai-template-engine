"use client"

import { Search } from "lucide-react"
import { useSearch } from "./SearchProvider"

export default function SearchBar() {
  const { open } = useSearch()

  return (
    <button
      onClick={open}
      className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/30 transition-all hover:border-white/20 hover:text-white/50"
    >
      <Search className="h-4 w-4" />
      <span className="hidden sm:inline">Search...</span>
      <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1.5 text-[10px] text-white/20">
        ⌘K
      </kbd>
    </button>
  )
}

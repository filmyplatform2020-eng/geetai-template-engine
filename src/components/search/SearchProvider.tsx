"use client"

import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from "react"
import type { Product } from "@/engine/product/types"
import { searchProducts, type SearchResult } from "@/engine/search"

interface SearchContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
  query: string
  setQuery: (q: string) => void
  results: SearchResult[]
  activeIndex: number
  setActiveIndex: (i: number) => void
  filters: { category?: string; minPrice?: number; maxPrice?: number; minRating?: number }
  setFilters: (f: Record<string, string | number | undefined>) => void
  search: (q: string) => void
}

const SearchContext = createContext<SearchContextValue | null>(null)

export function useSearch() {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error("useSearch must be inside SearchProvider")
  return ctx
}

export function SearchProvider({
  children,
  products,
}: {
  children: ReactNode
  products: Product[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const [filters, setFilters] = useState<Record<string, string | number | undefined>>({})

  const results = useMemo(() => searchProducts(products, query, filters), [products, query, filters])

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => {
    setIsOpen(false)
    setQuery("")
    setActiveIndex(0)
  }, [])

  const search = useCallback((q: string) => {
    setQuery(q)
    setActiveIndex(0)
  }, [])

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handle)
    return () => window.removeEventListener("keydown", handle)
  }, [])

  return (
    <SearchContext.Provider
      value={{ isOpen, open, close, query, setQuery, results, activeIndex, setActiveIndex, filters, setFilters, search }}
    >
      {children}
    </SearchContext.Provider>
  )
}

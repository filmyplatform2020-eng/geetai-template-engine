"use client"

import { useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, X, Star, Tag } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSearch } from "./SearchProvider"

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

function useFocusTrap(containerRef: React.RefObject<HTMLDivElement | null>, isActive: boolean) {
  const previousFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isActive) return
    previousFocus.current = document.activeElement as HTMLElement
    const el = containerRef.current
    if (!el) return
    const input = el.querySelector("input")
    if (input) input.focus()
    return () => {
      previousFocus.current?.focus()
    }
  }, [isActive, containerRef])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key !== "Tab") return
    const el = containerRef.current
    if (!el) return
    const focusable = el.querySelectorAll(FOCUSABLE)
    if (focusable.length === 0) return
    const first = focusable[0] as HTMLElement
    const last = focusable[focusable.length - 1] as HTMLElement
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }, [containerRef])

  useEffect(() => {
    if (!isActive) return
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isActive, handleKeyDown])
}

export default function SearchModal() {
  const { isOpen, close, query, setQuery, results, activeIndex, setActiveIndex } = useSearch()
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  useFocusTrap(containerRef, isOpen)

  useEffect(() => {
    if (!isOpen) return
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setActiveIndex(Math.min(activeIndex + 1, results.length - 1))
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setActiveIndex(Math.max(activeIndex - 1, 0))
      }
      if (e.key === "Enter" && results[activeIndex]) {
        router.push(`/review/${results[activeIndex].product.slug}`)
        close()
      }
    }
    window.addEventListener("keydown", handle)
    return () => window.removeEventListener("keydown", handle)
  }, [isOpen, results, activeIndex, setActiveIndex, close, router])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} aria-hidden="true" />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            className="relative w-full max-w-2xl"
          >
            <div className="rounded-2xl border border-default bg-background shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 border-b border-default px-5 py-4">
                <Search className="h-5 w-5" style={{ color: "var(--text-muted)" }} />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, brands, categories..."
                  aria-label="Search query"
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: "var(--text-primary)" }}
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs"
                  style={{
                    color: "var(--text-muted)",
                    borderColor: "var(--border-default)",
                    background: "var(--surface)",
                  }}>
                  ESC
                </kbd>
                <button onClick={close} aria-label="Close search">
                  <X className="h-4 w-4 transition-colors" style={{ color: "var(--text-muted)" }} />
                </button>
              </div>
              {query && (
                <div className="max-h-[50vh] overflow-y-auto" role="listbox" aria-label="Search results">
                  {results.length === 0 && (
                    <p className="px-5 py-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                      No results found
                    </p>
                  )}
                  {results.map((r, i) => (
                    <button
                      key={r.product.slug}
                      role="option"
                      aria-selected={i === activeIndex}
                      onClick={() => {
                        router.push(`/review/${r.product.slug}`)
                        close()
                      }}
                      className={`w-full flex items-center gap-4 px-5 py-3 text-left transition-colors`}
                      style={{
                        background: i === activeIndex ? "var(--color-accent-soft, rgba(200,210,250,0.314))" : "transparent",
                      }}
                    >
                      <div className="h-12 w-12 rounded-lg flex items-center justify-center text-xs overflow-hidden shrink-0"
                        style={{ background: "var(--surface)" }}>
                        {r.product.images[0]?.src ? (
                          <img src={r.product.images[0].src} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Tag className="h-5 w-5" style={{ color: "var(--text-muted)" }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate" style={{ color: "var(--text-primary)" }}>{r.product.product}</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {r.product.brand} &middot; {r.product.category}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
                        <Star className="h-3 w-3" style={{ fill: "var(--color-accent)", color: "var(--color-accent)" }} />
                        {r.product.rating}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
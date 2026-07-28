"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, X, Star, Tag } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSearch } from "./SearchProvider"

export default function SearchModal() {
  const { isOpen, close, query, setQuery, results, activeIndex, setActiveIndex } = useSearch()
  const router = useRouter()

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4"
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            className="relative w-full max-w-2xl"
          >
            <div className="rounded-2xl border border-white/10 bg-[#0a0a12] shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                <Search className="h-5 w-5 text-white/30" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, brands, categories..."
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/30">
                  ESC
                </kbd>
                <button onClick={close}>
                  <X className="h-4 w-4 text-white/30 hover:text-white/60 transition-colors" />
                </button>
              </div>
              {query && (
                <div className="max-h-[50vh] overflow-y-auto">
                  {results.length === 0 && (
                    <p className="px-5 py-8 text-center text-sm text-white/30">
                      No results found
                    </p>
                  )}
                  {results.map((r, i) => (
                    <button
                      key={r.product.slug}
                      onClick={() => {
                        router.push(`/review/${r.product.slug}`)
                        close()
                      }}
                      className={`w-full flex items-center gap-4 px-5 py-3 text-left transition-colors hover:bg-white/5 ${
                        i === activeIndex ? "bg-white/5" : ""
                      }`}
                    >
                      <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center text-xs text-white/20 overflow-hidden shrink-0">
                        {r.product.images[0]?.src ? (
                          <img src={r.product.images[0].src} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Tag className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/80 truncate">{r.product.product}</p>
                        <p className="text-xs text-white/30">{r.product.brand} &middot; {r.product.category}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-white/40">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
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

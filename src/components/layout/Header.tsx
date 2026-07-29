"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import SearchBar from "@/components/search/SearchBar"

const nav = [
  { label: "Reviews", href: "/" },
  { label: "Guides", href: "/" },
  { label: "Compare", href: "/" },
  { label: "Categories", href: "/" },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function handle() {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handle)
    return () => window.removeEventListener("scroll", handle)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-white/70 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)]" />
          <span className="text-sm font-semibold tracking-tight text-[#1a1a1e]/80">
            GeetAI
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-[#1a1a1e]/40 transition-colors hover:text-[#1a1a1e]/70"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <SearchBar />
          <button
            onClick={() => setOpen(!open)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#1a1a1e]/40 hover:bg-black/[0.04] md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-black/[0.04] bg-white/90 backdrop-blur-xl md:hidden"
          >
            <nav className="space-y-1 px-4 py-4">
              {nav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm text-[#1a1a1e]/50 transition-colors hover:bg-black/[0.04] hover:text-[#1a1a1e]/80"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

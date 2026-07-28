"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { NavItem } from "@/admin/types"

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "⊞" },
  { label: "Products", href: "/admin/products", icon: "□" },
  { label: "Categories", href: "/admin/categories", icon: "⊟" },
  { label: "Brands", href: "/admin/brands", icon: "◎" },
  { label: "Templates", href: "/admin/templates", icon: "◇" },
  { label: "Themes", href: "/admin/themes", icon: "◐" },
  { label: "SEO", href: "/admin/seo", icon: "◎" },
  { label: "Affiliate", href: "/admin/affiliate", icon: "¤" },
  { label: "Analytics", href: "/admin/analytics", icon: "▤" },
  { label: "Settings", href: "/admin/settings", icon: "⚙" },
  { label: "Build Status", href: "/admin/build-status", icon: "◉" },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-full flex-col border-r border-white/10 bg-black/90 backdrop-blur-xl transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
        {!collapsed && <span className="text-sm font-semibold text-white/80">GeetAI CMS</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-xs text-white/40 hover:bg-white/10 hover:text-white/80"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                active ? "bg-white/10 text-white" : "text-white/50 hover:bg-white/5 hover:text-white/70"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <span className="flex h-5 w-5 items-center justify-center text-base">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="ml-auto rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-white/10 p-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/40 transition-colors hover:bg-white/5 hover:text-white/60"
        >
          ← Back to Site
        </Link>
      </div>
    </aside>
  )
}

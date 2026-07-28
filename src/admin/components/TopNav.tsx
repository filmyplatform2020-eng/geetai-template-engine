"use client"

import { useNotifications } from "@/admin/hooks/useNotifications"

interface TopNavProps {
  title: string
  notificationHook: ReturnType<typeof useNotifications>
}

export default function TopNav({ title, notificationHook }: TopNavProps) {
  const { notifications, dismiss } = notificationHook

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/10 bg-black/60 px-6 backdrop-blur-xl">
      <h1 className="text-lg font-semibold text-white/90">{title}</h1>
      <div className="flex items-center gap-3">
        {notifications.length > 0 && (
          <div className="absolute right-4 top-14 w-80 space-y-1 rounded-xl border border-white/10 bg-black/90 p-2 backdrop-blur-xl shadow-2xl">
            {notifications.slice(0, 5).map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-2 rounded-lg px-3 py-2 text-xs ${
                  n.type === "error"
                    ? "bg-red-500/10 text-red-400"
                    : n.type === "success"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : n.type === "warning"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-blue-500/10 text-blue-400"
                }`}
              >
                <span className="mt-0.5">{n.type === "error" ? "✕" : n.type === "success" ? "✓" : n.type === "warning" ? "!" : "i"}</span>
                <div className="flex-1">
                  <p className="font-medium">{n.title}</p>
                  <p className="text-white/50">{n.message}</p>
                </div>
                <button onClick={() => dismiss(n.id)} className="text-white/30 hover:text-white/60">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-medium text-white/60">
          A
        </div>
      </div>
    </header>
  )
}

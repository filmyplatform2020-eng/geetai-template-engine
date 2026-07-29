"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Login failed")
        return
      }
      await new Promise((r) => setTimeout(r, 300))
      router.push("/admin")
    } catch {
      setError("Connection error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#06060e]">
      <div className="w-full max-w-sm rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-accent,#6c5ce7)] to-[var(--color-accent-light,#a29bfe)] text-lg font-bold text-white">
            G
          </div>
          <h1 className="text-xl font-semibold text-white/90">GeetAI CMS</h1>
          <p className="mt-1 text-sm text-white/40">Sign in to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="mb-1.5 block text-xs font-medium text-white/50">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white/80 outline-none transition-colors focus:border-white/20 focus:bg-white/[0.05]"
              placeholder="admin"
              required
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-white/50">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white/80 outline-none transition-colors focus:border-white/20 focus:bg-white/[0.05]"
              placeholder="••••••••"
              required
            />
          </div>
          {error && (
            <div className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-[var(--color-accent,#6c5ce7)] to-[var(--color-accent-light,#a29bfe)] py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  )
}

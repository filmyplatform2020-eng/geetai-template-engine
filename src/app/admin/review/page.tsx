"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

interface WorkflowItem {
  slug: string
  status: string
  createdAt: number
  updatedAt: number
  reviewedBy?: string
  notes?: string
}

export default function ReviewQueuePage() {
  const router = useRouter()
  const [items, setItems] = useState<WorkflowItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const [previewData, setPreviewData] = useState<Record<string, unknown> | null>(null)
  const [publishing, setPublishing] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const fetchQueue = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/workflow?status=review")
      const data = await res.json()
      setItems(data.products || [])
    } catch {
      setItems([])
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchQueue() }, [fetchQueue])

  async function loadPreview(slug: string) {
    setSelectedSlug(slug)
    setPreviewData(null)
    try {
      const res = await fetch(`/api/workflow?slug=${slug}`)
      const data = await res.json()
      setPreviewData(data.product || data)
    } catch {
      setPreviewData(null)
    }
  }

  async function handleApprove(slug: string) {
    setPublishing(slug)
    setMessage(null)
    try {
      const res = await fetch("/api/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", slug }),
      })
      const data = await res.json()
      if (data.success) {
        setMessage({ type: "success", text: `"${slug}" published successfully` })
        fetchQueue()
        setSelectedSlug(null)
      } else {
        setMessage({ type: "error", text: data.error || "Publish failed" })
      }
    } catch (e) {
      setMessage({ type: "error", text: "Network error during publish" })
    }
    setPublishing(null)
  }

  async function handleReject(slug: string) {
    const notes = prompt("Reason for rejection (optional):")
    try {
      await fetch("/api/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", slug, notes }),
      })
      fetchQueue()
      setSelectedSlug(null)
    } catch {}
  }

  const needsReview = items.filter((i) => i.status === "review")
  const otherItems = items.filter((i) => i.status !== "review")

  return (
    <div className="p-6">
      <h1 className="mb-2 text-2xl font-semibold text-white/90">Review Queue</h1>
      <p className="mb-6 text-sm text-white/40">Review and approve products before they go live.</p>

      {message && (
        <div
          className={`mb-4 rounded-lg px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {selectedSlug && previewData && (
        <div className="mb-6 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white/80">Preview: {selectedSlug}</h2>
            <button
              onClick={() => setSelectedSlug(null)}
              className="text-xs text-white/40 hover:text-white/70"
            >
              Close
            </button>
          </div>
          <pre className="max-h-96 overflow-auto rounded bg-black/40 p-3 text-xs text-white/50">
            {JSON.stringify(previewData, null, 2)}
          </pre>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => handleApprove(selectedSlug)}
              disabled={publishing === selectedSlug}
              className="rounded-lg bg-emerald-500/20 px-4 py-2 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/30 disabled:opacity-50"
            >
              {publishing === selectedSlug ? "Publishing..." : "Approve & Publish"}
            </button>
            <button
              onClick={() => handleReject(selectedSlug)}
              className="rounded-lg bg-red-500/10 px-4 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20"
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {/* Needs Review */}
      <div className="mb-8">
        <h2 className="mb-3 text-sm font-semibold text-white/60">
          Pending Review <span className="text-white/30">({needsReview.length})</span>
        </h2>
        {loading ? (
          <div className="text-sm text-white/30">Loading...</div>
        ) : needsReview.length === 0 ? (
          <div className="rounded-lg border border-white/[0.04] bg-white/[0.01] px-4 py-8 text-center text-sm text-white/30">
            No products pending review.
          </div>
        ) : (
          <div className="space-y-2">
            {needsReview.map((item) => (
              <div
                key={item.slug}
                className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3"
              >
                <div>
                  <span className="text-sm text-white/80">{item.slug}</span>
                  <span className="ml-3 rounded bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-400">
                    {item.status}
                  </span>
                  <span className="ml-2 text-[10px] text-white/20">
                    Created {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadPreview(item.slug)}
                    className="rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs text-white/50 transition-colors hover:bg-white/[0.08]"
                  >
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Other Items */}
      {otherItems.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold text-white/60">
            All Products <span className="text-white/30">({otherItems.length})</span>
          </h2>
          <div className="space-y-1">
            {otherItems.map((item) => (
              <div key={item.slug} className="flex items-center justify-between rounded px-4 py-2">
                <div>
                  <span className="text-sm text-white/60">{item.slug}</span>
                  <span
                    className={`ml-3 rounded px-2 py-0.5 text-[10px] ${
                      item.status === "published"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : item.status === "archived"
                          ? "bg-white/5 text-white/30"
                          : "bg-white/5 text-white/40"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 border-t border-white/[0.04] pt-4">
        <p className="text-xs text-white/20">
          Publishing creates a backup, validates completeness, and registers the product.
        </p>
      </div>
    </div>
  )
}

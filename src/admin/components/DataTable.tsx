"use client"

import { useState, useMemo } from "react"
import type { TableColumn, PaginationState } from "@/admin/types"

interface DataTableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  keyExtractor: (item: T) => string
  pageSize?: number
  searchable?: boolean
  searchKeys?: (keyof T)[]
  onRowClick?: (item: T) => void
  loading?: boolean
}

export default function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  keyExtractor,
  pageSize = 10,
  searchable = false,
  searchKeys,
  onRowClick,
  loading,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, pageSize, total: data.length })

  const filtered = useMemo(() => {
    if (!search || !searchKeys) return data
    const q = search.toLowerCase()
    return data.filter((item) =>
      searchKeys.some((key) => {
        const val = item[key]
        return val != null && String(val).toLowerCase().includes(q)
      })
    )
  }, [data, search, searchKeys])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (aVal == null) return 1
      if (bVal == null) return -1
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pagination.pageSize))
  const safePage = Math.min(pagination.page, totalPages)
  const start = (safePage - 1) * pagination.pageSize
  const paged = sorted.slice(start, start + pagination.pageSize)

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-white/10">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
      </div>
    )
  }

  return (
    <div>
      {searchable && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPagination((p) => ({ ...p, page: 1 }))
            }}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 outline-none placeholder:text-white/30 focus:border-white/20"
          />
        </div>
      )}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`px-4 py-3 font-medium text-white/50 ${col.sortable ? "cursor-pointer hover:text-white/70" : ""}`}
                  onClick={() => col.sortable && handleSort(String(col.key))}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {sortKey === String(col.key) && <span className="text-xs">{sortDir === "asc" ? "↑" : "↓"}</span>}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-white/30">
                  No data found
                </td>
              </tr>
            ) : (
              paged.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  onClick={() => onRowClick?.(item)}
                  className={`border-b border-white/5 transition-colors ${
                    onRowClick ? "cursor-pointer hover:bg-white/5" : ""
                  }`}
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3 text-white/70">
                      {col.render ? col.render(item) : String(item[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-xs text-white/50">
          <span>
            {sorted.length} total — page {safePage} of {totalPages}
          </span>
          <div className="flex gap-1">
            <button
              disabled={safePage <= 1}
              onClick={() => setPagination((p) => ({ ...p, page: safePage - 1 }))}
              className="rounded-md border border-white/10 px-3 py-1 disabled:opacity-30"
            >
              ←
            </button>
            <button
              disabled={safePage >= totalPages}
              onClick={() => setPagination((p) => ({ ...p, page: safePage + 1 }))}
              className="rounded-md border border-white/10 px-3 py-1 disabled:opacity-30"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

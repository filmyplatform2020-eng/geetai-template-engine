"use client"

import { useState, useCallback } from "react"
import type { Notification } from "@/admin/types"

let idCounter = 0

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const add = useCallback((type: Notification["type"], title: string, message: string) => {
    const id = String(++idCounter)
    const notification: Notification = { id, type, title, message, timestamp: Date.now(), read: false }
    setNotifications((prev) => [notification, ...prev].slice(0, 50))
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 5000)
    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const clear = useCallback(() => setNotifications([]), [])

  return { notifications, add, dismiss, markRead, clear }
}

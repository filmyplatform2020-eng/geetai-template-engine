import type { ReactNode } from "react"
import Sidebar from "@/admin/components/Sidebar"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <div className="ml-60 flex-1">{children}</div>
    </div>
  )
}

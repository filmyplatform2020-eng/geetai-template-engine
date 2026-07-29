import type { ReactNode } from "react"
import { getSessionFromCookie } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import Sidebar from "@/admin/components/Sidebar"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSessionFromCookie()
  if (!session) redirect("/login")

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar user={{ name: session.name, role: session.role, username: session.userId }} />
      <div className="ml-60 flex-1">{children}</div>
    </div>
  )
}

import { deleteSession } from "@/lib/auth/config"
import { getSessionFromCookie, destroySessionCookie } from "@/lib/auth/session"

export async function POST() {
  try {
    const session = await getSessionFromCookie()
    if (session) {
      const store = await import("@/lib/auth/config")
      const sessions = store.getSessions()
      for (const [token, s] of Object.entries(sessions)) {
        if (s.userId === session.userId) {
          deleteSession(token)
        }
      }
    }
    await destroySessionCookie()
    return Response.json({ ok: true })
  } catch {
    await destroySessionCookie()
    return Response.json({ ok: true })
  }
}

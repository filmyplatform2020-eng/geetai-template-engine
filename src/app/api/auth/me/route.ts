import { getSessionFromCookie } from "@/lib/auth/session"

export async function GET() {
  const session = await getSessionFromCookie()
  if (!session) {
    return Response.json({ authenticated: false }, { status: 401 })
  }
  return Response.json({
    authenticated: true,
    user: { username: session.userId, role: session.role, name: session.name },
  })
}

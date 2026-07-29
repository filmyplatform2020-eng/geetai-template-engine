import { cookies } from "next/headers"
import { getSession, type Session } from "./config"

const SESSION_COOKIE = "geetai_session"

export async function getSessionFromCookie(): Promise<Session | null> {
  try {
    const store = await cookies()
    const token = store.get(SESSION_COOKIE)?.value
    if (!token) return null
    return getSession(token) ?? null
  } catch {
    return null
  }
}

export async function createSessionCookie(token: string): Promise<void> {
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  })
}

export async function destroySessionCookie(): Promise<void> {
  try {
    const store = await cookies()
    store.delete(SESSION_COOKIE)
  } catch {
    // ignore
  }
}

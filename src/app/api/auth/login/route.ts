import { randomUUID } from "crypto"
import { getUser, verifyPassword, saveSession, cleanExpiredSessions } from "@/lib/auth/config"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 })
    }

    const user = getUser(username)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    if (!verifyPassword(password, user.password, user.salt)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    cleanExpiredSessions()
    const token = randomUUID()
    saveSession(token, {
      userId: username,
      role: user.role,
      name: user.name,
      createdAt: Date.now(),
    })

    const response = NextResponse.json({ user: { username, role: user.role, name: user.name } })
    response.cookies.set("geetai_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    })

    return response
  } catch (e) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}

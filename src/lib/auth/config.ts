import { randomBytes, pbkdf2Sync } from "crypto"
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs"
import { join } from "path"

const USERS_PATH = join(process.cwd(), "src", "data", "auth", "users.json")
const SESSIONS_PATH = join(process.cwd(), "src", "data", "auth", "sessions.json")

export type Role = "admin" | "editor" | "reviewer"

export interface User {
  password: string
  salt: string
  role: Role
  name: string
}

export interface Session {
  userId: string
  role: Role
  name: string
  createdAt: number
}

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString("hex")
  const hash = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex")
  return { hash, salt }
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const derived = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex")
  return derived === hash
}

export function getUsers(): Record<string, User> {
  try {
    return JSON.parse(readFileSync(USERS_PATH, "utf-8"))
  } catch {
    return {}
  }
}

export function getUser(username: string): User | undefined {
  return getUsers()[username]
}

export function saveSession(token: string, session: Session): void {
  const dir = join(process.cwd(), "src", "data", "auth")
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  const sessions = getSessions()
  sessions[token] = session
  writeFileSync(SESSIONS_PATH, JSON.stringify(sessions, null, 2))
}

export function getSessions(): Record<string, Session> {
  try {
    return JSON.parse(readFileSync(SESSIONS_PATH, "utf-8"))
  } catch {
    return {}
  }
}

export function getSession(token: string): Session | undefined {
  return getSessions()[token]
}

export function deleteSession(token: string): void {
  const sessions = getSessions()
  delete sessions[token]
  writeFileSync(SESSIONS_PATH, JSON.stringify(sessions, null, 2))
}

export function cleanExpiredSessions(): void {
  const sessions = getSessions()
  const now = Date.now()
  const maxAge = 24 * 60 * 60 * 1000
  for (const [token, session] of Object.entries(sessions)) {
    if (now - session.createdAt > maxAge) delete sessions[token]
  }
  writeFileSync(SESSIONS_PATH, JSON.stringify(sessions, null, 2))
}

export function roleAtLeast(userRole: Role, requiredRole: Role): boolean {
  const hierarchy: Record<Role, number> = { admin: 3, editor: 2, reviewer: 1 }
  return hierarchy[userRole] >= hierarchy[requiredRole]
}

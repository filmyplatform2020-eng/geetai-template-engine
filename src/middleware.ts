import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ADMIN_LOGIN = "/login"
const ADMIN_ROOT = "/admin"
const API_PREFIX = "/api"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const sessionCookie = request.cookies.get("geetai_session")?.value

  const isAdminRoute = pathname.startsWith(ADMIN_ROOT)
  const isLoginPage = pathname === ADMIN_LOGIN
  const isApiRoute = pathname.startsWith(API_PREFIX)

  // Allow login page and static assets
  if (isLoginPage || pathname.startsWith("/_next") || pathname.startsWith("/images") || pathname === "/favicon.ico") {
    return NextResponse.next()
  }

  // Protect admin routes
  if (isAdminRoute && !sessionCookie) {
    return NextResponse.redirect(new URL(ADMIN_LOGIN, request.url))
  }

  // Protect API write methods (except auth routes)
  if (isApiRoute && !pathname.startsWith("/api/auth/")) {
    const method = request.method
    if (["POST", "PUT", "DELETE", "PATCH"].includes(method) && !sessionCookie) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
}

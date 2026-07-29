const requestCounts = new Map<string, { count: number; resetAt: number }>()

const DEFAULT_LIMIT = 100
const DEFAULT_WINDOW = 60_000 // 1 minute

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

export function checkRateLimit(
  key: string,
  limit: number = DEFAULT_LIMIT,
  windowMs: number = DEFAULT_WINDOW
): RateLimitResult {
  const now = Date.now()
  const entry = requestCounts.get(key)

  if (!entry || now > entry.resetAt) {
    requestCounts.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs }
  }

  entry.count++
  if (entry.count > limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt }
}

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of requestCounts) {
    if (now > entry.resetAt) requestCounts.delete(key)
  }
}, 300_000)

export function rateLimitMiddleware(request: Request): Response | null {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
  const result = checkRateLimit(`api:${ip}`)

  if (!result.allowed) {
    return Response.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Remaining": "0",
        },
      }
    )
  }

  return null
}

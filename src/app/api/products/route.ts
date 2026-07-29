import { NextRequest } from "next/server"
import { getAllProducts, createProduct } from "@/cms/adapters"
import { getSessionFromCookie } from "@/lib/auth/session"
import { rateLimitMiddleware } from "@/lib/security/rate-limit"
import { validateProduct } from "@/engine/workflow/validate"

export async function GET() {
  const rateLimitResponse = rateLimitMiddleware(new Request("http://localhost"))
  if (rateLimitResponse) return rateLimitResponse

  const products = getAllProducts()
  return Response.json({ count: products.length, products })
}

export async function POST(req: NextRequest) {
  const rateLimitResponse = rateLimitMiddleware(req)
  if (rateLimitResponse) return rateLimitResponse

  const session = await getSessionFromCookie()
  if (!session) {
    return Response.json({ error: "Authentication required. POST requests require a valid session." }, { status: 401 })
  }

  const contentType = req.headers.get("content-type") || ""
  if (!contentType.includes("application/json")) {
    return Response.json({ error: "Content-Type must be application/json" }, { status: 415 })
  }

  const contentLength = parseInt(req.headers.get("content-length") || "0", 10)
  if (contentLength > 1_000_000) {
    return Response.json({ error: "Request body exceeds 1MB limit" }, { status: 413 })
  }

  try {
    const data = await req.json()
    if (!data || typeof data !== "object") {
      return Response.json({ error: "Request body must be a JSON object" }, { status: 400 })
    }

    if (!data.slug) {
      return Response.json({ error: "Product slug is required" }, { status: 400 })
    }

    if (typeof data.slug !== "string" || data.slug.length < 2) {
      return Response.json({ error: "Slug must be at least 2 characters" }, { status: 400 })
    }

    const validation = validateProduct(data)
    if (validation.errors.length > 0) {
      return Response.json({
        error: "Validation failed",
        details: validation.errors,
      }, { status: 422 })
    }

    const product = createProduct(data)
    return Response.json({ product }, { status: 201 })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create product"
    return Response.json({ error: message }, { status: 400 })
  }
}

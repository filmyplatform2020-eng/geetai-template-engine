import { NextRequest } from "next/server"
import { getProduct, updateProduct, deleteProduct } from "@/cms/adapters"
import { getSessionFromCookie } from "@/lib/auth/session"
import { rateLimitMiddleware } from "@/lib/security/rate-limit"
import { validateProduct } from "@/engine/workflow/validate"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const rateLimitResponse = rateLimitMiddleware(_req)
  if (rateLimitResponse) return rateLimitResponse

  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return Response.json({ error: "Product not found" }, { status: 404 })
  return Response.json({ product })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const rateLimitResponse = rateLimitMiddleware(req)
  if (rateLimitResponse) return rateLimitResponse

  const session = await getSessionFromCookie()
  if (!session) {
    return Response.json({ error: "Authentication required. PUT requests require a valid session." }, { status: 401 })
  }

  const contentType = req.headers.get("content-type") || ""
  if (!contentType.includes("application/json")) {
    return Response.json({ error: "Content-Type must be application/json" }, { status: 415 })
  }

  const contentLength = parseInt(req.headers.get("content-length") || "0", 10)
  if (contentLength > 1_000_000) {
    return Response.json({ error: "Request body exceeds 1MB limit" }, { status: 413 })
  }

  const { slug } = await params

  try {
    const data = await req.json()
    if (!data || typeof data !== "object") {
      return Response.json({ error: "Request body must be a JSON object" }, { status: 400 })
    }

    const validation = validateProduct({ ...getProduct(slug), ...data })
    if (validation.errors.length > 0) {
      return Response.json({
        error: "Validation failed",
        details: validation.errors,
      }, { status: 422 })
    }

    const product = updateProduct(slug, data)
    if (!product) return Response.json({ error: "Product not found" }, { status: 404 })
    return Response.json({ product })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update product"
    return Response.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const rateLimitResponse = rateLimitMiddleware(_req)
  if (rateLimitResponse) return rateLimitResponse

  const session = await getSessionFromCookie()
  if (!session) {
    return Response.json({ error: "Authentication required. DELETE requests require a valid session." }, { status: 401 })
  }

  const { slug } = await params
  const deleted = deleteProduct(slug)
  if (!deleted) return Response.json({ error: "Product not found" }, { status: 404 })
  return Response.json({ deleted: true })
}

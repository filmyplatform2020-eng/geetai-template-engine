import { NextRequest } from "next/server"
import { getAllProducts } from "@/cms/adapters"
import { getAllWorkflowProducts, getWorkflowProduct, createWorkflowProduct, updateWorkflowStatus, getProductsByStatus } from "@/engine/workflow/store"
import { publishProduct } from "@/engine/workflow/publish"
import { getSessionFromCookie } from "@/lib/auth/session"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const slug = searchParams.get("slug")

  if (slug) {
    const product = getWorkflowProduct(slug)
    if (!product) {
      return Response.json({ error: "Product not found in workflow" }, { status: 404 })
    }
    return Response.json({ product })
  }

  if (status) {
    const products = getProductsByStatus(status as any)
    return Response.json({ products })
  }

  return Response.json({ products: getAllWorkflowProducts() })
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromCookie()
  if (!session) {
    return Response.json({ error: "Authentication required" }, { status: 401 })
  }

  const body = await request.json()
  const { action, slug } = body

  if (!slug) {
    return Response.json({ error: "Slug is required" }, { status: 400 })
  }

  try {
    switch (action) {
      case "submit": {
        // AI pipeline or editor submits for review
        const existing = getWorkflowProduct(slug)
        if (!existing) {
          createWorkflowProduct(slug, "review")
        } else {
          updateWorkflowStatus(slug, "review")
        }
        return Response.json({ success: true, status: "review" })
      }

      case "approve": {
        const reviewer = session.userId
        const product = getAllProducts().find((p) => p.slug === slug)
        if (!product) {
          return Response.json({ error: "Product data not found" }, { status: 404 })
        }

        const workflow = getWorkflowProduct(slug)
        if (!workflow) {
          createWorkflowProduct(slug, "review")
        }

        updateWorkflowStatus(slug, "approved", reviewer)

        // Publish
        const result = await publishProduct(slug, product, reviewer)
        return Response.json(result)
      }

      case "reject": {
        updateWorkflowStatus(slug, "draft")
        return Response.json({ success: true, status: "draft" })
      }

      case "archive": {
        updateWorkflowStatus(slug, "archived")
        return Response.json({ success: true, status: "archived" })
      }

      default:
        return Response.json({ error: `Unknown action: ${action}` }, { status: 400 })
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Workflow operation failed"
    return Response.json({ error: message }, { status: 500 })
  }
}

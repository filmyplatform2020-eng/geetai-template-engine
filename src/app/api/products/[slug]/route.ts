import { NextRequest } from "next/server"
import { getProduct, updateProduct, deleteProduct } from "@/cms/adapters"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return Response.json({ error: "Not found" }, { status: 404 })
  return Response.json({ product })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const data = await req.json()
    const product = updateProduct(slug, data)
    if (!product) return Response.json({ error: "Not found" }, { status: 404 })
    return Response.json({ product })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update product"
    return Response.json({ error: message }, { status: 400 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const deleted = deleteProduct(slug)
  if (!deleted) return Response.json({ error: "Not found" }, { status: 404 })
  return Response.json({ deleted: true })
}

import { NextRequest } from "next/server"
import { getAllProducts, createProduct } from "@/cms/adapters"

export async function GET() {
  const products = getAllProducts()
  return Response.json({ count: products.length, products })
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const product = createProduct(data)
    return Response.json({ product }, { status: 201 })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create product"
    return Response.json({ error: message }, { status: 400 })
  }
}

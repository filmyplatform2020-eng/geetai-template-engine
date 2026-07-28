import { getProduct } from "@/cms/adapters"
import { notFound } from "next/navigation"
import EditProductClient from "./EditProductClient"

interface Props {
  params: Promise<{ slug: string }>
}

export default async function EditProductPage({ params }: Props) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()
  return <EditProductClient product={product} />
}

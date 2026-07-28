import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getProduct, getAllProducts } from "@/data/products"
import GuidePageClient from "./GuidePageClient"

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return {}
  return {
    title: `${product.product} Buying Guide | GeetAI Reviews`,
    description: `Comprehensive buying guide for the ${product.product}. Comparison, alternatives, accessories, and expert verdict.`,
  }
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()
  return <GuidePageClient product={product} />
}

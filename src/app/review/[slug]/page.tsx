import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getProduct, getAllProducts } from "@/data/products"
import { generateSEO } from "@/engine/seo"
import ReviewPageClient from "./ReviewPageClient"
import SchemaOrg from "@/components/seo/SchemaOrg"

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

  const seo = generateSEO(product)

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: seo.ogUrl,
      images: [{ url: seo.ogImage }],
    },
    twitter: {
      card: seo.twitterCard as "summary_large_image" | "summary",
      title: seo.twitterTitle,
      description: seo.twitterDescription,
      images: [seo.twitterImage],
    },
    robots: seo.robots,
    alternates: { canonical: seo.canonical },
  }
}

export default async function ReviewPage({ params }: Props) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  return (
    <>
      <SchemaOrg product={product} />
      <ReviewPageClient product={product} />
    </>
  )
}

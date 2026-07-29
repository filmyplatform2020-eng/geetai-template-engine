import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getProduct, getAllProducts } from "@/data/products"
import { generateSEO } from "@/engine/seo"
import ReviewPageClient from "./ReviewPageClient"
import SchemaOrg from "@/components/seo/SchemaOrg"
import { getWorkflowProduct } from "@/engine/workflow/store"

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

  // Workflow gate: only published products render
  const workflow = getWorkflowProduct(slug)
  if (workflow && workflow.status !== "published") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#06060e] px-4">
        <div className="text-center">
          <div className="mb-6 text-6xl font-bold text-white/10">Coming Soon</div>
          <h1 className="mb-3 text-2xl font-semibold text-white/80">{product.product}</h1>
          <p className="mb-2 text-sm text-white/40">
            This review is being prepared by our editorial team.
          </p>
          <p className="mb-8 text-xs text-white/20">Status: {workflow.status}</p>
          <a
            href="/"
            className="inline-block rounded-full bg-white/10 px-6 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/15"
          >
            Browse Reviews
          </a>
        </div>
      </div>
    )
  }

  const allProducts = getAllProducts()

  return (
    <>
      <SchemaOrg product={product} />
      <ReviewPageClient product={product} allProducts={allProducts} />
    </>
  )
}

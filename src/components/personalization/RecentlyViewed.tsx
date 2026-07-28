"use client"

import { useSyncExternalStore, useEffect } from "react"
import Link from "next/link"
import { Clock } from "lucide-react"
import type { Product } from "@/engine/product/types"
import { addToRecentlyViewed, getRecentlyViewed } from "@/engine/personalization"
import Container from "@/components/ui/Container"
import SectionTitle from "@/components/ui/SectionTitle"
import Card from "@/components/ui/Card"
import Rating from "@/components/ui/Rating"

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb)
  return () => window.removeEventListener("storage", cb)
}

interface RecentlyViewedProps {
  allProducts: Product[]
  currentSlug?: string
}

export default function RecentlyViewed({ allProducts, currentSlug }: RecentlyViewedProps) {
  const items = useSyncExternalStore(
    subscribe,
    () => getRecentlyViewed(allProducts),
    () => []
  )

  useEffect(() => {
    if (currentSlug) addToRecentlyViewed(currentSlug)
  }, [currentSlug])

  if (!items.length) return null

  return (
    <Container>
      <SectionTitle
        title="Recently Viewed"
        subtitle="Pick up where you left off."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p) => (
          <Link key={p.slug} href={`/review/${p.slug}`}>
            <Card className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/5">
                <Clock className="h-5 w-5 text-white/30" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white/80">{p.product}</p>
                <Rating value={p.rating} count={p.reviewCount} size="sm" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  )
}

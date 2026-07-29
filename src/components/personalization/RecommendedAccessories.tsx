import Link from "next/link"
import { Package } from "lucide-react"
import type { Accessory } from "@/engine/product/types"
import Container from "@/components/ui/Container"
import SectionTitle from "@/components/ui/SectionTitle"
import Card from "@/components/ui/Card"

interface RecommendedAccessoriesProps {
  accessories: Accessory[]
}

const PLACEHOLDER_IMAGES: Record<string, string> = {
  Charging: "🔌",
  Docks: "🔗",
  Audio: "🎧",
  Accessories: "🖥️",
}

export default function RecommendedAccessories({ accessories }: RecommendedAccessoriesProps) {
  if (!accessories.length) return null

  return (
    <Container>
      <SectionTitle title="Recommended Accessories" subtitle="Complete your setup." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {accessories.map((a, i) => (
          <Link key={i} href={`/review/${a.slug}`}>
            <Card className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface text-lg">
                {PLACEHOLDER_IMAGES[a.category] ?? <Package className="h-5 w-5 text-muted" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-primary">{a.name}</p>
                <p className="text-xs text-muted">{a.category} &middot; ${a.price}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  )
}

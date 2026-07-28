import { ExternalLink, Tag } from "lucide-react"
import type { Product } from "@/engine/product/types"
import { sortBuyLinks, formatPrice, getSavings } from "@/engine/affiliate"

interface BuyOptionsProps {
  product: Product
}

export default function BuyOptions({ product }: BuyOptionsProps) {
  const sortedLinks = sortBuyLinks(product.buyLinks)
  const savings = getSavings(product)

  return (
    <section className="py-8">
      <h2 className="text-xl font-semibold text-white mb-6">Buy {product.product}</h2>

      <div className="grid gap-4">
        {sortedLinks.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={`group relative flex items-center justify-between rounded-2xl border p-5 transition-all ${
              i === 0
                ? "border-white/20 bg-white/10 hover:bg-white/15"
                : "border-white/5 bg-white/[0.03] hover:bg-white/[0.06]"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-sm font-medium text-white/60">
                {link.store.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-white/80">{link.store}</p>
                <p className="text-xs text-white/30">{link.available ? "In Stock" : "Check availability"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {link.badge && (
                <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs text-green-400">
                  <Tag className="h-3 w-3" />
                  {link.badge}
                </span>
              )}
              <div className="text-right">
                <p className="text-lg font-semibold text-white">
                  {formatPrice(link.price, link.currency)}
                </p>
                {product.originalPrice && link.price < product.originalPrice && (
                  <p className="text-xs text-green-400">
                    Save {formatPrice(product.originalPrice - link.price, link.currency)}
                  </p>
                )}
              </div>
              <ExternalLink className="h-4 w-4 text-white/20 transition-colors group-hover:text-white/50" />
            </div>
          </a>
        ))}
      </div>

      {savings && (
        <p className="mt-4 text-center text-xs text-white/20">
          You save up to {savings}% compared to the original price
        </p>
      )}
    </section>
  )
}

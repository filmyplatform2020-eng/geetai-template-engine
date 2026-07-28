import type { Product } from "@/engine/product/types"

interface PreloadImagesProps {
  products: Product[]
}

export default function PreloadImages({ products }: PreloadImagesProps) {
  const priorityImages = products
    .flatMap((p) => p.images)
    .slice(0, 4)
    .map((img) => img.src)

  return (
    <>
      {priorityImages.map((src) => (
        <link key={src} rel="preload" as="image" href={src} />
      ))}
    </>
  )
}

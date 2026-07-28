"use client"

import Container from "@/components/ui/Container"
import SectionTitle from "@/components/ui/SectionTitle"
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer"
import type { ProductImage } from "@/engine/product/types"

interface ImageGalleryProps {
  title: string
  subtitle?: string
  images: ProductImage[]
}

export default function ImageGallery({ title, subtitle, images }: ImageGalleryProps) {
  if (!images.length) return null

  return (
    <Container>
      <SectionTitle title={title} subtitle={subtitle} />
      <StaggerContainer className="grid gap-3 sm:grid-cols-2">
        {images.map((img) => (
          <StaggerItem key={img.alt}>
            <div className="group relative aspect-video overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-2 h-12 w-12 rounded-xl bg-gradient-to-br from-[#6c5ce7]/30 to-[#a29bfe]/30" />
                  <p className="text-xs text-white/30">{img.alt}</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/[0.02] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Container>
  )
}

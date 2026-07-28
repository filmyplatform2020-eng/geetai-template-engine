"use client"

import { CheckCircle2 } from "lucide-react"
import Container from "@/components/ui/Container"
import SectionTitle from "@/components/ui/SectionTitle"
import Card from "@/components/ui/Card"
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer"
import type { ProductFeature } from "@/engine/product/types"

interface FeatureGridProps {
  title: string
  subtitle?: string
  features: ProductFeature[]
}

export default function FeatureGrid({ title, subtitle, features }: FeatureGridProps) {
  return (
    <Container>
      <SectionTitle title={title} subtitle={subtitle} />
      <StaggerContainer className="grid gap-px sm:grid-cols-2 lg:grid-cols-3 sm:gap-3">
        {features.map((f) => (
          <StaggerItem key={f.title}>
            <Card className="h-full p-5 sm:p-6">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] ring-1 ring-white/[0.06]">
                <CheckCircle2 className="h-4 w-4 text-[#a29bfe]" />
              </div>
              <h3 className="mb-1.5 text-sm font-semibold text-white/80">
                {f.title}
              </h3>
              <p className="text-xs leading-relaxed text-white/35">
                {f.description}
              </p>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Container>
  )
}

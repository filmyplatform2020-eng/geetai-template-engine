"use client"

import { ThumbsUp, ThumbsDown } from "lucide-react"
import Container from "@/components/ui/Container"
import SectionTitle from "@/components/ui/SectionTitle"
import Card from "@/components/ui/Card"
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer"

interface ProsConsProps {
  title: string
  subtitle?: string
  pros: string[]
  cons: string[]
}

export default function ProsCons({ title, subtitle, pros, cons }: ProsConsProps) {
  if (!pros.length && !cons.length) return null

  return (
    <Container>
      <SectionTitle title={title} subtitle={subtitle} />
      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 ring-1 ring-green-500/20">
              <ThumbsUp className="h-4 w-4 text-green-400" />
            </div>
            <h3 className="text-sm font-semibold text-white/80">Pros</h3>
          </div>
          <StaggerContainer className="space-y-3">
            {pros.map((pro) => (
              <StaggerItem key={pro} className="flex items-start gap-3">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400/50" />
                <span className="text-sm leading-relaxed text-white/60">{pro}</span>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 ring-1 ring-red-500/20">
              <ThumbsDown className="h-4 w-4 text-red-400" />
            </div>
            <h3 className="text-sm font-semibold text-white/80">Cons</h3>
          </div>
          <StaggerContainer className="space-y-3">
            {cons.map((con) => (
              <StaggerItem key={con} className="flex items-start gap-3">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400/50" />
                <span className="text-sm leading-relaxed text-white/60">{con}</span>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Card>
      </div>
    </Container>
  )
}

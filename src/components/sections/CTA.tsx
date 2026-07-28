"use client"

import { ArrowRight, Sparkles } from "lucide-react"
import Container from "@/components/ui/Container"
import AnimatedSection from "@/components/animations/AnimatedSection"
import Button from "@/components/ui/Button"

interface CTAProps {
  title: string
  description: string
  buttonText: string
  buttonHref: string
}

export default function CTA({ title, description, buttonText, buttonHref }: CTAProps) {
  return (
    <Container>
      <AnimatedSection type="scaleIn">
        <div className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-8 text-center sm:p-12">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-[#6c5ce7]/10 blur-[60px]" />
            <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-[#a29bfe]/10 blur-[60px]" />
          </div>

          <Sparkles className="mx-auto mb-4 h-8 w-8 text-[#a29bfe]/50" />
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-white/90 sm:text-3xl">
            {title}
          </h2>
          <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-white/40">
            {description}
          </p>
          <Button variant="primary" size="lg" icon={<ArrowRight className="h-4 w-4" />} href={buttonHref}>
            {buttonText}
          </Button>
        </div>
      </AnimatedSection>
    </Container>
  )
}

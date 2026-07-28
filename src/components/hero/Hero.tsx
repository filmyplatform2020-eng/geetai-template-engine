"use client"

import { useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import AuroraBackground from "./AuroraBackground"
import ParticleField from "./ParticleField"
import MouseGlow from "./MouseGlow"
import HeroHeading from "./HeroHeading"
import FloatingMacbook from "./FloatingMacbook"
import GlassFeatureCards from "./GlassFeatureCards"
import type { Product } from "@/engine/product/types"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface HeroProps {
  product?: Product
  variant?: "default" | "review"
  showCards?: boolean
}

export default function Hero({
  product,
  variant = "default",
  showCards = true,
}: HeroProps) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "#hero-section",
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          gsap.set("#hero-section", {
            opacity: 1 - self.progress * 0.5,
          })
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="hero-section"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
    >
      <AuroraBackground />
      <ParticleField />
      <MouseGlow />

      <div className="relative z-20 flex w-full flex-1 flex-col items-center justify-center px-4 pt-24 pb-12">
        <HeroHeading product={product} variant={variant} />

        <div className="mt-12 w-full max-w-4xl px-4">
          <FloatingMacbook />
        </div>

        {showCards && <GlassFeatureCards />}
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-40"
        style={{
          background: "linear-gradient(to top, #06060e 0%, transparent 100%)",
        }}
      />
    </section>
  )
}

"use client"

import { Zap, Shield, Palette } from "lucide-react"
import GlassCard from "@/components/ui/GlassCard"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for performance with sub-second page loads right out of the box.",
  },
  {
    icon: Shield,
    title: "Production Ready",
    description: "Battle-tested patterns with TypeScript, security, and best practices built in.",
  },
  {
    icon: Palette,
    title: "Beautiful by Default",
    description: "Premium design system with glassmorphism, animations, and responsive layouts.",
  },
]

export default function GlassFeatureCards() {
  return (
    <div className="relative z-20 mx-auto mt-16 grid w-full max-w-4xl gap-px sm:grid-cols-3 sm:gap-3">
      {features.map((feature) => (
        <GlassCard
          key={feature.title}
          gradient
          className="px-5 py-5 sm:px-6 sm:py-6"
        >
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] ring-1 ring-white/[0.06]">
            <feature.icon className="h-4 w-4 text-[#a29bfe]" />
          </div>
          <h3 className="mb-1.5 text-sm font-semibold text-white/80">
            {feature.title}
          </h3>
          <p className="text-xs leading-relaxed text-white/35">
            {feature.description}
          </p>
        </GlassCard>
      ))}
    </div>
  )
}

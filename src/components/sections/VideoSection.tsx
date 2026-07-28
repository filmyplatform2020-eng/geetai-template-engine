"use client"

import { Play } from "lucide-react"
import Container from "@/components/ui/Container"
import SectionTitle from "@/components/ui/SectionTitle"
import AnimatedSection from "@/components/animations/AnimatedSection"

interface VideoSectionProps {
  title: string
  subtitle?: string
  videoUrl?: string
}

export default function VideoSection({ title, subtitle, videoUrl }: VideoSectionProps) {
  if (!videoUrl) return null

  return (
    <Container>
      <SectionTitle title={title} subtitle={subtitle} />
      <AnimatedSection type="scaleIn">
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative mx-auto flex aspect-video max-w-4xl items-center justify-center overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-white/[0.01]"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-white/[0.1] backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#6c5ce7]/20 group-hover:ring-[#6c5ce7]/30">
            <Play className="ml-0.5 h-6 w-6 text-white/60 group-hover:text-[#a29bfe]" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </a>
      </AnimatedSection>
    </Container>
  )
}

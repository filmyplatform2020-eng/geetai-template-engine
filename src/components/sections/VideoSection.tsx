"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, X } from "lucide-react"
import { cn } from "@/lib/utils"
import SectionTitle from "@/components/ui/SectionTitle"
import AnimatedSection from "@/components/animations/AnimatedSection"

interface VideoSectionProps {
  title: string
  subtitle?: string
  videoUrl?: string
  productName: string
}

export default function VideoSection({
  title,
  subtitle,
  videoUrl,
  productName,
}: VideoSectionProps) {
  const [playing, setPlaying] = useState(false)

  if (!videoUrl) return null

  const embedUrl = videoUrl.includes("watch?v=")
    ? videoUrl.replace("watch?v=", "embed/")
    : videoUrl.includes("youtu.be/")
      ? videoUrl.replace("youtu.be/", "youtube.com/embed/")
      : videoUrl

  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title={title}
          subtitle={subtitle}
          badge="Video"
        />
        <AnimatedSection type="fadeInUp">
          {playing ? (
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-default bg-black shadow-2xl">
              <button
                onClick={() => setPlaying(false)}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-secondary backdrop-blur-sm transition-colors hover:bg-black/80 hover:text-primary"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="aspect-video">
                <iframe
                  src={`${embedUrl}?autoplay=1`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ) : (
            <button
              onClick={() => setPlaying(true)}
              className="group relative mx-auto block max-w-4xl overflow-hidden rounded-2xl border border-default bg-gradient-to-b from-white/[0.03] to-white/[0.01] shadow-2xl transition-shadow duration-500 hover:shadow-[var(--color-accent)]/5"
            >
              {/* Thumbnail placeholder */}
              <div className="aspect-video flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <motion.div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm transition-all duration-500 group-hover:bg-[var(--color-accent)]/20 group-hover:ring-[var(--color-accent)]/40 group-hover:scale-110"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Play className="ml-0.5 h-6 w-6 text-secondary transition-colors group-hover:text-[var(--color-accent-light)]" />
                  </motion.div>
                  <span className="text-xs text-muted">Watch {productName} in action</span>
                </div>
              </div>

              {/* Bottom gradient */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#06060e] to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-4 px-6 text-left">
                <span className="text-sm font-medium text-secondary">Watch review</span>
              </div>
            </button>
          )}
        </AnimatedSection>
      </div>
    </section>
  )
}

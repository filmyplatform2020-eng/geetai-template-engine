"use client"

import AnimatedSection from "./AnimatedSection"

interface SlideInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right"
}

export default function SlideIn({ children, className, delay, direction = "up" }: SlideInProps) {
  const dirMap = {
    up: "fadeInUp" as const,
    down: "fadeInDown" as const,
    left: "fadeInLeft" as const,
    right: "fadeInRight" as const,
  }

  return (
    <AnimatedSection type={dirMap[direction]} delay={delay} className={className}>
      {children}
    </AnimatedSection>
  )
}

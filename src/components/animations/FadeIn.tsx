"use client"

import AnimatedSection from "./AnimatedSection"

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export default function FadeIn({ children, className, delay }: FadeInProps) {
  return (
    <AnimatedSection type="fadeIn" delay={delay} className={className}>
      {children}
    </AnimatedSection>
  )
}

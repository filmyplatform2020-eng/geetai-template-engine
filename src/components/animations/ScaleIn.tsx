"use client"

import AnimatedSection from "./AnimatedSection"

interface ScaleInProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export default function ScaleIn({ children, className, delay }: ScaleInProps) {
  return (
    <AnimatedSection type="scaleIn" delay={delay} className={className}>
      {children}
    </AnimatedSection>
  )
}

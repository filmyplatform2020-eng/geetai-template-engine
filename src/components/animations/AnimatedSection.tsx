"use client"

import { motion, type Variants } from "framer-motion"
import { useReducedMotion } from "@/hooks/useReducedMotion"

type AnimationType =
  | "fadeIn"
  | "fadeInUp"
  | "fadeInDown"
  | "fadeInLeft"
  | "fadeInRight"
  | "scaleIn"
  | "slideInUp"
  | "none"

interface AnimatedSectionProps {
  children: React.ReactNode
  type?: AnimationType
  delay?: number
  duration?: number
  once?: boolean
  className?: string
}

const variants: Record<AnimationType, Variants> = {
  none: {
    hidden: { opacity: 1 },
    visible: { opacity: 1 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
  slideInUp: {
    hidden: { y: 60 },
    visible: { y: 0 },
  },
}

export default function AnimatedSection({
  children,
  type = "fadeInUp",
  delay = 0,
  duration = 0.6,
  once = true,
  className,
}: AnimatedSectionProps) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
      variants={variants[type]}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

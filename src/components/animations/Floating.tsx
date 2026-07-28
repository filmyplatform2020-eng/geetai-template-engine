"use client"

import { motion } from "framer-motion"

interface FloatingProps {
  children: React.ReactNode
  className?: string
  amplitude?: number
  duration?: number
  delay?: number
}

export default function Floating({
  children,
  className,
  amplitude = 16,
  duration = 6,
  delay = 0,
}: FloatingProps) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -amplitude, 0] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}

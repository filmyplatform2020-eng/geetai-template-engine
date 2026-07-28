"use client"

import { motion, useInView, type Variants } from "framer-motion"
import { useRef } from "react"
import { useReducedMotion } from "@/hooks/useReducedMotion"

interface RevealProps {
  children: React.ReactNode
  className?: string
  width?: "full" | "fit"
  delay?: number
}

const reveal: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
}

export default function Reveal({ children, className, width = "fit", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <div ref={ref} className={width === "full" ? "w-full" : "w-fit"}>
      <motion.div
        className={className}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={reveal}
        transition={{ delay }}
      >
        {children}
      </motion.div>
    </div>
  )
}

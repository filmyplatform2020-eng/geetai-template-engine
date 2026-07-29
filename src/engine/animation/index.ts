import type { Variants } from "framer-motion"

const ease = [0.16, 1, 0.3, 1] as const
const easeOut = [0, 0.55, 0.45, 1] as const

export const transitions = {
  spring: {
    type: "spring" as const,
    stiffness: 80,
    damping: 15,
  },
  springSnappy: {
    type: "spring" as const,
    stiffness: 150,
    damping: 18,
  },
  smooth: {
    duration: 0.7,
    ease,
  },
  fast: {
    duration: 0.35,
    ease,
  },
  slower: {
    duration: 1.2,
    ease,
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.7, ease } },
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92, filter: "blur(4px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.8, ease } },
}

export const slideInUp: Variants = {
  hidden: { y: 80 },
  visible: { y: 0, transition: { duration: 0.8, ease: easeOut } },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
  },
}

export const staggerItemFast: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: easeOut },
  },
}

export const cardHover = {
  rest: { scale: 1, y: 0, transition: { duration: 0.4, ease } },
  hover: { scale: 1.02, y: -6, transition: { type: "spring", stiffness: 200, damping: 15 } },
  tap: { scale: 0.98 },
}

export const cardHoverElevated = {
  rest: { scale: 1, y: 0, boxShadow: "0 4px 24px rgba(0,0,0,0.1)" },
  hover: { scale: 1.03, y: -8, boxShadow: "0 20px 60px rgba(108,92,231,0.15)", transition: { type: "spring", stiffness: 200, damping: 15 } },
  tap: { scale: 0.97 },
}

export const reveal: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)", transition: { duration: 0.6, ease } },
  visible: { clipPath: "inset(0 0% 0 0)", transition: { duration: 0.9, ease } },
}

export const floating: Variants = {
  animate: {
    y: [0, -14, 0],
    transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
  },
}

export const shimmerOverlay: Variants = {
  rest: { x: "-100%" },
  hover: { x: "100%", transition: { duration: 0.6, ease: "easeIn" } },
}

export const scaleCheck: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 12 } },
}

export const progressFill: Variants = {
  hidden: { scaleX: 0 },
  visible: (width: number) => ({
    scaleX: width,
    transition: { duration: 1.2, ease },
  }),
}

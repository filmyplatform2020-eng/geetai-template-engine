import type { Variants } from "framer-motion"
import { theme } from "@/engine/theme"

const ease = [0.25, 0.1, 0.25, 1] as const

export const transitions = {
  spring: {
    type: "spring" as const,
    stiffness: theme.animation["spring-stiffness"],
    damping: theme.animation["spring-damping"],
  },
  smooth: {
    duration: 0.6,
    ease,
  },
  fast: {
    duration: 0.3,
    ease,
  },
  slow: {
    duration: 1,
    ease,
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions.smooth,
  },
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.spring,
  },
}

export const slideInUp: Variants = {
  hidden: { y: 60 },
  visible: {
    y: 0,
    transition: transitions.smooth,
  },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
}

export const cardHover = {
  rest: {
    scale: 1,
    y: 0,
    transition: transitions.smooth,
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: transitions.spring,
  },
  tap: {
    scale: 0.98,
  },
}

export const buttonRipple: Variants = {
  rest: { scale: 0, opacity: 0 },
  hover: {
    scale: 2,
    opacity: 0.15,
    transition: { duration: 0.4, ease },
  },
}

export const reveal: Variants = {
  hidden: {
    clipPath: "inset(0 100% 0 0)",
    transition: { duration: 0.6, ease },
  },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 0.8, ease },
  },
}

export const floating: Variants = {
  animate: {
    y: [0, -16, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}

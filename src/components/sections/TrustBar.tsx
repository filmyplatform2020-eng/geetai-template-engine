"use client"

import { motion } from "framer-motion"
import Container from "@/components/ui/Container"

const logos = [
  "Apple", "Google", "Microsoft", "Amazon", "Meta", "Netflix", "Spotify", "Adobe",
]

export default function TrustBar() {
  return (
    <Container as="div" className="py-8 sm:py-10">
      <p className="mb-6 text-center text-xs font-medium tracking-widest uppercase text-white/30">
        Trusted by teams at
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {logos.map((name, i) => (
          <motion.span
            key={name}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
            className="text-sm font-semibold tracking-tight text-white/20 transition-colors hover:text-white/35"
          >
            {name}
          </motion.span>
        ))}
      </div>
    </Container>
  )
}

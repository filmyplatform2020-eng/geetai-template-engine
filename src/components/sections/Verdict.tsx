"use client"

import { motion } from "framer-motion"
import { Award, ThumbsUp, ThumbsDown } from "lucide-react"
import Container from "@/components/ui/Container"

interface VerdictProps {
  verdict: string
  pros: string[]
  cons: string[]
  productName: string
}

export default function Verdict({ verdict, pros, cons, productName }: VerdictProps) {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24">
      {/* Decorative background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, var(--color-accent), transparent)",
        }}
      />

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl"
        >
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 px-4 py-1.5 text-xs font-medium tracking-wide" style={{ color: "var(--color-accent-light)" }}>
              <Award className="h-3 w-3" />
              Final Verdict
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
              Is the {productName} Worth It?
            </h2>
            <p className="mt-3 text-base text-secondary">
              Our honest take after thorough analysis.
            </p>
          </div>

          {/* Verdict card */}
          <div
            className="relative mb-10 overflow-hidden rounded-2xl border p-6 sm:p-8 lg:p-10"
            style={{
              borderColor: "var(--color-accent)/0.15",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            {/* Gradient accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                background: "var(--color-accent-grad, linear-gradient(90deg, var(--color-accent), var(--color-accent-light)))",
              }}
            />

            <p className="text-base leading-relaxed text-primary sm:text-lg">
              {verdict}
            </p>

            {/* Score indicator */}
            <div className="mt-6 flex items-center gap-3 text-sm text-muted">
              <div className="flex items-center gap-1.5">
                <ThumbsUp className="h-3.5 w-3.5" style={{ color: "var(--color-accent)" }} />
                <span>Recommended</span>
              </div>
              <span className="text-muted">&middot;</span>
              <span>Expert reviewed</span>
            </div>
          </div>

          {/* Quick summary bars */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-default bg-white/[0.02] p-5">
              <div className="mb-3 flex items-center gap-2">
                <ThumbsUp className="h-4 w-4" style={{ color: "var(--color-accent)" }} />
                <span className="text-sm font-semibold text-primary">Pros</span>
              </div>
              <ul className="space-y-2">
                {pros.slice(0, 4).map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-secondary">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "var(--color-accent)" }} />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-default bg-white/[0.02] p-5">
              <div className="mb-3 flex items-center gap-2">
                <ThumbsDown className="h-4 w-4 text-secondary" />
                <span className="text-sm font-semibold text-primary">Cons</span>
              </div>
              <ul className="space-y-2">
                {cons.slice(0, 4).map((con, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-secondary">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/20" />
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

import { generateResourceHints } from "@/engine/performance"

interface ResourceHintsProps {
  images?: string[]
}

export default function ResourceHints({ images = [] }: ResourceHintsProps) {
  const hints = generateResourceHints(images)

  return (
    <>
      {hints.map((h, i) => (
        <link
          key={i}
          rel={h.rel}
          href={h.href}
          {...(h.as ? { as: h.as } : {})}
          {...(h.crossOrigin ? { crossOrigin: h.crossOrigin } : {})}
        />
      ))}
    </>
  )
}

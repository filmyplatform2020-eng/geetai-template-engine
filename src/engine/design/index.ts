export function glassClasses(className = "") {
  return [
    "glass",
    className,
  ]
    .filter(Boolean)
    .join(" ")
}

export function glassGradient(className = "") {
  return [
    "glass-gradient",
    className,
  ]
    .filter(Boolean)
    .join(" ")
}

export function gradientText(className = "") {
  return [
    "bg-clip-text text-transparent",
    "bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-light)]",
    className,
  ]
    .filter(Boolean)
    .join(" ")
}

export function sectionPadding(className = "") {
  return [`py-16 md:py-24 lg:py-32`, className].filter(Boolean).join(" ")
}

export const containerClass = "mx-auto w-full max-w-[1200px] px-4 sm:px-6"

export function cn(...inputs: (string | false | undefined | null)[]) {
  return inputs.filter(Boolean).join(" ")
}

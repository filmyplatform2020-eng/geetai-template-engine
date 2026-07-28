import { theme } from "@/engine/theme"

export function glassClasses(className = "") {
  return [
    "backdrop-blur-xl",
    `border border-[${theme.glass.border}]`,
    `bg-[${theme.glass.background}]`,
    `shadow-[${theme.glass.shadow}]`,
    className,
  ]
    .filter(Boolean)
    .join(" ")
}

export function gradientText(className = "") {
  return [
    "bg-clip-text text-transparent",
    `bg-[${theme.colors["gradient-primary"]}]`,
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

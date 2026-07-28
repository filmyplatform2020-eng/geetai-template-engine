export type ThemeName =
  | "apple"
  | "luxury-dark"
  | "minimal-white"
  | "gaming"
  | "tech"
  | "fashion"
  | "health"
  | "finance"

export interface ThemeColors {
  primary: string
  "primary-foreground": string
  secondary: string
  "secondary-foreground": string
  accent: string
  "accent-foreground": string
  background: string
  foreground: string
  muted: string
  "muted-foreground": string
  card: string
  "card-foreground": string
  border: string
  "border-light": string
  ring: string
  success: string
  warning: string
  error: string
  info: string
  "gradient-primary": string
  "gradient-accent": string
}

export interface ThemeTypography {
  "heading-font": string
  "body-font": string
  "mono-font": string
  "heading-weight": string
  "body-weight": string
  "base-size": string
  scale: string
}

export interface ThemeGlass {
  background: string
  border: string
  blur: string
  shadow: string
  "hover-background": string
}

export interface ThemeAnimation {
  "default-ease": string
  "spring-stiffness": number
  "spring-damping": number
  "duration-fast": string
  "duration-normal": string
  "duration-slow": string
}

export interface ThemeLayout {
  "max-width": string
  "content-padding": string
  "grid-gap": string
  "section-gap": string
}

export interface ThemeConfig {
  name: ThemeName
  label: string
  colors: ThemeColors
  typography: ThemeTypography
  glass: ThemeGlass
  animation: ThemeAnimation
  layout: ThemeLayout
  radius: string
}

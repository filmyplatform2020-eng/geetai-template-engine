import {
  hexToRgb, rgbToHex, relativeLuminance, contrastRatio, bestTextColor,
  blendWithWhite, blendWithBlack, emphasize, accessibleForeground, wcagLevel,
} from "./contrast"

export interface ColorScale {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
  foreground: string
}

export interface ProductPalette {
  accent: ColorScale
  accentLight: string
  accentSecondary: string
  accentSoft: string
  success: ColorScale
  warning: ColorScale
  danger: ColorScale
  neutral: ColorScale
  surface: { bg: string; card: string; raised: string; overlay: string }
  text: { primary: string; secondary: string; muted: string; inverse: string }
  border: { default: string; hover: string; focus: string }
  glass: { bg: string; border: string; opacity: number; blur: number }
  shadow: { color: string; intensity: number; highlight?: string }
  button: {
    primary: { bg: string; text: string; hover: string; pressed: string }
    secondary: { bg: string; text: string; hover: string; pressed: string }
  }
  badge: {
    success: { bg: string; text: string; border: string }
    warning: { bg: string; text: string; border: string }
    danger: { bg: string; text: string; border: string }
    neutral: { bg: string; text: string; border: string }
  }
  nav: {
    active: { bg: string; text: string; shadow: string }
    inactive: { text: string }
    capsule: { bg: string; border: string; shadow: string }
  }
  state: {
    hover: string
    pressed: string
    focus: string
    overlay: string
    disabled: { opacity: number; bg: string; text: string }
  }
}

function generateScale(base: string): ColorScale {
  const [r, g, b] = hexToRgb(base)
  const lum = relativeLuminance(base)

  if (lum > 0.5) {
    return {
      50: rgbToHex(r + (255 - r) * 0.9, g + (255 - g) * 0.9, b + (255 - b) * 0.9),
      100: rgbToHex(r + (255 - r) * 0.8, g + (255 - g) * 0.8, b + (255 - b) * 0.8),
      200: rgbToHex(r + (255 - r) * 0.6, g + (255 - g) * 0.6, b + (255 - b) * 0.6),
      300: rgbToHex(r + (255 - r) * 0.4, g + (255 - g) * 0.4, b + (255 - b) * 0.4),
      400: rgbToHex(r + (255 - r) * 0.2, g + (255 - g) * 0.2, b + (255 - b) * 0.2),
      500: base,
      600: blendWithBlack(base, 0.15),
      700: blendWithBlack(base, 0.3),
      800: blendWithBlack(base, 0.5),
      900: blendWithBlack(base, 0.7),
      foreground: bestTextColor(base),
    }
  }

  return {
    50: blendWithWhite(base, 0.85),
    100: blendWithWhite(base, 0.7),
    200: blendWithWhite(base, 0.5),
    300: blendWithWhite(base, 0.3),
    400: blendWithWhite(base, 0.15),
    500: base,
    600: blendWithBlack(base, 0.15),
    700: blendWithBlack(base, 0.3),
    800: blendWithBlack(base, 0.5),
    900: blendWithBlack(base, 0.7),
    foreground: bestTextColor(base),
  }
}

function deriveSemanticColor(accent: string, hueShift: number, saturationShift: number): string {
  const [r, g, b] = hexToRgb(accent)
  const gray = r * 0.299 + g * 0.587 + b * 0.114
  const shifted = rgbToHex(
    Math.round(Math.min(255, Math.max(0, gray + (r - gray) * (1 + saturationShift) + hueShift * 40))),
    Math.round(Math.min(255, Math.max(0, gray + (g - gray) * (1 + saturationShift) + hueShift * 20))),
    Math.round(Math.min(255, Math.max(0, gray + (b - gray) * (1 + saturationShift) - hueShift * 30))),
  )
  return shifted
}

export { generateScale }

export function generatePalette(
  accent: string,
  accentLight: string,
  accentSecondary: string,
  accentSoft: string,
  glassOpacity: number,
  glassBlur: number,
  glassBorderOpacity: number,
  shadowColor: string,
  shadowIntensity: number,
  shadowHighlight?: string,
  surfaceBg?: string,
): ProductPalette {
  const effectiveBg = surfaceBg || "#ffffff"
  const isLightBg = relativeLuminance(effectiveBg) > 0.5

  const accentScale = generateScale(accent)
  const successColor = deriveSemanticColor(accent, -0.5, 0.3)
  const warningColor = deriveSemanticColor(accent, 0.2, 0.2)
  const dangerColor = deriveSemanticColor(accent, 0.4, 0.1)

  const successScale = generateScale(successColor)
  const warningScale = generateScale(warningColor)
  const dangerScale = generateScale(dangerColor)
  const neutralScale = generateScale(isLightBg ? "#666680" : "#a0a0b8")

  let textPrimary = isLightBg ? blendWithBlack(effectiveBg, 0.85) : blendWithWhite(effectiveBg, 0.85)
  const textSecondary = isLightBg ? blendWithBlack(effectiveBg, 0.55) : blendWithWhite(effectiveBg, 0.55)
  const textMuted = isLightBg ? blendWithBlack(effectiveBg, 0.35) : blendWithWhite(effectiveBg, 0.35)
  const textInverse = isLightBg ? blendWithBlack(effectiveBg, 0.9) : blendWithWhite(effectiveBg, 0.9)

  if (contrastRatio(textPrimary, effectiveBg) < 4.5) {
    textPrimary = isLightBg ? "#1a1a1e" : "#f0f0f5"
  }

  const cardBg = isLightBg
    ? blendWithWhite(effectiveBg, 0.5)
    : blendWithBlack(effectiveBg, 0.3)

  const raisedBg = isLightBg
    ? blendWithWhite(accent, 0.92)
    : blendWithBlack(accent, 0.85)

  const overlayHover = isLightBg ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)"
  const overlayPress = isLightBg ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)"

  const borderDefault = isLightBg
    ? blendWithBlack(effectiveBg, 0.12)
    : blendWithWhite(effectiveBg, 0.12)

  const glassBg = isLightBg
    ? `rgba(255,255,255,${glassOpacity})`
    : `rgba(0,0,0,${glassOpacity})`

  const glassBorder = isLightBg
    ? `rgba(255,255,255,${glassBorderOpacity})`
    : `rgba(255,255,255,${glassBorderOpacity * 0.5})`

  const successBadgeBg = isLightBg
    ? blendWithWhite(successScale.foreground === "#ffffff" ? successScale.foreground : successColor, 0.85)
    : blendWithBlack(successColor, 0.7)

  const warningBadgeBg = isLightBg
    ? blendWithWhite(warningScale.foreground === "#ffffff" ? warningScale.foreground : warningColor, 0.85)
    : blendWithBlack(warningColor, 0.7)

  const dangerBadgeBg = isLightBg
    ? blendWithWhite(dangerScale.foreground === "#ffffff" ? dangerScale.foreground : dangerColor, 0.85)
    : blendWithBlack(dangerColor, 0.7)

  const neutralBadgeBg = isLightBg
    ? blendWithWhite(neutralScale.foreground === "#ffffff" ? neutralScale.foreground : neutralScale[500], 0.85)
    : blendWithBlack(neutralScale[500], 0.7)

  const successBadgeText = accessibleForeground(successBadgeBg, isLightBg ? "#16a34a" : "#86efac")
  const warningBadgeText = accessibleForeground(warningBadgeBg, isLightBg ? "#d97706" : "#fbbf24")
  const dangerBadgeText = accessibleForeground(dangerBadgeBg, isLightBg ? "#dc2626" : "#fca5a5")
  const neutralBadgeText = accessibleForeground(neutralBadgeBg, isLightBg ? "#4b5563" : "#d1d5db")

  const buttonPrimaryBg = accent
  const buttonPrimaryText = accessibleForeground(buttonPrimaryBg)
  const buttonPrimaryHover = emphasize(accent, 0.1)
  const buttonPrimaryPressed = emphasize(accent, 0.2)

  const buttonSecondaryBg = isLightBg ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.1)"
  const buttonSecondaryText = accessibleForeground(buttonSecondaryBg, textPrimary)
  const buttonSecondaryHover = isLightBg
    ? "rgba(255,255,255,0.95)"
    : "rgba(255,255,255,0.15)"
  const buttonSecondaryPressed = isLightBg
    ? "rgba(240,240,245,0.95)"
    : "rgba(255,255,255,0.2)"

  const navActiveBg = accentSoft
  const navActiveText = accessibleForeground(navActiveBg, accent)
  const navInactiveText = textSecondary
  const navCapsuleBg = isLightBg
    ? `rgba(255,255,255,${Math.min(1, glassOpacity + 0.15)})`
    : `rgba(255,255,255,${Math.min(1, glassOpacity + 0.2)})`

  return {
    accent: accentScale,
    accentLight,
    accentSecondary,
    accentSoft,
    success: successScale,
    warning: warningScale,
    danger: dangerScale,
    neutral: neutralScale,
    surface: {
      bg: effectiveBg,
      card: cardBg,
      raised: raisedBg,
      overlay: isLightBg ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)",
    },
    text: {
      primary: textPrimary,
      secondary: textSecondary,
      muted: textMuted,
      inverse: textInverse,
    },
    border: {
      default: borderDefault,
      hover: isLightBg ? blendWithBlack(effectiveBg, 0.25) : blendWithWhite(effectiveBg, 0.25),
      focus: accent,
    },
    glass: {
      bg: glassBg,
      border: glassBorder,
      opacity: glassOpacity,
      blur: glassBlur,
    },
    shadow: {
      color: shadowColor,
      intensity: shadowIntensity,
      highlight: shadowHighlight,
    },
    button: {
      primary: {
        bg: buttonPrimaryBg,
        text: buttonPrimaryText,
        hover: buttonPrimaryHover,
        pressed: buttonPrimaryPressed,
      },
      secondary: {
        bg: buttonSecondaryBg,
        text: buttonSecondaryText,
        hover: buttonSecondaryHover,
        pressed: buttonSecondaryPressed,
      },
    },
    badge: {
      success: { bg: successBadgeBg, text: successBadgeText, border: successBadgeText + "20" },
      warning: { bg: warningBadgeBg, text: warningBadgeText, border: warningBadgeText + "20" },
      danger: { bg: dangerBadgeBg, text: dangerBadgeText, border: dangerBadgeText + "20" },
      neutral: { bg: neutralBadgeBg, text: neutralBadgeText, border: neutralBadgeText + "20" },
    },
    nav: {
      active: {
        bg: accentSoft,
        text: navActiveText,
        shadow: `0 2px 8px ${accent}25`,
      },
      inactive: {
        text: navInactiveText,
      },
      capsule: {
        bg: navCapsuleBg,
        border: isLightBg ? `rgba(255,255,255,${glassBorderOpacity + 0.2})` : `rgba(255,255,255,${glassBorderOpacity * 0.7})`,
        shadow: `0 2px 20px rgba(${shadowColor}, ${shadowIntensity * 1.5}), 0 1px 4px rgba(0,0,0,0.04)`,
      },
    },
    state: {
      hover: overlayHover,
      pressed: overlayPress,
      focus: `0 0 0 2px ${accent}40`,
      overlay: isLightBg ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.5)",
      disabled: {
        opacity: 0.4,
        bg: isLightBg ? blendWithBlack(effectiveBg, 0.05) : blendWithWhite(effectiveBg, 0.05),
        text: isLightBg ? blendWithBlack(effectiveBg, 0.25) : blendWithWhite(effectiveBg, 0.25),
      },
    },
  }
}

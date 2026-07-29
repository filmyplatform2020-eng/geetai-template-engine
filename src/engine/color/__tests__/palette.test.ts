import { describe, it, expect } from "vitest"
import { generatePalette, generateScale } from "../palette"
import { hexToRgb, contrastRatio, wcagLevel } from "../contrast"

describe("generateScale", () => {
  it("contains 10 steps from 50 to 900 plus foreground", () => {
    const scale = generateScale("#e8a0bf")
    expect(scale[50]).toBeTruthy()
    expect(scale[100]).toBeTruthy()
    expect(scale[200]).toBeTruthy()
    expect(scale[300]).toBeTruthy()
    expect(scale[400]).toBeTruthy()
    expect(scale[500]).toBe("#e8a0bf")
    expect(scale[600]).toBeTruthy()
    expect(scale[700]).toBeTruthy()
    expect(scale[800]).toBeTruthy()
    expect(scale[900]).toBeTruthy()
    expect(scale.foreground).toBeTruthy()
  })

  it("produces lighter steps for light base colors", () => {
    const scale = generateScale("#e8a0bf")
    const [, , b50] = hexToRgb(scale[50])
    const [, , b500] = hexToRgb(scale[500])
    expect(b50).toBeGreaterThan(b500)
  })

  it("scale steps are monotonically ordered (light → dark)", () => {
    const scale = generateScale("#5a6aae")
    const lum50 = contrastRatio(scale[50], "#000000")
    const lum900 = contrastRatio(scale[900], "#000000")
    expect(lum50).toBeGreaterThan(lum900)
  })
})

describe("generatePalette — structure", () => {
  const palette = generatePalette(
    "#e8a0bf", "#f0b8d0", "#d4a5c4", "rgba(232,160,191,0.12)",
    0.55, 20, 0.3, "232,160,191", 0.06, undefined, undefined,
  )

  it("returns all required top-level keys", () => {
    expect(palette).toHaveProperty("accent")
    expect(palette).toHaveProperty("accentLight")
    expect(palette).toHaveProperty("success")
    expect(palette).toHaveProperty("warning")
    expect(palette).toHaveProperty("danger")
    expect(palette).toHaveProperty("neutral")
    expect(palette).toHaveProperty("surface")
    expect(palette).toHaveProperty("text")
    expect(palette).toHaveProperty("border")
    expect(palette).toHaveProperty("glass")
    expect(palette).toHaveProperty("shadow")
    expect(palette).toHaveProperty("button")
    expect(palette).toHaveProperty("badge")
    expect(palette).toHaveProperty("nav")
    expect(palette).toHaveProperty("state")
  })

  it("surface has bg, card, raised, overlay", () => {
    expect(palette.surface.bg).toBeTruthy()
    expect(palette.surface.card).toBeTruthy()
    expect(palette.surface.raised).toBeTruthy()
    expect(palette.surface.overlay).toBeTruthy()
  })

  it("text has primary, secondary, muted, inverse", () => {
    expect(palette.text.primary).toBeTruthy()
    expect(palette.text.secondary).toBeTruthy()
    expect(palette.text.muted).toBeTruthy()
    expect(palette.text.inverse).toBeTruthy()
  })

  it("button has primary and secondary with bg/text/hover/pressed", () => {
    for (const key of ["primary", "secondary"]) {
      expect(palette.button[key]).toHaveProperty("bg")
      expect(palette.button[key]).toHaveProperty("text")
      expect(palette.button[key]).toHaveProperty("hover")
      expect(palette.button[key]).toHaveProperty("pressed")
    }
  })

  it("badge has success, warning, danger, neutral with bg/text/border", () => {
    for (const key of ["success", "warning", "danger", "neutral"]) {
      expect(palette.badge[key]).toHaveProperty("bg")
      expect(palette.badge[key]).toHaveProperty("text")
      expect(palette.badge[key]).toHaveProperty("border")
    }
  })

  it("nav has active, inactive, capsule with proper sub-keys", () => {
    expect(palette.nav.active).toHaveProperty("bg")
    expect(palette.nav.active).toHaveProperty("text")
    expect(palette.nav.active).toHaveProperty("shadow")
    expect(palette.nav.inactive).toHaveProperty("text")
    expect(palette.nav.capsule).toHaveProperty("bg")
    expect(palette.nav.capsule).toHaveProperty("border")
    expect(palette.nav.capsule).toHaveProperty("shadow")
  })
})

describe("generatePalette — WCAG contrast validation", () => {
  const palette = generatePalette(
    "#e8a0bf", "#f0b8d0", "#d4a5c4", "rgba(232,160,191,0.12)",
    0.55, 20, 0.3, "232,160,191", 0.06, undefined, "#ffffff",
  )

  it("text primary vs bg meets AA", () => {
    const ratio = contrastRatio(palette.text.primary, palette.surface.bg)
    expect(wcagLevel(ratio)).toBe("AA")
  })

  it("button primary text vs bg meets AA", () => {
    const ratio = contrastRatio(palette.button.primary.text, palette.button.primary.bg)
    expect(wcagLevel(ratio)).toBe("AA")
  })

  it("button secondary text vs bg meets AA", () => {
    const ratio = contrastRatio(palette.button.secondary.text, palette.button.secondary.bg)
    expect(wcagLevel(ratio, "large")).toBe("AA")
  })

  it("badge success text vs bg meets AA", () => {
    const ratio = contrastRatio(palette.badge.success.text, palette.badge.success.bg)
    expect(wcagLevel(ratio)).toBe("AA")
  })

  it("badge warning text vs bg meets AA", () => {
    const ratio = contrastRatio(palette.badge.warning.text, palette.badge.warning.bg)
    expect(wcagLevel(ratio)).toBe("AA")
  })

  it("badge danger text vs bg meets AA", () => {
    const ratio = contrastRatio(palette.badge.danger.text, palette.badge.danger.bg)
    expect(wcagLevel(ratio)).toBe("AA")
  })

  it("badge neutral text vs bg meets AA", () => {
    const ratio = contrastRatio(palette.badge.neutral.text, palette.badge.neutral.bg)
    expect(wcagLevel(ratio)).toBe("AA")
  })
})

describe("generatePalette — light vs dark background", () => {
  it("uses white bg as default", () => {
    const palette = generatePalette(
      "#e8a0bf", "#f0b8d0", "#d4a5c4", "rgba(232,160,191,0.12)",
      0.55, 20, 0.3, "232,160,191", 0.06,
    )
    expect(palette.surface.bg).toBe("#ffffff")
  })

  it("uses provided bgColor", () => {
    const palette = generatePalette(
      "#e8a0bf", "#f0b8d0", "#d4a5c4", "rgba(232,160,191,0.12)",
      0.55, 20, 0.3, "232,160,191", 0.06, undefined, "#BEC8E6",
    )
    expect(palette.surface.bg).toBe("#BEC8E6")
  })

  it("generates dark text on light bg", () => {
    const palette = generatePalette(
      "#e8a0bf", "#f0b8d0", "#d4a5c4", "rgba(232,160,191,0.12)",
      0.55, 20, 0.3, "232,160,191", 0.06, undefined, "#ffffff",
    )
    const textLum = contrastRatio(palette.text.primary, "#000000")
    const bgLum = contrastRatio("#ffffff", "#000000")
    expect(textLum).toBeLessThan(bgLum)
  })

  it("generates light glass on light bg", () => {
    const palette = generatePalette(
      "#e8a0bf", "#f0b8d0", "#d4a5c4", "rgba(232,160,191,0.12)",
      0.55, 20, 0.3, "232,160,191", 0.06, undefined, "#ffffff",
    )
    expect(palette.glass.bg).toContain("rgba(255,255,255,")
  })
})

describe("generatePalette — glass system", () => {
  it("honors glass opacity parameter", () => {
    const p1 = generatePalette("#e8a0bf", "#f0b8d0", "#d4a5c4", "rgba(232,160,191,0.12)", 0.3, 20, 0.3, "232,160,191", 0.06, undefined, "#ffffff")
    const p2 = generatePalette("#e8a0bf", "#f0b8d0", "#d4a5c4", "rgba(232,160,191,0.12)", 0.7, 20, 0.3, "232,160,191", 0.06, undefined, "#ffffff")
    expect(p1.glass.opacity).toBe(0.3)
    expect(p2.glass.opacity).toBe(0.7)
  })

  it("honors glass blur parameter", () => {
    const p = generatePalette("#e8a0bf", "#f0b8d0", "#d4a5c4", "rgba(232,160,191,0.12)", 0.55, 24, 0.3, "232,160,191", 0.06)
    expect(p.glass.blur).toBe(24)
  })

  it("glass border has correct format", () => {
    const p = generatePalette("#e8a0bf", "#f0b8d0", "#d4a5c4", "rgba(232,160,191,0.12)", 0.55, 20, 0.4, "232,160,191", 0.06)
    expect(p.glass.border).toContain("rgba")
  })
})

describe("generatePalette — accent scale", () => {
  it("accent 500 matches input accent", () => {
    const palette = generatePalette(
      "#a8c8e8", "#c0d8f0", "#98b8d8", "rgba(168,200,232,0.12)",
      0.5, 24, 0.3, "150,180,210", 0.05, undefined, "#ffffff",
    )
    expect(palette.accent[500]).toBe("#a8c8e8")
  })

  it("accentLight matches input", () => {
    const palette = generatePalette(
      "#a8c8e8", "#c0d8f0", "#98b8d8", "rgba(168,200,232,0.12)",
      0.5, 24, 0.3, "150,180,210", 0.05,
    )
    expect(palette.accentLight).toBe("#c0d8f0")
  })

  it("accentSoft matches input", () => {
    const palette = generatePalette(
      "#a8c8e8", "#c0d8f0", "#98b8d8", "rgba(168,200,232,0.12)",
      0.5, 24, 0.3, "150,180,210", 0.05,
    )
    expect(palette.accentSoft).toBe("rgba(168,200,232,0.12)")
  })
})

describe("generatePalette — semantic colors", () => {
  const palette = generatePalette(
    "#e8a0bf", "#f0b8d0", "#d4a5c4", "rgba(232,160,191,0.12)",
    0.55, 20, 0.3, "232,160,191", 0.06, undefined, "#ffffff",
  )

  it("success, warning, danger are distinct from accent", () => {
    expect(palette.success[500]).not.toBe(palette.accent[500])
    expect(palette.warning[500]).not.toBe(palette.accent[500])
    expect(palette.danger[500]).not.toBe(palette.accent[500])
  })

  it("neutral is distinct from accent", () => {
    expect(palette.neutral[500]).not.toBe(palette.accent[500])
  })

  it("success has full ColorScale", () => {
    expect(palette.success[50]).toBeTruthy()
    expect(palette.success[500]).toBeTruthy()
    expect(palette.success[900]).toBeTruthy()
    expect(palette.success.foreground).toBeTruthy()
  })
})

describe("generatePalette — shadow", () => {
  it("stores shadow color and intensity", () => {
    const palette = generatePalette(
      "#e8a0bf", "#f0b8d0", "#d4a5c4", "rgba(232,160,191,0.12)",
      0.55, 20, 0.3, "232,160,191", 0.06,
    )
    expect(palette.shadow.color).toBe("232,160,191")
    expect(palette.shadow.intensity).toBe(0.06)
  })
})

describe("generatePalette — edge cases", () => {
  it("handles dark accent color", () => {
    const palette = generatePalette(
      "#1a1a2e", "#2a2a4e", "#0a0a1e", "rgba(26,26,46,0.12)",
      0.5, 20, 0.3, "26,26,46", 0.05, undefined, "#ffffff",
    )
    expect(palette.accent[500]).toBe("#1a1a2e")
  })

  it("handles saturated color", () => {
    const palette = generatePalette(
      "#ff0066", "#ff3399", "#cc0055", "rgba(255,0,102,0.12)",
      0.5, 20, 0.3, "255,0,102", 0.05, undefined, "#ffffff",
    )
    expect(palette.accent[500]).toBe("#ff0066")
  })

  it("handles white accent", () => {
    const palette = generatePalette(
      "#ffffff", "#ffffff", "#eeeeee", "rgba(255,255,255,0.12)",
      0.5, 20, 0.3, "200,200,200", 0.05, undefined, "#ffffff",
    )
    expect(palette.accent[500]).toBe("#ffffff")
    expect(palette.text.primary).toBeTruthy()
  })

  it("handles empty shadowHighlight", () => {
    const palette = generatePalette(
      "#e8a0bf", "#f0b8d0", "#d4a5c4", "rgba(232,160,191,0.12)",
      0.55, 20, 0.3, "232,160,191", 0.06, undefined, "#ffffff",
    )
    expect(palette.shadow.highlight).toBeUndefined()
  })

  it("handles present shadowHighlight", () => {
    const palette = generatePalette(
      "#e8a0bf", "#f0b8d0", "#d4a5c4", "rgba(232,160,191,0.12)",
      0.55, 20, 0.3, "232,160,191", 0.06, "inset 0 1px 0 rgba(255,255,255,0.7)", "#ffffff",
    )
    expect(palette.shadow.highlight).toBe("inset 0 1px 0 rgba(255,255,255,0.7)")
  })
})

import { describe, it, expect } from "vitest"
import {
  hexToRgb, rgbToHex, relativeLuminance, contrastRatio,
  wcagLevel, bestTextColor, blendWithWhite, blendWithBlack,
  emphasize, accessibleForeground,
} from "../contrast"

describe("hexToRgb", () => {
  it("converts full hex", () => {
    expect(hexToRgb("#ffffff")).toEqual([255, 255, 255])
  })
  it("converts without hash", () => {
    expect(hexToRgb("000000")).toEqual([0, 0, 0])
  })
  it("handles short hex", () => {
    expect(hexToRgb("#fff")).toEqual([255, 255, 255])
  })
  it("handles accent colors", () => {
    const [r, g, b] = hexToRgb("#e8a0bf")
    expect(r).toBe(232)
    expect(g).toBe(160)
    expect(b).toBe(191)
  })
})

describe("rgbToHex", () => {
  it("converts to hex", () => {
    expect(rgbToHex(255, 255, 255)).toBe("#ffffff")
  })
  it("handles zeros", () => {
    expect(rgbToHex(0, 0, 0)).toBe("#000000")
  })
  it("rounds values", () => {
    expect(rgbToHex(127.5, 63.3, 200.7)).toBe("#803fc9")
  })
  it("round-trips with hexToRgb", () => {
    const hex = "#a8c8e8"
    const [r, g, b] = hexToRgb(hex)
    expect(rgbToHex(r, g, b)).toBe(hex)
  })
})

describe("relativeLuminance", () => {
  it("white is ~1.0", () => {
    expect(relativeLuminance("#ffffff")).toBeCloseTo(1, 2)
  })
  it("black is ~0.0", () => {
    expect(relativeLuminance("#000000")).toBeCloseTo(0, 2)
  })
  it("gray is ~0.21", () => {
    const l = relativeLuminance("#808080")
    expect(l).toBeGreaterThan(0.2)
    expect(l).toBeLessThan(0.22)
  })
  it("is below 0.5 for dark colors", () => {
    expect(relativeLuminance("#1a1a2e")).toBeLessThan(0.5)
  })
  it("is above 0.5 for light colors", () => {
    expect(relativeLuminance("#f0e0d4")).toBeGreaterThan(0.5)
  })
})

describe("contrastRatio", () => {
  it("white on black = 21", () => {
    expect(contrastRatio("#ffffff", "#000000")).toBeCloseTo(21, 0)
  })
  it("black on white = 21", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 0)
  })
  it("same color = 1", () => {
    expect(contrastRatio("#ff0000", "#ff0000")).toBeCloseTo(1, 1)
  })
  it("light gray on white fails AA for normal text (<4.5)", () => {
    expect(contrastRatio("#cccccc", "#ffffff")).toBeLessThan(4.5)
  })
  it("dark on light passes AA", () => {
    expect(contrastRatio("#0a0a1a", "#BEC8E6")).toBeGreaterThan(4.5)
  })
})

describe("wcagLevel", () => {
  it("7+ is AAA for normal text", () => {
    expect(wcagLevel(7.5)).toBe("AAA")
  })
  it("4.5-7 is AA for normal text", () => {
    expect(wcagLevel(5)).toBe("AA")
  })
  it("below 4.5 fails for normal text", () => {
    expect(wcagLevel(3)).toBe("Fail")
  })
  it("4.5+ is AAA for large text", () => {
    expect(wcagLevel(4.5, "large")).toBe("AAA")
  })
  it("3-4.5 is AA for large text", () => {
    expect(wcagLevel(3.5, "large")).toBe("AA")
  })
  it("below 3 fails for large text", () => {
    expect(wcagLevel(2.5, "large")).toBe("Fail")
  })
})

describe("bestTextColor", () => {
  it("returns white text on dark background", () => {
    expect(bestTextColor("#0a0a1a")).toBe("#ffffff")
  })
  it("returns dark text on light background", () => {
    expect(bestTextColor("#ffffff")).toBe("#0a0a0f")
  })
  it("returns dark text on midtone", () => {
    expect(bestTextColor("#a0a0a0")).toBe("#0a0a0f")
  })
})

describe("blendWithWhite", () => {
  it("returns white at amount 1", () => {
    expect(blendWithWhite("#ff0000", 1)).toBe("#ffffff")
  })
  it("returns original at amount 0", () => {
    expect(blendWithWhite("#ff0000", 0)).toBe("#ff0000")
  })
  it("lightens the color", () => {
    const result = blendWithWhite("#ff0000", 0.5)
    const [r, g, b] = hexToRgb(result)
    expect(r).toBe(255) // R stays 255
    expect(g).toBe(128) // G goes to 128
    expect(b).toBe(128) // B goes to 128
  })
})

describe("blendWithBlack", () => {
  it("returns black at amount 1", () => {
    expect(blendWithBlack("#ff0000", 1)).toBe("#000000")
  })
  it("returns original at amount 0", () => {
    expect(blendWithBlack("#ff0000", 0)).toBe("#ff0000")
  })
  it("darkens the color", () => {
    const result = blendWithBlack("#ff0000", 0.5)
    const [r, g, b] = hexToRgb(result)
    expect(r).toBe(128)
    expect(g).toBe(0)
    expect(b).toBe(0)
  })
})

describe("emphasize", () => {
  it("darkens light colors", () => {
    const result = emphasize("#e8a0bf", 0.1)
    const [r, g, b] = hexToRgb(result)
    expect(r).toBeLessThan(232)
  })
  it("lightens dark colors", () => {
    const result = emphasize("#2a1a3e", 0.1)
    const [r, g, b] = hexToRgb(result)
    expect(r).toBeGreaterThan(42)
  })
  it("returns different value from input at non-zero amount", () => {
    expect(emphasize("#5a6aae", 0.1)).not.toBe("#5a6aae")
  })
})

describe("accessibleForeground", () => {
  it("returns bestTextColor when no hint provided", () => {
    expect(accessibleForeground("#0a0a1a")).toBe("#ffffff")
  })
  it("uses hint when it meets AA", () => {
    const result = accessibleForeground("#ffffff", "#0a0a1a")
    expect(result).toBe("#0a0a1a")
  })
  it("falls back when hint fails AA", () => {
    const result = accessibleForeground("#ffffff", "#cccccc")
    expect(contrastRatio(result, "#ffffff")).toBeGreaterThanOrEqual(4.5)
  })
})

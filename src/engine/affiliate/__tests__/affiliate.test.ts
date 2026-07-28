/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest"
import { sortBuyLinks, getLowestPrice, getSavings } from "../index"

const links: any[] = [
  { store: "Amazon", url: "#", price: 100, currency: "$", available: true },
  { store: "Best Buy", url: "#", price: 110, currency: "$", available: true },
  { store: "B&H", url: "#", price: 95, currency: "$", available: false },
]

describe("sortBuyLinks", () => {
  it("puts available links first", () => {
    const sorted = sortBuyLinks(links)
    expect(sorted[0].available).toBe(true)
    expect(sorted[sorted.length - 1].available).toBe(false)
  })
})

describe("getLowestPrice", () => {
  it("returns min available price", () => {
    expect(getLowestPrice(links)).toBe(100)
  })
})

describe("getSavings", () => {
  it("calculates savings percentage", () => {
    const savings = getSavings({ originalPrice: 200, buyLinks: links } as any)
    expect(savings).toBe(50)
  })
})

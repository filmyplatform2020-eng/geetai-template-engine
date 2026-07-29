#!/usr/bin/env python3
"""Generate SVG placeholder images for all products."""
import os, re

STYLES = [
    ("blush-rose",      "#e8a0bf", "#fce8ef", "#1a1a2e"),
    ("champagne-pearl", "#d4c4a8", "#f8f4ec", "#1a1a2e"),
    ("ice-baby-blue",   "#a8c8e8", "#eef4f8", "#1a1a2e"),
    ("sage-mint",       "#a8c8b8", "#eef4f0", "#1a1a2e"),
    ("lavender-mist",   "#c4b8e8", "#f0ecf8", "#1a1a2e"),
    ("rose-quartz",     "#e8b4c0", "#f8ecee", "#1a1a2e"),
    ("periwinkle-dream","#a8b4e8", "#eeecf8", "#1a1a2e"),
    ("warm-ivory",      "#d4c8b8", "#f6f2ec", "#1a1a2e"),
    ("sky-petal",       "#b8cce8", "#eef2f8", "#1a1a2e"),
    ("cream-blush",     "#e8d0c0", "#f8f0ea", "#1a1a2e"),
    ("image-derived",   "#5a6aae", "#e8ecf8", "#ffffff"),
    ("cosmic-purple",   "#7c5cbf", "#f0ecf8", "#ffffff"),
    ("midnight-indigo", "#2d2d6b", "#e8e8f4", "#ffffff"),
    ("tech-blue",       "#2563eb", "#e8f0fe", "#ffffff"),
    ("emerald",         "#059669", "#e8f8f0", "#ffffff"),
    ("crimson",         "#dc2626", "#fce8e8", "#ffffff"),
    ("navy",            "#1e3a5f", "#e8eef4", "#ffffff"),
    ("obsidian",        "#1a1a2e", "#e8e8ee", "#ffffff"),
    ("gold-noir",       "#b8860b", "#f8f0d8", "#ffffff"),
    ("rose-gold",       "#e8b4b8", "#fce8ea", "#1a1a2e"),
]

PRODUCTS = [
    "macbook-pro", "macbook-air-15-m3", "dell-xps-16-2025", "iphone-16-pro-max",
    "galaxy-s25-ultra", "sony-wh-1000xm6", "ipad-pro-13-m4", "apple-watch-ultra-3",
    "ps5-pro", "sony-a7v", "samsung-qd-oled", "airpods-pro-3",
    "nintendo-switch-2", "meta-quest-4", "dji-air-4", "kindle-scribe-2",
    "apple-studio-display-2", "logitech-mx-master-4", "google-pixel-9-pro", "sonos-era-300",
]

IMAGE_NAMES = ["front", "angle", "side", "display"]

def make_image_svg(accent, light, text_color, label, name):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:{light}"/>
      <stop offset="100%" style="stop-color:{accent}20"/>
    </linearGradient>
    <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:{accent};stop-opacity:0.08"/>
      <stop offset="50%" style="stop-color:{accent};stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:{accent};stop-opacity:0.08"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#bg)" rx="16"/>
  <rect x="100" y="100" width="1000" height="600" fill="url(#shimmer)" rx="24"/>
  <rect x="100" y="100" width="1000" height="600" fill="none" stroke="{accent}30" stroke-width="1" rx="24"/>
  <text x="600" y="380" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="28" font-weight="600" fill="{text_color}">{label}</text>
  <text x="600" y="420" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="16" fill="{text_color}90">{name}</text>
  <rect x="560" y="460" width="80" height="2" rx="1" fill="{accent}50"/>
</svg>'''

def make_cover_svg(accent, light, text_color, label):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:{accent}15"/>
      <stop offset="50%" style="stop-color:{light}"/>
      <stop offset="100%" style="stop-color:{accent}08"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" style="stop-color:{accent};stop-opacity:0.12"/>
      <stop offset="100%" style="stop-color:{accent};stop-opacity:0"/>
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#bg)"/>
  <rect width="1920" height="1080" fill="url(#glow)"/>
  <text x="960" y="500" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="48" font-weight="700" fill="{text_color}">{label}</text>
  <text x="960" y="550" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="20" fill="{text_color}80">Hero Cover</text>
  <rect x="880" y="580" width="160" height="2" rx="1" fill="{accent}40"/>
</svg>'''

def main():
    base = os.path.join(os.path.dirname(__file__), "..", "public", "images")
    os.makedirs(base, exist_ok=True)

    count = 0
    for i, slug in enumerate(PRODUCTS):
        _, accent, light, text_color = STYLES[i % len(STYLES)]
        label = slug.replace("-", " ").title()

        for name in IMAGE_NAMES:
            svg = make_image_svg(accent, light, text_color, label, f"{name} view")
            with open(os.path.join(base, f"{slug}-{name}.svg"), "w") as f:
                f.write(svg)
            count += 1

        svg = make_cover_svg(accent, light, text_color, label)
        with open(os.path.join(base, f"{slug}-cover.svg"), "w") as f:
            f.write(svg)
        count += 1

    print(f"Generated {count} placeholder SVGs in {base}")

if __name__ == "__main__":
    main()

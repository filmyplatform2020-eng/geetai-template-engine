#!/usr/bin/env python3
"""
Phase 4A - Stage 1 v3: Positional image replacement (handles duplicate src strings)
Each product has 5 SVGs: {base}-front, {base}-angle, {base}-side, {base}-cover, {base}-display
Assign 4 distinct images per product using positional editing.
"""

import re
from pathlib import Path

BASE_DIR = Path("/Users/aniket/Desktop/geetai-template-engine")
PRODUCTS_DIR = BASE_DIR / "src" / "data" / "products"
IMAGES_DIR = BASE_DIR / "public" / "images"

actual_svgs = {f.name for f in IMAGES_DIR.glob("*.svg")}

PRODUCT_BASES = {
    "airpods-pro-3.ts": "airpods-pro-3",
    "apple-studio-display-2.ts": "apple-studio-display-2",
    "apple-watch-ultra-3.ts": "apple-watch-ultra-3",
    "dell-xps-16-2025.ts": "dell-xps-16-2025",
    "dji-air-4.ts": "dji-air-4",
    "galaxy-s25-ultra.ts": "galaxy-s25-ultra",
    "google-pixel-9-pro.ts": "google-pixel-9-pro",
    "ipad-pro-13-m4.ts": "ipad-pro-13-m4",
    "iphone-16-pro-max.ts": "iphone-16-pro-max",
    "kindle-scribe-2.ts": "kindle-scribe-2",
    "logitech-mx-master-4.ts": "logitech-mx-master-4",
    "macbook-air-15-m3.ts": "macbook-air-15-m3",
    "macbook-pro.ts": "macbook-pro",
    "meta-quest-4.ts": "meta-quest-4",
    "nintendo-switch-2.ts": "nintendo-switch-2",
    "ps5-pro.ts": "ps5-pro",
    "samsung-qd-oled.ts": "samsung-qd-oled",
    "sonos-era-300.ts": "sonos-era-300",
    "sony-a7v.ts": "sony-a7v",
    "sony-wh-1000xm6.ts": "sony-wh-1000xm6",
}

VIEWS = {
    "airpods-pro-3":        ["front", "angle", "side", "cover"],
    "apple-studio-display-2": ["front", "angle", "side", "display"],
    "apple-watch-ultra-3":   ["front", "angle", "side", "display"],
    "dell-xps-16-2025":      ["front", "angle", "side", "display"],
    "dji-air-4":             ["front", "angle", "side", "cover"],
    "galaxy-s25-ultra":      ["front", "angle", "side", "display"],
    "google-pixel-9-pro":    ["front", "angle", "side", "display"],
    "ipad-pro-13-m4":        ["front", "angle", "side", "display"],
    "iphone-16-pro-max":     ["front", "angle", "side", "cover"],
    "kindle-scribe-2":       ["front", "angle", "side", "display"],
    "logitech-mx-master-4":  ["front", "angle", "side", "cover"],
    "macbook-air-15-m3":     ["front", "angle", "side", "display"],
    "macbook-pro":           ["front", "angle", "side", "display"],
    "meta-quest-4":          ["front", "angle", "side", "cover"],
    "nintendo-switch-2":     ["front", "angle", "side", "display"],
    "ps5-pro":               ["front", "angle", "side", "cover"],
    "samsung-qd-oled":       ["front", "angle", "side", "display"],
    "sonos-era-300":         ["front", "angle", "side", "cover"],
    "sony-a7v":              ["front", "angle", "side", "display"],
    "sony-wh-1000xm6":       ["front", "angle", "side", "cover"],
}

total_fixes = 0

for filename, product_base in PRODUCT_BASES.items():
    filepath = PRODUCTS_DIR / filename
    content = filepath.read_text()
    
    # Find the images array bounds
    images_match = re.search(r'images:\s*\[', content)
    if not images_match:
        print(f"  ❌ {filename}: no images array")
        continue
    
    array_start = images_match.start()
    
    # Find the closing bracket of the images array
    # Count brackets from the start of the array
    i = images_match.end()
    depth = 1
    while i < len(content) and depth > 0:
        if content[i] == '[':
            depth += 1
        elif content[i] == ']':
            depth -= 1
        i += 1
    
    if depth != 0:
        print(f"  ❌ {filename}: unbalanced brackets")
        continue
    
    array_end = i  # position after ']'
    
    images_block = content[images_match.start():array_end]
    
    # Extract each { src: "...", alt: "..." } entry as a positional match
    entries = list(re.finditer(r'\{\s*src:\s*"([^"]+)"\s*,\s*alt:\s*"([^"]+)"\s*\}', images_block))
    
    views = VIEWS.get(product_base, ["front", "angle", "side", "display"])
    
    if len(entries) != 4:
        print(f"  ❌ {filename}: expected 4 image entries, found {len(entries)}")
        continue
    
    # Build replacements (process from last to first to preserve positions)
    replacements = []
    for idx, entry in enumerate(entries):
        old_src = entry.group(1)
        view = views[idx]
        new_svg = f"{product_base}-{view}.svg"
        
        if new_svg not in actual_svgs:
            available = [s for s in actual_svgs if s.startswith(product_base + "-")]
            if available:
                new_svg = available[idx % len(available)]
            else:
                print(f"  ⚠️ {filename}: no SVGs for product, keeping {old_src}")
                continue
        
        new_src = f"/images/{new_svg}"
        if old_src != new_src:
            # Calculate absolute position in content
            abs_start = images_match.start() + entry.start(2)  # group 2 = src value
            abs_end = images_match.start() + entry.end(2)
            replacements.append((abs_start, abs_end, old_src, new_src, view))
    
    if not replacements:
        if all(entry.group(1).lstrip("/images/") in actual_svgs for entry in entries):
            print(f"  ✓ {filename}: already correct")
        continue
    
    # Apply from last to first to preserve positions
    chars = list(content)
    for start, end, old_src, new_src, view in reversed(replacements):
        # Verify current content at position still matches
        actual = "".join(chars[start:end])
        if actual == old_src:
            chars[start:end] = list(new_src)
            print(f"  ✅ {filename}: [{view}] {old_src.split('/')[-1]} -> {new_src.split('/')[-1]}")
            total_fixes += 1
        else:
            print(f"  ❌ {filename}: position mismatch at {start}, expected '{old_src}', got '{actual}'")
    
    filepath.write_text("".join(chars))

print(f"\n✅ Total: {total_fixes} positional image fixes")

# Verification
print("\n=== VERIFICATION ===")
all_ok = True
for filename, product_base in PRODUCT_BASES.items():
    content = (PRODUCTS_DIR / filename).read_text()
    refs = [m.group(1) for m in re.finditer(r'src:\s*"([^"]+)"', content)]
    filenames = [s.lstrip("/images/") for s in refs]
    exist = [f in actual_svgs for f in filenames]
    unique = len(set(filenames)) == len(filenames)
    
    if all(exist) and unique and len(refs) == 4:
        print(f"  ✓ {product_base}: {', '.join(filenames)}")
    else:
        all_ok = False
        reasons = []
        for f, e in zip(filenames, exist):
            if not e: reasons.append(f"{f} MISSING")
        if not unique: reasons.append("DUPLICATES")
        if len(refs) != 4: reasons.append(f"{len(refs)} refs")
        print(f"  ❌ {product_base}: {'; '.join(reasons)}")

print(f"\n{'✅ ALL 20 PRODUCTS OK' if all_ok else '⚠️ Some issues remain'}")

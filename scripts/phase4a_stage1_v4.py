#!/usr/bin/env python3
"""
Phase 4A - Stage 1 v4: FINAL - properly assign 4 DISTINCT SVG images per product.
Uses positional editing with correct regex group indexing.
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
    
    # For each product, read the file and do a targeted replacement of the 4 image src values
    # Strategy: find each occurrence of `src: "..."` within the images array
    
    # Find images array start
    images_start = content.find("images: [")
    if images_start == -1:
        print(f"  ❌ {filename}: no images array")
        continue
    
    # Find the closing bracket of images (balanced bracket search)
    i = images_start + len("images: [")
    bracket_depth = 1
    while i < len(content) and bracket_depth > 0:
        if content[i] == '[': bracket_depth += 1
        elif content[i] == ']': bracket_depth -= 1
        i += 1
    
    images_end = i  # after the closing ]
    images_section = content[images_start:images_end]
    
    # Find all `src: "..."` matches within the images section
    src_matches = list(re.finditer(r'src:\s*"([^"]+)"', images_section))
    
    if len(src_matches) != 4:
        print(f"  ❌ {filename}: expected 4 src entries, found {len(src_matches)}")
        continue
    
    views = VIEWS.get(product_base, ["front", "angle", "side", "display"])
    
    # Build replacements (process list of (absolute_position_start, absolute_position_end, new_text))
    replacements = []
    for idx, match in enumerate(src_matches):
        old_src = match.group(1)
        view = views[idx]
        new_svg = f"{product_base}-{view}.svg"
        
        if new_svg not in actual_svgs:
            available = [s for s in actual_svgs if s.startswith(product_base + "-")]
            if available:
                new_svg = available[idx % len(available)]
            else:
                continue
        
        new_src = f"/images/{new_svg}"
        if old_src != new_src:
            abs_start = images_start + match.start(1)
            abs_end = images_start + match.end(1)
            replacements.append((abs_start, abs_end, old_src, new_src, view))
    
    if not replacements:
        # Check if already correct
        refs = [m.group(1) for m in src_matches]
        svgs = [r.lstrip("/images/") for r in refs]
        if all(s in actual_svgs for s in svgs) and len(set(svgs)) == 4:
            print(f"  ✓ {filename}: already correct")
        else:
            issues = []
            for s in svgs:
                if s not in actual_svgs: issues.append(f"{s} MISSING")
            if len(set(svgs)) != len(svgs): issues.append("DUPLICATES")
            print(f"  ⚠️ {filename}: {'; '.join(issues)}")
        continue
    
    # Apply replacements from LAST to FIRST to preserve positions
    chars = list(content)
    for start, end, old, new, view in reversed(replacements):
        actual = "".join(chars[start:end])
        if actual != old:
            print(f"  ❌ {filename}: position mismatch at {start}, expected '{old}', got '{actual}'")
            continue
        chars[start:end] = list(new)
        print(f"  ✅ {filename}: [{view}] {old.split('/')[-1]} -> {new.split('/')[-1]}")
        total_fixes += 1
    
    filepath.write_text("".join(chars))

print(f"\n✅ Total: {total_fixes} image path fixes")

# Verification
print("\n=== VERIFICATION ===")
all_ok = True
ok_count = 0
for filename, product_base in PRODUCT_BASES.items():
    content = (PRODUCTS_DIR / filename).read_text()
    refs = [m.group(1) for m in re.finditer(r'src:\s*"([^"]+)"', content)]
    svgs = [s.lstrip("/images/") for s in refs]
    exist = [s in actual_svgs for s in svgs]
    unique = len(set(svgs)) == len(svgs)
    
    if all(exist) and unique and len(refs) == 4:
        print(f"  ✓ {product_base}: {', '.join(svgs)}")
        ok_count += 1
    else:
        all_ok = False
        reasons = []
        for s, e in zip(svgs, exist):
            if not e: reasons.append(f"MISSING: {s}")
        if not unique: reasons.append("DUPLICATES")
        if len(refs) != 4: reasons.append(f"{len(refs)} refs")
        print(f"  ❌ {product_base}: {'; '.join(reasons)}")

print(f"\n{'✅ ALL 20 PRODUCTS OK' if all_ok else f'⚠️ {ok_count}/20 OK - some issues remain'}")

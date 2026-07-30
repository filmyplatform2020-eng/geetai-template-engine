#!/usr/bin/env python3
"""
Phase 4A - Stage 1 v2: Properly assign 4 DISTINCT SVG images per product.
Each product has 5 SVGs available: {base}-front, {base}-angle, {base}-side, {base}-cover, {base}-display
We assign 4 distinct slots: hero, angle, detail, cover
"""

import re
from pathlib import Path

BASE_DIR = Path("/Users/aniket/Desktop/geetai-template-engine")
PRODUCTS_DIR = BASE_DIR / "src" / "data" / "products"
IMAGES_DIR = BASE_DIR / "public" / "images"

# Available SVGs per product base
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

# Mapping: for each product, map [old_ref_index] -> [standard_view_name]
# Index 0,1,2,3 are the 4 images in order in the file
# Standard views: front, angle, side, cover, display
VIEW_ASSIGNMENT = {
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
    
    # Find images array
    images_match = re.search(r'images:\s*\[(.*?)\]', content, re.DOTALL)
    if not images_match:
        print(f"  SKIP {filename}: no images array found")
        continue
    
    images_block = images_match.group(1)
    
    # Find all src entries with their surrounding text for replacement
    # Pattern: { src: "/images/...svg", alt: "..." }
    # We need to find each entry and replace just the src value
    
    # Find all src values in order
    srcs = list(re.finditer(r'(src:\s*)"([^"]+)"', images_block))
    
    views = VIEW_ASSIGNMENT.get(product_base, ["front", "angle", "side", "display"])
    
    if len(srcs) != 4:
        print(f"  SKIP {filename}: expected 4 image refs, found {len(srcs)}")
        continue
    
    changes = []
    for i, src_match in enumerate(srcs):
        old_src = src_match.group(2)
        view = views[i] if i < len(views) else "front"
        new_svg = f"{product_base}-{view}.svg"
        
        if new_svg not in actual_svgs:
            # Fallback
            available = [s for s in actual_svgs if s.startswith(product_base + "-")]
            if available:
                new_svg = available[i % len(available)]
            else:
                print(f"  WARN {filename}: no SVGs found for base {product_base}")
                continue
        
        new_src = f"/images/{new_svg}"
        
        if old_src != new_src:
            changes.append((old_src, new_src, view))
    
    if changes:
        # Apply all changes
        new_content = content
        for old_src, new_src, view in changes:
            new_content = new_content.replace(f'src: "{old_src}"', f'src: "{new_src}"')
        
        filepath.write_text(new_content)
        total_fixes += len(changes)
        for old_src, new_src, view in changes:
            print(f"  ✅ {filename}: {old_src.split('/')[-1]} → {new_src.split('/')[-1]} (view: {view})")
    else:
        print(f"  ✓ {filename}: already correct")

print(f"\n✅ Total: {total_fixes} image fixes across {len(PRODUCT_BASES)} files")

# Verify: for each product, all 4 images should exist and be distinct
print("\n=== VERIFICATION ===")
all_ok = True
for filename, product_base in PRODUCT_BASES.items():
    filepath = PRODUCTS_DIR / filename
    content = filepath.read_text()
    
    srcs = re.findall(r'src:\s*"([^"]+)"', content)
    filenames = [s.lstrip("/images/") for s in srcs]
    exist_checks = [f in actual_svgs for f in filenames]
    unique = len(set(filenames)) == len(filenames)
    
    if all(exist_checks) and unique and len(filenames) == 4:
        print(f"  ✓ {filename}: ALL 4 OK, distinct: {', '.join(filenames)}")
    else:
        all_ok = False
        issues = []
        for f, exists in zip(filenames, exist_checks):
            if not exists:
                issues.append(f"{f} (MISSING)")
        if not unique:
            issues.append("DUPLICATE IMAGES")
        if len(filenames) != 4:
            issues.append(f"{len(filenames)} images (expected 4)")
        print(f"  ❌ {filename}: {'; '.join(issues)}")

if all_ok:
    print("\n✅ ALL PRODUCTS: 4 distinct valid SVG images each")
else:
    print("\n⚠️ Some products still have issues")

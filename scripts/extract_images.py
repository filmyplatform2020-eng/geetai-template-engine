import re
import json
import os
import sys

PRODUCTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "src", "data", "products")
OUTPUT_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "output", "product_image_refs.json")

EXCLUDE = {"index.ts", "registry.ts"}

slug_pat = re.compile(r'^\s*slug:\s*"([^"]+)"', re.MULTILINE)

def extract_images_array(text: str) -> list[str]:
    """Extract all src values from the images array using regex, handling multi-line entries."""
    images_srcs = []
    in_images = False
    brace_depth = 0
    src_pat = re.compile(r'src:\s*"([^"]+)"')

    lines = text.split("\n")
    for line in lines:
        stripped = line.strip()

        if not in_images:
            if re.match(r'^\s*images:\s*\[', stripped):
                in_images = True
                brace_depth = stripped.count("[") - stripped.count("]")
                if brace_depth <= 0:
                    brace_depth = 1
                # Check for src on the same line as the opening
                for m in src_pat.finditer(line):
                    images_srcs.append(m.group(1))
            continue

        brace_depth += stripped.count("[") - stripped.count("]")

        for m in src_pat.finditer(line):
            images_srcs.append(m.group(1))

        if brace_depth <= 0:
            in_images = False

    return images_srcs


def main():
    if not os.path.isdir(PRODUCTS_DIR):
        print(f"ERROR: Directory not found: {PRODUCTS_DIR}", file=sys.stderr)
        sys.exit(1)

    product_files = sorted(
        f for f in os.listdir(PRODUCTS_DIR)
        if f.endswith(".ts") and f not in EXCLUDE
    )

    if not product_files:
        print("ERROR: No product .ts files found.", file=sys.stderr)
        sys.exit(1)

    result = {}
    all_refs = []

    for fname in product_files:
        fpath = os.path.join(PRODUCTS_DIR, fname)

        with open(fpath, "r", encoding="utf-8") as fh:
            text = fh.read()

        slug_match = slug_pat.search(text)
        slug = slug_match.group(1) if slug_match else fname.replace(".ts", "")

        refs = extract_images_array(text)

        result[slug] = {
            "filename": fname,
            "slug": slug,
            "refs": refs,
        }
        all_refs.extend(refs)

    with open(OUTPUT_PATH, "w", encoding="utf-8") as fh:
        json.dump(result, fh, indent=2)

    print(f"Written to: {OUTPUT_PATH}\n")

    # Summary
    unique_refs = sorted(set(all_refs))
    counts = {slug: len(data["refs"]) for slug, data in result.items()}
    most = max(counts, key=counts.get)
    fewest = min(counts, key=counts.get)

    print("=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"  Total product files:    {len(product_files)}")
    print(f"  Total image references: {len(all_refs)}")
    print(f"  Unique image paths:     {len(unique_refs)}")
    print()
    print(f"  Most refs:  {most} ({counts[most]} refs)")
    print(f"  Fewest refs: {fewest} ({counts[fewest]} refs)")
    print()
    print("--- All unique image paths ---")
    for p in unique_refs:
        print(f"  {p}")


if __name__ == "__main__":
    main()

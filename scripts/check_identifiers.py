import re
import os
import sys
from pathlib import Path

PRODUCTS_DIR = Path("/Users/aniket/Desktop/geetai-template-engine/src/data/products")
REGISTRY_FILE = PRODUCTS_DIR / "registry.ts"
INDEX_FILE = PRODUCTS_DIR / "index.ts"

ASIN_PATTERN = re.compile(r"/dp/(B0[A-Z0-9]{8,10})", re.IGNORECASE)
ASIN_PATTERN2 = re.compile(r"ASIN=([\w]+)", re.IGNORECASE)
ASIN_PATTERN3 = re.compile(r"tag=([\w-]+)", re.IGNORECASE)
ASIN_PATTERN4 = re.compile(r"ref=([\w_]+)", re.IGNORECASE)
AFFILIATE_PATTERNS = [
    (re.compile(r"tag=([\w-]+)", re.IGNORECASE), "affiliate_tag"),
    (re.compile(r"/dp/(B0[A-Z0-9]{8,10})", re.IGNORECASE), "asin_dp"),
    (re.compile(r"ASIN=([\w]+)", re.IGNORECASE), "asin_param"),
    (re.compile(r"ref=([\w_]+)", re.IGNORECASE), "ref_param"),
    (re.compile(r"affiliate", re.IGNORECASE), "affiliate_keyword"),
    (re.compile(r"partner", re.IGNORECASE), "partner_keyword"),
    (re.compile(r"campaign", re.IGNORECASE), "campaign_keyword"),
    (re.compile(r"&si=", re.IGNORECASE), "si_param"),
    (re.compile(r"&s=([a-z]+)", re.IGNORECASE), "s_param"),
]

IDENTIFIER_KEYWORDS = re.compile(r"\b(asin|ASIN|sku|SKU|upc|UPC|eann?|EAN|mpn|MPN|isbn|ISBN)\b")

def extract_buylinks(text: str) -> list[dict]:
    """Extract buyLinks array objects using regex."""
    # Find the buyLinks block: buyLinks: [ ... ]
    match = re.search(r"buyLinks:\s*\[(.*?)\]", text, re.DOTALL)
    if not match:
        return []
    block = match.group(1)

    links = []
    # Match each { store: ..., url: ..., price: ..., ... } object
    obj_pattern = re.compile(r"\{\s*([^}]+)\}", re.DOTALL)
    for obj_match in obj_pattern.finditer(block):
        obj_text = obj_match.group(1)
        store_m = re.search(r"store:\s*\"([^\"]+)\"", obj_text)
        url_m = re.search(r"url:\s*\"([^\"]+)\"", obj_text)
        price_m = re.search(r"price:\s*([\d.]+)", obj_text)
        if store_m and url_m:
            links.append({
                "store": store_m.group(1),
                "url": url_m.group(1),
                "price": float(price_m.group(1)) if price_m else 0,
            })
    return links

def extract_root_field(text: str, field_name: str):
    """Extract a root-level field value, avoiding matches inside array/object blocks."""
    # Remove all array/object blocks first, then search
    cleaned = re.sub(r'(?:specifications|reviews|faq|images|features|pros|cons|alternatives|accessories):\s*\[.*?\]', '', text, flags=re.DOTALL)
    cleaned = re.sub(r'(?:comparison|guide|seo):\s*\{.*?\}', '', cleaned, flags=re.DOTALL)
    # Now match the field at root level
    # Try double-quoted first (with escape support), then single-quoted
    m = re.search(rf'^\s+{field_name}:\s*"((?:[^"\\]|\\.)*)"', cleaned, re.MULTILINE)
    if not m:
        m = re.search(rf"^\s+{field_name}:\s*'([^']*)'", cleaned, re.MULTILINE)
    return m.group(1) if m else None

def extract_product_info(text: str, filename: str) -> dict:
    name_m = extract_root_field(text, "product")
    brand_m = extract_root_field(text, "brand")
    category_m = extract_root_field(text, "category")

    buyLinks = extract_buylinks(text)

    # Check URLs for affiliate/ASIN patterns
    affiliate_urls = []
    for link in buyLinks:
        url = link["url"]
        matches = {}
        for pattern, name in AFFILIATE_PATTERNS:
            m = pattern.search(url)
            if m:
                matches[name] = m.group(0)
        if matches:
            affiliate_urls.append({"store": link["store"], "url": url, "matches": matches})
        elif any(domain in url for domain in ["amazon.com/dp/", "amzn.to", "amazon.com/gp/"]):
            affiliate_urls.append({"store": link["store"], "url": url, "matches": {"potential_asin_path": True}})

    # Check file for identifier keywords
    id_matches = IDENTIFIER_KEYWORDS.findall(text)
    identifier_refs = list(set(id_matches)) if id_matches else []

    return {
        "filename": filename,
        "product_name": name_m if name_m else "???",
        "brand": brand_m if brand_m else "???",
        "category": category_m if category_m else "???",
        "buyLinks_count": len(buyLinks),
        "buyLinks": buyLinks,
        "affiliate_urls": affiliate_urls,
        "identifier_refs": identifier_refs,
    }

def check_file_for_identifiers(filepath: Path) -> dict:
    text = filepath.read_text(encoding="utf-8")
    return extract_product_info(text, filepath.name)

def main():
    product_files = sorted([f for f in PRODUCTS_DIR.glob("*.ts") if f.name not in ("index.ts", "registry.ts")])

    if not product_files:
        print(f"❌ No product .ts files found in {PRODUCTS_DIR}")
        sys.exit(1)

    all_results = []
    for f in product_files:
        info = check_file_for_identifiers(f)
        all_results.append(info)

    print("=" * 120)
    print(f"  PRODUCT IDENTIFIER & AFFILIATE URL AUDIT")
    print(f"  Scanned {len(all_results)} product files in {PRODUCTS_DIR}")
    print("=" * 120)

    print(f"\n{'#':<3} {'Filename':<30} {'Product':<30} {'Brand':<15} {'Category':<18} {'Links':<6} {'Affiliate URLs':<20} {'IDs Found'}")
    print("-" * 140)

    total_links = 0
    total_affiliate = 0
    total_with_identifiers = 0
    products_with_affiliate = []
    products_with_ids = []

    for i, info in enumerate(all_results, 1):
        aff_count = len(info["affiliate_urls"])
        id_count = len(info["identifier_refs"])
        total_links += info["buyLinks_count"]
        total_affiliate += aff_count

        aff_str = f"{'⚠️ ' + str(aff_count) if aff_count > 0 else '✅ 0'}"
        id_str = ", ".join(info["identifier_refs"]) if id_count > 0 else "—"

        if aff_count > 0:
            products_with_affiliate.append(info["filename"])
        if id_count > 0:
            products_with_ids.append(info["filename"])
            total_with_identifiers += 1

        print(f"{i:<3} {info['filename']:<30} {info['product_name']:<30} {info['brand']:<15} {info['category']:<18} {info['buyLinks_count']:<6} {aff_str:<20} {id_str}")

    print("-" * 140)
    print(f"\n📊 SUMMARY")
    print(f"   Total products:  {len(all_results)}")
    print(f"   Total buyLinks:  {total_links}")
    print(f"   Products with affiliate-ready URLs:  {len(products_with_affiliate)}")
    print(f"   Products with identifiers (ASIN/SKU): {total_with_identifiers}")

    print(f"\n🔍 DETAILED URL INSPECTION:")
    print("-" * 120)
    for info in all_results:
        if info["affiliate_urls"]:
            print(f"\n  📁 {info['filename']} — {info['product_name']}")
            for au in info["affiliate_urls"]:
                match_str = "; ".join(f"{k}={v}" for k, v in au["matches"].items())
                print(f"      🏪 {au['store']:<15} 🔗 {au['url']:<55} {match_str}")

    if not products_with_affiliate:
        print("\n  ⚠️  NONE — all buyLinks are generic (no ASINs, affiliate tags, or product-specific paths)")

    print(f"\n🔍 IDENTIFIER KEYWORD SEARCH (asin/sku/upc/earn/mpn/isbn):")
    print("-" * 120)
    if products_with_ids:
        for info in all_results:
            if info["identifier_refs"]:
                print(f"  📁 {info['filename']:<35} found: {', '.join(info['identifier_refs'])}")
    else:
        print("  ⚠️  No ASIN, SKU, UPC, EAN, MPN, or ISBN references found in any file.")

    print(f"\n🔍 CHECKING REGISTRY & INDEX FILES:")
    print("-" * 120)
    for extra_file in [REGISTRY_FILE, INDEX_FILE]:
        if extra_file.exists():
            text = extra_file.read_text(encoding="utf-8")
            id_matches = IDENTIFIER_KEYWORDS.findall(text)
            id_str = ", ".join(sorted(set(id_matches))) if id_matches else "None found"
            print(f"  📄 {extra_file.name:<35} Identifiers: {id_str}")
            # Check buyLinks in these files too
            links = extract_buylinks(text)
            if links:
                print(f"     buyLinks found: {len(links)} (unexpected for non-product file)")
                for l in links:
                    print(f"       {l['store']}: {l['url']}")
        else:
            print(f"  📄 {extra_file.name:<35} FILE NOT FOUND")

    print(f"\n{'=' * 120}")
    print(f"  CONCLUSION:")
    print(f"  - {len(products_with_affiliate)}/{len(all_results)} products have any affiliate identifiers in their URLs")
    print(f"  - {total_with_identifiers}/{len(all_results)} products reference ASIN/SKU/UPC in their file")
    if not products_with_affiliate and not total_with_identifiers:
        print(f"  - 🚨 ALL URLs are GENERIC — no product has affiliate-ready links or identifiers.")
        print(f"  - Recommendation: Add ASINs, SKUs, and affiliate tags to buyLinks.")
    print(f"{'=' * 120}")

if __name__ == "__main__":
    main()

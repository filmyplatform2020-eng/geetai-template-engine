#!/usr/bin/env python3
"""Product Completeness Validator

Checks every product data file against required fields and content depth.
Generates PRODUCT_COMPLETENESS_REPORT.md with per-product and aggregate scores.
"""

import re
import sys
from pathlib import Path
from datetime import datetime

PRODUCTS_DIR = Path("src/data/products")
REPORT_PATH = Path("PRODUCT_COMPLETENESS_REPORT.md")

REQUIRED_FIELDS = [
    "slug", "product", "brand", "tagline", "description",
    "price", "currency", "rating", "reviewCount",
    "images", "features", "pros", "cons",
    "specifications", "reviews", "faq",
    "comparison", "buyLinks",
    "category", "tags",
    "alternatives", "accessories",
    "verdict", "guide", "seo",
]

ARRAY_FIELDS_WITH_MIN = {
    "images": 2,
    "features": 3,
    "pros": 2,
    "cons": 1,
    "specifications": 4,
    "reviews": 3,
    "faq": 2,
    "buyLinks": 1,
    "tags": 2,
    "alternatives": 1,
    "accessories": 0,
}

NESTED_SUBFIELDS = {
    "comparison": ["with", "items"],
    "guide": ["sections"],
    "seo": ["title", "description", "keywords"],
}


def strip_comments(text: str) -> str:
    """Remove JS/TS comments while respecting string literals (http:// inside strings)."""
    result = []
    i = 0
    in_str = False
    str_delim = None
    in_backtick = False
    while i < len(text):
        if in_str:
            if text[i] == '\\':
                result.append(text[i])
                i += 1
                if i < len(text):
                    result.append(text[i])
                    i += 1
                continue
            result.append(text[i])
            if text[i] == str_delim:
                in_str = False
                str_delim = None
            i += 1
            continue
        if in_backtick:
            result.append(text[i])
            if text[i] == '`':
                in_backtick = False
            i += 1
            continue
        if text[i:i+2] == '//':
            i += 2
            while i < len(text) and text[i] != '\n':
                i += 1
            continue
        if text[i:i+2] == '/*':
            i += 2
            while i < len(text) and text[i:i+2] != '*/':
                i += 1
            i += 2
            continue
        if text[i] in ('"', "'"):
            in_str = True
            str_delim = text[i]
        if text[i] == '`':
            in_backtick = True
        result.append(text[i])
        i += 1
    return ''.join(result)


def extract_top_level_object(text: str) -> str | None:
    """Find the top-level Product object after ': Product = {'"""
    m = re.search(r':\s*Product\s*=\s*\{', text)
    if not m:
        return None
    start = m.end() - 1
    depth = 0
    in_str = False
    str_delim = None
    previous_was_backslash = False
    for i, ch in enumerate(text[start:], start):
        if previous_was_backslash:
            previous_was_backslash = False
            continue
        if ch == "\\":
            previous_was_backslash = True
            continue
        if ch in ('"', "'"):
            if in_str and ch == str_delim:
                in_str = False
                str_delim = None
            elif not in_str:
                in_str = True
                str_delim = ch
            continue
        if in_str:
            continue
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return text[start : i + 1]
    return None


def _string_val_re(field: str, quote: str) -> str:
    esc = re.escape
    return rf'(?<!\w){esc(field)}\s*:\s*{esc(quote)}((?:[^{esc(quote)}\\]|\\.)*?){esc(quote)}'


def extract_string_value(body: str, field: str) -> str | None:
    for q in ('"', "'"):
        pat = _string_val_re(field, q)
        m = re.search(pat, body)
        if m:
            return m.group(1)
    return None


def extract_number_value(body: str, field: str) -> float | None:
    pat = rf'(?<!\w){re.escape(field)}\s*:\s*(\d+(?:\.\d+)?)'
    m = re.search(pat, body)
    return float(m.group(1)) if m else None


def _is_escaped(text: str, pos: int) -> bool:
    """Check if char at pos is escaped by odd number of preceding backslashes."""
    count = 0
    i = pos - 1
    while i >= 0 and text[i] == "\\":
        count += 1
        i -= 1
    return count % 2 == 1


def _is_quote(ch: str) -> bool:
    return ch in ('"', "'")


def count_array_braces(body: str, field: str) -> int:
    """Count top-level objects inside an array field by tracking brace depth."""
    pat = rf'(?<!\w){re.escape(field)}\s*:\s*(\[)'
    m = re.search(pat, body)
    if not m:
        return 0
    start = m.start(1)
    depth_brackets = 1
    depth_braces = 0
    items = 0
    in_str = False
    str_delim = None
    in_obj = False

    for i, ch in enumerate(body[start+1:]):
        if in_str and _is_escaped(body, start + 1 + i):
            continue
        if _is_quote(ch):
            if in_str and ch == str_delim:
                in_str = False
                str_delim = None
            elif not in_str:
                in_str = True
                str_delim = ch
            continue
        if in_str:
            continue
        if ch == '[':
            depth_brackets += 1
        elif ch == ']':
            depth_brackets -= 1
            if depth_brackets == 0:
                if in_obj:
                    items += 1
                return items
        elif ch == '{':
            if depth_braces == 0:
                in_obj = True
            depth_braces += 1
        elif ch == '}':
            depth_braces -= 1
            if depth_braces == 0 and in_obj:
                items += 1
                in_obj = False
            elif depth_braces < 0:
                return items
    return items


def count_string_array(body: str, field: str) -> int:
    """Count string items in a string array (like pros, cons, tags)."""
    pat = rf'(?<!\w){re.escape(field)}\s*:\s*(\[)'
    m = re.search(pat, body)
    if not m:
        return 0
    start = m.start(1)
    depth = 1
    in_str = False
    str_delim = None
    prev_bksl = False
    items = 0
    for i, ch in enumerate(body[start+1:]):
        if prev_bksl:
            prev_bksl = False
            continue
        if ch == chr(92):
            prev_bksl = True
            continue
        if _is_quote(ch):
            if in_str and ch == str_delim:
                in_str = False
                str_delim = None
                items += 1
            elif not in_str:
                in_str = True
                str_delim = ch
            continue
        if in_str:
            continue
        if ch == '[':
            depth += 1
        elif ch == ']':
            depth -= 1
            if depth == 0:
                return items
    return items


def count_object_array(body: str, field: str) -> int:
    """Count objects in an object array (like features, reviews, images)."""
    return count_array_braces(body, field)


def validate_product(filepath: Path) -> dict:
    raw = filepath.read_text(encoding="utf-8")
    text = strip_comments(raw)
    obj = extract_top_level_object(text)

    if obj is None:
        return {
            "slug": filepath.stem,
            "file": filepath.name,
            "product_name": filepath.stem,
            "score": 0,
            "missing_fields": ["<could not parse object>"],
            "thin_fields": [],
            "total_ok": 0,
            "total_missing": 1,
            "total_thin": 0,
            "total_fields": len(REQUIRED_FIELDS),
            "details": {},
            "issues": ["Parse error"],
        }

    slug = extract_string_value(obj, "slug") or filepath.stem
    product_name = extract_string_value(obj, "product") or slug.replace("-", " ").title()

    results = {}
    missing_fields = []
    thin_fields = []
    ok_fields = []
    score = 100

    for field in REQUIRED_FIELDS:
        if field in ARRAY_FIELDS_WITH_MIN:
            # check if the field exists at all
            if re.search(rf'(?<!\w){re.escape(field)}\s*:', obj):
                min_required = ARRAY_FIELDS_WITH_MIN[field]
                if field in ("pros", "cons", "tags"):
                    count = count_string_array(obj, field)
                elif field in ("features", "images", "specifications", "reviews", "faq", "alternatives", "accessories"):
                    count = count_object_array(obj, field)
                elif field in ("buyLinks",):
                    count = count_object_array(obj, field)
                else:
                    count = count_string_array(obj, field)

                if count < min_required:
                    thin_fields.append(field)
                    score -= 3
                    results[field] = {"status": "thin", "count": count, "min": min_required}
                else:
                    results[field] = {"status": "ok", "count": count}
                    ok_fields.append(field)
            else:
                missing_fields.append(field)
                score -= 5
                results[field] = {"status": "missing"}
        elif field in NESTED_SUBFIELDS:
            if not re.search(rf'(?<!\w){re.escape(field)}\s*:', obj):
                missing_fields.append(field)
                score -= 5
                results[field] = {"status": "missing"}
            else:
                missing_sub = []
                for sub in NESTED_SUBFIELDS[field]:
                    if not re.search(rf'(?<!\w){re.escape(sub)}\s*:', obj):
                        missing_sub.append(sub)
                if missing_sub:
                    results[field] = {"status": "partial", "missing": missing_sub}
                    score -= len(missing_sub) * 2
                else:
                    results[field] = {"status": "ok"}
                    ok_fields.append(field)
        else:
            has_value = False
            string_val = extract_string_value(obj, field)
            num_val = extract_number_value(obj, field)
            if string_val is not None:
                has_value = True
            elif num_val is not None:
                has_value = True
            elif re.search(rf'(?<!\w){re.escape(field)}\s*:\s*(true|false)', obj):
                has_value = True

            if has_value:
                results[field] = {"status": "ok"}
                ok_fields.append(field)
            else:
                missing_fields.append(field)
                score -= 5
                results[field] = {"status": "missing"}

    score = max(0, score)
    issues = missing_fields[:]
    for f in thin_fields:
        d = results[f]
        issues.append(f"{f}({d.get('count', '?')}/{ARRAY_FIELDS_WITH_MIN[f]})")

    return {
        "slug": slug,
        "file": filepath.name,
        "product_name": product_name,
        "score": score,
        "missing_fields": missing_fields,
        "thin_fields": thin_fields,
        "total_ok": len(ok_fields),
        "total_missing": len(missing_fields),
        "total_thin": len(thin_fields),
        "total_fields": len(REQUIRED_FIELDS),
        "details": results,
        "issues": issues,
    }


def main():
    ts_files = sorted(PRODUCTS_DIR.glob("*.ts"))
    ts_files = [f for f in ts_files if f.name not in ("index.ts", "registry.ts")]

    if not ts_files:
        print("No product files found.")
        sys.exit(1)

    results = []
    for fp in ts_files:
        r = validate_product(fp)
        results.append(r)

    results.sort(key=lambda x: x["score"])

    avg_score = sum(r["score"] for r in results) / len(results)
    total_missing = sum(r["total_missing"] for r in results)
    total_thin = sum(r["total_thin"] for r in results)
    total_issues = total_missing + total_thin

    lines = []
    grade_ranges = [
        ("A+", 97, 101), ("A", 92, 97), ("A-", 85, 92),
        ("B+", 78, 85), ("B", 70, 78), ("C", 60, 70),
        ("D", 40, 60), ("F", 0, 40),
    ]

    def grade(s):
        for g, lo, hi in grade_ranges:
            if lo <= s < hi:
                return g
        return "F"

    lines.append("# Product Completeness Report")
    lines.append("")
    lines.append(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    lines.append(f"**Products Checked:** {len(results)}")
    lines.append(f"**Average Score:** {avg_score:.1f}%")
    lines.append(f"**Total Issues:** {total_issues} ({total_missing} missing + {total_thin} thin)")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## Summary by Product")
    lines.append("")
    lines.append("| # | Product | Score | Missing | Thin | Issues |")
    lines.append("|---|---------|-------|---------|------|--------|")

    for i, r in enumerate(results, 1):
        name = r["product_name"]
        issues_str = ", ".join(r["issues"][:5])
        if len(r["issues"]) > 5:
            issues_str += f" +{len(r['issues'])-5} more"
        lines.append(
            f"| {i} | {name} | {r['score']}% ({grade(r['score'])}) | "
            f"{r['total_missing']} | {r['total_thin']} | {issues_str or '—'} |"
        )

    lines.append("")
    lines.append("## Grade Distribution")
    lines.append("")
    grade_counts = {}
    for r in results:
        g = grade(r["score"])
        grade_counts[g] = grade_counts.get(g, 0) + 1
    for g, _, _ in grade_ranges:
        c = grade_counts.get(g, 0)
        if c > 0:
            lines.append(f"- **{g}**: {'█' * c} ({c})")

    lines.append("")
    lines.append("---")
    lines.append("## Per-Product Breakdown\n")
    for l in ("**Scoring:**", "- Missing required field → -5 pts",
              "- Array below minimum depth → -3 pts",
              "- Missing nested sub-field → -2 pts"):
        lines.append(f"  {l}")
    lines.append("")

    for r in results:
        name = r["product_name"]
        lines.append(f"### {name} ({r['score']}% — {grade(r['score'])})")
        lines.append("")
        lines.append(f"**File:** `{r['file']}`")
        if r["missing_fields"]:
            lines.append("\n**❌ Missing Fields:**")
            for f in r["missing_fields"]:
                lines.append(f"  - `{f}`")
        if r["thin_fields"]:
            lines.append("\n**⚠️ Thin Arrays:**")
            for f in r["thin_fields"]:
                d = r["details"][f]
                lines.append(f"  - `{f}`: {d.get('count', '?')} items (min: {d.get('min', '?')})")
        if not r["missing_fields"] and not r["thin_fields"]:
            lines.append("\n  ✅ All checks passed.")
        lines.append("")

    REPORT_PATH.write_text("\n".join(lines), encoding="utf-8")
    print(f"Report written to {REPORT_PATH}")
    print(f"\nAverage score: {avg_score:.1f}%")
    print(f"Total issues: {total_issues} ({total_missing} missing + {total_thin} thin)")
    print(f"\nLowest scored products:")
    for r in results[:5]:
        issues = r["issues"][:5]
        print(f"  {r['product_name']}: {r['score']}% — {', '.join(issues) if issues else 'ok'}")


if __name__ == "__main__":
    main()

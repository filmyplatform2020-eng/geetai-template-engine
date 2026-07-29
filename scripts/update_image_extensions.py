#!/usr/bin/env python3
"""Update all product data files: .jpg -> .svg in image src paths."""
import os, glob

PRODUCTS_DIR = os.path.join(os.path.dirname(__file__), "..", "src", "data", "products")

for filepath in glob.glob(os.path.join(PRODUCTS_DIR, "*.ts")):
    with open(filepath, "r") as f:
        content = f.read()
    old = content
    content = content.replace('.jpg"', '.svg"')
    content = content.replace(".jpg'", ".svg'")
    if content != old:
        with open(filepath, "w") as f:
            f.write(content)
        print(f"Updated: {os.path.basename(filepath)}")
    else:
        print(f"No changes: {os.path.basename(filepath)}")

print("Done!")

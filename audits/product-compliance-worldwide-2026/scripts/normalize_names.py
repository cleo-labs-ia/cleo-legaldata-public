#!/usr/bin/env python3
"""Normalize product_name per product_id in master-consolidated.csv."""
import csv
from pathlib import Path

ROOT = Path("/Users/naomiehalioua/cleo-legaldata-public/audits/product-compliance-worldwide-2026")
CSV_PATH = ROOT / "data/master-consolidated.csv"

CANONICAL = {
    "1": "Shampoo & Hair Care",
    "2": "Sunscreen & Sun Care",
    "3": "Smartphones & Mobile",
    "4": "Stuffed Toys (0-3 years)",
    "5": "Adhesive Bandages (Class I)",
    "6": "E-cigarettes & Vaping",
    "7": "Laundry Detergent Pods",
    "8": "Dietary Supplements",
    "9": "Athletic Apparel & Textile",
    "10": "Bicycle Helmets (PPE)",
    "11": "Wine & Spirits",
    "12": "Fresh Meat (Animal Food)",
    "13": "OTC Pharmaceuticals",
    "14": "Tyres & Automotive",
    "15": "Household Insecticides",
    "16": "Consumer Drones",
    "17": "Smart Connected Appliances",
    "18": "Dental Implants (Class III)",
    "19": "Interior Paints & Coatings",
    "20": "Pet Food",
}

rows = list(csv.DictReader(CSV_PATH.open()))
header = list(rows[0].keys())
changed = 0
for r in rows:
    pid = r["product_id"]
    canonical = CANONICAL.get(pid)
    if canonical and r["product_name"] != canonical:
        r["product_name"] = canonical
        changed += 1

with CSV_PATH.open("w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=header)
    w.writeheader()
    for r in rows:
        w.writerow(r)
print(f"Normalized {changed} rows in {CSV_PATH.name} (total {len(rows)})")

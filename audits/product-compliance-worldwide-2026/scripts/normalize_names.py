#!/usr/bin/env python3
"""Normalize product_name per product_id in master-consolidated.csv."""
import csv
from pathlib import Path

ROOT = Path("/Users/naomiehalioua/cleo-legaldata-public/audits/product-compliance-worldwide-2026")
CSV_PATH = ROOT / "data/master-consolidated.csv"

CANONICAL = {
    "1": "Shampoing",
    "2": "Crème solaire",
    "3": "Smartphone",
    "4": "Peluche bébé 0-3 ans",
    "5": "Pansement adhésif",
    "6": "Vape / e-cigarette",
    "7": "Capsule lessive (pod)",
    "8": "Complément alimentaire vitamines",
    "9": "Legging sport synthétique",
    "10": "Casque vélo adulte",
    "11": "Bouteille de vin",
    "12": "Steak emballé (viande fraîche)",
    "13": "Paracétamol OTC",
    "14": "Pneumatique voiture",
    "15": "Insecticide spray maison",
    "16": "Drone grand public",
    "17": "Robot aspirateur connecté",
    "18": "Implant dentaire",
    "19": "Peinture déco intérieure",
    "20": "Croquettes pour chien",
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

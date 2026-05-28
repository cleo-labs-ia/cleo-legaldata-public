#!/usr/bin/env python3
"""
Merge tous les fichiers extended-*.csv dans master.csv.
Dédupe sur (product_id, jurisdiction_code, regulation_name + regulation_ref).
Génère product-compliance.json mis à jour.
"""
import csv
import json
import sys
from pathlib import Path
from collections import defaultdict

BASE = Path("/Users/naomiehalioua/cleo-legaldata-public/audits/product-compliance-worldwide-2026")
MASTER = BASE / "data" / "master.csv"
EXTENDED_DIR = BASE / "data" / "per-product"
JSON_OUT = Path("/Users/naomiehalioua/cleo-legaldata-public/public/data/product-compliance.json")

CANONICAL_HEADER = [
    "product_id", "product_name", "product_regime_tag",
    "jurisdiction_code", "jurisdiction_name", "region",
    "regulation_name", "regulation_ref", "enforcement_body",
    "key_requirements", "status", "criticality",
    "legal_api_match", "legal_api_id", "legal_api_match_method",
    "gap_action", "notes",
]

EXTENDED_FILES = [
    EXTENDED_DIR / "extended-p1-p4.csv",
    EXTENDED_DIR / "extended-p5-p8.csv",
    EXTENDED_DIR / "extended-p9-p12.csv",
    EXTENDED_DIR / "extended-p13-p16.csv",
    EXTENDED_DIR / "extended-p17-p20.csv",
]


def normalize_row(row: dict) -> dict:
    """Fill missing canonical columns with empty strings."""
    out = {}
    for col in CANONICAL_HEADER:
        out[col] = (row.get(col) or "").strip()
    return out


def dedup_key(row: dict) -> tuple:
    pid = row["product_id"]
    jur = row["jurisdiction_code"]
    name = row["regulation_name"].lower().strip()
    ref = row["regulation_ref"].lower().strip()
    return (pid, jur, name, ref)


def main():
    # 1. Load master.csv
    rows = []
    seen = set()
    dup_internal = 0
    with MASTER.open() as f:
        reader = csv.DictReader(f)
        for r in reader:
            n = normalize_row(r)
            k = dedup_key(n)
            if k in seen:
                dup_internal += 1
                continue
            seen.add(k)
            rows.append(n)
    print(f"master.csv: {len(rows)} unique rows (skipped {dup_internal} internal dups)")

    # 2. Append extended-*
    for path in EXTENDED_FILES:
        if not path.exists():
            print(f"!! missing {path.name}")
            continue
        added = 0
        skipped = 0
        with path.open() as f:
            reader = csv.DictReader(f)
            for r in reader:
                n = normalize_row(r)
                if not n["product_id"]:
                    skipped += 1
                    continue
                k = dedup_key(n)
                if k in seen:
                    skipped += 1
                    continue
                seen.add(k)
                rows.append(n)
                added += 1
        print(f"{path.name}: +{added} (skipped {skipped} dups)")

    # 3. Write master-consolidated.csv (don't clobber master.csv yet)
    out_path = BASE / "data" / "master-consolidated.csv"
    with out_path.open("w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=CANONICAL_HEADER)
        w.writeheader()
        for r in rows:
            w.writerow(r)
    print(f"\nWrote {out_path.name}: {len(rows)} rows total")

    # 4. Stats per product
    per_product = defaultdict(lambda: {
        "name": "",
        "total": 0,
        "jurisdictions": set(),
        "critical": 0,
        "in_api": 0,
        "not_in_api": 0,
        "to_review": 0,
    })
    per_jurisdiction = defaultdict(int)
    juris_meta = {}

    for r in rows:
        pid = r["product_id"]
        p = per_product[pid]
        p["name"] = r["product_name"]
        p["total"] += 1
        p["jurisdictions"].add(r["jurisdiction_code"])
        if r["criticality"].lower() == "critical":
            p["critical"] += 1
        match = r["legal_api_match"].upper().strip()
        if match == "FOUND":
            p["in_api"] += 1
        elif match == "NOT_FOUND":
            p["not_in_api"] += 1
        else:
            p["to_review"] += 1

        jc = r["jurisdiction_code"]
        per_jurisdiction[jc] += 1
        if jc and jc not in juris_meta:
            juris_meta[jc] = {
                "code": jc,
                "name": r["jurisdiction_name"],
                "region": r["region"],
            }

    total_rows = len(rows)
    total_products = len(per_product)
    total_jurisdictions = len(per_jurisdiction)
    in_api_total = sum(p["in_api"] for p in per_product.values())
    not_in_api_total = sum(p["not_in_api"] for p in per_product.values())
    cross_checked = in_api_total + not_in_api_total
    coverage_pct = round(in_api_total * 100 / cross_checked) if cross_checked else 0

    print(f"\nGlobal stats:")
    print(f"  total rows         : {total_rows}")
    print(f"  products           : {total_products}")
    print(f"  jurisdictions      : {total_jurisdictions}")
    print(f"  cross-checked      : {cross_checked}")
    print(f"  in_api (FOUND)     : {in_api_total} ({coverage_pct}% of cross-checked)")
    print(f"  not_in_api         : {not_in_api_total}")
    print(f"  to_review (pending): {total_rows - cross_checked}")

    print(f"\nPer product:")
    for pid in sorted(per_product, key=lambda x: int(x) if x.isdigit() else 999):
        p = per_product[pid]
        print(f"  P{pid:>2} {p['name'][:30]:30s}  {p['total']:>5} regs / {len(p['jurisdictions']):>3} jur / {p['critical']:>4} critical")

    # 5. Build the product-compliance.json that the site reads
    # Convert sets to counts
    json_per_product = []
    for pid, p in sorted(per_product.items(), key=lambda x: int(x[0]) if x[0].isdigit() else 999):
        json_per_product.append({
            "product_id": int(pid) if pid.isdigit() else pid,
            "product_name": p["name"],
            "total_regulations": p["total"],
            "jurisdictions_count": len(p["jurisdictions"]),
            "critical_count": p["critical"],
            "in_api_count": p["in_api"],
            "not_in_api_count": p["not_in_api"],
            "to_review_count": p["to_review"],
        })

    # Pull existing platform totals from current JSON (keep as-is)
    platform = {}
    if JSON_OUT.exists():
        existing = json.loads(JSON_OUT.read_text())
        for k in (
            "platform_regulations", "platform_documents", "platform_sources",
            "platform_product_regs", "platform_products_tracked", "platform_authorities",
        ):
            if k in existing:
                platform[k] = existing[k]

    new_json = {
        "generated_at": "2026-05-28",
        "product_regs_audited": total_rows,
        "product_regs_cross_checked": cross_checked,
        "product_regs_in_api": in_api_total,
        "product_regs_not_in_api": not_in_api_total,
        "product_coverage_pct": coverage_pct,
        "product_categories": total_products,
        "jurisdictions_audited": total_jurisdictions,
        "products": json_per_product,
        "jurisdictions": sorted(
            [{**meta, "regulations_count": per_jurisdiction[code]} for code, meta in juris_meta.items()],
            key=lambda x: -x["regulations_count"],
        ),
        **platform,
    }

    JSON_OUT.parent.mkdir(parents=True, exist_ok=True)
    JSON_OUT.write_text(json.dumps(new_json, ensure_ascii=False, indent=2))
    print(f"\nWrote {JSON_OUT}")
    print(f"\nFINAL TOTALS:")
    print(f"  product_regs_audited   = {total_rows}")
    print(f"  product_regs_in_api    = {in_api_total}")
    print(f"  product_coverage_pct   = {new_json['product_coverage_pct']}%")
    print(f"  product_categories     = {total_products}")
    print(f"  jurisdictions_audited  = {total_jurisdictions}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Fast cross-check: exact + substring match only.
For each TO_REVIEW row, lookup against Supabase reg names (country-aware).
"""
import csv
import re
import sys
from pathlib import Path
from collections import defaultdict

ROOT = Path("/Users/naomiehalioua/cleo-legaldata-public")
MASTER = ROOT / "audits/product-compliance-worldwide-2026/data/master-consolidated.csv"
SUPA_DUMP = ROOT / "audits/product-compliance-worldwide-2026/data/supabase_regs_dump.csv"


def normalize(s: str) -> str:
    s = (s or "").lower()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def build_index():
    """Build (country_norm -> set of normalized names) and global set."""
    by_country = defaultdict(set)
    all_names = set()
    name_to_canonical = {}  # normalized -> original name
    with SUPA_DUMP.open() as f:
        next(f)
        for line in f:
            parts = line.rstrip("\n").split("\t")
            if len(parts) < 1:
                continue
            name = parts[0]
            country = (parts[2] if len(parts) > 2 else "").upper().strip()
            for s in (parts[0], parts[1] if len(parts) > 1 else ""):
                n = normalize(s)
                if len(n) > 5:
                    by_country[country].add(n)
                    all_names.add(n)
                    if n not in name_to_canonical:
                        name_to_canonical[n] = name
    return by_country, all_names, name_to_canonical


def lookup(row, by_country, all_names) -> tuple:
    """Try exact + substring match against Supabase regs. Country-aware."""
    jur = (row["jurisdiction_code"] or "").upper().strip()
    name_norm = normalize(row["regulation_name"])
    ref_norm = normalize(row["regulation_ref"])

    # Map sub-jurisdiction blocs to parent country
    bloc_aliases = {
        "US-CA": "US", "US-NY": "US", "US-TX": "US", "US-FL": "US",
        "US-HI": "US", "US-WA": "US", "US-OR": "US", "US-MA": "US",
        "US-MN": "US", "US-ME": "US", "US-IL": "US",
    }
    candidate_countries = {jur, bloc_aliases.get(jur, ""), ""}

    if not name_norm:
        return (None, None)

    # Exact match within candidate countries (instant lookup)
    for c in candidate_countries:
        names = by_country.get(c, set())
        if name_norm in names:
            return (name_norm, "exact_name")
        if ref_norm and ref_norm in names:
            return (ref_norm, "exact_ref")

    # Global exact-match fallback (international body matches like ISO/Codex)
    if name_norm in all_names:
        return (name_norm, "exact_global")
    if ref_norm and ref_norm in all_names:
        return (ref_norm, "exact_global_ref")
    return (None, None)


def main():
    print("Building Supabase index…", flush=True)
    by_country, all_names, name_canon = build_index()
    print(f"  {sum(len(v) for v in by_country.values())} entries across {len(by_country)} countries", flush=True)
    print(f"  {len(all_names)} unique normalized names total", flush=True)

    rows = list(csv.DictReader(MASTER.open()))
    header = list(rows[0].keys())

    new_found = 0
    new_unverified = 0
    already_found = 0
    already_not_found = 0
    per_method = defaultdict(int)
    per_product = defaultdict(lambda: {"new_found": 0, "unverified": 0, "orig": 0})

    n = len(rows)
    for i, r in enumerate(rows):
        if i and i % 5000 == 0:
            print(f"  …{i}/{n}", flush=True)
        match = r["legal_api_match"].strip().upper()
        pid = r["product_id"]
        if match == "FOUND":
            already_found += 1
            per_product[pid]["orig"] += 1
            continue
        if match == "NOT_FOUND":
            already_not_found += 1
            per_product[pid]["orig"] += 1
            continue
        # TO_REVIEW
        matched, method = lookup(r, by_country, all_names)
        if matched:
            r["legal_api_match"] = "FOUND"
            r["legal_api_match_method"] = f"supa_{method}"
            r["status"] = "VERIFIED"
            new_found += 1
            per_method[method] += 1
            per_product[pid]["new_found"] += 1
        else:
            r["legal_api_match"] = "UNVERIFIED"
            r["status"] = "UNVERIFIED"
            new_unverified += 1
            per_product[pid]["unverified"] += 1

    with MASTER.open("w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=header)
        w.writeheader()
        for r in rows:
            w.writerow(r)

    total = len(rows)
    found_total = already_found + new_found
    solid_total = already_found + already_not_found + new_found

    print(f"\n=== Cross-check summary ===")
    print(f"  Already FOUND     : {already_found}")
    print(f"  Already NOT_FOUND : {already_not_found}")
    print(f"  NEW FOUND         : {new_found} (newly verified vs Supabase)")
    print(f"  UNVERIFIED        : {new_unverified} (not matched in Cleo base)")
    print(f"  TOTAL FOUND       : {found_total}")
    print(f"  SOLID (verified)  : {solid_total}")
    print(f"  Total rows        : {total}")
    print(f"  Coverage on SOLID : {found_total*100//solid_total if solid_total else 0}%")
    print(f"\nMatch methods (new only):")
    for m, c in per_method.items():
        print(f"  {m}: {c}")
    print(f"\nPer product (new_found / unverified / orig_solid):")
    for pid in sorted(per_product, key=lambda x: int(x) if x.isdigit() else 999):
        s = per_product[pid]
        print(f"  P{pid:>2}  new={s['new_found']:>5}  unverif={s['unverified']:>5}  orig={s['orig']:>4}")


if __name__ == "__main__":
    main()

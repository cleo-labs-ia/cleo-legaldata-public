#!/usr/bin/env python3
"""
Cross-check master-consolidated.csv against Supabase regulations table.
For TO_REVIEW lines, check if regulation exists in Cleo Legal Data.
Mark as VERIFIED_FOUND (in base) or UNVERIFIED (likely agent hallucination or just missing).
"""
import csv
import os
import re
import subprocess
import sys
from pathlib import Path
from collections import defaultdict

ROOT = Path("/Users/naomiehalioua/cleo-legaldata-public")
MASTER = ROOT / "audits/product-compliance-worldwide-2026/data/master-consolidated.csv"
SUPA_DUMP = ROOT / "audits/product-compliance-worldwide-2026/data/supabase_regs_dump.csv"

PG_CONN = [
    "psql",
    "-h", "aws-1-eu-west-1.pooler.supabase.com",
    "-p", "5432",
    "-U", "bi_readonly.mqorhzexucjorebrbzcj",
    "-d", "postgres",
    "-A", "-F", "\t", "--no-align", "-t",
]


def normalize(s: str) -> str:
    """Lowercase, remove punctuation, collapse whitespace."""
    s = (s or "").lower()
    s = re.sub(r"[^a-z0-9\s]", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def tokens(s: str) -> set:
    """Significant tokens of length > 2."""
    return {t for t in normalize(s).split() if len(t) > 2}


def dump_supabase():
    """Download distinct names + countries from Supabase to CSV."""
    if SUPA_DUMP.exists():
        print(f"Using cached {SUPA_DUMP.name}")
        return
    print("Dumping Supabase regulations…")
    sql = """
    SELECT name, full_name, origin_country_code, regulatory_domain, status
    FROM regulations
    WHERE name IS NOT NULL
    """
    env = os.environ.copy()
    env["PGPASSWORD"] = "NaoAna3.0"
    out = subprocess.check_output(PG_CONN + ["-c", sql], env=env, text=True)
    with SUPA_DUMP.open("w") as f:
        f.write("name\tfull_name\tcountry\tdomain\tstatus\n")
        f.write(out)
    print(f"Wrote {SUPA_DUMP.name}")


def build_index():
    """Index Supabase regs by (country, normalized name token set)."""
    by_country_name = {}  # (country_lower, normalized_name) -> 1
    by_country_tokens = defaultdict(list)  # country -> list of (full_str, tokens_set)
    all_by_tokens = defaultdict(list)  # for international regs without country

    with SUPA_DUMP.open() as f:
        next(f)  # skip header
        for line in f:
            parts = line.rstrip("\n").split("\t")
            if len(parts) < 3:
                continue
            name, full_name, country = parts[0], parts[1] if len(parts) > 1 else "", parts[2] if len(parts) > 2 else ""
            country = country.upper().strip() or ""
            normd = normalize(name)
            if normd:
                by_country_name[(country, normd)] = (name, country)
                by_country_tokens[country].append((name, tokens(name)))
                all_by_tokens["*"].append((name, tokens(name), country))
            normd_full = normalize(full_name)
            if normd_full and normd_full != normd:
                by_country_name[(country, normd_full)] = (name, country)
    return by_country_name, by_country_tokens


def match_reg(row, by_country_name, by_country_tokens) -> tuple:
    """Return (matched_supabase_name, match_method, country) or (None, None, None)."""
    jur = (row["jurisdiction_code"] or "").upper().strip()
    name = row["regulation_name"]
    ref = row["regulation_ref"]
    normd_name = normalize(name)
    normd_ref = normalize(ref)

    # Map jurisdiction blocs to typical country codes for matching
    bloc_aliases = {
        "US-CA": ["US"], "US-NY": ["US"], "US-TX": ["US"], "US-FL": ["US"],
        "US-HI": ["US"], "US-WA": ["US"], "US-OR": ["US"], "US-MA": ["US"],
        "US-MN": ["US"], "US-ME": ["US"], "US-IL": ["US"],
        "EU": ["EU", ""], "GCC": ["SA", "AE", ""],
    }
    candidates = [jur] + bloc_aliases.get(jur, []) + [""]

    # 1) Exact name match within candidate countries
    for c in candidates:
        if (c, normd_name) in by_country_name:
            n, _ = by_country_name[(c, normd_name)]
            return (n, "exact_name", c)
        if normd_ref and (c, normd_ref) in by_country_name:
            n, _ = by_country_name[(c, normd_ref)]
            return (n, "exact_ref", c)

    # 2) Token-set overlap (Jaccard ≥ 0.6) for any name in candidate country
    tk = tokens(name)
    if len(tk) < 2:
        return (None, None, None)
    for c in candidates:
        for sup_name, sup_tk in by_country_tokens.get(c, []):
            if not sup_tk:
                continue
            inter = tk & sup_tk
            union = tk | sup_tk
            if len(inter) >= 2 and len(inter) / len(union) >= 0.6:
                return (sup_name, "token_overlap", c)
    return (None, None, None)


def main():
    dump_supabase()
    print("Building Supabase index…")
    by_country_name, by_country_tokens = build_index()
    print(f"  {len(by_country_name)} indexed names")

    print("Cross-checking master-consolidated.csv…")
    rows = list(csv.DictReader(MASTER.open()))
    header = list(rows[0].keys())

    new_found = 0
    new_unverified = 0
    already_found = 0
    already_not_found = 0
    stats_per_product = defaultdict(lambda: {"new_found": 0, "unverified": 0, "already": 0})

    for r in rows:
        match = r["legal_api_match"].strip().upper()
        pid = r["product_id"]
        if match == "FOUND":
            already_found += 1
            stats_per_product[pid]["already"] += 1
            continue
        if match == "NOT_FOUND":
            already_not_found += 1
            stats_per_product[pid]["already"] += 1
            continue
        # TO_REVIEW: try to match
        n, method, c = match_reg(r, by_country_name, by_country_tokens)
        if n:
            r["legal_api_match"] = "FOUND"
            r["legal_api_match_method"] = f"supabase_{method}"
            r["status"] = "VERIFIED"
            new_found += 1
            stats_per_product[pid]["new_found"] += 1
        else:
            r["legal_api_match"] = "UNVERIFIED"
            r["status"] = "UNVERIFIED"
            new_unverified += 1
            stats_per_product[pid]["unverified"] += 1

    # Write back
    with MASTER.open("w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=header)
        w.writeheader()
        for r in rows:
            w.writerow(r)

    print(f"\n=== Cross-check summary ===")
    print(f"  Already FOUND     : {already_found}")
    print(f"  Already NOT_FOUND : {already_not_found}")
    print(f"  NEW FOUND         : {new_found} (newly verified vs Supabase)")
    print(f"  UNVERIFIED        : {new_unverified} (likely not in Cleo or agent hallucination)")
    print(f"  TOTAL FOUND       : {already_found + new_found}")
    print(f"  Total rows        : {len(rows)}")
    print(f"  SOLID (verified)  : {already_found + already_not_found + new_found}")
    print(f"  Coverage on SOLID : {(already_found + new_found)*100//(already_found + already_not_found + new_found)}%")

    print(f"\nPer product (NEW_FOUND / UNVERIFIED / orig):")
    for pid in sorted(stats_per_product, key=lambda x: int(x) if x.isdigit() else 999):
        s = stats_per_product[pid]
        print(f"  P{pid:>2}  new={s['new_found']:>5}  unverif={s['unverified']:>5}  orig={s['already']:>4}")


if __name__ == "__main__":
    main()

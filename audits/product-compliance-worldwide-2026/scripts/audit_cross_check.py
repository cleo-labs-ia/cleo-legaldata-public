#!/usr/bin/env python3
"""
audit_cross_check.py — Cross-check master.csv against Cleo Legal Data API.

Tag each row with legal_api_match (FOUND/PARTIAL/NOT_FOUND), legal_api_id,
legal_api_match_method, and gap_action via 3-pass matching:
  1. exact_ref — normalized regulation_ref containment
  2. fuzzy_name — Levenshtein ratio ≥ 0.85 on names
  3. contextual — region + regulatory_domain match (PARTIAL)

USAGE:
    python audit_cross_check.py \\
        --input data/master.csv \\
        --output data/master.csv \\
        --api-dump data/legal-api-dump.json
"""

import argparse
import csv
import json
import re
import sys
from pathlib import Path
from difflib import SequenceMatcher


_PREFIX_RE = re.compile(
    r"^(regulation|directive|reg\.?|dir\.?)\s+",
    re.IGNORECASE,
)
_BLOC_RE = re.compile(
    r"^\(?(ec|eu|eec|cee|ce)\)?\s+(no\.?\s+)?",
    re.IGNORECASE,
)


def normalize_ref(ref: str) -> str:
    """Normalize a regulation reference for exact-style matching.

    Examples:
        "(EC) No 1223/2009" -> "1223/2009"
        "Regulation EU 2017/745" -> "2017/745"
        "Directive 2014/53/EU" -> "2014/53/eu"
        "21 CFR Part 700" -> "21 cfr part 700"
    """
    if not ref:
        return ""
    s = _PREFIX_RE.sub("", ref)
    s = _BLOC_RE.sub("", s)
    s = " ".join(s.split())
    return s.strip().lower()


def fuzzy_score(a: str, b: str) -> float:
    if not a or not b:
        return 0.0
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def load_legal_api_dump(path: Path) -> list[dict]:
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    if isinstance(data, dict):
        return data.get("regulations") or data.get("data") or []
    return data


def find_match(csv_row: dict, api_regs: list[dict]) -> tuple[str, str, str]:
    """Return (match_status, api_id, method)."""
    csv_ref = normalize_ref(csv_row.get("regulation_ref", ""))
    csv_name = (csv_row.get("regulation_name") or "").lower()
    csv_region = (csv_row.get("region") or "").lower()
    csv_regime = (csv_row.get("product_regime_tag") or "").lower()

    # Pass 1: exact ref match
    if csv_ref:
        for r in api_regs:
            api_ref_full = normalize_ref(r.get("full_name") or "")
            api_ref_short = normalize_ref(r.get("name") or "")
            if api_ref_full and csv_ref in api_ref_full:
                return "FOUND", r["id"], "exact_ref"
            if api_ref_short and csv_ref in api_ref_short:
                return "FOUND", r["id"], "exact_ref"

    # Pass 2: fuzzy name match
    best_score = 0.0
    best_id = None
    for r in api_regs:
        api_text = ((r.get("name") or "") + " " + (r.get("full_name") or "")).lower()
        if not api_text.strip():
            continue
        score = fuzzy_score(csv_name, api_text)
        if score > best_score:
            best_score = score
            best_id = r["id"]
    if best_score >= 0.85 and best_id:
        return "FOUND", best_id, "fuzzy_name"

    # Pass 3: contextual
    regime_keywords = [k.strip() for k in csv_regime.split("+") if k.strip()]
    for r in api_regs:
        api_region = (r.get("region") or "").lower()
        api_domain = (r.get("regulatory_domain") or "").lower()
        if not api_region or not api_domain:
            continue
        region_match = (
            csv_region and (csv_region in api_region or api_region in csv_region)
        )
        if not region_match:
            continue
        if any(kw in api_domain for kw in regime_keywords if kw):
            return "PARTIAL", r["id"], "contextual"

    return "NOT_FOUND", "", ""


def gap_action_for(status: str) -> str:
    if status == "FOUND":
        return "OK"
    if status == "PARTIAL":
        return "À enrichir"
    return "À ajouter"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--api-dump", required=True)
    args = parser.parse_args()

    api_regs = load_legal_api_dump(Path(args.api_dump))
    print(f"Loaded {len(api_regs)} regulations from Legal API dump", file=sys.stderr)

    with open(args.input, encoding="utf-8") as f_in:
        reader = csv.DictReader(f_in)
        # Filter out None keys that can appear when the CSV has a trailing comma
        fieldnames = [f for f in reader.fieldnames if f is not None]
        rows = list(reader)

    counts = {"FOUND": 0, "PARTIAL": 0, "NOT_FOUND": 0}
    for row in rows:
        status, api_id, method = find_match(row, api_regs)
        row["legal_api_match"] = status
        row["legal_api_id"] = api_id
        row["legal_api_match_method"] = method
        row["gap_action"] = gap_action_for(status)
        counts[status] += 1

    with open(args.output, "w", encoding="utf-8", newline="") as f_out:
        writer = csv.DictWriter(f_out, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)

    total = len(rows)
    if total > 0:
        print(
            f"Cross-check complete: "
            f"{counts['FOUND']}/{total} FOUND ({100*counts['FOUND']/total:.1f}%), "
            f"{counts['PARTIAL']}/{total} PARTIAL ({100*counts['PARTIAL']/total:.1f}%), "
            f"{counts['NOT_FOUND']}/{total} NOT_FOUND ({100*counts['NOT_FOUND']/total:.1f}%)",
            file=sys.stderr,
        )


if __name__ == "__main__":
    main()

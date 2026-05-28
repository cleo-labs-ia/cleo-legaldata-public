#!/usr/bin/env python3
"""
Build product-compliance.json with full schema for the site to read.
Preserves category descriptions/images and jurisdiction flags from previous JSON.
"""
import csv
import json
import subprocess
from pathlib import Path
from collections import defaultdict

ROOT = Path("/Users/naomiehalioua/cleo-legaldata-public")
MASTER = ROOT / "audits/product-compliance-worldwide-2026/data/master-consolidated.csv"
JSON_OUT = ROOT / "public/data/product-compliance.json"

# Load previous JSON via git for metadata preservation
prev = json.loads(subprocess.check_output(
    ["git", "show", "HEAD:public/data/product-compliance.json"],
    cwd=ROOT,
))

cat_meta = {c["name"]: c for c in prev["categories"]}
jur_meta = {j["code"]: j for j in prev["jurisdictions"]}
prev_totals = prev["totals"]

# Flag fallbacks for new jurisdictions not in prev
EXTRA_FLAGS = {
    "AT": "🇦🇹", "BE": "🇧🇪", "CZ": "🇨🇿", "DK": "🇩🇰", "FI": "🇫🇮",
    "GR": "🇬🇷", "IE": "🇮🇪", "PT": "🇵🇹", "SE": "🇸🇪", "PL": "🇵🇱",
    "RO": "🇷🇴", "HU": "🇭🇺", "PE": "🇵🇪", "UY": "🇺🇾", "PY": "🇵🇾",
    "DO": "🇩🇴", "PA": "🇵🇦", "PK": "🇵🇰", "BD": "🇧🇩", "LK": "🇱🇰",
    "KZ": "🇰🇿", "UZ": "🇺🇿", "SA": "🇸🇦", "AE": "🇦🇪", "QA": "🇶🇦",
    "KW": "🇰🇼", "BH": "🇧🇭", "DZ": "🇩🇿", "TN": "🇹🇳", "SN": "🇸🇳",
    "GH": "🇬🇭", "CI": "🇨🇮", "OM": "🇴🇲", "YE": "🇾🇪", "IQ": "🇮🇶",
    "IR": "🇮🇷", "SY": "🇸🇾", "LB": "🇱🇧", "JO": "🇯🇴", "IL": "🇮🇱",
    "PS": "🇵🇸", "MA": "🇲🇦", "EG": "🇪🇬", "LY": "🇱🇾", "SD": "🇸🇩",
    "ZA": "🇿🇦", "NG": "🇳🇬", "KE": "🇰🇪", "ET": "🇪🇹", "CM": "🇨🇲",
    "TZ": "🇹🇿", "UG": "🇺🇬", "RW": "🇷🇼", "BF": "🇧🇫", "ML": "🇲🇱",
    "NE": "🇳🇪", "TG": "🇹🇬", "BJ": "🇧🇯", "GA": "🇬🇦", "CG": "🇨🇬",
    "CD": "🇨🇩", "AO": "🇦🇴", "MZ": "🇲🇿", "ZM": "🇿🇲", "ZW": "🇿🇼",
    "BW": "🇧🇼", "NA": "🇳🇦", "MG": "🇲🇬", "MU": "🇲🇺", "SC": "🇸🇨",
    "CV": "🇨🇻", "GW": "🇬🇼", "GM": "🇬🇲", "SL": "🇸🇱", "LR": "🇱🇷",
    "MR": "🇲🇷", "DJ": "🇩🇯", "SO": "🇸🇴", "ER": "🇪🇷", "BI": "🇧🇮",
    "KM": "🇰🇲", "MW": "🇲🇼", "SZ": "🇸🇿", "LS": "🇱🇸", "ST": "🇸🇹",
    "EH": "🏳️", "VN": "🇻🇳", "TH": "🇹🇭", "MY": "🇲🇾", "SG": "🇸🇬",
    "ID": "🇮🇩", "PH": "🇵🇭", "BN": "🇧🇳", "KH": "🇰🇭", "LA": "🇱🇦",
    "MM": "🇲🇲", "NP": "🇳🇵", "BT": "🇧🇹", "MV": "🇲🇻", "AF": "🇦🇫",
    "TW": "🇹🇼", "HK": "🇭🇰", "MO": "🇲🇴", "KP": "🇰🇵", "MN": "🇲🇳",
    "NZ": "🇳🇿", "FJ": "🇫🇯", "PG": "🇵🇬", "TL": "🇹🇱",
    "RS": "🇷🇸", "BA": "🇧🇦", "AL": "🇦🇱", "MK": "🇲🇰", "ME": "🇲🇪",
    "XK": "🇽🇰", "RU": "🇷🇺", "BY": "🇧🇾", "UA": "🇺🇦", "MD": "🇲🇩",
    "TR": "🇹🇷", "IS": "🇮🇸", "LI": "🇱🇮", "CH": "🇨🇭", "NO": "🇳🇴",
    "JM": "🇯🇲", "TT": "🇹🇹", "BB": "🇧🇧", "HT": "🇭🇹", "CU": "🇨🇺",
    "GT": "🇬🇹", "CR": "🇨🇷", "NI": "🇳🇮", "SV": "🇸🇻", "HN": "🇭🇳",
    "BO": "🇧🇴", "EC": "🇪🇨", "VE": "🇻🇪", "AM": "🇦🇲", "AZ": "🇦🇿",
    "GE": "🇬🇪", "KG": "🇰🇬", "TJ": "🇹🇯", "TM": "🇹🇲",
    "GB": "🇬🇧", "AR": "🇦🇷",
    # Regional blocs / orgs
    "ASEAN": "🌏", "GCC": "🕌", "EAEU": "🌐", "MERCOSUR": "🌎",
    "CARICOM": "🌎", "ECOWAS": "🌍", "SADC": "🌍", "EAC": "🌍",
    "COMESA": "🌍", "ECCAS": "🌍", "AU-AFR": "🌍", "AU": "🇦🇺",
    "ISO": "🌐", "IEC": "🌐", "CODEX": "🌐", "WHO": "🌐", "OECD": "🌐",
    "UNECE": "🌐", "WTO": "🌐", "WIPO": "🌐", "ITU": "🌐", "IMO": "🌐",
    "IATA": "🌐", "ICAO": "🌐", "ICH": "🌐", "IMDRF": "🌐", "WADA": "🌐",
    "PIC-S": "🌐", "OIE": "🌐", "FAO": "🌐", "WCO": "🌐", "WOAH": "🌐",
    "UN": "🌐", "OIV": "🌐", "INTL": "🌐", "EU": "🇪🇺",
    # US states
    "US-CA": "🇺🇸", "US-NY": "🇺🇸", "US-TX": "🇺🇸", "US-FL": "🇺🇸",
    "US-IL": "🇺🇸", "US-HI": "🇺🇸", "US-WA": "🇺🇸", "US-OR": "🇺🇸",
    "US-MA": "🇺🇸", "US-MN": "🇺🇸", "US-ME": "🇺🇸",
}

REGION_FALLBACK = {
    # Quick fallback if previous didn't have it
    "EU": "Europe", "GB": "Europe", "CH": "Europe", "NO": "Europe",
    "IS": "Europe", "LI": "Europe", "RU": "Europe", "TR": "Europe",
    "UA": "Europe", "BY": "Europe", "MD": "Europe",
}


def main():
    rows = list(csv.DictReader(MASTER.open()))
    print(f"Loaded {len(rows)} rows from {MASTER.name}")

    # Per-category stats
    cat_stats = defaultdict(lambda: {
        "total_regs": 0, "found": 0,
        "jurisdictions": set(), "cross_checked": 0,
    })
    jur_stats = defaultdict(lambda: {
        "total": 0, "found": 0, "name": "", "region": "",
        "cross_checked": 0,
    })

    regulations = []
    for r in rows:
        cat = r["product_name"]
        if not cat:
            continue
        # category stats
        cs = cat_stats[cat]
        cs["total_regs"] += 1
        cs["jurisdictions"].add(r["jurisdiction_code"])
        match = r["legal_api_match"].strip().upper()
        if match == "FOUND":
            cs["found"] += 1
            cs["cross_checked"] += 1
            in_api = True
        elif match == "NOT_FOUND":
            cs["cross_checked"] += 1
            in_api = False
        else:
            in_api = False

        # jurisdiction stats
        jc = r["jurisdiction_code"]
        if jc:
            js = jur_stats[jc]
            js["name"] = r["jurisdiction_name"]
            js["region"] = r["region"]
            js["total"] += 1
            if match == "FOUND":
                js["found"] += 1
                js["cross_checked"] += 1
            elif match == "NOT_FOUND":
                js["cross_checked"] += 1

        # regulation entry (only first 5000 to keep JSON manageable; in_api ones prioritized)
        regulations.append({
            "regulation_name": r["regulation_name"],
            "regulation_ref": r["regulation_ref"],
            "jurisdiction_code": jc,
            "jurisdiction_name": r["jurisdiction_name"],
            "category": cat,
            "enforcement_body": r["enforcement_body"],
            "criticality": (r["criticality"] or "medium").lower(),
            "in_api": in_api,
            "url": r.get("notes", "") if r.get("notes", "").startswith("http") else "",
        })

    # Build categories (preserve descriptions/images, override stats)
    categories = []
    for cat_name in sorted(cat_stats, key=lambda x: -cat_stats[x]["total_regs"]):
        s = cat_stats[cat_name]
        prev_cat = cat_meta.get(cat_name, {})
        pct = round(s["found"] * 100 / s["cross_checked"]) if s["cross_checked"] else 0
        categories.append({
            "name": cat_name,
            "description": prev_cat.get("description", ""),
            "image": prev_cat.get("image", ""),
            "total_regs": s["total_regs"],
            "found": s["found"],
            "pct": pct,
            "jurisdictions": len(s["jurisdictions"]),
            "cross_checked": s["cross_checked"],
        })

    # Build jurisdictions (preserve flag, override stats)
    jurisdictions = []
    for code in sorted(jur_stats, key=lambda x: -jur_stats[x]["total"]):
        s = jur_stats[code]
        prev_jur = jur_meta.get(code, {})
        pct = round(s["found"] * 100 / s["cross_checked"]) if s["cross_checked"] else 0
        flag = prev_jur.get("flag") or EXTRA_FLAGS.get(code, "🏳️")
        region = prev_jur.get("region") or s["region"] or REGION_FALLBACK.get(code, "Other")
        jurisdictions.append({
            "code": code,
            "name": s["name"],
            "region": region,
            "flag": flag,
            "total": s["total"],
            "found": s["found"],
            "pct": pct,
            "cross_checked": s["cross_checked"],
        })

    # Totals
    total_audited = len(rows)
    total_in_api = sum(s["found"] for s in cat_stats.values())
    total_cross = sum(s["cross_checked"] for s in cat_stats.values())
    coverage_pct = round(total_in_api * 100 / total_cross) if total_cross else 0

    totals = {
        "product_regs_audited": total_audited,
        "product_regs_cross_checked": total_cross,
        "product_regs_in_api": total_in_api,
        "product_coverage_pct": coverage_pct,
        "product_categories": len(categories),
        "jurisdictions_audited": len(jurisdictions),
        # Preserve platform-wide numbers
        "platform_regulations": prev_totals.get("platform_regulations", 210508),
        "platform_documents": prev_totals.get("platform_documents", 1940751),
        "platform_sources": prev_totals.get("platform_sources", 158),
        "platform_product_regs": prev_totals.get("platform_product_regs", 37267),
        "platform_products_tracked": prev_totals.get("platform_products_tracked", 2851),
        "platform_authorities": prev_totals.get("platform_authorities", 55924),
    }

    # Keep regulations list — but cap to avoid massive JSON;
    # site only iterates for the table. Prioritize FOUND + critical first.
    regulations.sort(key=lambda r: (
        0 if r["in_api"] else 1,
        0 if r["criticality"] == "critical" else 1 if r["criticality"] == "high" else 2,
    ))

    out = {
        "totals": totals,
        "categories": categories,
        "jurisdictions": jurisdictions,
        "regulations": regulations,
    }

    JSON_OUT.write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")))
    print(f"\nWrote {JSON_OUT.name}: {JSON_OUT.stat().st_size//1024} KB")
    print(f"\nTotals:")
    for k, v in totals.items():
        print(f"  {k:30s} = {v}")
    print(f"\nCategories: {len(categories)} | Jurisdictions: {len(jurisdictions)} | Regulations: {len(regulations)}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Génère outputs/coverage-dashboard.md : taux de couverture par axe."""

import csv
from collections import defaultdict
from pathlib import Path
import datetime

CSV_PATH = Path(__file__).parent.parent / "data" / "master.csv"
OUT_PATH = Path(__file__).parent.parent / "outputs" / "coverage-dashboard.md"


def coverage_pct(rows):
    if not rows:
        return 0.0
    f = sum(1 for r in rows if r["legal_api_match"] == "FOUND")
    return 100.0 * f / len(rows)


def bar(pct, width=20):
    """ASCII bar of `width` chars."""
    filled = int(round(pct * width / 100))
    return "█" * filled + "░" * (width - filled)


def main():
    rows = list(csv.DictReader(open(CSV_PATH, encoding="utf-8")))
    total = len(rows)
    found = sum(1 for r in rows if r["legal_api_match"] == "FOUND")
    partial = sum(1 for r in rows if r["legal_api_match"] == "PARTIAL")
    missing = sum(1 for r in rows if r["legal_api_match"] == "NOT_FOUND")

    lines = []
    lines.append("# Cleo Legal API — Coverage Dashboard\n\n")
    lines.append(f"_Cross-check du {datetime.date.today().isoformat()} contre 78 régulations Cleo Legal API (proxy via Cleo Insight)._\n\n")

    # Global
    lines.append("## Global\n\n")
    lines.append(f"- **Total régulations attendues** : {total}\n")
    lines.append(f"- ✅ **FOUND** : {found} ({100*found/total:.1f}%)  {bar(100*found/total)}\n")
    lines.append(f"- 🟡 **PARTIAL** : {partial} ({100*partial/total:.1f}%)\n")
    lines.append(f"- ❌ **NOT_FOUND** : {missing} ({100*missing/total:.1f}%)\n\n")

    # Par produit
    lines.append("## Couverture par produit\n\n")
    lines.append("| ID | Produit | Total | FOUND | NOT_FOUND | % | Bar |\n")
    lines.append("|---|---|---:|---:|---:|---:|---|\n")
    by_product = defaultdict(list)
    for r in rows:
        by_product[r["product_id"]].append(r)
    product_stats = []
    for pid in sorted(by_product.keys(), key=int):
        p = by_product[pid]
        f = sum(1 for r in p if r["legal_api_match"] == "FOUND")
        m = sum(1 for r in p if r["legal_api_match"] == "NOT_FOUND")
        pct = coverage_pct(p)
        name = p[0]["product_name"]
        product_stats.append((pid, name, len(p), f, m, pct))
        lines.append(f"| {pid} | {name} | {len(p)} | {f} | {m} | {pct:.1f}% | {bar(pct, 15)} |\n")

    # Par région
    lines.append("\n## Couverture par région\n\n")
    lines.append("| Région | Total | FOUND | NOT_FOUND | % | Bar |\n")
    lines.append("|---|---:|---:|---:|---:|---|\n")
    by_region = defaultdict(list)
    for r in rows:
        by_region[r["region"]].append(r)
    for region in sorted(by_region.keys()):
        rr = by_region[region]
        f = sum(1 for r in rr if r["legal_api_match"] == "FOUND")
        m = sum(1 for r in rr if r["legal_api_match"] == "NOT_FOUND")
        pct = coverage_pct(rr)
        lines.append(f"| {region} | {len(rr)} | {f} | {m} | {pct:.1f}% | {bar(pct, 15)} |\n")

    # Par criticité
    lines.append("\n## Couverture par criticité\n\n")
    lines.append("| Criticité | Total | FOUND | NOT_FOUND | % | Bar |\n")
    lines.append("|---|---:|---:|---:|---:|---|\n")
    by_crit = defaultdict(list)
    for r in rows:
        by_crit[r["criticality"]].append(r)
    for crit in ["critical", "high", "medium", "low"]:
        cc = by_crit.get(crit, [])
        if not cc:
            continue
        f = sum(1 for r in cc if r["legal_api_match"] == "FOUND")
        m = sum(1 for r in cc if r["legal_api_match"] == "NOT_FOUND")
        pct = coverage_pct(cc)
        lines.append(f"| {crit} | {len(cc)} | {f} | {m} | {pct:.1f}% | {bar(pct, 15)} |\n")

    # Top/Bottom 5 produits
    sorted_by_cov = sorted(product_stats, key=lambda x: x[5], reverse=True)
    lines.append("\n## Top 5 produits les mieux couverts\n\n")
    lines.append("| Rang | Produit | Coverage |\n")
    lines.append("|---|---|---:|\n")
    for i, (pid, name, tot, f, m, pct) in enumerate(sorted_by_cov[:5], 1):
        lines.append(f"| {i} | {name} | {pct:.1f}% ({f}/{tot}) |\n")

    lines.append("\n## Top 5 produits les moins couverts\n\n")
    lines.append("| Rang | Produit | Coverage |\n")
    lines.append("|---|---|---:|\n")
    for i, (pid, name, tot, f, m, pct) in enumerate(sorted_by_cov[-5:][::-1], 1):
        lines.append(f"| {i} | {name} | {pct:.1f}% ({f}/{tot}) |\n")

    # Notable findings
    lines.append("\n## Notable findings\n\n")
    zero_products = [s for s in product_stats if s[5] == 0]
    lines.append(f"- **{len(zero_products)} produits avec 0% de couverture** : {', '.join(s[1] for s in zero_products)}\n")
    eu_rows = [r for r in rows if r["region"].lower().startswith("eu")]  # may miss "Europe"
    # Better: by "European Union" or "Europe"
    europe_rows = [r for r in rows if r["region"] == "Europe"]
    europe_found = sum(1 for r in europe_rows if r["legal_api_match"] == "FOUND")
    lines.append(f"- **Couverture Europe** : {europe_found}/{len(europe_rows)} ({100*europe_found/max(len(europe_rows),1):.1f}%)\n")
    non_europe_rows = [r for r in rows if r["region"] != "Europe"]
    non_europe_found = sum(1 for r in non_europe_rows if r["legal_api_match"] == "FOUND")
    lines.append(f"- **Couverture hors-Europe** : {non_europe_found}/{len(non_europe_rows)} ({100*non_europe_found/max(len(non_europe_rows),1):.1f}%)\n")
    critical_found = sum(1 for r in by_crit.get("critical", []) if r["legal_api_match"] == "FOUND")
    critical_total = len(by_crit.get("critical", []))
    lines.append(f"- **Couverture des régulations critiques** : {critical_found}/{critical_total} ({100*critical_found/max(critical_total,1):.1f}%)\n")
    lines.append(f"- **Match methods utilisées** : exact_ref (référence officielle) prime, fuzzy_name fallback\n")

    OUT_PATH.write_text("".join(lines), encoding="utf-8")
    print(f"Wrote {OUT_PATH}")


if __name__ == "__main__":
    main()

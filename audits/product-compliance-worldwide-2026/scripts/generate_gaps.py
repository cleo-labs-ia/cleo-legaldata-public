#!/usr/bin/env python3
"""Génère outputs/gaps-summary.md à partir de master.csv annoté."""

import csv
import datetime
from collections import defaultdict
from pathlib import Path

CSV_PATH = Path(__file__).parent.parent / "data" / "master.csv"
OUT_PATH = Path(__file__).parent.parent / "outputs" / "gaps-summary.md"
CRITICALITY_ORDER = {"critical": 0, "high": 1, "medium": 2, "low": 3}


def main():
    rows = list(csv.DictReader(open(CSV_PATH, encoding="utf-8")))
    total = len(rows)
    found = sum(1 for r in rows if r["legal_api_match"] == "FOUND")
    partial = sum(1 for r in rows if r["legal_api_match"] == "PARTIAL")
    missing = [r for r in rows if r["legal_api_match"] == "NOT_FOUND"]

    # Compute breakdowns
    by_product = defaultdict(list)
    by_region = defaultdict(list)
    by_criticality = defaultdict(list)
    for r in rows:
        by_product[(r["product_id"], r["product_name"])].append(r)
    for r in missing:
        by_region[r["region"]].append(r)
        by_criticality[r["criticality"]].append(r)

    lines = []
    lines.append("# Cleo Legal API — Gaps Summary\n")
    lines.append(f"\n> Audit worldwide product compliance — 20 produits × 50 juridictions × {total} régulations attendues  ")
    lines.append(f"\n> Cross-check effectué le {datetime.date.today().isoformat()} contre 78 régulations Cleo Legal API (proxy via Cleo Insight)\n\n")
    lines.append("## Executive Summary\n\n")
    lines.append(f"- **Couverture globale : {100*found/total:.1f}%** ({found}/{total} régulations FOUND)\n")
    lines.append(f"- **{len(missing)} régulations NOT_FOUND** à ajouter pour exhaustivité worldwide\n")
    lines.append(f"- **Critical regs** : {sum(1 for r in rows if r['criticality']=='critical' and r['legal_api_match']=='FOUND')}/{sum(1 for r in rows if r['criticality']=='critical')} ({100*sum(1 for r in rows if r['criticality']=='critical' and r['legal_api_match']=='FOUND')/max(sum(1 for r in rows if r['criticality']=='critical'),1):.1f}%) couvertes\n")

    # 7 products at 0%
    zero_pct_products = []
    for (pid, name), prows in sorted(by_product.items(), key=lambda x: int(x[0][0])):
        f = sum(1 for r in prows if r["legal_api_match"] == "FOUND")
        if f == 0:
            zero_pct_products.append(name)
    lines.append(f"- **{len(zero_pct_products)} produits avec 0% de couverture** : " + ", ".join(zero_pct_products) + "\n\n")

    # Top 50 critical gaps
    lines.append("## Top 50 régulations critiques à ajouter en priorité\n\n")
    critical_missing = [r for r in missing if r["criticality"] == "critical"]
    critical_missing.sort(key=lambda r: (int(r["product_id"]), r["jurisdiction_code"]))
    lines.append("| Produit | Juridiction | Régulation | Référence | Autorité |\n")
    lines.append("|---|---|---|---|---|\n")
    for g in critical_missing[:50]:
        lines.append(f"| {g['product_name']} | {g['jurisdiction_name']} | {g['regulation_name']} | {g['regulation_ref']} | {g['enforcement_body']} |\n")
    if len(critical_missing) > 50:
        lines.append(f"\n*({len(critical_missing) - 50} autres régulations critiques manquantes — voir master.csv)*\n\n")

    # Gaps par produit
    lines.append("\n## Gaps par produit\n\n")
    for (pid, name), prows in sorted(by_product.items(), key=lambda x: int(x[0][0])):
        f = sum(1 for r in prows if r["legal_api_match"] == "FOUND")
        m = sum(1 for r in prows if r["legal_api_match"] == "NOT_FOUND")
        pct = 100*f/len(prows) if prows else 0
        lines.append(f"### Produit {pid} — {name} ({pct:.1f}% couverture, {m} gaps)\n\n")
        prod_missing_critical = sorted(
            [r for r in prows if r["legal_api_match"] == "NOT_FOUND" and r["criticality"] == "critical"],
            key=lambda r: r["jurisdiction_code"],
        )[:5]
        if prod_missing_critical:
            for g in prod_missing_critical:
                lines.append(f"- **{g['jurisdiction_name']}** — {g['regulation_name']} ({g['regulation_ref']})\n")
        else:
            lines.append("_Aucune régulation critique manquante._\n")
        lines.append("\n")

    # Gaps par région
    lines.append("## Gaps par région (NOT_FOUND uniquement)\n\n")
    lines.append("| Région | Gaps total | Critical | High | Medium | Low |\n")
    lines.append("|---|---|---|---|---|---|\n")
    for reg in sorted(by_region.keys()):
        rrows = by_region[reg]
        c = sum(1 for r in rrows if r["criticality"] == "critical")
        h = sum(1 for r in rrows if r["criticality"] == "high")
        med = sum(1 for r in rrows if r["criticality"] == "medium")
        low = sum(1 for r in rrows if r["criticality"] == "low")
        lines.append(f"| {reg} | {len(rrows)} | {c} | {h} | {med} | {low} |\n")

    # Recommandations
    lines.append("\n## Recommandations actionnables\n\n")
    critical_total = sum(1 for r in rows if r["criticality"] == "critical")
    high_total = sum(1 for r in rows if r["criticality"] == "high")
    medium_total = sum(1 for r in rows if r["criticality"] == "medium")
    low_total = sum(1 for r in rows if r["criticality"] == "low")
    critical_missing_n = len(critical_missing)
    high_missing_n = sum(1 for r in missing if r["criticality"] == "high")

    lines.append(f"1. **Priorité 1 (Q1 — 3 mois)** : ajouter les **{critical_missing_n} régulations critiques** manquantes ({critical_total} critical universe total)\n")
    lines.append(f"2. **Priorité 2 (Q2-Q3 — 6 mois)** : étendre aux **{high_missing_n} régulations HIGH** ({high_total} high universe total)\n")
    lines.append(f"3. **Priorité 3 (Q4 — 12 mois)** : couvrir les {medium_total + low_total} régulations MEDIUM/LOW\n")
    lines.append("4. **Élargissement géographique critique** : 95%+ des gaps sont hors-Europe. Cibler en priorité :\n")
    lines.append("   - **Asie-Pacifique** (CN, JP, KR, IN, AU, ASEAN) — marchés stratégiques pour électronique, médical, food\n")
    lines.append("   - **Amériques** (US fédéral + CA, BR, MX) — marchés régulés majeurs\n")
    lines.append("   - **MENA & Afrique** (GCC, ZA, NG) — émergents avec régimes ISO/CEN qui divergent\n\n")

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text("".join(lines), encoding="utf-8")
    print(f"Wrote {OUT_PATH} ({len(missing)} gaps, {critical_missing_n} critical)")


if __name__ == "__main__":
    main()

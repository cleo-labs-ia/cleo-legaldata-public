#!/usr/bin/env python3
"""
Roll up the 20 specific products in product-compliance.json into 15 broad
physical-product families for the "Légal API produit physique" page.

- Each family aggregates the regulations of its member products.
- Regulations are de-duplicated within a family on (ref, jurisdiction, name)
  so shared regs (e.g. EU REACH applying to two products) are not double-counted.
- Jurisdiction totals and global totals are recomputed on the deduped set.

Output: public/data/product-families.json (same schema as product-compliance.json).
"""
import json
import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
SRC = os.path.join(ROOT, "public", "data", "product-compliance.json")
OUT = os.path.join(ROOT, "public", "data", "product-families.json")

# Broad family (FR display name) -> member product categories present in the data
FAMILIES = {
    "Alcool & boissons": ["Bouteille de vin"],
    "Pièces automobiles": ["Pneumatique voiture"],
    "Cosmétiques & soins": ["Shampoing", "Crème solaire"],
    "Drones & aviation": ["Drone grand public"],
    "Électronique & télécom": ["Smartphone", "Robot aspirateur connecté"],
    "Alimentaire & compléments": [
        "Steak emballé (viande fraîche)",
        "Complément alimentaire vitamines",
    ],
    "Produits chimiques ménagers": [
        "Insecticide spray maison",
        "Capsule lessive (pod)",
    ],
    "Dispositifs médicaux": ["Pansement adhésif", "Implant dentaire"],
    "Peintures & revêtements": ["Peinture déco intérieure"],
    "Alimentation animale": ["Croquettes pour chien"],
    "Médicaments": ["Paracétamol OTC"],
    "EPI & équipements de sécurité": ["Casque vélo adulte"],
    "Textile & habillement": ["Legging sport synthétique"],
    "Tabac & vapotage": ["Vape / e-cigarette"],
    "Jouets": ["Peluche bébé 0-3 ans"],
}

# Ordering for severity merge
CRIT_RANK = {"critical": 3, "high": 2, "medium": 1, "low": 0}


def main():
    data = json.load(open(SRC, encoding="utf-8"))
    regs = data["regulations"]
    jur_meta = {j["code"]: j for j in data["jurisdictions"]}

    # product category name -> family name
    prod_to_family = {}
    for fam, prods in FAMILIES.items():
        for p in prods:
            prod_to_family[p] = fam

    # sanity: every product in data must be mapped
    data_cats = {c["name"] for c in data["categories"]}
    unmapped = data_cats - set(prod_to_family)
    if unmapped:
        raise SystemExit(f"Unmapped product categories: {unmapped}")

    # Aggregate + dedup regs per family
    fam_regs = {fam: {} for fam in FAMILIES}  # fam -> key -> reg
    for r in regs:
        fam = prod_to_family.get(r["category"])
        if not fam:
            continue
        key = (r["regulation_ref"], r["jurisdiction_code"], r["regulation_name"])
        bucket = fam_regs[fam]
        existing = bucket.get(key)
        merged = dict(r)
        merged["category"] = fam
        if existing:
            merged["in_api"] = existing["in_api"] or r["in_api"]
            # keep highest criticality
            if CRIT_RANK.get(existing["criticality"], 0) >= CRIT_RANK.get(
                r["criticality"], 0
            ):
                merged["criticality"] = existing["criticality"]
            merged["url"] = existing["url"] or r["url"]
            merged["enforcement_body"] = (
                existing["enforcement_body"] or r["enforcement_body"]
            )
        bucket[key] = merged

    out_regs = []
    categories = []
    for fam, prods in FAMILIES.items():
        rlist = list(fam_regs[fam].values())
        out_regs.extend(rlist)
        total = len(rlist)
        found = sum(1 for r in rlist if r["in_api"])
        jurs = {r["jurisdiction_code"] for r in rlist}
        categories.append(
            {
                "name": fam,
                "description": " · ".join(prods),
                "image": "",
                "total_regs": total,
                "found": found,
                "pct": round(found / total * 100) if total else 0,
                "jurisdictions": len(jurs),
            }
        )

    categories.sort(key=lambda c: c["total_regs"], reverse=True)

    # Recompute jurisdiction rows on the deduped family set
    jagg = {}
    for r in out_regs:
        code = r["jurisdiction_code"]
        a = jagg.setdefault(code, {"total": 0, "found": 0})
        a["total"] += 1
        if r["in_api"]:
            a["found"] += 1
    jurisdictions = []
    for code, a in jagg.items():
        meta = jur_meta.get(code, {})
        jurisdictions.append(
            {
                "code": code,
                "name": meta.get("name", code),
                "region": meta.get("region", ""),
                "flag": meta.get("flag", ""),
                "total": a["total"],
                "found": a["found"],
                "pct": round(a["found"] / a["total"] * 100) if a["total"] else 0,
            }
        )
    jurisdictions.sort(key=lambda j: j["total"], reverse=True)

    total_regs = len(out_regs)
    total_found = sum(1 for r in out_regs if r["in_api"])
    totals = dict(data["totals"])
    totals["product_regs_audited"] = total_regs
    totals["product_regs_cross_checked"] = total_regs
    totals["product_regs_in_api"] = total_found
    totals["product_coverage_pct"] = (
        round(total_found / total_regs * 100) if total_regs else 0
    )
    totals["product_categories"] = len(categories)
    totals["jurisdictions_audited"] = len(jurisdictions)

    out = {
        "totals": totals,
        "categories": categories,
        "jurisdictions": jurisdictions,
        "regulations": out_regs,
    }
    json.dump(out, open(OUT, "w", encoding="utf-8"), ensure_ascii=False)
    print(f"Wrote {OUT}")
    print(f"  families: {len(categories)}")
    print(f"  regs (deduped): {total_regs}  in_api: {total_found}  ({totals['product_coverage_pct']}%)")
    print(f"  jurisdictions: {len(jurisdictions)}")
    for c in categories:
        print(f"    {c['name']:32} {c['total_regs']:4} regs  {c['pct']:3}%  {c['jurisdictions']} juris")


if __name__ == "__main__":
    main()

# Worldwide Product Compliance Audit (2026)

Audit de la couverture réglementaire produit dans Cleo Legal Data API pour 20 produits × 50 juridictions.

## Results (2026-05-26)

- **Coverage global : 2.0%** (35/1761 régulations trouvées dans Cleo Legal API)
- **1761 régulations** identifiées pour 20 produits × 50 juridictions
- 7 produits à 0% : Smartphone, Peluche bébé, Vape, Vin, Paracétamol, Pneumatique, Drone
- **722 régulations critiques manquantes** — voir [gaps-summary.md](outputs/gaps-summary.md)
- **100% des matches sont en Europe** — 0 régulation US, Asie, MENA, Afrique, Latam
- Top couverture : Shampoing (7.9%), Compléments (7.5%), Steak (7.3%)
- Couverture complète par axe : voir [coverage-dashboard.md](outputs/coverage-dashboard.md)

## Structure
- `data/products.json` — 20 produits avec régime réglementaire
- `data/jurisdictions.json` — 50 juridictions cibles
- `data/master.csv` — Tableau principal (1761 rows, 17 colonnes)
- `data/legal-api-dump.json` — Snapshot 78 régs Cleo Legal API (via Cleo Insight)
- `outputs/gaps-summary.md` — 722 régulations critiques manquantes
- `outputs/coverage-dashboard.md` — Taux de couverture par axe
- `scripts/audit_cross_check.py` — 3-pass matcher (exact_ref / fuzzy_name / contextual)
- `scripts/generate_gaps.py` — Génère le rapport de gaps
- `scripts/generate_dashboard.py` — Génère le dashboard de couverture

## Reproduce
1. `pip install -r requirements.txt`
2. Auth Cleo Legal API via `/mcp` dans Claude Code (ou utiliser le dump existant)
3. `python scripts/audit_cross_check.py --input data/master.csv --output data/master.csv --api-dump data/legal-api-dump.json`
4. `python scripts/generate_gaps.py`
5. `python scripts/generate_dashboard.py`

## Status
- [x] Phase 1.A — Univers produits 1-10
- [x] Phase 1.B — Univers produits 11-20
- [x] Phase 2 — Cross-check Legal API
- [x] Phase 3 — Synthèse

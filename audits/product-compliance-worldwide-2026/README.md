# Worldwide Product Compliance Audit (2026)

Audit de la couverture réglementaire produit dans Cleo Legal Data API pour 20 produits × 50 juridictions.

## Structure
- `data/products.json` — 20 produits avec régime réglementaire
- `data/jurisdictions.json` — 50 juridictions cibles
- `data/master.csv` — Tableau principal (regulations × produits × juridictions)
- `outputs/gaps-summary.md` — Top régulations manquantes dans Cleo Legal API
- `outputs/coverage-dashboard.md` — Taux de couverture par axe
- `scripts/` — Scripts de génération et cross-check

## Reproduce
1. `pip install -r requirements.txt`
2. Auth Cleo Legal API via `/mcp` dans Claude Code
3. `python scripts/audit_cross_check.py`
4. `python scripts/generate_gaps.py`
5. `python scripts/generate_dashboard.py`

## Status
- [ ] Phase 1.A — Univers produits 1-10
- [ ] Phase 1.B — Univers produits 11-20
- [ ] Phase 2 — Cross-check Legal API
- [ ] Phase 3 — Synthèse

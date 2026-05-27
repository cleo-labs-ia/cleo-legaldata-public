# Worldwide Product Compliance Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire un audit exhaustif des réglementations produit worldwide pour 20 produits couvrant ~98% des régimes réglementaires mondiaux, puis cross-checker contre Cleo Legal Data API pour identifier les gaps de couverture.

**Architecture:**
1. **Référentiel statique** (`products.json` + `jurisdictions.json`) : définit l'univers exact
2. **Master CSV** rempli produit par produit via recherche structurée (sources officielles + LLM assisté)
3. **Script Python** (`audit_cross_check.py`) qui pull Legal API via MCP et tag chaque ligne du CSV
4. **Synthèses markdown** (`gaps-summary.md`, `coverage-dashboard.md`) générées à partir du CSV annoté

**Tech Stack:**
- Python 3.11+ (script de cross-check)
- Pandas (manipulation CSV)
- requests + MCP client pour Cleo Legal API
- Markdown pour livrables de synthèse
- Bash pour orchestration

---

## File Structure

```
cleo-legaldata-public/
└── audits/
    └── product-compliance-worldwide-2026/
        ├── data/
        │   ├── products.json         # 20 produits avec metadata
        │   ├── jurisdictions.json    # 50 juridictions avec metadata
        │   └── master.csv            # Output principal (~2-3k lignes)
        ├── outputs/
        │   ├── gaps-summary.md       # Top 50 régs critiques manquantes
        │   └── coverage-dashboard.md # Taux de couverture par axe
        ├── scripts/
        │   ├── audit_cross_check.py  # Cross-check Legal API + tag CSV
        │   ├── generate_gaps.py      # Génère gaps-summary.md
        │   └── generate_dashboard.py # Génère coverage-dashboard.md
        ├── requirements.txt          # Python deps
        └── README.md                 # How to run + reproduce
```

---

## Task 1: Setup du dossier audit et structure de base

**Files:**
- Create: `audits/product-compliance-worldwide-2026/README.md`
- Create: `audits/product-compliance-worldwide-2026/requirements.txt`
- Create: `audits/product-compliance-worldwide-2026/.gitignore`

- [ ] **Step 1: Créer la structure de dossiers**

```bash
cd /Users/naomiehalioua/cleo-legaldata-public
mkdir -p audits/product-compliance-worldwide-2026/{data,outputs,scripts}
```

- [ ] **Step 2: Écrire le README de l'audit**

Contenu de `audits/product-compliance-worldwide-2026/README.md` :

```markdown
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
```

- [ ] **Step 3: Écrire le requirements.txt**

Contenu :

```
pandas>=2.2
requests>=2.31
python-Levenshtein>=0.21
```

- [ ] **Step 4: Écrire le .gitignore**

Contenu :

```
__pycache__/
*.pyc
.env
.venv/
```

- [ ] **Step 5: Commit**

```bash
git add audits/product-compliance-worldwide-2026/
git commit -m "feat(audit): setup product compliance audit structure"
```

---

## Task 2: Créer le référentiel products.json (20 produits)

**Files:**
- Create: `audits/product-compliance-worldwide-2026/data/products.json`

- [ ] **Step 1: Écrire le JSON complet des 20 produits**

Contenu exact :

```json
[
  {"id": 1,  "name": "Shampoing",                     "regime_tag": "Cosmétique rinse-off",       "category": "Personal Care"},
  {"id": 2,  "name": "Crème solaire",                 "regime_tag": "Cosmétique leave-on + UV",   "category": "Personal Care"},
  {"id": 3,  "name": "Smartphone",                    "regime_tag": "Électronique + télécom",     "category": "Electronics"},
  {"id": 4,  "name": "Peluche bébé 0-3 ans",          "regime_tag": "Jouet enfant",               "category": "Toys & Children"},
  {"id": 5,  "name": "Pansement adhésif",             "regime_tag": "Dispositif médical Cl. I",   "category": "Medical Devices"},
  {"id": 6,  "name": "Vape / e-cigarette",            "regime_tag": "Tabac/Nicotine",             "category": "Tobacco & Vape"},
  {"id": 7,  "name": "Capsule lessive (pod)",         "regime_tag": "Détergent + biocide",        "category": "Household Chemicals"},
  {"id": 8,  "name": "Complément alimentaire vitamines", "regime_tag": "Food supplement",         "category": "Food & Supplements"},
  {"id": 9,  "name": "Legging sport synthétique",     "regime_tag": "Textile + PFAS",             "category": "Textile & Apparel"},
  {"id": 10, "name": "Casque vélo adulte",            "regime_tag": "EPI catégorie II",           "category": "PPE"},
  {"id": 11, "name": "Bouteille de vin",              "regime_tag": "Alcool",                      "category": "Alcohol"},
  {"id": 12, "name": "Steak emballé (viande fraîche)","regime_tag": "Animal origin food",         "category": "Food (Animal)"},
  {"id": 13, "name": "Paracétamol OTC",               "regime_tag": "Pharma humain OTC",           "category": "Pharmaceuticals"},
  {"id": 14, "name": "Pneumatique voiture",           "regime_tag": "Tyre + automotive parts",     "category": "Automotive"},
  {"id": 15, "name": "Insecticide spray maison",      "regime_tag": "Biocide produit fini",        "category": "Biocides"},
  {"id": 16, "name": "Drone grand public",            "regime_tag": "Drone + aviation civile",     "category": "Aviation & UAV"},
  {"id": 17, "name": "Robot aspirateur connecté",     "regime_tag": "Machinery + IoT + AI Act",    "category": "Smart Appliances"},
  {"id": 18, "name": "Implant dentaire",              "regime_tag": "Dispositif médical Cl. III",  "category": "Medical Devices"},
  {"id": 19, "name": "Peinture déco intérieure",      "regime_tag": "VOC + REACH SVHC",            "category": "Paint & Coatings"},
  {"id": 20, "name": "Croquettes pour chien",         "regime_tag": "Pet food",                    "category": "Pet Products"}
]
```

- [ ] **Step 2: Valider le JSON**

```bash
cd /Users/naomiehalioua/cleo-legaldata-public/audits/product-compliance-worldwide-2026
python -c "import json; data=json.load(open('data/products.json')); assert len(data)==20; print(f'OK {len(data)} products')"
```

Expected: `OK 20 products`

- [ ] **Step 3: Commit**

```bash
git add audits/product-compliance-worldwide-2026/data/products.json
git commit -m "feat(audit): add 20 products reference"
```

---

## Task 3: Créer le référentiel jurisdictions.json (50 juridictions)

**Files:**
- Create: `audits/product-compliance-worldwide-2026/data/jurisdictions.json`

- [ ] **Step 1: Écrire le JSON complet des 50 juridictions**

Contenu exact :

```json
[
  {"code": "EU",       "name": "European Union",   "region": "Europe",       "type": "bloc"},
  {"code": "FR",       "name": "France",           "region": "Europe",       "type": "country"},
  {"code": "DE",       "name": "Germany",          "region": "Europe",       "type": "country"},
  {"code": "IT",       "name": "Italy",            "region": "Europe",       "type": "country"},
  {"code": "ES",       "name": "Spain",            "region": "Europe",       "type": "country"},
  {"code": "NL",       "name": "Netherlands",      "region": "Europe",       "type": "country"},
  {"code": "GB",       "name": "United Kingdom",   "region": "Europe",       "type": "country"},
  {"code": "CH",       "name": "Switzerland",      "region": "Europe",       "type": "country"},
  {"code": "NO",       "name": "Norway",           "region": "Europe",       "type": "country"},
  {"code": "RU",       "name": "Russia",           "region": "Europe",       "type": "country"},
  {"code": "TR",       "name": "Turkey",           "region": "Europe",       "type": "country"},
  {"code": "UA",       "name": "Ukraine",          "region": "Europe",       "type": "country"},
  {"code": "EAEU",     "name": "EAEU",             "region": "Europe",       "type": "bloc"},
  {"code": "US",       "name": "United States",    "region": "Americas",     "type": "country"},
  {"code": "US-CA",    "name": "California",       "region": "Americas",     "type": "state"},
  {"code": "US-NY",    "name": "New York",         "region": "Americas",     "type": "state"},
  {"code": "CA",       "name": "Canada",           "region": "Americas",     "type": "country"},
  {"code": "MX",       "name": "Mexico",           "region": "Americas",     "type": "country"},
  {"code": "BR",       "name": "Brazil",           "region": "Americas",     "type": "country"},
  {"code": "AR",       "name": "Argentina",        "region": "Americas",     "type": "country"},
  {"code": "CL",       "name": "Chile",            "region": "Americas",     "type": "country"},
  {"code": "CO",       "name": "Colombia",         "region": "Americas",     "type": "country"},
  {"code": "MERCOSUR", "name": "Mercosur",         "region": "Americas",     "type": "bloc"},
  {"code": "CN",       "name": "China",            "region": "Asia-Pacific", "type": "country"},
  {"code": "HK",       "name": "Hong Kong",        "region": "Asia-Pacific", "type": "territory"},
  {"code": "TW",       "name": "Taiwan",           "region": "Asia-Pacific", "type": "territory"},
  {"code": "JP",       "name": "Japan",            "region": "Asia-Pacific", "type": "country"},
  {"code": "KR",       "name": "South Korea",      "region": "Asia-Pacific", "type": "country"},
  {"code": "SG",       "name": "Singapore",        "region": "Asia-Pacific", "type": "country"},
  {"code": "MY",       "name": "Malaysia",         "region": "Asia-Pacific", "type": "country"},
  {"code": "TH",       "name": "Thailand",         "region": "Asia-Pacific", "type": "country"},
  {"code": "VN",       "name": "Vietnam",          "region": "Asia-Pacific", "type": "country"},
  {"code": "ID",       "name": "Indonesia",        "region": "Asia-Pacific", "type": "country"},
  {"code": "PH",       "name": "Philippines",      "region": "Asia-Pacific", "type": "country"},
  {"code": "IN",       "name": "India",            "region": "Asia-Pacific", "type": "country"},
  {"code": "AU",       "name": "Australia",        "region": "Asia-Pacific", "type": "country"},
  {"code": "NZ",       "name": "New Zealand",      "region": "Asia-Pacific", "type": "country"},
  {"code": "ASEAN",    "name": "ASEAN",            "region": "Asia-Pacific", "type": "bloc"},
  {"code": "GCC",      "name": "GCC",              "region": "MENA & Africa","type": "bloc"},
  {"code": "IL",       "name": "Israel",           "region": "MENA & Africa","type": "country"},
  {"code": "EG",       "name": "Egypt",            "region": "MENA & Africa","type": "country"},
  {"code": "MA",       "name": "Morocco",          "region": "MENA & Africa","type": "country"},
  {"code": "ZA",       "name": "South Africa",     "region": "MENA & Africa","type": "country"},
  {"code": "NG",       "name": "Nigeria",          "region": "MENA & Africa","type": "country"},
  {"code": "KE",       "name": "Kenya",            "region": "MENA & Africa","type": "country"},
  {"code": "CODEX",    "name": "Codex Alimentarius","region": "International","type": "international"},
  {"code": "ISO",      "name": "ISO/IEC",          "region": "International","type": "international"},
  {"code": "UNECE",    "name": "UNECE WP.29",      "region": "International","type": "international"},
  {"code": "WADA",     "name": "WADA",             "region": "International","type": "international"},
  {"code": "OECD",     "name": "OECD",             "region": "International","type": "international"}
]
```

- [ ] **Step 2: Valider le JSON**

```bash
cd /Users/naomiehalioua/cleo-legaldata-public/audits/product-compliance-worldwide-2026
python -c "import json; data=json.load(open('data/jurisdictions.json')); assert len(data)==50; print(f'OK {len(data)} jurisdictions')"
```

Expected: `OK 50 jurisdictions`

- [ ] **Step 3: Commit**

```bash
git add audits/product-compliance-worldwide-2026/data/jurisdictions.json
git commit -m "feat(audit): add 50 jurisdictions reference"
```

---

## Task 4: Créer le master.csv vide avec headers

**Files:**
- Create: `audits/product-compliance-worldwide-2026/data/master.csv`

- [ ] **Step 1: Écrire le CSV avec uniquement la ligne d'en-têtes**

Contenu exact (une seule ligne) :

```csv
product_id,product_name,product_regime_tag,jurisdiction_code,jurisdiction_name,region,regulation_name,regulation_ref,enforcement_body,key_requirements,status,criticality,legal_api_match,legal_api_id,legal_api_match_method,gap_action,notes
```

- [ ] **Step 2: Valider la structure**

```bash
cd /Users/naomiehalioua/cleo-legaldata-public/audits/product-compliance-worldwide-2026
python -c "
import csv
with open('data/master.csv') as f:
    reader = csv.reader(f)
    headers = next(reader)
    assert len(headers) == 17, f'Expected 17 cols, got {len(headers)}'
    print(f'OK {len(headers)} columns: {headers}')
"
```

Expected: `OK 17 columns: [...]`

- [ ] **Step 3: Commit**

```bash
git add audits/product-compliance-worldwide-2026/data/master.csv
git commit -m "feat(audit): init master.csv with schema headers"
```

---

## Task 5: Recherche et remplissage — Produit 1 (Shampoing)

**Files:**
- Modify: `audits/product-compliance-worldwide-2026/data/master.csv` (append rows)

**Régime activé :** Cosmétique rinse-off. Sources prioritaires : EUR-Lex (1223/2009), FDA (21 CFR), NMPA China CSAR, MFDS Korea, MHLW Japan, Health Canada Cosmetic Regulations, ANVISA Brazil RDC 7.

- [ ] **Step 1: Recherche systématique des régulations applicables**

Pour chaque juridiction de `jurisdictions.json`, identifier 1-3 régulations principales applicables au shampoing.

**Méthode de recherche** :
1. Consulter le portail officiel de chaque juridiction (ex: EUR-Lex pour EU, eCFR pour US)
2. Vérifier sur 2 sources indépendantes (régulateur + cabinet conseil compliance)
3. Pour les blocs (EU, ASEAN, GCC, Mercosur) : régulation harmonisée
4. Pour les pays membres de bloc : ajouter uniquement les régulations *additionnelles* locales

**Régulations de référence connues** (point de départ minimum) :
```
EU      → Regulation (EC) No 1223/2009 (Cosmetics)
EU      → Regulation (EU) 2024/996 (Cosmetic CMR amendments)
US      → 21 CFR Parts 700-740 (FDA Cosmetics)
US      → MoCRA 2022 (Modernization of Cosmetics Regulation Act)
US-CA   → Prop 65 (Safe Drinking Water and Toxic Enforcement Act)
GB      → UK Cosmetics Regulation (post-Brexit SI 2019/696)
CN      → CSAR (Cosmetic Supervision and Administration Regulation, Decree 727)
KR      → Cosmetics Act (Act No. 18448)
JP      → Pharmaceutical Affairs Law (PMD Act)
CA      → Cosmetic Regulations (SOR/2001-203)
BR      → ANVISA RDC No. 7/2015
MX      → NOM-141-SSA1/SCFI-2012
IN      → Drugs and Cosmetics Act 1940
AU      → Industrial Chemicals Act 2019 + NICNAS replacement AICIS
GCC     → GSO 2528:2016 (Cosmetics safety)
ZA      → Foodstuffs, Cosmetics and Disinfectants Act 54/1972
```

- [ ] **Step 2: Append les lignes CSV (~80-150 lignes pour shampoing × 50 juridictions)**

Pour chaque (Shampoing × juridiction × régulation), append une ligne au format :

```csv
1,Shampoing,Cosmétique rinse-off,EU,European Union,Europe,EU Cosmetics Regulation,(EC) No 1223/2009,EC DG GROW + NCAs,"CPNP notification; PIF; Responsible Person; Safety assessment per Annex I; Labeling per Article 19",in_force,critical,,,,,
1,Shampoing,Cosmétique rinse-off,US,United States,Americas,FDA Cosmetics Regulations,21 CFR Parts 700-740,FDA CDER + OCAC,"Establishment registration; Product listing per MoCRA; Adverse event reporting; cGMP per MoCRA Section 606",in_force,critical,,,,,
...
```

Les 4 colonnes `legal_api_*` et `gap_action` restent vides — elles seront remplies en Phase 2.

- [ ] **Step 3: Valider le compte de lignes**

```bash
python -c "
import csv
with open('data/master.csv') as f:
    rows = list(csv.DictReader(f))
    p1 = [r for r in rows if r['product_id'] == '1']
    print(f'Product 1 (Shampoing): {len(p1)} regulations across {len(set(r[\"jurisdiction_code\"] for r in p1))} jurisdictions')
"
```

Expected : `Product 1 (Shampoing): 80-150 regulations across 40-50 jurisdictions`

- [ ] **Step 4: Commit**

```bash
git add data/master.csv
git commit -m "feat(audit): add product 1 (Shampoing) regulations across 50 jurisdictions"
```

---

## Task 6: Recherche et remplissage — Produit 2 (Crème solaire)

**Files:**
- Modify: `data/master.csv` (append rows)

**Régime activé :** Cosmétique leave-on + filtres UV + nano + environnement marin. **Spécificité critique** : les filtres UV autorisés divergent fortement par juridiction (US : 16 filtres OTC monograph ≠ EU : 30+ filtres annex VI ≠ AU : régime ARTG distinct).

- [ ] **Step 1: Recherche des régulations spécifiques crème solaire**

Régulations de référence à inclure :

```
EU       → Regulation (EC) No 1223/2009 Annex VI (UV filters)
EU       → Regulation (EU) 2022/1531 (nano)
US       → FDA Sunscreen Monograph 21 CFR 352 (OTC drug)
US-HI    → Hawaii Reef-safe Act (Act 104) — interdit oxybenzone, octinoxate
AU       → ARTG Sunscreen Standard + Therapeutic Goods Act
CN       → CSAR + Cosmetic Ingredient Safety Standards
KR       → Functional Cosmetics regulation (Cosmetics Act)
JP       → Quasi-drug (Iyakubugaiyahin) regime under PMD Act
GCC      → GSO 1943:2016 (Sunscreen products)
PH       → Ban on oxybenzone in marine protected areas
```

Note importante : aux US, les crèmes solaires sont des **OTC drugs**, pas des cosmétiques — régime différent de la juridiction "shampoing" US.

- [ ] **Step 2: Append les lignes CSV (~100-180 lignes)**

Format identique au Task 5.

- [ ] **Step 3: Valider**

```bash
python -c "
import csv
with open('data/master.csv') as f:
    rows = list(csv.DictReader(f))
    p2 = [r for r in rows if r['product_id'] == '2']
    print(f'Product 2: {len(p2)} regs, {len(set(r[\"jurisdiction_code\"] for r in p2))} jurisdictions')
"
```

- [ ] **Step 4: Commit**

```bash
git add data/master.csv
git commit -m "feat(audit): add product 2 (Crème solaire) regulations"
```

---

## Task 7: Recherche et remplissage — Produit 3 (Smartphone)

**Files:**
- Modify: `data/master.csv` (append rows)

**Régime activé :** Le plus dense de tous — 6-7 régimes simultanés. RoHS, REACH, RED/FCC RF, batterie, DEEE, USB-C, conflict minerals.

- [ ] **Step 1: Recherche multi-régimes**

Régulations clés à inclure :

```
EU      → Directive RoHS 2 (2011/65/EU)
EU      → Regulation REACH (EC) 1907/2006
EU      → Directive RED (2014/53/EU) + Common Charger USB-C
EU      → Regulation Batteries (EU) 2023/1542
EU      → Directive WEEE (2012/19/EU)
EU      → Cyber Resilience Act (EU) 2024/2847
EU      → Eco-design Regulation 2024/1781
US      → FCC Part 15 (RF emissions)
US      → CPSC General Conformity Certificate
US      → Dodd-Frank Section 1502 (conflict minerals)
US-CA   → Prop 65
CN      → 3C Compulsory Certification (CCC)
CN      → SRRC (Radio type approval)
CN      → CMIIT ID
JP      → MIC Radio Law (giteki mark)
KR      → KC Mark (RRA)
IN      → BIS Compulsory Registration (CRS)
BR      → ANATEL homologation
```

- [ ] **Step 2: Append CSV lines (~150-200 lignes)**

- [ ] **Step 3: Valider**

```bash
python -c "
import csv
with open('data/master.csv') as f:
    rows = list(csv.DictReader(f))
    p3 = [r for r in rows if r['product_id'] == '3']
    print(f'Product 3: {len(p3)} regs')
"
```

- [ ] **Step 4: Commit**

```bash
git add data/master.csv
git commit -m "feat(audit): add product 3 (Smartphone) regulations"
```

---

## Task 8: Recherche et remplissage — Produit 4 (Peluche bébé 0-3 ans)

**Files:**
- Modify: `data/master.csv` (append rows)

**Régime activé :** Le plus strict au monde. Phtalates, petites pièces, flammabilité, étiquetage avertissement, chemical migration.

- [ ] **Step 1: Recherche régulations jouets enfants**

Régulations clés :

```
EU      → Toy Safety Directive 2009/48/EC
EU      → EN 71 series (mechanical, flammability, migration)
EU      → REACH SVHC + Annex XVII (phtalates DEHP/DBP/BBP)
US      → CPSIA 2008 (Consumer Product Safety Improvement Act)
US      → ASTM F963 (Standard Consumer Safety Specification for Toy Safety)
US      → 16 CFR Part 1500 (small parts, sharp points)
US      → 16 CFR Part 1303 (lead paint)
CN      → GB 6675 series (National toy safety standard)
CN      → CCC mark for some toys
AU      → AS/NZS ISO 8124 + Trade Practices Act (mandatory standards)
CA      → Canadian Toys Regulations SOR/2011-17
BR      → INMETRO Portaria 563/2016
IN      → Toys (Quality Control) Order 2020
MENA    → GCC Technical Regulation BD 131
GLOBAL  → ISO 8124-1/2/3/4 (international toy safety)
```

- [ ] **Step 2: Append CSV lines (~120-180 lignes)**

- [ ] **Step 3: Valider**

```bash
python -c "
import csv
with open('data/master.csv') as f:
    rows = list(csv.DictReader(f))
    p4 = [r for r in rows if r['product_id'] == '4']
    print(f'Product 4: {len(p4)} regs')
"
```

- [ ] **Step 4: Commit**

```bash
git add data/master.csv
git commit -m "feat(audit): add product 4 (Peluche bébé) regulations"
```

---

## Task 9: Recherche et remplissage — Produit 5 (Pansement adhésif)

**Files:**
- Modify: `data/master.csv` (append rows)

**Régime activé :** Dispositif médical classe I auto-certifié. Régulations légères mais présentes mondialement.

- [ ] **Step 1: Recherche DM classe I**

```
EU      → MDR (EU) 2017/745 — DM classe I (sans stérile/mesure)
EU      → EUDAMED registration (when fully operational)
US      → FDA 510(k) Exempt — Class I Listing
US      → 21 CFR 880.5240 (Adhesive Bandage)
CN      → NMPA Class I (sans dossier complet, juste filing)
JP      → PMDA Class I notification
KR      → MFDS Class I notification
CA      → Health Canada MDL Class I
AU      → TGA Class I + ARTG listing
BR      → ANVISA RDC 185/2001
IN      → CDSCO Medical Device Rules 2017
GCC     → SFDA medical device classification
GLOBAL  → IMDRF guidance + ISO 13485 (QMS)
```

- [ ] **Step 2: Append CSV lines (~80-120 lignes)**

- [ ] **Step 3: Valider & Commit**

```bash
python -c "import csv; rows=list(csv.DictReader(open('data/master.csv'))); p=[r for r in rows if r['product_id']=='5']; print(f'Product 5: {len(p)} regs')"
git add data/master.csv && git commit -m "feat(audit): add product 5 (Pansement) regulations"
```

---

## Task 10: Recherche et remplissage — Produit 6 (Vape / e-cigarette)

**Files:**
- Modify: `data/master.csv` (append rows)

**Régime activé :** Tabac + nicotine + batterie. Régime émergent, divergence massive (interdit dans certains pays, lourd en taxes ailleurs).

- [ ] **Step 1: Recherche tabac/vapotage**

```
EU      → Tobacco Products Directive 2014/40/EU (TPD)
EU      → TPD Article 20 (e-cigarettes notification ENDS)
US      → FDA Premarket Tobacco Product Application (PMTA)
US      → PACT Act (shipping restrictions)
US-CA   → CA Prop 56 + flavor ban
GB      → Tobacco and Related Products Regulations 2016
AU      → Therapeutic Goods (e-cigarette) Standard 2021
NZ      → Smokefree Environments Act
SG      → Banned for sale and use (Tobacco Act)
TH      → Banned (Customs Notification 2014)
IN      → Banned (PECA 2019)
BR      → ANVISA RDC 46/2009 (banned)
JP      → Pharmaceutical Affairs Law (nicotine = drug)
GCC     → KSA SFDA + UAE MOH (varying restrictions)
```

- [ ] **Step 2: Append CSV lines (~80-140 lignes)**

Inclure un statut `banned` pour les juridictions où le produit est interdit.

- [ ] **Step 3: Valider & Commit**

```bash
python -c "import csv; rows=list(csv.DictReader(open('data/master.csv'))); p=[r for r in rows if r['product_id']=='6']; print(f'Product 6: {len(p)} regs')"
git add data/master.csv && git commit -m "feat(audit): add product 6 (Vape) regulations"
```

---

## Task 11: Recherche et remplissage — Produit 7 (Capsule lessive pod)

**Files:**
- Modify: `data/master.csv` (append rows)

**Régime activé :** Détergent + emballage child-resistant + biocide. Régulations renforcées post incidents enfants (Tide Pod challenge).

- [ ] **Step 1: Recherche détergents + sécurité enfant**

```
EU      → Regulation (EU) 2026/405 (Detergent — successor of 648/2004)
EU      → Regulation 1272/2008 (CLP)
EU      → Regulation (EU) 2015/1297 (child-resistant packaging detergent caps)
EU      → BPR (EU) 528/2012 if biocide claim
US      → ASTM F3159 (Liquid Laundry Detergent Packets standard)
US      → CPSC 16 CFR Part 1700 (poison prevention packaging)
US      → EPA Safer Choice (if claims)
CN      → GB/T 13174 + GB 19258
KR      → K-REACH + Chemical Substances Control Act
JP      → APRTR + Household Goods Quality Labelling Act
CA      → Consumer Chemicals and Containers Regulations
GCC     → GSO 1361 + 2530 standards
```

- [ ] **Step 2: Append CSV lines (~90-130 lignes)**

- [ ] **Step 3: Valider & Commit**

```bash
python -c "import csv; rows=list(csv.DictReader(open('data/master.csv'))); p=[r for r in rows if r['product_id']=='7']; print(f'Product 7: {len(p)} regs')"
git add data/master.csv && git commit -m "feat(audit): add product 7 (Capsule lessive) regulations"
```

---

## Task 12: Recherche et remplissage — Produit 8 (Complément alimentaire vitamines)

**Files:**
- Modify: `data/master.csv` (append rows)

**Régime activé :** Frontière food/médicament. Très divergent (US = food, certains pays = OTC drug).

- [ ] **Step 1: Recherche compléments**

```
EU      → Directive 2002/46/EC (food supplements)
EU      → Regulation (EC) 1925/2006 (added vitamins/minerals)
EU      → Regulation (EC) 1924/2006 (nutrition & health claims)
EU      → Regulation (EU) 609/2013 (foods for specific groups)
US      → DSHEA 1994 (Dietary Supplement Health and Education Act)
US      → 21 CFR Part 111 (cGMP supplements)
US      → FDA Good Manufacturing Practices
CN      → Health Food Registration (NMPA blue hat)
JP      → Food with Function Claims (FFC) system
KR      → Health Functional Food Act
AU      → Therapeutic Goods Act (Listed/Registered medicine)
BR      → ANVISA RDC 243/2018
IN      → FSSAI Nutraceutical Regulations 2022
CODEX   → CAC/GL 55-2005 Guidelines on Vitamin/Mineral Food Supplements
```

- [ ] **Step 2: Append CSV lines (~100-150 lignes)**

- [ ] **Step 3: Valider & Commit**

```bash
python -c "import csv; rows=list(csv.DictReader(open('data/master.csv'))); p=[r for r in rows if r['product_id']=='8']; print(f'Product 8: {len(p)} regs')"
git add data/master.csv && git commit -m "feat(audit): add product 8 (Complément alimentaire) regulations"
```

---

## Task 13: Recherche et remplissage — Produit 9 (Legging sport synthétique)

**Files:**
- Modify: `data/master.csv` (append rows)

**Régime activé :** Textile + PFAS + DPP (Digital Product Passport) + devoir de vigilance + EPR textile.

- [ ] **Step 1: Recherche textile**

```
EU      → Regulation (EU) No 1007/2011 (textile fibre names + labelling)
EU      → REACH Annex XVII Entry 50 (azodyes) + Entry 72 (CMR)
EU      → ESPR (EU) 2024/1781 — Digital Product Passport textile (2027+)
EU      → CSDDD 2024 (Corporate Sustainability Due Diligence Directive)
EU      → PFAS restriction proposal (REACH XVII)
FR      → AGEC Loi anti-gaspillage (2020-105) + REP textile
DE      → Lieferkettengesetz (Supply Chain Due Diligence Act)
US      → FTC Textile Fiber Products Identification Act (16 CFR 303)
US-CA   → AB 1817 (PFAS ban in textile, 2025)
US-NY   → Fashion Sustainability Act (proposed)
CN      → GB 18401 (national textile safety standard)
JP      → JIS L 1902 (antibacterial textile)
OEKO-TEX → Standard 100 (voluntary, very widely used)
```

- [ ] **Step 2: Append CSV lines (~100-150 lignes)**

- [ ] **Step 3: Valider & Commit**

```bash
python -c "import csv; rows=list(csv.DictReader(open('data/master.csv'))); p=[r for r in rows if r['product_id']=='9']; print(f'Product 9: {len(p)} regs')"
git add data/master.csv && git commit -m "feat(audit): add product 9 (Legging textile) regulations"
```

---

## Task 14: Recherche et remplissage — Produit 10 (Casque vélo adulte)

**Files:**
- Modify: `data/master.csv` (append rows)

**Régime activé :** EPI catégorie II.

- [ ] **Step 1: Recherche EPI casque**

```
EU      → Regulation (EU) 2016/425 (PPE Regulation)
EU      → EN 1078 (Helmets for pedal cyclists)
US      → CPSC 16 CFR Part 1203 (Bicycle helmet)
AU      → AS/NZS 2063 (Bicycle helmets)
CA      → CSA D113.2 (Cycling helmets)
JP      → JIS T 8134
CN      → GB 24429
BR      → ABNT NBR 16175
SNELL   → Snell B-90 (voluntary US)
```

- [ ] **Step 2: Append CSV lines (~60-100 lignes)**

- [ ] **Step 3: Valider & Commit**

```bash
python -c "import csv; rows=list(csv.DictReader(open('data/master.csv'))); p=[r for r in rows if r['product_id']=='10']; print(f'Product 10: {len(p)} regs')"
git add data/master.csv && git commit -m "feat(audit): add product 10 (Casque vélo) regulations"
```

---

## ✅ Checkpoint Phase 1.A complete

Après Task 14, livrable intermédiaire : **CSV avec produits 1-10 complets** (~900-1500 lignes).

Vérifier :

```bash
python -c "
import csv
rows = list(csv.DictReader(open('data/master.csv')))
print(f'Total rows: {len(rows)}')
for pid in range(1, 11):
    p = [r for r in rows if r['product_id'] == str(pid)]
    print(f'Product {pid}: {len(p)} regs')
"
```

---

## Task 15: Recherche et remplissage — Produit 11 (Bouteille de vin)

**Files:**
- Modify: `data/master.csv` (append rows)

**Régime activé :** Alcool — excise, étiquetage santé, GIs/AOC, traçabilité.

- [ ] **Step 1: Recherche alcool**

```
EU      → Regulation (EU) 1308/2013 (CMO wine)
EU      → Regulation (EU) 2019/787 (spirits — exclude wine but reference)
EU      → Regulation (EU) 2021/2117 (PDO/PGI wine reform)
EU      → Directive 2011/64/EU (excise alcohol structure)
EU      → Ireland Public Health Alcohol Act (health warning labels 2026)
US      → TTB Federal Alcohol Administration Act
US      → TTB labelling (27 CFR Part 4)
US      → Surgeon General's warning (mandatory)
CA      → Health Canada + provincial monopolies
AU      → Australian Wine and Brandy Corp Act
JP      → Liquor Tax Act
CN      → GB 15037 (Wine national standard)
RU      → EAEU Technical Regulation 047/2018
ZA      → Liquor Products Act 60/1989
```

- [ ] **Step 2: Append CSV lines (~80-120 lignes)**

- [ ] **Step 3: Valider & Commit**

```bash
python -c "import csv; rows=list(csv.DictReader(open('data/master.csv'))); p=[r for r in rows if r['product_id']=='11']; print(f'Product 11: {len(p)} regs')"
git add data/master.csv && git commit -m "feat(audit): add product 11 (Vin) regulations"
```

---

## Task 16: Recherche et remplissage — Produit 12 (Steak emballé)

**Files:**
- Modify: `data/master.csv` (append rows)

**Régime activé :** Animal origin food — HACCP, vétérinaire, abattoir, halal/casher.

- [ ] **Step 1: Recherche viande fraîche**

```
EU      → Regulation (EC) 853/2004 (food of animal origin)
EU      → Regulation (EC) 852/2004 (food hygiene)
EU      → Regulation (EC) 178/2002 (general food law + traceability)
EU      → Regulation (EU) 1169/2011 (FIC labelling)
EU      → Regulation (EC) 1099/2009 (animal welfare slaughter)
US      → FSIS 21 CFR (USDA inspection)
US      → Federal Meat Inspection Act (21 USC 601)
CN      → GB 2707 (Hygienic standard meat)
JP      → Food Sanitation Law
KR      → Livestock Products Sanitary Control Act
GCC     → GSO 993 (Halal meat)
IL      → Kashrut Council regulations
CODEX   → CAC/RCP 58-2005 (meat hygiene)
```

- [ ] **Step 2: Append CSV lines (~80-130 lignes)**

- [ ] **Step 3: Valider & Commit**

```bash
python -c "import csv; rows=list(csv.DictReader(open('data/master.csv'))); p=[r for r in rows if r['product_id']=='12']; print(f'Product 12: {len(p)} regs')"
git add data/master.csv && git commit -m "feat(audit): add product 12 (Steak) regulations"
```

---

## Task 17: Recherche et remplissage — Produit 13 (Paracétamol OTC)

**Files:**
- Modify: `data/master.csv` (append rows)

**Régime activé :** Pharma humain OTC — AMM/FDA/EMA/NMPA, pharmacopée, sérialisation.

- [ ] **Step 1: Recherche pharma OTC**

```
EU      → Directive 2001/83/EC (medicinal products for human use)
EU      → Regulation (EU) 536/2014 (clinical trials)
EU      → Falsified Medicines Directive 2011/62/EU + Delegated Reg 2016/161 (serialisation)
EU      → European Pharmacopoeia (EDQM)
US      → FDA OTC Monograph + 21 CFR 343 (Internal analgesic)
US      → DSCSA (Drug Supply Chain Security Act) — serialisation
US      → USP monograph
CN      → NMPA OTC drug administration
JP      → PMD Act OTC class regulations
KR      → MFDS Pharmaceutical Affairs Act
IN      → CDSCO Drugs and Cosmetics Act 1940 (Schedule K OTC)
BR      → ANVISA RDC 98/2016
GCC     → SFDA pharmacopoeia + GCC Health Council
GLOBAL  → ICH guidelines (Q/E/S/M)
```

- [ ] **Step 2: Append CSV lines (~80-130 lignes)**

- [ ] **Step 3: Valider & Commit**

```bash
python -c "import csv; rows=list(csv.DictReader(open('data/master.csv'))); p=[r for r in rows if r['product_id']=='13']; print(f'Product 13: {len(p)} regs')"
git add data/master.csv && git commit -m "feat(audit): add product 13 (Paracétamol) regulations"
```

---

## Task 18: Recherche et remplissage — Produit 14 (Pneumatique voiture)

**Files:**
- Modify: `data/master.csv` (append rows)

**Régime activé :** Tyre labelling, ECE, REACH 6PPD, REP pneus.

- [ ] **Step 1: Recherche pneumatique**

```
EU      → Regulation (EU) 2020/740 (tyre labelling)
EU      → ECE R30 (passenger car tyres)
EU      → ECE R117 (rolling resistance + wet grip + noise)
EU      → REACH Restriction PAH in tyres (Entry 50 Annex XVII)
FR      → REP pneus (Aliapur) under L. 541-10 Environment Code
DE      → ElektroG + ARN tyres
US      → DOT FMVSS 109 + 119 (tyre standards)
US-CA   → 6PPD ban proposed (DTSC priority product 2024)
CN      → CCC mark for tyres (CNCA-C11-01)
JP      → JATMA standards + Road Vehicle Act
KR      → KMVSS regulations
BR      → INMETRO tyre certification
GCC     → GSO 1457 (passenger car tyres)
UNECE   → WP.29 (mother body for ECE regulations)
```

- [ ] **Step 2: Append CSV lines (~70-110 lignes)**

- [ ] **Step 3: Valider & Commit**

```bash
python -c "import csv; rows=list(csv.DictReader(open('data/master.csv'))); p=[r for r in rows if r['product_id']=='14']; print(f'Product 14: {len(p)} regs')"
git add data/master.csv && git commit -m "feat(audit): add product 14 (Pneumatique) regulations"
```

---

## Task 19: Recherche et remplissage — Produit 15 (Insecticide spray)

**Files:**
- Modify: `data/master.csv` (append rows)

**Régime activé :** Biocide produit fini (BPR), EPA FIFRA, emballage CR.

- [ ] **Step 1: Recherche biocide**

```
EU      → Biocidal Products Regulation (EU) 528/2012
EU      → REACH (EC) 1907/2006
EU      → CLP 1272/2008
EU      → Detergents Reg if surfactant content
FR      → Code de la santé publique L. 522 (Mise sur le marché)
US      → FIFRA (Federal Insecticide Fungicide and Rodenticide Act) — EPA reg #
US      → EPA Label Review Manual
US      → 40 CFR Part 152-180
US-CA   → DPR (Department of Pesticide Regulation)
CN      → MARA Pesticide Administration Regulation (2017)
JP      → Agricultural Chemicals Regulation Act
KR      → Agrochemicals Control Act
AU      → APVMA registration
BR      → ANVISA + IBAMA + MAPA tri-registry
GCC     → GSO 1942 + national pesticide laws
```

- [ ] **Step 2: Append CSV lines (~80-130 lignes)**

- [ ] **Step 3: Valider & Commit**

```bash
python -c "import csv; rows=list(csv.DictReader(open('data/master.csv'))); p=[r for r in rows if r['product_id']=='15']; print(f'Product 15: {len(p)} regs')"
git add data/master.csv && git commit -m "feat(audit): add product 15 (Insecticide) regulations"
```

---

## Task 20: Recherche et remplissage — Produit 16 (Drone grand public)

**Files:**
- Modify: `data/master.csv` (append rows)

**Régime activé :** Aviation civile + RF + batterie + RGPD caméra + AI Act.

- [ ] **Step 1: Recherche drone**

```
EU      → Regulation (EU) 2019/947 (UAS operations) + 2019/945 (UAS classes)
EU      → EASA Easy Access Rules for UAS
EU      → RED 2014/53/EU
EU      → AI Act 2024/1689 if AI features (real-time tracking)
EU      → GDPR if camera capture
FR      → Décret n°2018-374 (no-fly zones)
US      → FAA Part 107 (commercial small UAS)
US      → FAA Remote ID Rule 14 CFR 89
US      → FCC Part 15 (RF)
CN      → CAAC Civil UAV Manufacturer Registration
CN      → MIIT Radio Type Approval
JP      → MLIT UAV regulations + Civil Aeronautics Act
KR      → KOCA UAV regs
AU      → CASA Part 101 + RPA registration
BR      → ANAC RBAC-E n°94
GCC     → GCAA registration UAE + SCAA Saudi
ICAO    → Annex 19 (Safety Management)
```

- [ ] **Step 2: Append CSV lines (~80-130 lignes)**

- [ ] **Step 3: Valider & Commit**

```bash
python -c "import csv; rows=list(csv.DictReader(open('data/master.csv'))); p=[r for r in rows if r['product_id']=='16']; print(f'Product 16: {len(p)} regs')"
git add data/master.csv && git commit -m "feat(audit): add product 16 (Drone) regulations"
```

---

## Task 21: Recherche et remplissage — Produit 17 (Robot aspirateur connecté)

**Files:**
- Modify: `data/master.csv` (append rows)

**Régime activé :** Machinery + RED + CRA + AI Act + IoT. Régimes 2024-2027 récents.

- [ ] **Step 1: Recherche smart appliance**

```
EU      → Machinery Regulation (EU) 2023/1230 (replacing Directive 2006/42/EC)
EU      → Low Voltage Directive 2014/35/EU
EU      → EMC Directive 2014/30/EU
EU      → RED 2014/53/EU (Wi-Fi/Bluetooth)
EU      → Cyber Resilience Act (EU) 2024/2847 (in force 2027)
EU      → AI Act (EU) 2024/1689 (mapping if any AI feature)
EU      → Eco-design Regulation (EU) 2024/1781
US      → FCC Part 15
US      → UL 60335-2-2 (Particular requirements for vacuum cleaners)
US-CA   → SB-327 IoT Connected Devices Security Law
US      → FTC Section 5 (data security if connected)
CN      → CCC certification + IoT cybersecurity (CNCA-C18-01)
JP      → PSE mark + Telecom Business Law
KR      → KC mark + IoT Security Certification
AU      → RCM mark (EESS) + Cyber Security Act
GLOBAL  → ETSI EN 303 645 (Consumer IoT security)
```

- [ ] **Step 2: Append CSV lines (~100-150 lignes)**

- [ ] **Step 3: Valider & Commit**

```bash
python -c "import csv; rows=list(csv.DictReader(open('data/master.csv'))); p=[r for r in rows if r['product_id']=='17']; print(f'Product 17: {len(p)} regs')"
git add data/master.csv && git commit -m "feat(audit): add product 17 (Robot aspirateur) regulations"
```

---

## Task 22: Recherche et remplissage — Produit 18 (Implant dentaire)

**Files:**
- Modify: `data/master.csv` (append rows)

**Régime activé :** Dispositif médical classe III — le plus lourd des régimes médical.

- [ ] **Step 1: Recherche DM classe III**

```
EU      → MDR (EU) 2017/745 — DM classe III (full conformity assessment + Notified Body)
EU      → Annex VIII Classification rules
EU      → UDI + EUDAMED
EU      → ISO 13485 (QMS)
EU      → ISO 14971 (Risk management)
US      → FDA PMA (Premarket Approval) 21 CFR 814
US      → FDA UDI + GUDID
US      → 21 CFR Part 872 (Dental devices)
CN      → NMPA Class III Medical Device Registration
JP      → PMDA Class IV Highly Controlled Medical Device
KR      → MFDS Class IV Medical Device
CA      → Health Canada Class IV MDL
AU      → TGA Class III + ARTG
BR      → ANVISA RDC 185/2001 Class III/IV
IN      → CDSCO Medical Device Rules 2017 Class D
IMDRF   → Global Harmonization Task Force guidance
```

- [ ] **Step 2: Append CSV lines (~80-130 lignes)**

- [ ] **Step 3: Valider & Commit**

```bash
python -c "import csv; rows=list(csv.DictReader(open('data/master.csv'))); p=[r for r in rows if r['product_id']=='18']; print(f'Product 18: {len(p)} regs')"
git add data/master.csv && git commit -m "feat(audit): add product 18 (Implant dentaire) regulations"
```

---

## Task 23: Recherche et remplissage — Produit 19 (Peinture déco intérieure)

**Files:**
- Modify: `data/master.csv` (append rows)

**Régime activé :** VOC + REACH SVHC + qualité air intérieur + écolabel.

- [ ] **Step 1: Recherche peinture**

```
EU      → Directive 2004/42/EC (VOC content limits in decorative paints)
EU      → REACH (EC) 1907/2006 + Annex XVII (SVHC)
EU      → CLP 1272/2008
EU      → Eco-label Regulation (EC) 66/2010 (voluntary)
FR      → Décret 2011-321 (étiquetage émissions COV)
DE      → AgBB scheme (German emissions evaluation)
US      → EPA AIM Rule (40 CFR Part 59 Subpart D)
US-CA   → CARB SCM (Suggested Control Measure for architectural coatings)
US      → SCAQMD Rule 1113 (LA basin)
CN      → GB 18581 (Limit of harmful substances)
JP      → JIS K 5663 + Building Standard Law indoor air
KR      → Korea Eco-label + Indoor Air Quality Control Act
AU      → APAS + GreenTag voluntary schemes
GCC     → ESMA (UAE) + SASO (Saudi) green building rules
```

- [ ] **Step 2: Append CSV lines (~70-120 lignes)**

- [ ] **Step 3: Valider & Commit**

```bash
python -c "import csv; rows=list(csv.DictReader(open('data/master.csv'))); p=[r for r in rows if r['product_id']=='19']; print(f'Product 19: {len(p)} regs')"
git add data/master.csv && git commit -m "feat(audit): add product 19 (Peinture) regulations"
```

---

## Task 24: Recherche et remplissage — Produit 20 (Croquettes pour chien)

**Files:**
- Modify: `data/master.csv` (append rows)

**Régime activé :** Pet food — distinct du food humain. Animal by-products, claims, additifs.

- [ ] **Step 1: Recherche pet food**

```
EU      → Regulation (EC) 767/2009 (placing on market & use of feed)
EU      → Regulation (EC) 1069/2009 (animal by-products)
EU      → Regulation (EC) 1831/2003 (feed additives)
EU      → Regulation (EU) 2017/625 (official controls feed and food)
US      → FDA FSMA + 21 CFR Part 507 (Animal Food preventive controls)
US      → AAFCO Model Bill (state-level uniformity)
CN      → MARA Feed Hygiene Standards + GB 13078
JP      → Pet Food Safety Act (Law No. 83/2008)
KR      → Feed Control Act
AU      → AAFCO + state pet food standards + DAFF import
BR      → MAPA Normative Instructions on pet food
CA      → CFIA Feeds Act + AAFCO references
GCC     → GSO 1933 (Pet food)
IN      → BIS standards + FSSAI references
```

- [ ] **Step 2: Append CSV lines (~70-110 lignes)**

- [ ] **Step 3: Valider & Commit**

```bash
python -c "import csv; rows=list(csv.DictReader(open('data/master.csv'))); p=[r for r in rows if r['product_id']=='20']; print(f'Product 20: {len(p)} regs')"
git add data/master.csv && git commit -m "feat(audit): add product 20 (Croquettes chien) regulations"
```

---

## ✅ Checkpoint Phase 1.B complete

Après Task 24, livrable : **CSV univers complet** (~2 000-3 000 lignes).

Vérifier :

```bash
python -c "
import csv
rows = list(csv.DictReader(open('data/master.csv')))
print(f'TOTAL: {len(rows)} regulations')
for pid in range(1, 21):
    p = [r for r in rows if r['product_id'] == str(pid)]
    print(f'  P{pid:02d}: {len(p):4d} regs across {len(set(r[\"jurisdiction_code\"] for r in p))} jurisdictions')
"
```

---

## Task 25: Vérifier l'auth Cleo Legal API

**Files:** None (vérification interactive)

- [ ] **Step 1: Vérifier que l'auth OAuth Cleo Legal API est complétée**

L'utilisateur doit avoir tapé `/mcp` et complété l'auth pour `claude.ai CLEO LEGAL API`.

Tester avec une commande simple :

```bash
# Dans Claude Code, vérifier que les tools MCP commencent par mcp__claude_ai_CLEO_LEGAL_API__*
# (autres que authenticate / complete_authentication)
```

- [ ] **Step 2: Si auth manquante, demander à l'utilisateur**

Message à afficher : "L'auth Cleo Legal API n'est pas encore faite. Tape `/mcp` et sélectionne 'claude.ai CLEO LEGAL API' avant de continuer."

- [ ] **Step 3: Lister les endpoints disponibles**

Une fois auth, utiliser `ToolSearch` pour découvrir les endpoints disponibles :

```
query: "mcp__claude_ai_CLEO_LEGAL_API"
max_results: 20
```

Documenter les endpoints découverts dans `audits/.../scripts/api_endpoints.md`.

---

## Task 26: Écrire audit_cross_check.py — Logique de matching

**Files:**
- Create: `audits/product-compliance-worldwide-2026/scripts/audit_cross_check.py`

- [ ] **Step 1: Écrire le script de cross-check**

Contenu exact :

```python
#!/usr/bin/env python3
"""
audit_cross_check.py — Cross-check master.csv against Cleo Legal Data API.

Pour chaque ligne du CSV, tente de matcher la régulation avec un enregistrement
dans Cleo Legal API selon 3 méthodes :
  1. exact_ref : match exact sur regulation_ref normalisée (ex: "1223/2009")
  2. fuzzy_name : Levenshtein > 0.85 sur nom court
  3. contextual : match sur (région + domaine + autorité)

Output : master.csv enrichi avec legal_api_match, legal_api_id, legal_api_match_method.

USAGE:
    python audit_cross_check.py --input data/master.csv --output data/master.csv

PRÉREQUIS:
    Le client MCP Cleo Legal API doit être authentifié (via /mcp dans Claude Code).
    Ce script attend en stdin un JSON {regulations: [...]} dump de l'API,
    OU il appellera directement l'API via le wrapper MCP CLI si dispo.
"""

import argparse
import csv
import json
import re
import sys
from pathlib import Path
from difflib import SequenceMatcher


def normalize_ref(ref: str) -> str:
    """Normalize a regulation reference for exact matching.
    
    Examples:
        "(EC) No 1223/2009" -> "1223/2009"
        "Regulation EU 2017/745" -> "2017/745"
        "21 CFR Part 700" -> "21 CFR 700"
    """
    if not ref:
        return ""
    # Strip prefixes
    s = re.sub(r"^(regulation|directive|reg\.?|dir\.?)\s+", "", ref, flags=re.IGNORECASE)
    s = re.sub(r"^\(?(ec|eu|eec)\)?\s+(no\.?\s+)?", "", s, flags=re.IGNORECASE)
    # Compact whitespace
    s = " ".join(s.split())
    return s.strip().lower()


def fuzzy_score(a: str, b: str) -> float:
    """Levenshtein-like ratio."""
    if not a or not b:
        return 0.0
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def load_legal_api_dump(path: Path) -> list[dict]:
    """Load the Cleo Legal API regulations dump.
    
    Expects a JSON file with structure: {"regulations": [{"id":..., "name":..., 
    "full_name":..., "region":..., "regulatory_domain":..., "enforcement_body":...}, ...]}
    """
    with open(path) as f:
        data = json.load(f)
    return data.get("regulations", data) if isinstance(data, dict) else data


def find_match(csv_row: dict, api_regs: list[dict]) -> tuple[str, str, str]:
    """Return (match_status, api_id, method).
    
    match_status: FOUND / PARTIAL / NOT_FOUND
    """
    csv_ref = normalize_ref(csv_row.get("regulation_ref", ""))
    csv_name = csv_row.get("regulation_name", "").lower()
    csv_region = csv_row.get("region", "").lower()
    csv_jurisdiction = csv_row.get("jurisdiction_code", "")
    
    # Pass 1: exact ref match
    if csv_ref:
        for r in api_regs:
            api_ref = normalize_ref(r.get("full_name", "")) or normalize_ref(r.get("name", ""))
            if api_ref and csv_ref in api_ref:
                return "FOUND", r["id"], "exact_ref"
    
    # Pass 2: fuzzy name match (>0.85)
    best_score = 0.0
    best_id = None
    for r in api_regs:
        api_name = (r.get("name", "") + " " + r.get("full_name", "")).lower()
        score = fuzzy_score(csv_name, api_name)
        if score > best_score:
            best_score = score
            best_id = r["id"]
    
    if best_score >= 0.85 and best_id:
        return "FOUND", best_id, "fuzzy_name"
    
    # Pass 3: contextual (region + domain)
    domain_keywords = csv_row.get("product_regime_tag", "").lower().split(" + ")
    for r in api_regs:
        api_region = (r.get("region", "") or "").lower()
        api_domain = (r.get("regulatory_domain", "") or "").lower()
        if csv_region in api_region or api_region in csv_region:
            if any(kw in api_domain for kw in domain_keywords if kw):
                return "PARTIAL", r["id"], "contextual"
    
    return "NOT_FOUND", "", ""


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True, help="Path to master.csv")
    parser.add_argument("--output", required=True, help="Path to output annotated CSV")
    parser.add_argument("--api-dump", required=True, help="Path to Legal API regulations JSON dump")
    args = parser.parse_args()
    
    api_regs = load_legal_api_dump(Path(args.api_dump))
    print(f"Loaded {len(api_regs)} regulations from Legal API dump", file=sys.stderr)
    
    with open(args.input) as f_in:
        reader = csv.DictReader(f_in)
        rows = list(reader)
        fieldnames = reader.fieldnames
    
    found = partial = missing = 0
    for row in rows:
        status, api_id, method = find_match(row, api_regs)
        row["legal_api_match"] = status
        row["legal_api_id"] = api_id
        row["legal_api_match_method"] = method
        if status == "FOUND":
            found += 1
            row["gap_action"] = "OK"
        elif status == "PARTIAL":
            partial += 1
            row["gap_action"] = "À enrichir"
        else:
            missing += 1
            row["gap_action"] = "À ajouter"
    
    with open(args.output, "w") as f_out:
        writer = csv.DictWriter(f_out, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    
    total = len(rows)
    print(f"Cross-check complete: {found}/{total} FOUND ({100*found/total:.1f}%), "
          f"{partial}/{total} PARTIAL ({100*partial/total:.1f}%), "
          f"{missing}/{total} NOT_FOUND ({100*missing/total:.1f}%)", file=sys.stderr)


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Tester sur un sous-ensemble (smoke test)**

Préparer un dump JSON minimal pour tester :

```bash
cd /Users/naomiehalioua/cleo-legaldata-public/audits/product-compliance-worldwide-2026
cat > /tmp/test-api-dump.json <<'EOF'
{
  "regulations": [
    {
      "id": "65a1e5e2-ae9c-46dd-bf66-9699ef765423",
      "name": "Regulation (EC) No 1223/2009",
      "full_name": "Regulation (EC) No 1223/2009 of the European Parliament and of the Council on Cosmetic Products",
      "region": "European Union",
      "regulatory_domain": "Cosmétiques",
      "enforcement_body": "EC DG GROW"
    }
  ]
}
EOF

python scripts/audit_cross_check.py --input data/master.csv --output /tmp/test-out.csv --api-dump /tmp/test-api-dump.json
```

Expected : un message stderr indiquant FOUND/PARTIAL/NOT_FOUND counts. La ligne shampoing EU 1223/2009 doit être tagée `FOUND` via `exact_ref`.

- [ ] **Step 3: Commit**

```bash
git add scripts/audit_cross_check.py
git commit -m "feat(audit): add cross-check script with 3-pass matching"
```

---

## Task 27: Pull le dump complet de Cleo Legal API

**Files:**
- Create: `audits/product-compliance-worldwide-2026/data/legal-api-dump.json`

- [ ] **Step 1: Identifier l'endpoint de liste des régulations**

Une fois auth OAuth complétée, les endpoints disponibles dépendent de l'API. Avec ToolSearch :

```
query: "mcp__claude_ai_CLEO_LEGAL_API regulations"
max_results: 5
```

Lister tous les endpoints commençant par `mcp__claude_ai_CLEO_LEGAL_API__list_*` ou `mcp__claude_ai_CLEO_LEGAL_API__get_*`.

- [ ] **Step 2: Pull la liste complète**

Appeler l'endpoint listing (probablement `list_regulations` ou équivalent) avec pagination jusqu'à épuisement. Sauvegarder le JSON brut dans `data/legal-api-dump.json` :

```json
{
  "fetched_at": "2026-05-26T...",
  "total_count": <N>,
  "regulations": [...]
}
```

- [ ] **Step 3: Valider la structure**

```bash
python -c "
import json
data = json.load(open('data/legal-api-dump.json'))
regs = data.get('regulations', [])
print(f'Total regs in dump: {len(regs)}')
print(f'Sample: {regs[0] if regs else \"empty\"}')
"
```

- [ ] **Step 4: Commit**

```bash
git add data/legal-api-dump.json
git commit -m "feat(audit): pull full Cleo Legal API regulations dump"
```

---

## Task 28: Exécuter le cross-check sur le master.csv complet

**Files:**
- Modify: `data/master.csv` (rempli avec colonnes legal_api_*)

- [ ] **Step 1: Backup avant exécution**

```bash
cp data/master.csv data/master.csv.bak
```

- [ ] **Step 2: Lancer le cross-check**

```bash
python scripts/audit_cross_check.py \
    --input data/master.csv \
    --output data/master.csv \
    --api-dump data/legal-api-dump.json
```

Expected stderr :
```
Loaded N regulations from Legal API dump
Cross-check complete: X/Y FOUND (Z%), A/Y PARTIAL (B%), C/Y NOT_FOUND (D%)
```

- [ ] **Step 3: Vérifier la couverture**

```bash
python -c "
import csv
rows = list(csv.DictReader(open('data/master.csv')))
from collections import Counter
status_counts = Counter(r['legal_api_match'] for r in rows)
print('Match status breakdown:')
for k, v in status_counts.most_common():
    print(f'  {k}: {v} ({100*v/len(rows):.1f}%)')
"
```

- [ ] **Step 4: Commit**

```bash
git add data/master.csv
git commit -m "feat(audit): cross-check master.csv against Cleo Legal API"
```

---

## Task 29: Générer gaps-summary.md

**Files:**
- Create: `audits/product-compliance-worldwide-2026/scripts/generate_gaps.py`
- Create: `audits/product-compliance-worldwide-2026/outputs/gaps-summary.md`

- [ ] **Step 1: Écrire generate_gaps.py**

Contenu :

```python
#!/usr/bin/env python3
"""Génère outputs/gaps-summary.md à partir du master.csv annoté."""

import csv
from collections import defaultdict
from pathlib import Path

CSV_PATH = Path(__file__).parent.parent / "data" / "master.csv"
OUT_PATH = Path(__file__).parent.parent / "outputs" / "gaps-summary.md"

CRITICALITY_ORDER = {"critical": 0, "high": 1, "medium": 2, "low": 3}


def main():
    rows = list(csv.DictReader(open(CSV_PATH)))
    
    # Filtrer NOT_FOUND
    gaps = [r for r in rows if r["legal_api_match"] == "NOT_FOUND"]
    
    # Trier par criticité puis par produit
    gaps.sort(key=lambda r: (CRITICALITY_ORDER.get(r["criticality"], 99), r["product_id"]))
    
    # Group by criticality
    by_crit = defaultdict(list)
    for g in gaps:
        by_crit[g["criticality"]].append(g)
    
    lines = ["# Cleo Legal API — Gaps Summary\n"]
    lines.append(f"Total gaps: {len(gaps)} régulations manquantes sur {len(rows)} attendues.\n")
    lines.append("Classées par criticité (critical > high > medium > low).\n\n---\n")
    
    for crit in ["critical", "high", "medium", "low"]:
        items = by_crit.get(crit, [])
        if not items:
            continue
        lines.append(f"\n## {crit.upper()} ({len(items)} gaps)\n\n")
        lines.append("| Produit | Juridiction | Régulation | Référence | Autorité |\n")
        lines.append("|---|---|---|---|---|\n")
        for g in items[:50]:  # cap at 50 per criticality
            lines.append(f"| {g['product_name']} | {g['jurisdiction_name']} | {g['regulation_name']} | "
                        f"{g['regulation_ref']} | {g['enforcement_body']} |\n")
        if len(items) > 50:
            lines.append(f"\n*({len(items) - 50} autres gaps de criticité {crit} non listés ici — voir master.csv)*\n")
    
    OUT_PATH.write_text("".join(lines))
    print(f"Wrote {OUT_PATH} ({len(gaps)} gaps)")


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Exécuter le script**

```bash
python scripts/generate_gaps.py
```

Expected stdout : `Wrote outputs/gaps-summary.md (N gaps)`

- [ ] **Step 3: Vérifier le contenu**

```bash
head -50 outputs/gaps-summary.md
```

- [ ] **Step 4: Commit**

```bash
git add scripts/generate_gaps.py outputs/gaps-summary.md
git commit -m "feat(audit): generate gaps summary by criticality"
```

---

## Task 30: Générer coverage-dashboard.md

**Files:**
- Create: `audits/product-compliance-worldwide-2026/scripts/generate_dashboard.py`
- Create: `audits/product-compliance-worldwide-2026/outputs/coverage-dashboard.md`

- [ ] **Step 1: Écrire generate_dashboard.py**

Contenu :

```python
#!/usr/bin/env python3
"""Génère outputs/coverage-dashboard.md : taux de couverture par produit, par région."""

import csv
from collections import defaultdict
from pathlib import Path

CSV_PATH = Path(__file__).parent.parent / "data" / "master.csv"
OUT_PATH = Path(__file__).parent.parent / "outputs" / "coverage-dashboard.md"


def coverage_pct(rows):
    if not rows:
        return 0.0
    found = sum(1 for r in rows if r["legal_api_match"] == "FOUND")
    return 100.0 * found / len(rows)


def main():
    rows = list(csv.DictReader(open(CSV_PATH)))
    total = len(rows)
    found = sum(1 for r in rows if r["legal_api_match"] == "FOUND")
    partial = sum(1 for r in rows if r["legal_api_match"] == "PARTIAL")
    missing = sum(1 for r in rows if r["legal_api_match"] == "NOT_FOUND")
    
    lines = ["# Cleo Legal API — Coverage Dashboard\n\n"]
    lines.append(f"## Global\n\n")
    lines.append(f"- **Total régulations attendues** : {total}\n")
    lines.append(f"- ✅ **FOUND** : {found} ({100*found/total:.1f}%)\n")
    lines.append(f"- 🟡 **PARTIAL** : {partial} ({100*partial/total:.1f}%)\n")
    lines.append(f"- ❌ **NOT_FOUND** : {missing} ({100*missing/total:.1f}%)\n\n")
    
    # Par produit
    lines.append("## Couverture par produit\n\n")
    lines.append("| ID | Produit | Total | FOUND | PARTIAL | NOT_FOUND | % Couvert |\n")
    lines.append("|---|---|---|---|---|---|---|\n")
    by_product = defaultdict(list)
    for r in rows:
        by_product[r["product_id"]].append(r)
    for pid in sorted(by_product.keys(), key=int):
        prows = by_product[pid]
        f = sum(1 for r in prows if r["legal_api_match"] == "FOUND")
        p = sum(1 for r in prows if r["legal_api_match"] == "PARTIAL")
        m = sum(1 for r in prows if r["legal_api_match"] == "NOT_FOUND")
        name = prows[0]["product_name"]
        lines.append(f"| {pid} | {name} | {len(prows)} | {f} | {p} | {m} | {coverage_pct(prows):.1f}% |\n")
    
    # Par région
    lines.append("\n## Couverture par région\n\n")
    lines.append("| Région | Total | FOUND | PARTIAL | NOT_FOUND | % Couvert |\n")
    lines.append("|---|---|---|---|---|---|\n")
    by_region = defaultdict(list)
    for r in rows:
        by_region[r["region"]].append(r)
    for region in sorted(by_region.keys()):
        rrows = by_region[region]
        f = sum(1 for r in rrows if r["legal_api_match"] == "FOUND")
        p = sum(1 for r in rrows if r["legal_api_match"] == "PARTIAL")
        m = sum(1 for r in rrows if r["legal_api_match"] == "NOT_FOUND")
        lines.append(f"| {region} | {len(rrows)} | {f} | {p} | {m} | {coverage_pct(rrows):.1f}% |\n")
    
    # Par criticité
    lines.append("\n## Couverture par criticité\n\n")
    lines.append("| Criticité | Total | FOUND | PARTIAL | NOT_FOUND | % Couvert |\n")
    lines.append("|---|---|---|---|---|---|\n")
    by_crit = defaultdict(list)
    for r in rows:
        by_crit[r["criticality"]].append(r)
    for crit in ["critical", "high", "medium", "low"]:
        crows = by_crit.get(crit, [])
        if not crows:
            continue
        f = sum(1 for r in crows if r["legal_api_match"] == "FOUND")
        p = sum(1 for r in crows if r["legal_api_match"] == "PARTIAL")
        m = sum(1 for r in crows if r["legal_api_match"] == "NOT_FOUND")
        lines.append(f"| {crit} | {len(crows)} | {f} | {p} | {m} | {coverage_pct(crows):.1f}% |\n")
    
    OUT_PATH.write_text("".join(lines))
    print(f"Wrote {OUT_PATH}")


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Exécuter le script**

```bash
python scripts/generate_dashboard.py
```

Expected : `Wrote outputs/coverage-dashboard.md`

- [ ] **Step 3: Vérifier le contenu**

```bash
cat outputs/coverage-dashboard.md
```

- [ ] **Step 4: Commit**

```bash
git add scripts/generate_dashboard.py outputs/coverage-dashboard.md
git commit -m "feat(audit): generate coverage dashboard by product/region/criticality"
```

---

## Task 31: Mettre à jour le README et tag final

**Files:**
- Modify: `audits/product-compliance-worldwide-2026/README.md`

- [ ] **Step 1: Mettre à jour le README avec les résultats finaux**

Ajouter une section "## Results" en haut du README avec :
- Coverage global %
- Top 3 produits les mieux couverts
- Top 3 produits les moins couverts
- Total gaps critiques

Exemple :

```markdown
## Results (2026-05-30)

- Coverage global : **X%** (Y/Z régulations trouvées)
- Top couvertures : Produit A (95%), Produit B (88%), Produit C (76%)
- Faibles couvertures : Produit X (12%), Produit Y (5%), Produit Z (0%)
- **N gaps critiques** identifiés — voir [gaps-summary.md](outputs/gaps-summary.md)
```

- [ ] **Step 2: Cocher les phases complétées en haut du README**

```markdown
## Status
- [x] Phase 1.A — Univers produits 1-10
- [x] Phase 1.B — Univers produits 11-20
- [x] Phase 2 — Cross-check Legal API
- [x] Phase 3 — Synthèse
```

- [ ] **Step 3: Commit final + tag**

```bash
git add audits/product-compliance-worldwide-2026/README.md
git commit -m "docs(audit): finalize README with results summary"
git tag audit-2026-v1.0
```

---

## ✅ Audit complet

Livrables finaux :

| Fichier | Contenu |
|---|---|
| `data/products.json` | 20 produits avec metadata |
| `data/jurisdictions.json` | 50 juridictions avec metadata |
| `data/master.csv` | ~2 000-3 000 lignes (régulations × produits × juridictions × match Legal API) |
| `data/legal-api-dump.json` | Snapshot de Cleo Legal API au moment de l'audit |
| `outputs/gaps-summary.md` | Top régulations manquantes par criticité |
| `outputs/coverage-dashboard.md` | Taux de couverture par produit/région/criticité |
| `scripts/audit_cross_check.py` | Script de re-run du cross-check |
| `scripts/generate_gaps.py` | Génère le rapport gaps |
| `scripts/generate_dashboard.py` | Génère le dashboard |
| `README.md` | Documentation complète + résultats |

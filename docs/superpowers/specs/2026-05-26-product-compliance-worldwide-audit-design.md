# Audit Worldwide Product Compliance × Cleo Legal Data API

**Date** : 2026-05-26
**Auteur** : Naomie (Cleo Labs)
**Statut** : Draft pour validation

---

## 1. Objectif

Vérifier si la base de données Cleo Legal Data API couvre exhaustivement la réglementation produit worldwide, en partant de 20 produits stratégiquement choisis pour activer ~98% des régimes réglementaires mondiaux.

**Question business** : « Pour chacun de ces 20 produits, est-ce que toutes les réglementations à tracker dans le monde sont déjà dans Cleo Legal Data API ? Si non, lesquelles manquent et avec quelle criticité ? »

## 2. Périmètre

### 2.1 Produits couverts (20)

Sélectionnés pour activer un maximum de régimes réglementaires distincts.

| # | Produit | Régimes activés |
|---|---|---|
| 1 | Shampoing | Cosmétique rinse-off, chimie, emballage, claims |
| 2 | Crème solaire | Cosmétique leave-on, filtres UV, nano, environnement marin |
| 3 | Smartphone | Électronique, télécom/RF, batterie Li-ion, RoHS, REACH, USB-C, DEEE |
| 4 | Peluche bébé 0-3 ans | Jouet EN 71, ASTM F963, GB 6675, textile, flammabilité, phtalates |
| 5 | Pansement adhésif | Dispositif médical classe I (MDR, FDA 510(k), NMPA, PMDA) |
| 6 | Vape / e-cigarette | Tabac (TPD, FDA tobacco), nicotine, batterie, plain packaging |
| 7 | Capsule lessive (pod) | Détergent, sécurité enfant (CR caps), chimie, emballage |
| 8 | Complément alimentaire vitamines | Foods for specific groups, claims santé, contaminants |
| 9 | Legging sport synthétique | Textile, REACH, PFAS, OEKO-TEX, EPR textile, DPP, devoir de vigilance |
| 10 | Casque vélo adulte | EPI catégorie II, CE, ANSI/CPSC |
| 11 | Bouteille de vin | Alcool : excise, étiquetage santé, GIs/AOC, traçabilité |
| 12 | Steak emballé (viande fraîche) | Animal origin food (853/2004), vétérinaire, HACCP, halal/casher |
| 13 | Paracétamol OTC | Pharma humain : AMM/FDA/EMA/NMPA, pharmacopée, sérialisation |
| 14 | Pneumatique voiture | Tyre labelling, ECE R30/R117, REACH 6PPD, REP pneus |
| 15 | Insecticide spray maison | Biocide BPR, EPA FIFRA, emballage CR |
| 16 | Drone grand public | EASA/FAA drone, RF, batterie Li-Po, RGPD caméra, AI Act |
| 17 | Robot aspirateur connecté | Machinery Directive, RED, Cyber Resilience Act, AI Act, IoT |
| 18 | Implant dentaire | Dispositif médical classe III (MDR, UDI, EUDAMED, FDA PMA) |
| 19 | Peinture déco intérieure | COV/VOC (2004/42), REACH SVHC, écolabel |
| 20 | Croquettes pour chien | Pet food (UE 767/2009), animal by-products, claims |

### 2.2 Juridictions cibles (50)

Couvrent 99% du commerce mondial.

**Europe (13)** : UE (bloc), France, Allemagne, Italie, Espagne, Pays-Bas, UK, Suisse, Norvège, Russie, Turquie, Ukraine, EAEU (bloc)

**Amériques (10)** : US fédéral, Californie, New York, Canada, Mexique, Brésil, Argentine, Chili, Colombie, Mercosur (bloc)

**Asie-Pacifique (15)** : Chine, Hong Kong, Taiwan, Japon, Corée du Sud, Singapour, Malaisie, Thaïlande, Vietnam, Indonésie, Philippines, Inde, Australie, Nouvelle-Zélande, ASEAN (bloc)

**Moyen-Orient & Afrique (7)** : GCC (Arabie, EAU, Qatar, Bahrein, Koweït, Oman, bloc), Israël, Égypte, Maroc, Afrique du Sud, Nigeria, Kenya

**International (5)** : Codex Alimentarius, ISO/IEC, UNECE WP.29, WADA, OECD

### 2.3 Hors périmètre

- Régulations B2B/professionnelles (sauf si elles s'appliquent aussi en B2C)
- Réglementations purement nationales d'États non listés (couvertes en phase 2 si besoin)
- Régulations historiques abrogées

## 3. Structure du livrable

### 3.1 Format

**Un fichier CSV principal** : `product-compliance-worldwide-audit.csv`
- ~20 produits × ~50 juridictions × moyenne 2-3 régs par case = **~2 000 à 3 000 lignes**
- Chaque ligne = 1 couple (produit, juridiction, réglementation)

### 3.2 Schéma des colonnes

| Colonne | Type | Exemple |
|---|---|---|
| `product_id` | int | 1 |
| `product_name` | string | Shampoing |
| `product_regime_tag` | string | Cosmétique rinse-off |
| `jurisdiction_code` | string | EU |
| `jurisdiction_name` | string | European Union |
| `region` | string | Europe |
| `regulation_name` | string | EU Cosmetics Regulation |
| `regulation_ref` | string | (EC) No 1223/2009 |
| `enforcement_body` | string | EC DG GROW + NCAs |
| `key_requirements` | string | CPNP notification, PIF, Responsible Person, safety assessment |
| `status` | enum | in_force / proposed / adopted_not_yet_in_force |
| `criticality` | enum | critical / high / medium / low |
| `legal_api_match` | enum | FOUND / NOT_FOUND / PARTIAL |
| `legal_api_id` | string | UUID si trouvé |
| `legal_api_match_method` | string | exact_ref / fuzzy_name / manual |
| `gap_action` | string | À ajouter / À enrichir / OK |
| `notes` | string | Libre |

### 3.3 Livrables annexes

- `gaps-summary.md` : Top 50 régulations critiques manquantes, classées par criticité × volume commercial
- `coverage-dashboard.md` : Taux de couverture par produit, par région, par criticité
- `scripts/audit-cross-check.py` : Script de re-run du cross-check Legal API (pour relancer après évolutions de la DB)

## 4. Méthodologie

### 4.1 Construction de l'univers (Phase 1)

Pour chaque couple (produit × juridiction), recherche systématique LLM des régulations applicables :
- Sources primaires : portails officiels (EUR-Lex, eCFR, CFDA China, MHLW Japan, etc.)
- Sources secondaires : guides de marché (CIRS Group, SGS, TÜV, Intertek)
- Validation croisée sur 2 sources minimum par régulation citée

### 4.2 Cross-check Cleo Legal Data API (Phase 2)

Prérequis : authentification OAuth complétée sur le serveur MCP `claude.ai CLEO LEGAL API` (api.legaldata.cleolabs.co/mcp).

Pour chaque régulation de l'univers :
1. **Match exact** sur référence officielle (ex: "1223/2009")
2. **Match fuzzy** sur nom court de régulation (Levenshtein > 0.85)
3. **Match contextuel** sur (région + domaine + autorité)

Tag du résultat :
- `FOUND` : match exact ou fuzzy validé
- `PARTIAL` : régulation présente mais sans tous les champs (résumé manquant, deadline absente, etc.)
- `NOT_FOUND` : aucun match — gap confirmé

### 4.3 Criticité des gaps

Échelle attribuée à chaque ligne :
- **critical** : régulation phare du régime, sanction pénale ou retrait marché possible (ex: Cosmetics Regulation EU, FDA 510(k))
- **high** : régulation obligatoire avec sanctions administratives lourdes
- **medium** : régulation sectorielle ou récente importante (ex: AI Act, CRA)
- **low** : régulation marginale, niche, ou en cours d'abrogation

## 5. Phasage

| Phase | Livrable | Durée estimée |
|---|---|---|
| **0** | Validation spec + auth Cleo Legal API + structure CSV vide | aujourd'hui |
| **1.A** | Univers complet — produits 1 à 10 × 50 juridictions | 2 jours |
| **1.B** | Univers complet — produits 11 à 20 × 50 juridictions | 2 jours |
| **2** | Cross-check automatisé contre Cleo Legal API | 1 jour |
| **3** | Synthèse gaps + dashboard couverture + recommandations | 1 jour |

Livrable partiel à chaque fin de phase pour itération.

## 6. Hypothèses & risques

### 6.1 Hypothèses
- Cleo Legal API expose un endpoint `list_regulations` ou équivalent permettant de récupérer la base complète
- L'auth OAuth peut être complétée par Naomie via `/mcp`
- Les régulations dans Legal API ont une référence officielle (ex: "1223/2009") permettant le match exact

### 6.2 Risques
- **R1** : Si Legal API n'a pas d'endpoint listing, le cross-check sera manuel par recherche → fallback : recherche ID par ID via `get_regulation`
- **R2** : Une régulation peut exister sous plusieurs noms (FR/EN/local) → mitigation : match sur référence officielle prioritaire
- **R3** : Certaines juridictions secondaires (Afrique, MENA) ont peu de documentation publique en anglais → mitigation : marquer ces cases comme "best effort" avec note

## 7. Critères de succès

- ✅ Les 20 produits sont documentés avec régulations applicables pour ≥ 40 des 50 juridictions cibles
- ✅ Chaque ligne du CSV a un statut `FOUND` / `PARTIAL` / `NOT_FOUND` non vide
- ✅ Le `gaps-summary.md` identifie les 50 régulations critiques prioritaires à ajouter à Cleo Legal API
- ✅ Le script `audit-cross-check.py` est rejouable

## 8. Next steps après validation

1. Naomie complète l'auth OAuth Cleo Legal API via `/mcp`
2. Création du CSV vide avec toutes les lignes (20 produits × 50 juridictions × N régs/case)
3. Démarrage Phase 1.A

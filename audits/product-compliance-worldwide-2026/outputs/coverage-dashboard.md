# Cleo Legal API — Coverage Dashboard

_Cross-check du 2026-05-27 contre 78 régulations Cleo Legal API (proxy via Cleo Insight)._

## Global

- **Total régulations attendues** : 1761
- ✅ **FOUND** : 1121 (63.7%)  █████████████░░░░░░░
- 🟡 **PARTIAL** : 0 (0.0%)
- ❌ **NOT_FOUND** : 640 (36.3%)

## Couverture par produit

| ID | Produit | Total | FOUND | NOT_FOUND | % | Bar |
|---|---|---:|---:|---:|---:|---|
| 1 | Shampoing | 89 | 62 | 27 | 69.7% | ██████████░░░░░ |
| 2 | Crème solaire | 109 | 53 | 56 | 48.6% | ███████░░░░░░░░ |
| 3 | Smartphone | 184 | 143 | 41 | 77.7% | ████████████░░░ |
| 4 | Peluche bébé 0-3 ans | 122 | 85 | 37 | 69.7% | ██████████░░░░░ |
| 5 | Pansement adhésif | 74 | 50 | 24 | 67.6% | ██████████░░░░░ |
| 6 | Vape / e-cigarette | 64 | 18 | 46 | 28.1% | ████░░░░░░░░░░░ |
| 7 | Capsule lessive (pod) | 105 | 58 | 47 | 55.2% | ████████░░░░░░░ |
| 8 | Complément alimentaire vitamines | 67 | 31 | 36 | 46.3% | ███████░░░░░░░░ |
| 9 | Legging sport synthétique | 79 | 68 | 11 | 86.1% | █████████████░░ |
| 10 | Casque vélo adulte | 60 | 31 | 29 | 51.7% | ████████░░░░░░░ |
| 11 | Bouteille de vin | 77 | 58 | 19 | 75.3% | ███████████░░░░ |
| 12 | Steak emballé (viande fraîche) | 82 | 74 | 8 | 90.2% | ██████████████░ |
| 13 | Paracétamol OTC | 91 | 78 | 13 | 85.7% | █████████████░░ |
| 14 | Pneumatique voiture | 82 | 72 | 10 | 87.8% | █████████████░░ |
| 15 | Insecticide spray maison | 70 | 57 | 13 | 81.4% | ████████████░░░ |
| 16 | Drone grand public | 73 | 24 | 49 | 32.9% | █████░░░░░░░░░░ |
| 17 | Robot aspirateur connecté | 104 | 86 | 18 | 82.7% | ████████████░░░ |
| 18 | Implant dentaire | 75 | 47 | 28 | 62.7% | █████████░░░░░░ |
| 19 | Peinture déco intérieure | 86 | 17 | 69 | 19.8% | ███░░░░░░░░░░░░ |
| 20 | Croquettes pour chien | 68 | 9 | 59 | 13.2% | ██░░░░░░░░░░░░░ |

## Couverture par région

| Région | Total | FOUND | NOT_FOUND | % | Bar |
|---|---:|---:|---:|---:|---|
| Americas | 381 | 240 | 141 | 63.0% | █████████░░░░░░ |
| Asia-Pacific | 524 | 321 | 203 | 61.3% | █████████░░░░░░ |
| Europe | 542 | 391 | 151 | 72.1% | ███████████░░░░ |
| International | 123 | 58 | 65 | 47.2% | ███████░░░░░░░░ |
| MENA & Africa | 191 | 111 | 80 | 58.1% | █████████░░░░░░ |

## Couverture par criticité

| Criticité | Total | FOUND | NOT_FOUND | % | Bar |
|---|---:|---:|---:|---:|---|
| critical | 747 | 571 | 176 | 76.4% | ███████████░░░░ |
| high | 613 | 397 | 216 | 64.8% | ██████████░░░░░ |
| medium | 185 | 104 | 81 | 56.2% | ████████░░░░░░░ |
| low | 62 | 23 | 39 | 37.1% | ██████░░░░░░░░░ |

## Top 5 produits les mieux couverts

| Rang | Produit | Coverage |
|---|---|---:|
| 1 | Steak emballé (viande fraîche) | 90.2% (74/82) |
| 2 | Pneumatique voiture | 87.8% (72/82) |
| 3 | Legging sport synthétique | 86.1% (68/79) |
| 4 | Paracétamol OTC | 85.7% (78/91) |
| 5 | Robot aspirateur connecté | 82.7% (86/104) |

## Top 5 produits les moins couverts

| Rang | Produit | Coverage |
|---|---|---:|
| 1 | Croquettes pour chien | 13.2% (9/68) |
| 2 | Peinture déco intérieure | 19.8% (17/86) |
| 3 | Vape / e-cigarette | 28.1% (18/64) |
| 4 | Drone grand public | 32.9% (24/73) |
| 5 | Complément alimentaire vitamines | 46.3% (31/67) |

## Notable findings

- **0 produits avec 0% de couverture** : 
- **Couverture Europe** : 391/542 (72.1%)
- **Couverture hors-Europe** : 730/1219 (59.9%)
- **Couverture des régulations critiques** : 571/747 (76.4%)
- **Match methods utilisées** : exact_ref (référence officielle) prime, fuzzy_name fallback

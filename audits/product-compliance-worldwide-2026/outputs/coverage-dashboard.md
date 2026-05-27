# Cleo Legal API — Coverage Dashboard

_Cross-check du 2026-05-27 contre 78 régulations Cleo Legal API (proxy via Cleo Insight)._

## Global

- **Total régulations attendues** : 1761
- ✅ **FOUND** : 1085 (61.6%)  ████████████░░░░░░░░
- 🟡 **PARTIAL** : 0 (0.0%)
- ❌ **NOT_FOUND** : 676 (38.4%)

## Couverture par produit

| ID | Produit | Total | FOUND | NOT_FOUND | % | Bar |
|---|---|---:|---:|---:|---:|---|
| 1 | Shampoing | 89 | 62 | 27 | 69.7% | ██████████░░░░░ |
| 2 | Crème solaire | 109 | 53 | 56 | 48.6% | ███████░░░░░░░░ |
| 3 | Smartphone | 184 | 143 | 41 | 77.7% | ████████████░░░ |
| 4 | Peluche bébé 0-3 ans | 122 | 85 | 37 | 69.7% | ██████████░░░░░ |
| 5 | Pansement adhésif | 74 | 50 | 24 | 67.6% | ██████████░░░░░ |
| 6 | Vape / e-cigarette | 64 | 18 | 46 | 28.1% | ████░░░░░░░░░░░ |
| 7 | Capsule lessive (pod) | 105 | 49 | 56 | 46.7% | ███████░░░░░░░░ |
| 8 | Complément alimentaire vitamines | 67 | 23 | 44 | 34.3% | █████░░░░░░░░░░ |
| 9 | Legging sport synthétique | 79 | 63 | 16 | 79.7% | ████████████░░░ |
| 10 | Casque vélo adulte | 60 | 29 | 31 | 48.3% | ███████░░░░░░░░ |
| 11 | Bouteille de vin | 77 | 54 | 23 | 70.1% | ███████████░░░░ |
| 12 | Steak emballé (viande fraîche) | 82 | 74 | 8 | 90.2% | ██████████████░ |
| 13 | Paracétamol OTC | 91 | 78 | 13 | 85.7% | █████████████░░ |
| 14 | Pneumatique voiture | 82 | 71 | 11 | 86.6% | █████████████░░ |
| 15 | Insecticide spray maison | 70 | 55 | 15 | 78.6% | ████████████░░░ |
| 16 | Drone grand public | 73 | 22 | 51 | 30.1% | █████░░░░░░░░░░ |
| 17 | Robot aspirateur connecté | 104 | 83 | 21 | 79.8% | ████████████░░░ |
| 18 | Implant dentaire | 75 | 47 | 28 | 62.7% | █████████░░░░░░ |
| 19 | Peinture déco intérieure | 86 | 17 | 69 | 19.8% | ███░░░░░░░░░░░░ |
| 20 | Croquettes pour chien | 68 | 9 | 59 | 13.2% | ██░░░░░░░░░░░░░ |

## Couverture par région

| Région | Total | FOUND | NOT_FOUND | % | Bar |
|---|---:|---:|---:|---:|---|
| Americas | 381 | 232 | 149 | 60.9% | █████████░░░░░░ |
| Asia-Pacific | 524 | 305 | 219 | 58.2% | █████████░░░░░░ |
| Europe | 542 | 383 | 159 | 70.7% | ███████████░░░░ |
| International | 123 | 56 | 67 | 45.5% | ███████░░░░░░░░ |
| MENA & Africa | 191 | 109 | 82 | 57.1% | █████████░░░░░░ |

## Couverture par criticité

| Criticité | Total | FOUND | NOT_FOUND | % | Bar |
|---|---:|---:|---:|---:|---|
| critical | 747 | 558 | 189 | 74.7% | ███████████░░░░ |
| high | 613 | 381 | 232 | 62.2% | █████████░░░░░░ |
| medium | 185 | 99 | 86 | 53.5% | ████████░░░░░░░ |
| low | 62 | 21 | 41 | 33.9% | █████░░░░░░░░░░ |

## Top 5 produits les mieux couverts

| Rang | Produit | Coverage |
|---|---|---:|
| 1 | Steak emballé (viande fraîche) | 90.2% (74/82) |
| 2 | Pneumatique voiture | 86.6% (71/82) |
| 3 | Paracétamol OTC | 85.7% (78/91) |
| 4 | Robot aspirateur connecté | 79.8% (83/104) |
| 5 | Legging sport synthétique | 79.7% (63/79) |

## Top 5 produits les moins couverts

| Rang | Produit | Coverage |
|---|---|---:|
| 1 | Croquettes pour chien | 13.2% (9/68) |
| 2 | Peinture déco intérieure | 19.8% (17/86) |
| 3 | Vape / e-cigarette | 28.1% (18/64) |
| 4 | Drone grand public | 30.1% (22/73) |
| 5 | Complément alimentaire vitamines | 34.3% (23/67) |

## Notable findings

- **0 produits avec 0% de couverture** : 
- **Couverture Europe** : 383/542 (70.7%)
- **Couverture hors-Europe** : 702/1219 (57.6%)
- **Couverture des régulations critiques** : 558/747 (74.7%)
- **Match methods utilisées** : exact_ref (référence officielle) prime, fuzzy_name fallback

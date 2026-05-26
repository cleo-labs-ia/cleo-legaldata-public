# Cleo Legal API — Coverage Dashboard

_Cross-check du 2026-05-26 contre 78 régulations Cleo Legal API (proxy via Cleo Insight)._

## Global

- **Total régulations attendues** : 1761
- ✅ **FOUND** : 1049 (59.6%)  ████████████░░░░░░░░
- 🟡 **PARTIAL** : 0 (0.0%)
- ❌ **NOT_FOUND** : 712 (40.4%)

## Couverture par produit

| ID | Produit | Total | FOUND | NOT_FOUND | % | Bar |
|---|---|---:|---:|---:|---:|---|
| 1 | Shampoing | 89 | 73 | 16 | 82.0% | ████████████░░░ |
| 2 | Crème solaire | 109 | 71 | 38 | 65.1% | ██████████░░░░░ |
| 3 | Smartphone | 184 | 145 | 39 | 78.8% | ████████████░░░ |
| 4 | Peluche bébé 0-3 ans | 122 | 101 | 21 | 82.8% | ████████████░░░ |
| 5 | Pansement adhésif | 74 | 54 | 20 | 73.0% | ███████████░░░░ |
| 6 | Vape / e-cigarette | 64 | 11 | 53 | 17.2% | ███░░░░░░░░░░░░ |
| 7 | Capsule lessive (pod) | 105 | 81 | 24 | 77.1% | ████████████░░░ |
| 8 | Complément alimentaire vitamines | 67 | 30 | 37 | 44.8% | ███████░░░░░░░░ |
| 9 | Legging sport synthétique | 79 | 64 | 15 | 81.0% | ████████████░░░ |
| 10 | Casque vélo adulte | 60 | 35 | 25 | 58.3% | █████████░░░░░░ |
| 11 | Bouteille de vin | 77 | 17 | 60 | 22.1% | ███░░░░░░░░░░░░ |
| 12 | Steak emballé (viande fraîche) | 82 | 34 | 48 | 41.5% | ██████░░░░░░░░░ |
| 13 | Paracétamol OTC | 91 | 48 | 43 | 52.7% | ████████░░░░░░░ |
| 14 | Pneumatique voiture | 82 | 40 | 42 | 48.8% | ███████░░░░░░░░ |
| 15 | Insecticide spray maison | 70 | 31 | 39 | 44.3% | ███████░░░░░░░░ |
| 16 | Drone grand public | 73 | 29 | 44 | 39.7% | ██████░░░░░░░░░ |
| 17 | Robot aspirateur connecté | 104 | 84 | 20 | 80.8% | ████████████░░░ |
| 18 | Implant dentaire | 75 | 49 | 26 | 65.3% | ██████████░░░░░ |
| 19 | Peinture déco intérieure | 86 | 38 | 48 | 44.2% | ███████░░░░░░░░ |
| 20 | Croquettes pour chien | 68 | 14 | 54 | 20.6% | ███░░░░░░░░░░░░ |

## Couverture par région

| Région | Total | FOUND | NOT_FOUND | % | Bar |
|---|---:|---:|---:|---:|---|
| Americas | 381 | 232 | 149 | 60.9% | █████████░░░░░░ |
| Asia-Pacific | 524 | 282 | 242 | 53.8% | ████████░░░░░░░ |
| Europe | 542 | 366 | 176 | 67.5% | ██████████░░░░░ |
| International | 123 | 63 | 60 | 51.2% | ████████░░░░░░░ |
| MENA & Africa | 191 | 106 | 85 | 55.5% | ████████░░░░░░░ |

## Couverture par criticité

| Criticité | Total | FOUND | NOT_FOUND | % | Bar |
|---|---:|---:|---:|---:|---|
| critical | 747 | 479 | 268 | 64.1% | ██████████░░░░░ |
| high | 613 | 363 | 250 | 59.2% | █████████░░░░░░ |
| medium | 185 | 127 | 58 | 68.6% | ██████████░░░░░ |
| low | 62 | 28 | 34 | 45.2% | ███████░░░░░░░░ |

## Top 5 produits les mieux couverts

| Rang | Produit | Coverage |
|---|---|---:|
| 1 | Peluche bébé 0-3 ans | 82.8% (101/122) |
| 2 | Shampoing | 82.0% (73/89) |
| 3 | Legging sport synthétique | 81.0% (64/79) |
| 4 | Robot aspirateur connecté | 80.8% (84/104) |
| 5 | Smartphone | 78.8% (145/184) |

## Top 5 produits les moins couverts

| Rang | Produit | Coverage |
|---|---|---:|
| 1 | Vape / e-cigarette | 17.2% (11/64) |
| 2 | Croquettes pour chien | 20.6% (14/68) |
| 3 | Bouteille de vin | 22.1% (17/77) |
| 4 | Drone grand public | 39.7% (29/73) |
| 5 | Steak emballé (viande fraîche) | 41.5% (34/82) |

## Notable findings

- **0 produits avec 0% de couverture** : 
- **Couverture Europe** : 366/542 (67.5%)
- **Couverture hors-Europe** : 683/1219 (56.0%)
- **Couverture des régulations critiques** : 479/747 (64.1%)
- **Match methods utilisées** : exact_ref (référence officielle) prime, fuzzy_name fallback

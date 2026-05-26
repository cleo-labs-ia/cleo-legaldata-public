# Cleo Legal API — Coverage Dashboard

_Cross-check du 2026-05-26 contre 78 régulations Cleo Legal API (proxy via Cleo Insight)._

## Global

- **Total régulations attendues** : 1761
- ✅ **FOUND** : 582 (33.0%)  ███████░░░░░░░░░░░░░
- 🟡 **PARTIAL** : 0 (0.0%)
- ❌ **NOT_FOUND** : 1179 (67.0%)

## Couverture par produit

| ID | Produit | Total | FOUND | NOT_FOUND | % | Bar |
|---|---|---:|---:|---:|---:|---|
| 1 | Shampoing | 89 | 50 | 39 | 56.2% | ████████░░░░░░░ |
| 2 | Crème solaire | 109 | 40 | 69 | 36.7% | ██████░░░░░░░░░ |
| 3 | Smartphone | 184 | 84 | 100 | 45.7% | ███████░░░░░░░░ |
| 4 | Peluche bébé 0-3 ans | 122 | 48 | 74 | 39.3% | ██████░░░░░░░░░ |
| 5 | Pansement adhésif | 74 | 23 | 51 | 31.1% | █████░░░░░░░░░░ |
| 6 | Vape / e-cigarette | 64 | 12 | 52 | 18.8% | ███░░░░░░░░░░░░ |
| 7 | Capsule lessive (pod) | 105 | 51 | 54 | 48.6% | ███████░░░░░░░░ |
| 8 | Complément alimentaire vitamines | 67 | 18 | 49 | 26.9% | ████░░░░░░░░░░░ |
| 9 | Legging sport synthétique | 79 | 41 | 38 | 51.9% | ████████░░░░░░░ |
| 10 | Casque vélo adulte | 60 | 12 | 48 | 20.0% | ███░░░░░░░░░░░░ |
| 11 | Bouteille de vin | 77 | 12 | 65 | 15.6% | ██░░░░░░░░░░░░░ |
| 12 | Steak emballé (viande fraîche) | 82 | 22 | 60 | 26.8% | ████░░░░░░░░░░░ |
| 13 | Paracétamol OTC | 91 | 15 | 76 | 16.5% | ██░░░░░░░░░░░░░ |
| 14 | Pneumatique voiture | 82 | 14 | 68 | 17.1% | ███░░░░░░░░░░░░ |
| 15 | Insecticide spray maison | 70 | 17 | 53 | 24.3% | ████░░░░░░░░░░░ |
| 16 | Drone grand public | 73 | 11 | 62 | 15.1% | ██░░░░░░░░░░░░░ |
| 17 | Robot aspirateur connecté | 104 | 56 | 48 | 53.8% | ████████░░░░░░░ |
| 18 | Implant dentaire | 75 | 27 | 48 | 36.0% | █████░░░░░░░░░░ |
| 19 | Peinture déco intérieure | 86 | 17 | 69 | 19.8% | ███░░░░░░░░░░░░ |
| 20 | Croquettes pour chien | 68 | 12 | 56 | 17.6% | ███░░░░░░░░░░░░ |

## Couverture par région

| Région | Total | FOUND | NOT_FOUND | % | Bar |
|---|---:|---:|---:|---:|---|
| Americas | 381 | 132 | 249 | 34.6% | █████░░░░░░░░░░ |
| Asia-Pacific | 524 | 121 | 403 | 23.1% | ███░░░░░░░░░░░░ |
| Europe | 542 | 284 | 258 | 52.4% | ████████░░░░░░░ |
| International | 123 | 28 | 95 | 22.8% | ███░░░░░░░░░░░░ |
| MENA & Africa | 191 | 17 | 174 | 8.9% | █░░░░░░░░░░░░░░ |

## Couverture par criticité

| Criticité | Total | FOUND | NOT_FOUND | % | Bar |
|---|---:|---:|---:|---:|---|
| critical | 747 | 267 | 480 | 35.7% | █████░░░░░░░░░░ |
| high | 613 | 215 | 398 | 35.1% | █████░░░░░░░░░░ |
| medium | 185 | 63 | 122 | 34.1% | █████░░░░░░░░░░ |
| low | 62 | 8 | 54 | 12.9% | ██░░░░░░░░░░░░░ |

## Top 5 produits les mieux couverts

| Rang | Produit | Coverage |
|---|---|---:|
| 1 | Shampoing | 56.2% (50/89) |
| 2 | Robot aspirateur connecté | 53.8% (56/104) |
| 3 | Legging sport synthétique | 51.9% (41/79) |
| 4 | Capsule lessive (pod) | 48.6% (51/105) |
| 5 | Smartphone | 45.7% (84/184) |

## Top 5 produits les moins couverts

| Rang | Produit | Coverage |
|---|---|---:|
| 1 | Drone grand public | 15.1% (11/73) |
| 2 | Bouteille de vin | 15.6% (12/77) |
| 3 | Paracétamol OTC | 16.5% (15/91) |
| 4 | Pneumatique voiture | 17.1% (14/82) |
| 5 | Croquettes pour chien | 17.6% (12/68) |

## Notable findings

- **0 produits avec 0% de couverture** : 
- **Couverture Europe** : 284/542 (52.4%)
- **Couverture hors-Europe** : 298/1219 (24.4%)
- **Couverture des régulations critiques** : 267/747 (35.7%)
- **Match methods utilisées** : exact_ref (référence officielle) prime, fuzzy_name fallback

# Cleo Legal API — Coverage Dashboard

_Cross-check du 2026-05-26 contre 78 régulations Cleo Legal API (proxy via Cleo Insight)._

## Global

- **Total régulations attendues** : 1761
- ✅ **FOUND** : 142 (8.1%)  ██░░░░░░░░░░░░░░░░░░
- 🟡 **PARTIAL** : 0 (0.0%)
- ❌ **NOT_FOUND** : 1619 (91.9%)

## Couverture par produit

| ID | Produit | Total | FOUND | NOT_FOUND | % | Bar |
|---|---|---:|---:|---:|---:|---|
| 1 | Shampoing | 89 | 12 | 77 | 13.5% | ██░░░░░░░░░░░░░ |
| 2 | Crème solaire | 109 | 11 | 98 | 10.1% | ██░░░░░░░░░░░░░ |
| 3 | Smartphone | 184 | 11 | 173 | 6.0% | █░░░░░░░░░░░░░░ |
| 4 | Peluche bébé 0-3 ans | 122 | 11 | 111 | 9.0% | █░░░░░░░░░░░░░░ |
| 5 | Pansement adhésif | 74 | 12 | 62 | 16.2% | ██░░░░░░░░░░░░░ |
| 6 | Vape / e-cigarette | 64 | 5 | 59 | 7.8% | █░░░░░░░░░░░░░░ |
| 7 | Capsule lessive (pod) | 105 | 4 | 101 | 3.8% | █░░░░░░░░░░░░░░ |
| 8 | Complément alimentaire vitamines | 67 | 12 | 55 | 17.9% | ███░░░░░░░░░░░░ |
| 9 | Legging sport synthétique | 79 | 6 | 73 | 7.6% | █░░░░░░░░░░░░░░ |
| 10 | Casque vélo adulte | 60 | 2 | 58 | 3.3% | ░░░░░░░░░░░░░░░ |
| 11 | Bouteille de vin | 77 | 7 | 70 | 9.1% | █░░░░░░░░░░░░░░ |
| 12 | Steak emballé (viande fraîche) | 82 | 11 | 71 | 13.4% | ██░░░░░░░░░░░░░ |
| 13 | Paracétamol OTC | 91 | 12 | 79 | 13.2% | ██░░░░░░░░░░░░░ |
| 14 | Pneumatique voiture | 82 | 3 | 79 | 3.7% | █░░░░░░░░░░░░░░ |
| 15 | Insecticide spray maison | 70 | 4 | 66 | 5.7% | █░░░░░░░░░░░░░░ |
| 16 | Drone grand public | 73 | 2 | 71 | 2.7% | ░░░░░░░░░░░░░░░ |
| 17 | Robot aspirateur connecté | 104 | 3 | 101 | 2.9% | ░░░░░░░░░░░░░░░ |
| 18 | Implant dentaire | 75 | 7 | 68 | 9.3% | █░░░░░░░░░░░░░░ |
| 19 | Peinture déco intérieure | 86 | 3 | 83 | 3.5% | █░░░░░░░░░░░░░░ |
| 20 | Croquettes pour chien | 68 | 4 | 64 | 5.9% | █░░░░░░░░░░░░░░ |

## Couverture par région

| Région | Total | FOUND | NOT_FOUND | % | Bar |
|---|---:|---:|---:|---:|---|
| Americas | 381 | 42 | 339 | 11.0% | ██░░░░░░░░░░░░░ |
| Asia-Pacific | 524 | 34 | 490 | 6.5% | █░░░░░░░░░░░░░░ |
| Europe | 542 | 66 | 476 | 12.2% | ██░░░░░░░░░░░░░ |
| International | 123 | 0 | 123 | 0.0% | ░░░░░░░░░░░░░░░ |
| MENA & Africa | 191 | 0 | 191 | 0.0% | ░░░░░░░░░░░░░░░ |

## Couverture par criticité

| Criticité | Total | FOUND | NOT_FOUND | % | Bar |
|---|---:|---:|---:|---:|---|
| critical | 747 | 126 | 621 | 16.9% | ███░░░░░░░░░░░░ |
| high | 613 | 9 | 604 | 1.5% | ░░░░░░░░░░░░░░░ |
| medium | 185 | 0 | 185 | 0.0% | ░░░░░░░░░░░░░░░ |
| low | 62 | 0 | 62 | 0.0% | ░░░░░░░░░░░░░░░ |

## Top 5 produits les mieux couverts

| Rang | Produit | Coverage |
|---|---|---:|
| 1 | Complément alimentaire vitamines | 17.9% (12/67) |
| 2 | Pansement adhésif | 16.2% (12/74) |
| 3 | Shampoing | 13.5% (12/89) |
| 4 | Steak emballé (viande fraîche) | 13.4% (11/82) |
| 5 | Paracétamol OTC | 13.2% (12/91) |

## Top 5 produits les moins couverts

| Rang | Produit | Coverage |
|---|---|---:|
| 1 | Drone grand public | 2.7% (2/73) |
| 2 | Robot aspirateur connecté | 2.9% (3/104) |
| 3 | Casque vélo adulte | 3.3% (2/60) |
| 4 | Peinture déco intérieure | 3.5% (3/86) |
| 5 | Pneumatique voiture | 3.7% (3/82) |

## Notable findings

- **0 produits avec 0% de couverture** : 
- **Couverture Europe** : 66/542 (12.2%)
- **Couverture hors-Europe** : 76/1219 (6.2%)
- **Couverture des régulations critiques** : 126/747 (16.9%)
- **Match methods utilisées** : exact_ref (référence officielle) prime, fuzzy_name fallback

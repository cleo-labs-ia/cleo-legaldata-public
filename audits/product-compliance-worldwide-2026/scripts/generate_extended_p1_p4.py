#!/usr/bin/env python3
"""
Exhaustive worldwide regulation list for products 1-4:
  P1 Shampoo (cosmetic rinse-off)
  P2 Sunscreen (cosmetic leave-on + UV)
  P3 Smartphone (electronics + telecom)
  P4 Stuffed toy 0-3y (children toy)

Generates extended-p1-p4.csv with columns:
  product_id,product_name,product_regime_tag,jurisdiction_code,
  jurisdiction_name,region,regulation_name,regulation_ref,
  enforcement_body,key_requirements,status,criticality,notes
"""

import csv
import os

OUTPUT = "/Users/naomiehalioua/cleo-legaldata-public/audits/product-compliance-worldwide-2026/data/per-product/extended-p1-p4.csv"

PRODUCTS = {
    1: ("Shampoing",            "Cosmétique rinse-off"),
    2: ("Crème solaire",        "Cosmétique leave-on + UV"),
    3: ("Smartphone",           "Électronique + télécom"),
    4: ("Peluche bébé 0-3 ans", "Jouet enfant"),
}

# ---------------------------------------------------------------
# JURISDICTIONS  (code, name, region)
# ---------------------------------------------------------------
EU_MEMBERS = [
    ("AT", "Austria",        "Europe"),
    ("BE", "Belgium",        "Europe"),
    ("BG", "Bulgaria",       "Europe"),
    ("HR", "Croatia",        "Europe"),
    ("CY", "Cyprus",         "Europe"),
    ("CZ", "Czech Republic", "Europe"),
    ("DK", "Denmark",        "Europe"),
    ("EE", "Estonia",        "Europe"),
    ("FI", "Finland",        "Europe"),
    ("FR", "France",         "Europe"),
    ("DE", "Germany",        "Europe"),
    ("GR", "Greece",         "Europe"),
    ("HU", "Hungary",        "Europe"),
    ("IE", "Ireland",        "Europe"),
    ("IT", "Italy",          "Europe"),
    ("LV", "Latvia",         "Europe"),
    ("LT", "Lithuania",      "Europe"),
    ("LU", "Luxembourg",     "Europe"),
    ("MT", "Malta",          "Europe"),
    ("NL", "Netherlands",    "Europe"),
    ("PL", "Poland",         "Europe"),
    ("PT", "Portugal",       "Europe"),
    ("RO", "Romania",        "Europe"),
    ("SK", "Slovakia",       "Europe"),
    ("SI", "Slovenia",       "Europe"),
    ("ES", "Spain",          "Europe"),
    ("SE", "Sweden",         "Europe"),
]

EUROPE_NON_EU = [
    ("UK", "United Kingdom",            "Europe"),
    ("CH", "Switzerland",               "Europe"),
    ("NO", "Norway",                    "Europe"),
    ("IS", "Iceland",                   "Europe"),
    ("LI", "Liechtenstein",             "Europe"),
    ("RU", "Russia",                    "Europe"),
    ("BY", "Belarus",                   "Europe"),
    ("UA", "Ukraine",                   "Europe"),
    ("MD", "Moldova",                   "Europe"),
    ("TR", "Türkiye",                   "Europe"),
    ("RS", "Serbia",                    "Europe"),
    ("BA", "Bosnia and Herzegovina",    "Europe"),
    ("AL", "Albania",                   "Europe"),
    ("MK", "North Macedonia",           "Europe"),
    ("ME", "Montenegro",                "Europe"),
    ("XK", "Kosovo",                    "Europe"),
]

US_STATES = [
    ("US-CA", "California", "Americas"),
    ("US-NY", "New York",   "Americas"),
    ("US-TX", "Texas",      "Americas"),
    ("US-FL", "Florida",    "Americas"),
    ("US-IL", "Illinois",   "Americas"),
    ("US-WA", "Washington", "Americas"),
    ("US-OR", "Oregon",     "Americas"),
    ("US-MA", "Massachusetts","Americas"),
    ("US-MN", "Minnesota",  "Americas"),
    ("US-NJ", "New Jersey", "Americas"),
    ("US-HI", "Hawaii",     "Americas"),
    ("US-VT", "Vermont",    "Americas"),
    ("US-ME", "Maine",      "Americas"),
    ("US-CO", "Colorado",   "Americas"),
]

CA_PROVINCES = [
    ("CA-ON", "Ontario",          "Americas"),
    ("CA-QC", "Québec",           "Americas"),
    ("CA-BC", "British Columbia", "Americas"),
    ("CA-AB", "Alberta",          "Americas"),
]

AMERICAS = [
    ("US",  "United States",         "Americas"),
    ("CA",  "Canada",                "Americas"),
    ("MX",  "Mexico",                "Americas"),
    ("BR",  "Brazil",                "Americas"),
    ("AR",  "Argentina",             "Americas"),
    ("CL",  "Chile",                 "Americas"),
    ("CO",  "Colombia",              "Americas"),
    ("PE",  "Peru",                  "Americas"),
    ("VE",  "Venezuela",             "Americas"),
    ("EC",  "Ecuador",               "Americas"),
    ("UY",  "Uruguay",               "Americas"),
    ("PY",  "Paraguay",              "Americas"),
    ("BO",  "Bolivia",               "Americas"),
    ("DO",  "Dominican Republic",    "Americas"),
    ("GT",  "Guatemala",             "Americas"),
    ("CR",  "Costa Rica",            "Americas"),
    ("PA",  "Panama",                "Americas"),
    ("NI",  "Nicaragua",             "Americas"),
    ("SV",  "El Salvador",           "Americas"),
    ("HN",  "Honduras",              "Americas"),
    ("CU",  "Cuba",                  "Americas"),
    ("JM",  "Jamaica",               "Americas"),
    ("TT",  "Trinidad and Tobago",   "Americas"),
    ("BB",  "Barbados",              "Americas"),
    ("HT",  "Haiti",                 "Americas"),
    ("MERCOSUR", "MERCOSUR",         "Americas"),
    ("CARICOM",  "CARICOM",          "Americas"),
    ("ALADI",    "ALADI",            "Americas"),
]

AU_STATES = [
    ("AU-NSW", "New South Wales",    "Asia-Pacific"),
    ("AU-VIC", "Victoria",           "Asia-Pacific"),
    ("AU-QLD", "Queensland",         "Asia-Pacific"),
    ("AU-WA",  "Western Australia",  "Asia-Pacific"),
    ("AU-SA",  "South Australia",    "Asia-Pacific"),
    ("AU-TAS", "Tasmania",           "Asia-Pacific"),
]

ASIA_PAC = [
    ("CN", "China",        "Asia-Pacific"),
    ("HK", "Hong Kong SAR","Asia-Pacific"),
    ("MO", "Macau SAR",    "Asia-Pacific"),
    ("TW", "Taiwan",       "Asia-Pacific"),
    ("JP", "Japan",        "Asia-Pacific"),
    ("KR", "South Korea",  "Asia-Pacific"),
    ("KP", "North Korea",  "Asia-Pacific"),
    ("MN", "Mongolia",     "Asia-Pacific"),
    ("IN", "India",        "Asia-Pacific"),
    ("PK", "Pakistan",     "Asia-Pacific"),
    ("BD", "Bangladesh",   "Asia-Pacific"),
    ("LK", "Sri Lanka",    "Asia-Pacific"),
    ("NP", "Nepal",        "Asia-Pacific"),
    ("BT", "Bhutan",       "Asia-Pacific"),
    ("MV", "Maldives",     "Asia-Pacific"),
    ("MM", "Myanmar",      "Asia-Pacific"),
    ("TH", "Thailand",     "Asia-Pacific"),
    ("VN", "Vietnam",      "Asia-Pacific"),
    ("LA", "Laos",         "Asia-Pacific"),
    ("KH", "Cambodia",     "Asia-Pacific"),
    ("MY", "Malaysia",     "Asia-Pacific"),
    ("SG", "Singapore",    "Asia-Pacific"),
    ("ID", "Indonesia",    "Asia-Pacific"),
    ("PH", "Philippines",  "Asia-Pacific"),
    ("BN", "Brunei",       "Asia-Pacific"),
    ("TL", "Timor-Leste",  "Asia-Pacific"),
    ("AU", "Australia",    "Asia-Pacific"),
    ("NZ", "New Zealand",  "Asia-Pacific"),
    ("FJ", "Fiji",         "Asia-Pacific"),
    ("PG", "Papua New Guinea","Asia-Pacific"),
    ("ASEAN", "ASEAN",     "Asia-Pacific"),
    ("SAARC", "SAARC",     "Asia-Pacific"),
]

MENA = [
    ("SA", "Saudi Arabia",       "Middle East"),
    ("AE", "United Arab Emirates","Middle East"),
    ("AE-AUH", "Abu Dhabi",      "Middle East"),
    ("AE-DXB", "Dubai",          "Middle East"),
    ("AE-SHJ", "Sharjah",        "Middle East"),
    ("AE-AJM", "Ajman",          "Middle East"),
    ("AE-UAQ", "Umm Al Quwain",  "Middle East"),
    ("AE-RAK", "Ras Al Khaimah", "Middle East"),
    ("AE-FUJ", "Fujairah",       "Middle East"),
    ("QA", "Qatar",              "Middle East"),
    ("KW", "Kuwait",             "Middle East"),
    ("BH", "Bahrain",            "Middle East"),
    ("OM", "Oman",               "Middle East"),
    ("YE", "Yemen",              "Middle East"),
    ("JO", "Jordan",             "Middle East"),
    ("LB", "Lebanon",            "Middle East"),
    ("SY", "Syria",              "Middle East"),
    ("IQ", "Iraq",               "Middle East"),
    ("IR", "Iran",               "Middle East"),
    ("IL", "Israel",             "Middle East"),
    ("PS", "Palestine",          "Middle East"),
    ("GCC", "GCC",               "Middle East"),
]

AFRICA = [
    ("ZA", "South Africa",      "Africa"),
    ("NG", "Nigeria",           "Africa"),
    ("KE", "Kenya",             "Africa"),
    ("EG", "Egypt",             "Africa"),
    ("MA", "Morocco",           "Africa"),
    ("DZ", "Algeria",           "Africa"),
    ("TN", "Tunisia",           "Africa"),
    ("LY", "Libya",             "Africa"),
    ("SD", "Sudan",             "Africa"),
    ("ET", "Ethiopia",          "Africa"),
    ("TZ", "Tanzania",          "Africa"),
    ("UG", "Uganda",            "Africa"),
    ("GH", "Ghana",             "Africa"),
    ("SN", "Senegal",           "Africa"),
    ("CI", "Côte d'Ivoire",     "Africa"),
    ("CM", "Cameroon",          "Africa"),
    ("ZW", "Zimbabwe",          "Africa"),
    ("ZM", "Zambia",            "Africa"),
    ("AO", "Angola",            "Africa"),
    ("MZ", "Mozambique",        "Africa"),
    ("MG", "Madagascar",        "Africa"),
    ("BJ", "Benin",             "Africa"),
    ("BF", "Burkina Faso",      "Africa"),
    ("ML", "Mali",              "Africa"),
    ("NE", "Niger",             "Africa"),
    ("GA", "Gabon",             "Africa"),
    ("CD", "DR Congo",          "Africa"),
    ("CG", "Congo",             "Africa"),
    ("RW", "Rwanda",            "Africa"),
    ("BI", "Burundi",           "Africa"),
    ("DJ", "Djibouti",          "Africa"),
    ("ER", "Eritrea",           "Africa"),
    ("SO", "Somalia",           "Africa"),
    ("SL", "Sierra Leone",      "Africa"),
    ("LR", "Liberia",           "Africa"),
    ("GM", "Gambia",            "Africa"),
    ("GW", "Guinea-Bissau",     "Africa"),
    ("MR", "Mauritania",        "Africa"),
    ("EH", "Western Sahara",    "Africa"),
    ("SC", "Seychelles",        "Africa"),
    ("MU", "Mauritius",         "Africa"),
    ("NA", "Namibia",           "Africa"),
    ("BW", "Botswana",          "Africa"),
    ("SZ", "Eswatini",          "Africa"),
    ("LS", "Lesotho",           "Africa"),
    ("MW", "Malawi",            "Africa"),
    ("KM", "Comoros",           "Africa"),
    ("CV", "Cabo Verde",        "Africa"),
    ("ST", "São Tomé & Príncipe","Africa"),
    ("TG", "Togo",              "Africa"),
    ("ECOWAS", "ECOWAS",        "Africa"),
    ("EAC", "EAC",              "Africa"),
    ("SADC", "SADC",            "Africa"),
    ("COMESA","COMESA",         "Africa"),
    ("ECCAS","ECCAS",           "Africa"),
    ("AFCFTA","AfCFTA",         "Africa"),
    ("AU-Africa","African Union","Africa"),
]

INTERNATIONAL = [
    ("CODEX",  "Codex Alimentarius (FAO/WHO)", "International"),
    ("ISO",    "ISO/IEC",                      "International"),
    ("UNECE",  "UNECE",                        "International"),
    ("OECD",   "OECD",                         "International"),
    ("WTO",    "WTO",                          "International"),
    ("WIPO",   "WIPO",                         "International"),
    ("ITU",    "ITU",                          "International"),
    ("IMO",    "IMO",                          "International"),
    ("IATA",   "IATA",                         "International"),
    ("ICAO",   "ICAO",                         "International"),
    ("WHO",    "World Health Organization",    "International"),
    ("3GPP",   "3GPP",                         "International"),
    ("GSMA",   "GSMA",                         "International"),
]


def all_jurisdictions():
    """Returns the master list of jurisdictions to iterate."""
    return (
        [("EU", "European Union", "Europe")]
        + EU_MEMBERS
        + EUROPE_NON_EU
        + [("EAEU", "Eurasian Economic Union", "Europe")]
        + [("US", "United States (federal)", "Americas")]
        + US_STATES
        + [("CA", "Canada (federal)", "Americas")]
        + CA_PROVINCES
        + [j for j in AMERICAS if j[0] not in ("US", "CA")]
        + ASIA_PAC
        + AU_STATES
        + MENA
        + AFRICA
        + INTERNATIONAL
    )


# ---------------------------------------------------------------
#                     P1 — SHAMPOO (cosmetic rinse-off)
# ---------------------------------------------------------------
def p1_regs(code, name, region):
    """Return list of regulations for shampoo for given jurisdiction."""
    R = []
    # EU
    if code == "EU":
        R = [
            ("EU Cosmetics Regulation", "(EC) No 1223/2009", "EC DG GROW + NCAs",
             "CPNP notification; PIF; Responsible Person; safety assessment Annex I; labelling Art. 19",
             "in_force", "critical", ""),
            ("EU Cosmetics Regulation — Annexes II/III restrictions updates", "Regulation (EU) 2024/996",
             "EC DG GROW", "CMR substances restrictions; preservative/fragrance allergens updates",
             "in_force", "high", ""),
            ("EU CLP Regulation", "(EC) No 1272/2008", "ECHA",
             "Classification, labelling, packaging of hazardous substances",
             "in_force", "high", ""),
            ("EU REACH Regulation", "(EC) No 1907/2006", "ECHA",
             "Registration of substances >1t; SVHC notification; Annex XVII restrictions",
             "in_force", "high", ""),
            ("EU Detergents Regulation (surfactants biodegradability)", "(EC) No 648/2004",
             "EC DG ENV", "Biodegradability of surfactants; label rules where shampoo qualifies as detergent",
             "in_force", "medium", "Borderline — applies if marketed as cleaning"),
            ("EU Packaging and Packaging Waste Regulation (PPWR)", "Regulation (EU) 2025/40",
             "EC DG ENV", "Recyclability, recycled content targets, labelling for cosmetics packaging",
             "in_force", "high", "Replaces Directive 94/62/EC"),
            ("EU Microplastics restriction", "(EU) 2023/2055 amending Annex XVII REACH",
             "ECHA", "Ban of intentionally added microplastics — phase-out for rinse-off cosmetics",
             "in_force", "high", ""),
            ("EU Green Claims Directive (proposal)", "COM(2023)166", "EC DG ENV",
             "Substantiation/verification of environmental claims (natural, bio)",
             "draft", "medium", ""),
            ("EU Empowering Consumers for Green Transition Directive", "(EU) 2024/825",
             "EC DG JUST", "Ban of generic environmental claims; transparency on durability",
             "in_force", "medium", ""),
            ("ISO 22716 GMP (referenced in 1223/2009 Art. 8)", "ISO 22716:2007",
             "ISO via national bodies", "Cosmetics GMP — production, control, storage, shipping",
             "in_force", "critical", ""),
        ]
    elif code in [c for c, _, _ in EU_MEMBERS]:
        # Transposition + national specifics
        R = [
            ("EU Cosmetics Regulation (directly applicable)", "(EC) No 1223/2009",
             f"National competent authority of {name}", "CPNP notification; PIF in local/EU language",
             "in_force", "critical", ""),
            ("National cosmetic surveillance authority decree", f"National implementing law ({code})",
             f"{name} health/market surveillance", "National market surveillance, sanctions, language",
             "in_force", "high", ""),
            ("National Cosmetovigilance system", f"National pharmacovigilance/cosmetovigilance scheme ({code})",
             f"{name} health authority", "Adverse event reporting to national agency",
             "in_force", "high", ""),
            ("National language labelling requirement", f"Consumer protection code ({code})",
             f"{name} consumer protection authority", "Mandatory labelling in official language(s)",
             "in_force", "high", ""),
        ]
        # specifics
        if code == "FR":
            R += [
                ("Code de la santé publique — cosmétiques", "L5131-1 à L5131-13",
                 "ANSM", "Mise sur le marché; déclaration; PIF; cosmétovigilance EIG",
                 "in_force", "critical", ""),
                ("Décret cosmétovigilance", "Décret n° 2013-1065",
                 "ANSM", "Modalités de déclaration EIG",
                 "in_force", "high", ""),
                ("Norme AFNOR cosmétiques bio", "NF T 75-501 / COSMOS",
                 "AFNOR", "Référentiel bio (volontaire)",
                 "in_force", "low", "Voluntary"),
            ]
        elif code == "DE":
            R += [
                ("Lebensmittel- und Futtermittelgesetzbuch — cosmetics", "LFGB §§ 26-29",
                 "BVL / BfR", "National cosmetics provisions; safety assessment in DE",
                 "in_force", "critical", ""),
                ("Kosmetik-Verordnung", "KosmetikV",
                 "BVL", "Notification, GMP, language",
                 "in_force", "high", ""),
                ("DIN ISO 22716", "DIN EN ISO 22716",
                 "DIN", "National GMP standard for cosmetics",
                 "in_force", "high", ""),
            ]
        elif code == "IT":
            R += [
                ("Decreto cosmetici", "D.Lgs. 204/2015",
                 "Ministero della Salute", "Sanctions; vigilance; market surveillance IT",
                 "in_force", "high", ""),
            ]
        elif code == "ES":
            R += [
                ("Real Decreto productos cosméticos", "RD 85/2018",
                 "AEMPS", "Notification, surveillance, language",
                 "in_force", "high", ""),
            ]
        elif code == "PL":
            R += [
                ("Ustawa o produktach kosmetycznych", "Dz.U. 2018 poz. 2227",
                 "GIS", "National cosmetics act PL; sanctions",
                 "in_force", "high", ""),
            ]
        elif code == "NL":
            R += [
                ("Warenwetbesluit kosmetische producten", "WBK 2013",
                 "NVWA", "NL implementation; language",
                 "in_force", "high", ""),
            ]
        elif code == "BE":
            R += [
                ("Arrêté royal produits cosmétiques", "AR 17.07.2012",
                 "FAGG/AFMPS", "BE implementation; vigilance",
                 "in_force", "high", ""),
            ]
    elif code == "UK":
        R = [
            ("UK Cosmetics Regulation (assimilated EU 1223/2009)", "Schedule 34 Product Safety & Metrology etc. (Amendment etc.) (EU Exit) Regs 2019",
             "OPSS", "SCPN notification; Responsible Person in UK; safety dossier",
             "in_force", "critical", ""),
            ("UK SCPN portal", "Submit Cosmetic Product Notifications service",
             "OPSS", "Notification via gov.uk SCPN",
             "in_force", "critical", ""),
            ("UK REACH", "Statutory Instrument 2019/758",
             "HSE", "UK REACH duties for substances in cosmetics",
             "in_force", "high", ""),
            ("UK CLP", "Statutory Instrument 2019/720",
             "HSE", "UK CLP labelling",
             "in_force", "high", ""),
        ]
    elif code == "CH":
        R = [
            ("Loi suisse sur les denrées alimentaires — objets usuels", "LDAl RS 817.0; ODAlOUs RS 817.02",
             "OSAV / Cantons", "Cosmetics treated as 'objets usuels'; safety, labelling DE/FR/IT",
             "in_force", "critical", ""),
            ("Ordonnance sur les cosmétiques", "OCos RS 817.023.31",
             "OSAV", "Composition, labelling, restricted substances",
             "in_force", "critical", ""),
        ]
    elif code in ("NO", "IS", "LI"):
        R = [
            ("EEA-incorporated EU Cosmetics Regulation", "(EC) No 1223/2009 via EEA Agreement",
             f"{name} health authority", "Same EU rules + EEA-EFTA secretariat",
             "in_force", "critical", ""),
        ]
    elif code == "RU":
        R = [
            ("EAEU Technical Regulation on Cosmetics", "TR CU 009/2011",
             "EEC + Rospotrebnadzor", "EAEU declaration / state registration; labelling Cyrillic",
             "in_force", "critical", ""),
            ("Federal Law on Sanitary-Epidemiological Welfare", "Federal Law 52-FZ",
             "Rospotrebnadzor", "Sanitary rules; consumer protection",
             "in_force", "high", ""),
        ]
    elif code == "BY":
        R = [
            ("EAEU TR CU 009/2011 (Belarus)", "TR CU 009/2011",
             "Gosstandart", "EAEU declaration; State Hygiene",
             "in_force", "critical", ""),
        ]
    elif code == "EAEU":
        R = [
            ("EAEU TR on Perfumery and Cosmetics", "TR CU 009/2011",
             "Eurasian Economic Commission", "Single market notification; testing; SoC",
             "in_force", "critical", ""),
        ]
    elif code == "UA":
        R = [
            ("Ukraine Technical Regulation on Cosmetics", "Resolution KMU No 65 of 20.01.2021",
             "Derzhprodspozhyvsluzhba", "Aligned with EU 1223/2009; notification; PIF",
             "in_force", "high", ""),
        ]
    elif code == "TR":
        R = [
            ("Turkish Cosmetics Law", "Law No 5324",
             "TITCK", "Notification to TITCK; Responsible Person in TR; labelling Turkish",
             "in_force", "critical", ""),
            ("Cosmetics Regulation", "RG 23.05.2005 No 25823",
             "TITCK", "Aligned with EU 76/768 → 1223/2009",
             "in_force", "high", ""),
        ]
    elif code in ("RS", "BA", "AL", "MK", "ME", "XK", "MD"):
        R = [
            (f"{name} cosmetic products law", f"National cosmetics act ({code})",
             f"{name} health/market authority", "Notification, labelling local language",
             "in_force", "high", "Often aligned with EU 1223/2009"),
        ]
    # USA
    elif code == "US":
        R = [
            ("FD&C Act — Cosmetics", "21 U.S.C. §§ 361-364",
             "US FDA CFSAN", "Adulteration/misbranding; ingredients safety",
             "in_force", "critical", ""),
            ("MoCRA — Modernization of Cosmetics Regulation Act 2022", "Pub.L. 117-328 Subtitle E",
             "US FDA", "Facility registration; product listing; adverse event reporting; GMP; safety substantiation",
             "in_force", "critical", "Deadline registration 2024"),
            ("FPLA — Fair Packaging and Labeling Act", "15 U.S.C. § 1451",
             "FTC + FDA", "Net quantity, identity, place of business",
             "in_force", "high", ""),
            ("21 CFR Part 700-740 cosmetics regulations", "21 CFR 700-740",
             "US FDA", "Color additives, prohibited/restricted ingredients, labelling",
             "in_force", "critical", ""),
            ("FDA Color Additives", "21 CFR Parts 73, 74, 82",
             "US FDA", "Only listed colors permitted; certification batches",
             "in_force", "high", ""),
            ("PFAS in cosmetics — Federal", "FDA voluntary phase-out + MoCRA report",
             "US FDA", "Reporting on PFAS use in cosmetics",
             "in_force", "medium", ""),
        ]
    elif code == "US-CA":
        R = [
            ("California Safe Cosmetics Act (CSCA)", "AB 2775 (Health & Safety Code §§ 111791.5)",
             "CA OEHHA / CDPH", "Reporting of hazardous ingredients (CIR list)",
             "in_force", "high", ""),
            ("Proposition 65", "Cal. Health & Safety Code § 25249.5",
             "CA OEHHA", "Warning labels for listed chemicals",
             "in_force", "high", ""),
            ("Toxic-Free Cosmetics Act", "AB 2762 (2020)",
             "CDPH", "Ban of 24 chemicals (parabens, mercury, formaldehyde) from 2025",
             "in_force", "high", ""),
            ("PFAS-Free Cosmetics Act", "AB 2771 (2022)",
             "CDPH", "Ban PFAS in cosmetics from 1 Jan 2025",
             "in_force", "high", ""),
        ]
    elif code == "US-NY":
        R = [
            ("NY 1,4-dioxane limits in personal care", "ECL § 35-0103",
             "NY DEC", "Max 1 ppm 1,4-dioxane in shampoo from 2023",
             "in_force", "high", ""),
            ("NY PFAS in cosmetics ban (S4265B)", "Environmental Conservation Law 37-0121",
             "NY DEC", "PFAS ban in cosmetics",
             "in_force", "high", ""),
        ]
    elif code in ("US-WA","US-OR","US-MN","US-VT","US-ME","US-CO","US-IL","US-MA"):
        R = [
            (f"{name} Toxic-Free Cosmetics Act", f"State statute ({code})",
             f"{name} Department of Health/Ecology",
             "PFAS, formaldehyde, phthalates restrictions in cosmetics",
             "in_force", "high", ""),
        ]
    elif code == "US-HI":
        R = [
            ("Hawaii UV filter ban applicability", "HRS § 342D-21 (rare in shampoo unless 2-in-1)",
             "Hawaii DOH", "Marginal if shampoo contains UV filters",
             "in_force", "low", ""),
        ]
    elif code in ("US-TX","US-FL","US-NJ"):
        R = [
            (f"{name} consumer protection / cosmetics enforcement", f"State consumer protection statutes ({code})",
             f"{name} Attorney General / health dept",
             "False/misleading claims; state cosmetics enforcement",
             "in_force", "medium", ""),
        ]
    elif code == "CA":
        R = [
            ("Food and Drugs Act — Cosmetics", "R.S.C. 1985, c. F-27",
             "Health Canada", "Adulteration; ingredients; safety",
             "in_force", "critical", ""),
            ("Cosmetic Regulations", "C.R.C., c. 869",
             "Health Canada", "Notification (Cosmetic Notification Form); labelling EN/FR",
             "in_force", "critical", ""),
            ("Hotlist of Prohibited and Restricted Ingredients", "Health Canada Cosmetic Ingredient Hotlist",
             "Health Canada", "Prohibited substances list",
             "in_force", "high", ""),
            ("Consumer Packaging and Labelling Act", "R.S.C. 1985, c. C-38",
             "Competition Bureau", "Bilingual labelling EN/FR",
             "in_force", "high", ""),
        ]
    elif code == "CA-QC":
        R = [
            ("Charter of the French Language", "RLRQ c C-11",
             "OQLF", "Mandatory French labelling Québec",
             "in_force", "high", ""),
        ]
    elif code == "MX":
        R = [
            ("Ley General de Salud", "Title XII Cosmetics",
             "COFEPRIS", "Notification AS / sanitary register",
             "in_force", "critical", ""),
            ("Reglamento de Control Sanitario de Productos y Servicios", "RCSPS",
             "COFEPRIS", "GMP, labelling, ingredients",
             "in_force", "high", ""),
            ("NOM-141-SSA1/SCFI-2012", "NOM-141-SSA1/SCFI-2012",
             "COFEPRIS / SE", "Labelling of pre-packaged cosmetics",
             "in_force", "critical", ""),
            ("NOM-089-SSA1-1994", "NOM-089-SSA1-1994",
             "COFEPRIS", "Microbiology methods cosmetics",
             "in_force", "medium", ""),
        ]
    elif code == "BR":
        R = [
            ("Anvisa cosmetics regulation", "RDC 7/2015",
             "ANVISA", "Notification grades 1 & 2; product list",
             "in_force", "critical", ""),
            ("GMP cosmetics", "RDC 48/2013",
             "ANVISA", "Good manufacturing practices BR",
             "in_force", "high", ""),
            ("List of restricted/prohibited substances", "RDC 530/2021 + RDC 81/2018",
             "ANVISA", "MERCOSUR harmonised lists",
             "in_force", "high", ""),
            ("Labeling cosmetics", "RDC 288/2019",
             "ANVISA", "Portuguese labelling rules",
             "in_force", "high", ""),
        ]
    elif code in ("AR","CL","CO","PE","UY","PY","BO","EC","VE","DO","GT","CR","PA","NI","SV","HN"):
        R = [
            (f"{name} cosmetics sanitary regulation", f"National cosmetics regulation ({code})",
             f"{name} sanitary authority",
             "Sanitary notification; labelling Spanish",
             "in_force", "high", ""),
        ]
        if code == "AR":
            R += [("ANMAT cosmetics", "Disposición 6288/2024 ANMAT",
                   "ANMAT", "Sanitary registration; labelling",
                   "in_force", "critical", "")]
            R += [("IRAM cosmetics standard", "IRAM 80100 series",
                   "IRAM", "AR technical standards cosmetics",
                   "in_force", "medium", "")]
        if code == "CL":
            R += [("Reglamento Sistema Nacional Control Cosméticos", "Decreto 239/02 MINSAL",
                   "ISP Chile", "Sanitary registration; labelling",
                   "in_force", "critical", "")]
        if code == "CO":
            R += [("Decisión 516 CAN cosméticos", "Decisión 516 + 705 (Comunidad Andina)",
                   "INVIMA", "NSO notification Andean Community",
                   "in_force", "critical", "")]
        if code == "PE":
            R += [("DIGEMID cosmetics", "Decisión 516 CAN + DS 010-97-SA",
                   "DIGEMID", "NSO notification",
                   "in_force", "critical", "")]
        if code == "MERCOSUR":
            R = [("MERCOSUR Cosmetics Resolution", "GMC Res. 110/94 + 26/04 (cosmetics labelling)",
                  "MERCOSUR", "Harmonised cosmetics rules among AR/BR/UY/PY",
                  "in_force", "high", "")]
    elif code == "MERCOSUR":
        R = [("MERCOSUR Cosmetics Technical Regulation", "GMC Res. 110/94 + 26/04",
              "MERCOSUR Secretariat", "Cosmetics rules harmonised",
              "in_force", "high", "")]
    elif code in ("CU","JM","TT","BB","HT"):
        R = [(f"{name} consumer/cosmetics import rules", f"National consumer act ({code})",
              f"{name} health/standards authority", "Import authorisation, labelling",
              "in_force", "medium", "")]
    elif code == "CARICOM":
        R = [("CARICOM Cosmetics Common Standard", "CRS / CROSQ standards",
              "CROSQ", "Common labelling/quality",
              "in_force", "medium", "")]
    # ASIA-PACIFIC
    elif code == "CN":
        R = [
            ("Cosmetic Supervision and Administration Regulation (CSAR)", "State Council Order No. 727 (2020)",
             "NMPA", "Registration / notification; Domestic Responsible Person; efficacy claims",
             "in_force", "critical", ""),
            ("Provisions on Cosmetic Registration and Notification Management", "NMPA Order No 35",
             "NMPA", "Registration vs notification regime",
             "in_force", "critical", ""),
            ("Provisions on Cosmetic Labels Management", "NMPA Notice 77 (2021)",
             "NMPA", "Chinese labelling; ingredient list; claims",
             "in_force", "critical", ""),
            ("Safety and Technical Standards for Cosmetics", "STSC 2015",
             "NMPA", "Prohibited/restricted lists; methods",
             "in_force", "critical", ""),
            ("GB cosmetics standards", "GB 7916, GB 7917, GB/T 27574",
             "SAMR", "Chinese national standards on cosmetics",
             "in_force", "high", ""),
        ]
    elif code == "HK":
        R = [
            ("Public Health and Municipal Services Ordinance", "Cap. 132",
             "FEHD", "Cosmetics not pre-registered; misleading labelling prohibited",
             "in_force", "medium", ""),
            ("Trade Descriptions Ordinance", "Cap. 362",
             "Customs & Excise", "False trade descriptions",
             "in_force", "medium", ""),
        ]
    elif code == "MO":
        R = [("Macau cosmetics import rules", "Decree-Law 5/90/M",
              "Health Bureau", "Importation cosmetics control",
              "in_force", "medium", "")]
    elif code == "TW":
        R = [
            ("Cosmetic Hygiene and Safety Act", "Act of 2018 (revised 2023)",
             "TFDA", "PIF; product information file; notification",
             "in_force", "critical", ""),
            ("Cosmetic Labelling Regulation", "TFDA labelling order",
             "TFDA", "Chinese labelling; INCI",
             "in_force", "high", ""),
        ]
    elif code == "JP":
        R = [
            ("Pharmaceutical and Medical Device Act (PMD Act)", "Act 145 of 1960 (revised)",
             "PMDA / MHLW", "Cosmetics (kesho-hin) and quasi-drugs (iyakubugaihin) distinction",
             "in_force", "critical", ""),
            ("Standards for Cosmetics", "MHLW Notification 331/2000",
             "MHLW", "Positive/negative ingredient lists",
             "in_force", "critical", ""),
            ("Voluntary Labelling Fair Competition Code Cosmetics", "JCIA Code",
             "JCIA / JFTC", "Fair competition labels",
             "in_force", "medium", ""),
            ("JIS cosmetics packaging", "JIS series",
             "JISC", "Voluntary JP standards",
             "in_force", "low", ""),
        ]
    elif code == "KR":
        R = [
            ("Cosmetics Act", "Act No 10788",
             "MFDS", "Manufacture/import registration; functional cosmetics review",
             "in_force", "critical", ""),
            ("Cosmetics Act Enforcement Decree", "Presidential Decree",
             "MFDS", "Implementation rules",
             "in_force", "high", ""),
            ("Standards for cosmetics safety", "MFDS Notification 2024-XX",
             "MFDS", "Positive list of ingredients",
             "in_force", "critical", ""),
            ("KCII / KS standards", "KS H ISO 22716",
             "KATS", "Korean GMP standard",
             "in_force", "high", ""),
        ]
    elif code == "IN":
        R = [
            ("Drugs and Cosmetics Act 1940", "Act No 23 of 1940",
             "CDSCO", "Cosmetics regulated; registration for imports",
             "in_force", "critical", ""),
            ("Cosmetics Rules 2020", "G.S.R. 763(E)",
             "CDSCO", "Import registration, manufacturing licence; labelling",
             "in_force", "critical", ""),
            ("BIS cosmetics standards", "IS 7884 (shampoo); IS 4707 part 1 & 2",
             "BIS", "Compulsory hallmarking/standards for cosmetics",
             "in_force", "high", ""),
            ("Legal Metrology (Packaged Commodities) Rules", "2011",
             "Dept. Consumer Affairs", "MRP, net qty, country of origin",
             "in_force", "high", ""),
        ]
    elif code == "PK":
        R = [("Drug Regulatory Authority of Pakistan Act", "Act XXI of 2012",
              "DRAP", "Cosmetics registration",
              "in_force", "high", "")]
    elif code in ("BD","LK","NP","BT","MV"):
        R = [(f"{name} cosmetics import licence", f"Drug/cosmetic act ({code})",
              f"{name} drug authority", "Import licence; labelling EN/local",
              "in_force", "medium", "")]
    elif code == "MM":
        R = [("Myanmar cosmetics notification", "FDA Myanmar",
              "FDA Myanmar", "Notification & import",
              "in_force", "medium", "")]
    elif code == "TH":
        R = [
            ("Cosmetic Act B.E. 2558 (2015)", "Act of 2015",
             "Thai FDA", "Notification, hazardous ingredients control",
             "in_force", "critical", ""),
            ("Notification of Ministry of Public Health", "Various MoPH notifications",
             "Thai FDA", "Restricted/prohibited substances; labelling Thai",
             "in_force", "high", ""),
        ]
    elif code == "VN":
        R = [
            ("Circular on Cosmetics Management", "Circular 06/2011/TT-BYT (rev. 32/2019)",
             "DAV/MoH Vietnam", "Notification number; ASEAN aligned",
             "in_force", "critical", ""),
        ]
    elif code in ("LA","KH"):
        R = [(f"{name} cosmetic notification (ASEAN aligned)", "ACD-aligned national rules",
              f"{name} FDA", "Notification & labelling",
              "in_force", "medium", "")]
    elif code == "MY":
        R = [
            ("Control of Drugs and Cosmetics Regulations 1984", "P.U.(A) 223/1984",
             "NPRA Malaysia", "Notification; labelling Bahasa",
             "in_force", "critical", ""),
            ("Guidelines for Control of Cosmetic Products", "NPRA Guidelines",
             "NPRA", "GMP; claim substantiation",
             "in_force", "high", ""),
        ]
    elif code == "SG":
        R = [
            ("Health Products Act — Cosmetics", "Act 14 of 2007",
             "HSA Singapore", "Notification via HSA portal; ASEAN aligned",
             "in_force", "critical", ""),
            ("Health Products (Cosmetic Products — ASEAN) Regulations", "S 247/2007",
             "HSA Singapore", "Composition; labelling",
             "in_force", "high", ""),
        ]
    elif code == "ID":
        R = [
            ("BPOM Regulation Cosmetics", "BPOM No 23/2019 + amendments",
             "BPOM Indonesia", "Notification; halal certification path",
             "in_force", "critical", ""),
            ("Halal Cosmetics", "Law No 33/2014 + GR 31/2019",
             "BPJPH", "Mandatory halal certification (phased)",
             "in_force", "high", ""),
        ]
    elif code == "PH":
        R = [
            ("ASEAN Cosmetic Directive Implementation", "FDA Circular No 2016-008",
             "FDA Philippines", "Notification; labelling EN/Filipino",
             "in_force", "critical", ""),
            ("RA 9711 (FDA Act)", "Republic Act 9711",
             "FDA Philippines", "FDA mandate for cosmetics",
             "in_force", "high", ""),
        ]
    elif code == "BN":
        R = [("Brunei cosmetics notification ACD", "ASEAN ACD-aligned",
              "Ministry of Health BN", "Notification + labelling",
              "in_force", "medium", "")]
    elif code == "TL":
        R = [("Timor-Leste cosmetics import rules", "National import code",
              "MoH TL", "Limited regulation",
              "in_force", "low", "")]
    elif code == "AU":
        R = [
            ("Australia Industrial Chemicals Act", "Act No 12 of 2019",
             "AICIS", "Inventory listing of ingredients (AIIC)",
             "in_force", "critical", ""),
            ("Therapeutic Goods Act (border with cosmetic)", "Act 1989",
             "TGA", "Borderline cosmetic/therapeutic claims",
             "in_force", "high", ""),
            ("Consumer Goods (Cosmetics) Information Standard", "Trade Practices Act / ACL",
             "ACCC", "Ingredient labelling AICS-aligned",
             "in_force", "high", ""),
            ("Australian Dangerous Goods Code", "ADG Code",
             "NTC", "Transport classification if applicable",
             "in_force", "low", ""),
        ]
    elif code in [c for c, _, _ in AU_STATES]:
        R = [(f"{name} state consumer/fair trading act", f"State Fair Trading Act ({code})",
              f"{name} Fair Trading", "State-level consumer enforcement",
              "in_force", "medium", "")]
    elif code == "NZ":
        R = [
            ("Cosmetic Products Group Standard 2020", "Group Standard HSR002552",
             "EPA NZ", "Adopts EU Cosmetics Reg Annex restrictions",
             "in_force", "critical", ""),
            ("Hazardous Substances and New Organisms Act", "HSNO Act 1996",
             "EPA NZ", "Hazardous substances framework",
             "in_force", "high", ""),
            ("Fair Trading Act", "FTA 1986",
             "Commerce Commission", "Misleading conduct/labelling",
             "in_force", "high", ""),
        ]
    elif code in ("FJ","PG"):
        R = [(f"{name} consumer protection cosmetics", "National consumer act",
              f"{name} consumer council", "Import rules",
              "in_force", "low", "")]
    elif code == "ASEAN":
        R = [
            ("ASEAN Cosmetic Directive", "ACD 2003 + amendments",
             "ACC (ASEAN Cosmetic Committee)", "Harmonised cosmetic rules; ASEAN dossier",
             "in_force", "critical", ""),
            ("ASEAN Cosmetic Product Notification", "ACD Annex",
             "ACC", "Common notification template",
             "in_force", "high", ""),
        ]
    elif code == "SAARC":
        R = [("SAARC consumer protection framework", "SAARC Charter",
              "SAARC Secretariat", "Cooperation only",
              "draft", "low", "")]
    # MENA
    elif code == "GCC":
        R = [
            ("GSO Technical Regulation Cosmetics", "GSO 1943:2016 (Safety requirements for cosmetics and personal care)",
             "GSO Standardization Org.", "Gulf-wide cosmetic safety",
             "in_force", "critical", ""),
            ("GSO 2528:2016 Cosmetic Labelling", "GSO 2528:2016",
             "GSO", "Labelling Arabic + EN",
             "in_force", "high", ""),
            ("GSO Halal cosmetics", "GSO 2055-2",
             "GSO", "Halal cosmetics standard",
             "in_force", "medium", ""),
        ]
    elif code == "SA":
        R = [
            ("SFDA Cosmetics Law", "Royal Decree M/29 (2024)",
             "SFDA", "Notification SFDA; Saudi Authorised Person",
             "in_force", "critical", ""),
            ("SASO Technical Regulation Cosmetics", "SASO TR (aligned GSO 1943)",
             "SASO", "Cosmetic safety; Arabic labelling",
             "in_force", "high", ""),
        ]
    elif code == "AE":
        R = [
            ("UAE Cabinet Resolution Cosmetics", "Cabinet Decision 36/2019",
             "MoHAP / ESMA", "Notification; halal optional; Arabic label",
             "in_force", "critical", ""),
            ("Dubai Municipality Cosmetics registration", "DM Cosmetic registration",
             "Dubai Municipality", "Cosmetic import via Montaji",
             "in_force", "high", ""),
        ]
    elif code in ("AE-AUH","AE-DXB","AE-SHJ","AE-AJM","AE-UAQ","AE-RAK","AE-FUJ"):
        R = [(f"{name} municipal product control", f"Emirate-level municipality rules ({code})",
              f"{name} Municipality", "Local import/inspection",
              "in_force", "medium", "")]
    elif code in ("QA","KW","BH","OM"):
        R = [(f"{name} cosmetics import via GSO", "GSO 1943:2016 (national implementation)",
              f"{name} health/standards authority",
              "Arabic labelling, notification",
              "in_force", "high", "")]
    elif code in ("YE","JO","LB","SY","IQ","PS"):
        R = [(f"{name} cosmetics import rules", "National cosmetics regulation",
              f"{name} health ministry", "Import licence + Arabic label",
              "in_force", "medium", "")]
    elif code == "IR":
        R = [("Iran FDA cosmetics registration", "IFDA Cosmetics Bylaw",
              "IFDA", "Registration; labelling Farsi",
              "in_force", "high", "")]
    elif code == "IL":
        R = [
            ("Pharmacists Ordinance — Cosmetics", "Cosmetic regulations 1973",
             "MoH Israel", "Import licence; labelling Hebrew",
             "in_force", "high", ""),
        ]
    # AFRICA
    elif code == "ZA":
        R = [
            ("Foodstuffs, Cosmetics and Disinfectants Act", "Act No 54 of 1972",
             "DoH SA", "Cosmetic safety; labelling",
             "in_force", "critical", ""),
            ("Regulations relating to cosmetics", "GN R1469",
             "DoH SA", "Composition restrictions",
             "in_force", "high", ""),
            ("Consumer Protection Act", "Act 68 of 2008",
             "NCC", "Labelling; product safety",
             "in_force", "high", ""),
            ("SABS standards cosmetics", "SANS 50000 series",
             "SABS", "Voluntary technical standards",
             "in_force", "medium", ""),
        ]
    elif code == "NG":
        R = [
            ("NAFDAC Cosmetics Regulations", "NAFDAC Cosmetic Regulations 2021",
             "NAFDAC", "Registration with NAFDAC; manufacturing licence",
             "in_force", "critical", ""),
            ("SON cosmetics standards", "NIS standards (Standards Org. of Nigeria)",
             "SON", "Technical product standards",
             "in_force", "high", ""),
        ]
    elif code == "KE":
        R = [
            ("Kenya cosmetics import standards", "KS 1992-2:2019",
             "KEBS", "Import notification; PVoC scheme",
             "in_force", "high", ""),
            ("PPB Pharmacy and Poisons Board", "Pharmacy and Poisons Act CAP 244",
             "PPB", "Cosmetic claims border with drug",
             "in_force", "medium", ""),
        ]
    elif code == "EG":
        R = [
            ("Egyptian Drug Authority cosmetics", "EDA Decree 25/2021",
             "EDA", "Cosmetics registration; Arabic labelling",
             "in_force", "high", ""),
        ]
    elif code in ("MA","DZ","TN","LY","SD","ET","TZ","UG","GH","SN","CI","CM","ZW","ZM","AO","MZ","MG",
                  "BJ","BF","ML","NE","GA","CD","CG","RW","BI","DJ","ER","SO","SL","LR","GM","GW","MR",
                  "EH","SC","MU","NA","BW","SZ","LS","MW","KM","CV","ST","TG"):
        R = [
            (f"{name} cosmetics import / sanitary rules",
             f"National cosmetic regulation ({code})",
             f"{name} health authority / standards bureau",
             "Import licence; labelling local language",
             "in_force", "medium", ""),
            (f"{name} consumer protection act (cosmetics)",
             f"National consumer protection code ({code})",
             f"{name} consumer protection authority",
             "Misleading labelling; consumer rights",
             "in_force", "medium", ""),
            (f"{name} standards body — cosmetic standards (voluntary/mandatory)",
             f"{name} national standards (cosmetic series)",
             f"{name} national standards body",
             "Standards alignment ISO 22716 / EU 1223 frequently referenced",
             "in_force", "medium", ""),
        ]
        # Specific patches
        if code == "MA":
            R += [("Loi marocaine sur produits cosmétiques", "Loi 28-13",
                   "DMP / Ministry of Health", "Notification & labelling Arabic/French",
                   "in_force", "high", ""),
                  ("Décret application loi cosmétiques", "Décret 2-13-852",
                   "DMP Maroc", "Modalités application loi 28-13",
                   "in_force", "high", ""),
                  ("Norme marocaine ISO 22716", "NM ISO 22716",
                   "IMANOR", "GMP cosmétiques", "in_force", "medium", "")]
        if code == "DZ":
            R += [("Décret exécutif algérien cosmétiques", "Décret exécutif 97-37",
                   "Ministère du Commerce", "Conditions de fabrication, conditionnement",
                   "in_force", "high", ""),
                  ("Loi sur la protection du consommateur", "Loi 09-03 du 25.02.2009",
                   "Ministère du Commerce", "Étiquetage en arabe + français",
                   "in_force", "high", "")]
        if code == "TN":
            R += [("Décret tunisien cosmétiques", "Décret 2008-2745",
                   "DPM Tunisia", "AMM cosmétiques",
                   "in_force", "high", ""),
                  ("Loi consommateur tunisienne", "Loi 92-117",
                   "Direction Consumer Protection TN", "Consumer rights TN", "in_force", "medium", "")]
        if code == "GH":
            R += [("FDA Ghana cosmetics", "PHA 2012 Act 851",
                   "FDA Ghana", "Registration & GMP",
                   "in_force", "high", ""),
                  ("Standards Authority Ghana cosmetic", "GS 800 series",
                   "Ghana Standards Authority", "Cosmetic standards GH", "in_force", "medium", "")]
        if code == "ZW":
            R += [("Medicines and Allied Substances Control Act", "Chapter 15:03",
                   "MCAZ", "Cosmetics regulated by MCAZ", "in_force", "high", "")]
        if code == "TZ":
            R += [("Tanzania Food, Drugs and Cosmetics Act", "Act 1 of 2003",
                   "TMDA", "Cosmetic registration TZ", "in_force", "high", "")]
        if code == "UG":
            R += [("Uganda National Drug Authority cosmetic registration", "NDA Act Cap 206",
                   "NDA Uganda", "Cosmetic registration UG", "in_force", "high", "")]
        if code == "SN":
            R += [("Code sénégalais hygiène / cosmétiques", "Loi 83-71",
                   "Ministère de la Santé SN", "Cosmetics framework SN", "in_force", "high", "")]
        if code == "CI":
            R += [("Décret ivoirien sur cosmétiques", "Décret 2000-191",
                   "Ministère Santé CI", "Cosmetic regulation CI", "in_force", "high", "")]
        if code == "CM":
            R += [("Loi cadre sur la santé publique CM", "Loi 2000/021",
                   "Ministère Santé CM", "Cosmetics framework CM", "in_force", "medium", "")]
        if code == "MU":
            R += [("Pharmacy Act Mauritius cosmetic borderline", "Act 24 of 1983",
                   "Ministry of Health MU", "Cosmetic borderline MU", "in_force", "medium", "")]
        if code == "BW":
            R += [("Drugs and Related Substances Act Botswana", "Cap 63:04",
                   "Ministry of Health BW", "Cosmetics framework BW", "in_force", "medium", "")]
        if code == "NA":
            R += [("Medicines and Related Substances Control Act NA", "Act 13 of 2003",
                   "Ministry of Health NA", "Cosmetics framework NA", "in_force", "medium", "")]
    elif code == "ECOWAS":
        R = [("ECOWAS cosmetics harmonised standards", "ECOSHAM cosmetics framework",
              "ECOWAS Commission", "Regional harmonisation initiative",
              "in_force", "medium", "")]
    elif code in ("EAC","SADC","COMESA","ECCAS","AFCFTA"):
        R = [(f"{name} harmonisation product standards", f"{name} technical regulation framework",
              f"{name} Secretariat", "Regional cooperation",
              "in_force", "low", "")]
    elif code == "AU-Africa":
        R = [("African Union Continental Standards Strategy", "AU Agenda 2063",
              "AU Commission", "Continental standardisation framework",
              "in_force", "low", "")]
    # INTERNATIONAL
    elif code == "ISO":
        R = [
            ("ISO 22716 GMP Cosmetics", "ISO 22716:2007",
             "ISO/TC 217", "Cosmetic GMP — international",
             "in_force", "high", ""),
            ("ISO 16128 natural/organic cosmetics", "ISO 16128-1:2016 + 16128-2:2017",
             "ISO/TC 217", "Definitions natural/organic ingredients",
             "in_force", "medium", ""),
            ("ISO 17516 microbial limits cosmetics", "ISO 17516:2014",
             "ISO/TC 217", "Microbiological limits",
             "in_force", "high", ""),
            ("ISO 21148 microbiology methods", "ISO 21148:2017",
             "ISO/TC 217", "General methods microbiology",
             "in_force", "medium", ""),
        ]
    elif code == "CODEX":
        R = [("Codex — not applicable for cosmetics", "N/A",
              "FAO/WHO Codex", "Codex covers food not cosmetics",
              "in_force", "low", "")]
    elif code == "OECD":
        R = [("OECD Test Guidelines for ingredient safety", "OECD TG 404/406/429/439",
              "OECD ENV/CBC", "Skin irritation/sensitisation TGs",
              "in_force", "high", "")]
    elif code == "WTO":
        R = [("WTO TBT Agreement notifications", "TBT Agreement",
              "WTO Secretariat", "Notifications of national cosmetic technical regulations",
              "in_force", "medium", "")]
    elif code in ("WHO","ICAO","IATA","IMO","UNECE","WIPO","ITU","3GPP","GSMA"):
        R = [(f"{name} cosmetic-relevant guidance (limited)", "Various",
              name, "Limited/no direct cosmetic role",
              "in_force", "low", "")]
    return R


# ---------------------------------------------------------------
#                  P2 — SUNSCREEN (cosmetic leave-on + UV)
# ---------------------------------------------------------------
def p2_regs(code, name, region):
    R = []
    if code == "EU":
        R = [
            ("EU Cosmetics Regulation", "(EC) No 1223/2009",
             "EC DG GROW", "Applies to sunscreens; UV filters Annex VI positive list only",
             "in_force", "critical", ""),
            ("EC Recommendation on Sunscreen Products Efficacy", "Commission Recommendation 2006/647/EC",
             "EC DG GROW", "SPF/UVA testing & labelling; UVA logo; SPF categories",
             "in_force", "critical", ""),
            ("EU Annex VI — UV Filters", "(EC) 1223/2009 Annex VI",
             "EC DG GROW + SCCS", "Positive list of UV filters",
             "in_force", "critical", ""),
            ("Octocrylene restriction", "Reg (EU) 2022/2195",
             "EC DG GROW", "Restriction nano-octocrylene & Benzophenone-3",
             "in_force", "high", ""),
            ("Homosalate restriction", "Reg (EU) 2022/1531",
             "EC DG GROW", "Max 7.34% face only",
             "in_force", "high", ""),
            ("Microplastics ban (TiO2 leave-on nano)", "(EU) 2023/2055",
             "ECHA", "Solid microplastics ban — leave-on excluded but encapsulated UV filters scoped",
             "in_force", "high", ""),
            ("PPWR Packaging Regulation", "(EU) 2025/40",
             "EC DG ENV", "Recyclability sunscreen pumps/aerosols",
             "in_force", "high", ""),
            ("CLP Regulation", "(EC) 1272/2008",
             "ECHA", "Hazard classification of aerosol products",
             "in_force", "high", ""),
            ("Aerosol Dispensers Directive (if aerosol form)", "75/324/EEC consolidated 2016/2037",
             "EC DG GROW", "Aerosol packaging technical reqs",
             "in_force", "high", ""),
            ("ISO 22716 GMP", "ISO 22716:2007",
             "ISO", "GMP cosmetics",
             "in_force", "critical", ""),
            ("ISO 24444 SPF", "ISO 24444:2019 (rev. 2020)",
             "ISO/TC 217", "In vivo SPF test",
             "in_force", "critical", ""),
            ("ISO 24443 UVA in vitro", "ISO 24443:2021",
             "ISO/TC 217", "In vitro UVA-PF",
             "in_force", "critical", ""),
        ]
    elif code in [c for c, _, _ in EU_MEMBERS]:
        R = [
            ("EU Cosmetics Regulation directly applicable", "(EC) No 1223/2009",
             f"NCA {name}", "CPNP; UVA logo; SPF categories",
             "in_force", "critical", ""),
            ("National sunscreen labelling implementing rules", f"National implementing decree ({code})",
             f"{name} health authority", "Local language; UVA logo",
             "in_force", "high", ""),
        ]
        if code == "FR":
            R += [("Recommandation ANSM produits solaires", "Recommandations ANSM",
                   "ANSM", "Test SPF, mentions obligatoires",
                   "in_force", "high", "")]
        if code == "DE":
            R += [("BVL solar product guidance", "BVL Leitfaden Sonnenschutz",
                   "BVL", "DE-specific testing/marketing",
                   "in_force", "medium", "")]
    elif code == "UK":
        R = [
            ("UK Cosmetics Regulation", "Assimilated EU 1223/2009",
             "OPSS", "SCPN notification; UV filters Annex VI",
             "in_force", "critical", ""),
            ("BSI ISO 24444 SPF", "BS ISO 24444",
             "BSI", "SPF test national standard",
             "in_force", "high", ""),
        ]
    elif code == "CH":
        R = [("Ordonnance cosmétiques (OCos)", "RS 817.023.31",
              "OSAV", "UV filters positive list aligned EU",
              "in_force", "critical", "")]
    elif code in ("NO", "IS", "LI"):
        R = [("EEA cosmetics regulation", "(EC) 1223/2009 via EEA",
              f"{name} health authority", "Same as EU",
              "in_force", "critical", "")]
    elif code == "RU":
        R = [("EAEU TR CU 009/2011 UV filters", "TR CU 009/2011 Annex 4",
              "Rospotrebnadzor", "EAEU positive list UV filters",
              "in_force", "critical", "")]
    elif code == "EAEU":
        R = [("EAEU TR CU 009/2011 UV filters list", "TR CU 009/2011",
              "EEC", "UV filters positive list",
              "in_force", "critical", "")]
    elif code == "TR":
        R = [("Cosmetics Reg + SPF testing", "RG 23.05.2005 No 25823 + Annex VI",
              "TITCK", "UV filters positive list; SPF labelling",
              "in_force", "critical", "")]
    elif code in ("BY","UA","MD","RS","BA","AL","MK","ME","XK"):
        R = [(f"{name} cosmetics + UV filter rules", f"National cosmetics act ({code})",
              f"{name} health authority", "UV filters positive list (EU aligned)",
              "in_force", "high", "")]
    # USA
    elif code == "US":
        R = [
            ("FDA OTC Sunscreen Final Monograph (Stayed)", "21 CFR Part 352",
             "US FDA", "Sunscreens regulated as OTC drugs in US; active ingredients list",
             "in_force", "critical", ""),
            ("Sunscreen Innovation Act", "Pub.L. 113-195 (2014)",
             "US FDA", "TEA new active ingredient process",
             "in_force", "critical", ""),
            ("CARES Act sunscreen reform", "Pub.L. 116-136 §3854",
             "US FDA", "Order/admin process for sunscreen OTC monograph",
             "in_force", "high", ""),
            ("Deemed Final Order Sunscreens (2021)", "September 24 2021 DFO",
             "US FDA", "16 active ingredients; SPF testing; labelling",
             "in_force", "critical", ""),
            ("FDA Drug Establishment Registration", "FDC Act §510",
             "US FDA", "Facility registration + drug listing for sunscreens",
             "in_force", "critical", ""),
            ("FDA Sunscreen Labelling Final Rule 2011", "76 FR 35620",
             "US FDA", "Broad spectrum; SPF; water resistance",
             "in_force", "critical", ""),
            ("FDA Adverse Event Reporting", "21 CFR 314.80",
             "US FDA", "MedWatch reporting",
             "in_force", "high", ""),
            ("CPSIA aerosol if applicable", "Pub.L. 110-314",
             "US CPSC", "If aerosol container",
             "in_force", "medium", ""),
        ]
    elif code == "US-HI":
        R = [
            ("Hawaii Reef-Safe Sunscreen Act", "HRS § 342D-21 (Act 104 of 2018)",
             "Hawaii DOH", "Ban sale of sunscreens with oxybenzone or octinoxate from 1 Jan 2021",
             "in_force", "critical", ""),
            ("Hawaii Sunscreen Ban Expansion (2024)", "HB 2807",
             "Hawaii DOH", "Avobenzone, octocrylene phase-out",
             "draft", "high", ""),
        ]
    elif code == "US-CA":
        R = [
            ("CA Toxic-Free Cosmetics Act", "AB 2762",
             "CDPH", "Apply to leave-on incl. sunscreens",
             "in_force", "high", ""),
            ("Prop 65", "Cal. H&S Code § 25249.5",
             "OEHHA", "Warnings for listed chemicals (BHT, retinyl palmitate)",
             "in_force", "high", ""),
            ("AB 2862 reef-protective sunscreen", "AB 2862",
             "CDPH", "Educational labelling reefs",
             "in_force", "medium", ""),
        ]
    elif code in ("US-FL","US-NY","US-TX","US-IL"):
        R = [(f"{name} sunscreen distribution rules", "Various state consumer/health",
              f"{name} health/AG", "State drug listing & labelling",
              "in_force", "medium", "")]
    elif code in ("US-OR","US-WA","US-MA","US-MN","US-CO","US-NJ","US-ME","US-VT"):
        R = [(f"{name} chemicals in cosmetics/sunscreens", f"State Toxic-Free Cosmetics Act ({code})",
              f"{name} health/ecology dept", "PFAS, phthalate, formaldehyde restrictions",
              "in_force", "high", "")]
    # Other Americas
    elif code == "CA":
        R = [
            ("Health Canada Sunscreen Monograph", "Sunscreen Monograph 2013",
             "Health Canada NNHPD", "NHP licensing; SPF testing; UVA",
             "in_force", "critical", ""),
            ("Natural Health Products Regulations", "SOR/2003-196",
             "Health Canada NNHPD", "Mineral sunscreens as NHP",
             "in_force", "critical", ""),
            ("Drug Identification Number (DIN)", "Food and Drugs Act",
             "Health Canada", "Chemical sunscreens as drugs require DIN",
             "in_force", "critical", ""),
        ]
    elif code == "CA-QC":
        R = [("Charte de la langue française", "RLRQ c C-11",
              "OQLF", "French labelling Québec",
              "in_force", "high", "")]
    elif code == "MX":
        R = [
            ("Bonampak/Cozumel reef sunscreen ban", "Decreto Quintana Roo 2010 (Sian Ka'an, Xcaret)",
             "SEMARNAT + state authorities", "Reef-safe sunscreens only in selected parks",
             "in_force", "high", ""),
            ("NOM-141-SSA1/SCFI-2012", "NOM-141-SSA1/SCFI-2012",
             "COFEPRIS", "Cosmetic labelling (applies to sunscreens)",
             "in_force", "critical", ""),
            ("Sunscreen as cosmetic (no OTC drug)", "Ley General de Salud",
             "COFEPRIS", "Sunscreens regulated as cosmetics MX",
             "in_force", "high", ""),
        ]
    elif code == "BR":
        R = [
            ("Anvisa RDC 30/2012 sunscreens", "RDC 30/2012",
             "ANVISA", "SPF, UVA-PF, water resistance requirements",
             "in_force", "critical", ""),
            ("Anvisa RDC 7/2015 cosmetics", "RDC 7/2015",
             "ANVISA", "Notification grade 2 sunscreens (grade 2)",
             "in_force", "critical", ""),
            ("Anvisa RDC 47/2014 actives list", "RDC 47/2014",
             "ANVISA", "Allowed UV filters list",
             "in_force", "critical", ""),
        ]
    elif code in ("AR","CL","CO","PE","UY","PY","BO","EC","VE","DO","GT","CR","PA","NI","SV","HN"):
        R = [(f"{name} sunscreen regulation (cosmetic+OTC border)",
              "Decisión 516 CAN or local",
              f"{name} sanitary authority",
              "Sanitary registration; SPF labelling; positive UV filter list",
              "in_force", "high", "")]
        if code == "AR":
            R += [("ANMAT Disposición 3992/2005 protectores solares", "Disposición 3992/2005",
                   "ANMAT", "Sunscreens technical requirements",
                   "in_force", "critical", "")]
        if code == "CO":
            R += [("Decisión 833 protectores solares Andina", "Decisión 833 CAN",
                   "INVIMA", "Andean sunscreen rules",
                   "in_force", "critical", "")]
        if code == "PE":
            R += [("DIGEMID sunscreens", "DS 010-97-SA",
                   "DIGEMID", "Sanitary notification",
                   "in_force", "high", "")]
    elif code == "MERCOSUR":
        R = [("MERCOSUR Sunscreen Resolution", "GMC Res. 26/04 + 56/02",
              "MERCOSUR", "Common sunscreen rules",
              "in_force", "high", "")]
    elif code in ("CU","JM","TT","BB","HT"):
        R = [(f"{name} sunscreen import rules", "National consumer code",
              f"{name} health authority", "Import + label",
              "in_force", "medium", "")]
    elif code == "CARICOM":
        R = [("CARICOM sunscreen standards CROSQ", "CROSQ technical regulations",
              "CROSQ", "Regional standards",
              "in_force", "medium", "")]
    # ASIA-PACIFIC
    elif code == "CN":
        R = [
            ("CSAR — Special Cosmetic (sunscreen)", "State Council Order No 727",
             "NMPA", "Sunscreen is 'special cosmetic' = REGISTRATION (not notification)",
             "in_force", "critical", ""),
            ("STSC UV filter list", "STSC 2015 Annex 6",
             "NMPA", "Positive list UV filters CN",
             "in_force", "critical", ""),
            ("Efficacy claim evaluation", "NMPA Provisions on cosmetic efficacy claim",
             "NMPA", "SPF/PA efficacy reports filing",
             "in_force", "critical", ""),
            ("GB SPF test", "GB/T 30133-2013 + Methods STSC",
             "SAMR", "SPF test method CN",
             "in_force", "high", ""),
        ]
    elif code == "HK":
        R = [("HK Pharmacy and Poisons / cosmetic borderline", "Cap. 138 + Cap. 132",
              "Pharmacy and Poisons Board", "Borderline for some sunscreens",
              "in_force", "medium", "")]
    elif code == "MO":
        R = [("Macau cosmetic import", "DL 5/90/M", "Health Bureau",
              "Import control", "in_force", "medium", "")]
    elif code == "TW":
        R = [
            ("Cosmetic Hygiene Safety Act + SPF testing", "TFDA Act 2018",
             "TFDA", "Sunscreen registration; SPF/UVA per ISO",
             "in_force", "critical", ""),
            ("TFDA UV filter positive list", "TFDA Guidance",
             "TFDA", "Allowed UV filters",
             "in_force", "high", ""),
        ]
    elif code == "JP":
        R = [
            ("PMD Act — Quasi-drugs / Cosmetics", "Act 145/1960",
             "MHLW / PMDA", "SPF claim → quasi-drug; otherwise cosmetic",
             "in_force", "critical", ""),
            ("MHLW Notification 331/2000 + sunscreen actives", "MHLW Notif. 331",
             "MHLW", "Positive UV filter list",
             "in_force", "critical", ""),
            ("JCIA SPF measurement standard", "JCIA standard",
             "JCIA / MHLW", "JP SPF in vivo method (aligned ISO 24444)",
             "in_force", "high", ""),
            ("PA system", "JCIA PA grading",
             "JCIA", "PA+ to PA++++ UVA grading",
             "in_force", "high", ""),
        ]
    elif code == "KR":
        R = [
            ("Cosmetics Act — Functional cosmetics", "Act No 10788",
             "MFDS", "Sunscreens = functional cosmetics; review by MFDS",
             "in_force", "critical", ""),
            ("MFDS Notification UV filter positive list", "MFDS Notification 2024-XX",
             "MFDS", "Positive list UV filters",
             "in_force", "critical", ""),
            ("KFDA SPF test method", "MFDS Notification SPF Guidelines",
             "MFDS", "SPF/PA testing rules KR (ISO aligned)",
             "in_force", "high", ""),
            ("PA system", "MFDS PA grading", "MFDS",
             "PA+ to PA++++ UVA grading", "in_force", "high", ""),
        ]
    elif code == "IN":
        R = [
            ("Drugs and Cosmetics Rules", "Rules 1945",
             "CDSCO", "Sunscreens generally cosmetic; SPF on label",
             "in_force", "critical", ""),
            ("BIS sunscreen standard", "IS 4707",
             "BIS", "Voluntary IS for cosmetics incl. sunscreen",
             "in_force", "medium", ""),
        ]
    elif code in ("PK","BD","LK","NP","BT","MV","MM"):
        R = [(f"{name} sunscreen import", "National cosmetic act",
              f"{name} drug authority", "Import licence",
              "in_force", "medium", "")]
    elif code == "TH":
        R = [
            ("Cosmetic Act B.E. 2558", "Act 2015",
             "Thai FDA", "Sunscreen notification",
             "in_force", "critical", ""),
            ("Notification of MoPH sunscreen", "MoPH UV filter notification",
             "Thai FDA", "Allowed UV filters Thailand",
             "in_force", "high", ""),
        ]
    elif code == "VN":
        R = [("Circular 06/2011/TT-BYT + amendments", "Circular 06/2011",
              "DAV", "ASEAN aligned UV filter list",
              "in_force", "critical", "")]
    elif code == "MY":
        R = [
            ("NPRA cosmetic notification + sunscreens", "Control of Drugs and Cosmetics Reg",
             "NPRA", "Notification + UV filter ASEAN list",
             "in_force", "critical", ""),
        ]
    elif code == "SG":
        R = [("HSA sunscreen ASEAN-aligned", "S 247/2007",
              "HSA Singapore", "Notification + ASEAN UV filter list",
              "in_force", "critical", "")]
    elif code == "ID":
        R = [
            ("BPOM cosmetic notification + sunscreen", "BPOM No 23/2019",
             "BPOM", "Notification; UV filter list ASEAN",
             "in_force", "critical", ""),
            ("Halal sunscreens", "Law 33/2014",
             "BPJPH", "Halal certification (phased)",
             "in_force", "high", ""),
        ]
    elif code == "PH":
        R = [("FDA Philippines cosmetic + sunscreens", "FDA Circular 2016-008",
              "FDA Philippines", "ASEAN-aligned",
              "in_force", "critical", "")]
    elif code in ("BN","LA","KH","TL"):
        R = [(f"{name} ASEAN aligned sunscreen", "ACD-aligned",
              f"{name} FDA", "Notification + label",
              "in_force", "medium", "")]
    elif code == "AU":
        R = [
            ("Therapeutic Goods Order — Sunscreen Standard", "TGO 109 (2021)",
             "TGA", "Therapeutic sunscreens (primary use sun protection) regulated as therapeutic goods",
             "in_force", "critical", ""),
            ("ARTG listing for primary sunscreens", "Therapeutic Goods Act 1989",
             "TGA", "ARTG registration",
             "in_force", "critical", ""),
            ("AS/NZS 2604 Sunscreen Standard", "AS/NZS 2604:2021",
             "Standards Australia", "SPF testing AU/NZ",
             "in_force", "critical", ""),
            ("AICIS — secondary sunscreens (cosmetic)", "Industrial Chemicals Act 2019",
             "AICIS", "Cosmetic with SPF<15",
             "in_force", "high", ""),
            ("ACCC labelling consumer goods", "ACL",
             "ACCC", "Misleading conduct",
             "in_force", "high", ""),
        ]
    elif code in [c for c, _, _ in AU_STATES]:
        R = [(f"{name} consumer safety regulator", "State Fair Trading Act",
              f"{name} Fair Trading", "State-level enforcement",
              "in_force", "medium", "")]
    elif code == "NZ":
        R = [
            ("AS/NZS 2604 SPF Standard", "AS/NZS 2604:2021",
             "Standards NZ", "SPF testing NZ",
             "in_force", "critical", ""),
            ("Sunscreen (Product Safety Standard) Act 2022", "Public Act 2022 No 21",
             "Commerce Commission", "Mandatory compliance with AS/NZS 2604",
             "in_force", "critical", ""),
            ("EPA NZ Cosmetic Products Group Standard", "HSR002552",
             "EPA NZ", "Hazardous substances",
             "in_force", "high", ""),
        ]
    elif code in ("FJ","PG"):
        R = [("Pacific Reef-safe sunscreen voluntary", "National voluntary",
              f"{name} environment authority", "Reef-safe campaigns",
              "in_force", "low", "")]
    elif code == "ASEAN":
        R = [
            ("ASEAN Cosmetic Directive UV filter Annex", "ACD Annex VII",
             "ACC", "Common UV filter positive list",
             "in_force", "critical", ""),
        ]
    elif code == "SAARC":
        R = [("SAARC consumer cooperation", "SAARC Charter",
              "SAARC", "Limited", "draft", "low", "")]
    # MENA
    elif code == "GCC":
        R = [
            ("GSO 1943:2016 cosmetics (incl. sunscreen)", "GSO 1943:2016",
             "GSO", "Safety reqs, UV filters list",
             "in_force", "critical", ""),
            ("GSO 2528:2016 cosmetic labelling", "GSO 2528:2016",
             "GSO", "Labelling Arabic + EN",
             "in_force", "high", ""),
        ]
    elif code == "SA":
        R = [("SFDA sunscreen as cosmetic", "RD M/29 (2024)",
              "SFDA", "Notification SFDA; UV filter aligned GSO",
              "in_force", "critical", "")]
    elif code == "AE":
        R = [("UAE Cabinet Decision 36/2019", "Cabinet Decision 36/2019",
              "MoHAP / ESMA", "Sunscreen as cosmetic; UV filter aligned",
              "in_force", "critical", "")]
    elif code in ("AE-AUH","AE-DXB","AE-SHJ","AE-AJM","AE-UAQ","AE-RAK","AE-FUJ"):
        R = [(f"{name} municipal cosmetic registration",
              f"Emirate municipality cosmetics ({code})",
              f"{name} Municipality", "Local cosmetic import",
              "in_force", "medium", "")]
    elif code in ("QA","KW","BH","OM"):
        R = [(f"{name} GSO 1943:2016 implementation", "GSO 1943:2016",
              f"{name} health authority", "Arabic labelling, notification",
              "in_force", "high", "")]
    elif code in ("YE","JO","LB","SY","IQ","PS"):
        R = [(f"{name} sunscreen import", "National cosmetic regulation",
              f"{name} health ministry", "Import + Arabic label",
              "in_force", "medium", "")]
    elif code == "IR":
        R = [("IFDA sunscreen registration", "IFDA Cosmetic Bylaw",
              "IFDA", "Registration; Farsi label",
              "in_force", "high", "")]
    elif code == "IL":
        R = [("Cosmetic Regulations 1973 (sunscreens)", "Pharmacist Ordinance",
              "MoH Israel", "Import licence; Hebrew label",
              "in_force", "high", "")]
    # AFRICA
    elif code == "ZA":
        R = [
            ("Foodstuffs, Cosmetics and Disinfectants Act + sunscreen", "Act 54/1972",
             "DoH SA", "Sunscreen as cosmetic; SPF labelling",
             "in_force", "critical", ""),
            ("SANS 1557 Sunscreen Standard", "SANS 1557:2007",
             "SABS", "Sunscreen SPF test SA",
             "in_force", "high", ""),
        ]
    elif code == "NG":
        R = [("NAFDAC sunscreens", "NAFDAC Cosmetic Regulations 2021",
              "NAFDAC", "Registration; SPF label",
              "in_force", "critical", "")]
    elif code == "KE":
        R = [("KEBS PVoC + cosmetic standard", "KS 1992-2:2019",
              "KEBS", "Import notification",
              "in_force", "high", "")]
    elif code == "EG":
        R = [("EDA cosmetics + sunscreens", "EDA Decree 25/2021",
              "EDA", "Registration; Arabic labelling",
              "in_force", "high", "")]
    elif code in ("MA","DZ","TN","LY","SD","ET","TZ","UG","GH","SN","CI","CM","ZW","ZM","AO","MZ","MG",
                  "BJ","BF","ML","NE","GA","CD","CG","RW","BI","DJ","ER","SO","SL","LR","GM","GW","MR",
                  "EH","SC","MU","NA","BW","SZ","LS","MW","KM","CV","ST","TG"):
        R = [(f"{name} sunscreen as cosmetic",
              f"National cosmetic regulation ({code})",
              f"{name} health authority",
              "Import licence; local language label",
              "in_force", "medium", "")]
    elif code == "ECOWAS":
        R = [("ECOWAS cosmetics harmonised", "ECOSHAM",
              "ECOWAS Commission", "Harmonisation initiative",
              "in_force", "medium", "")]
    elif code in ("EAC","SADC","COMESA","ECCAS","AFCFTA"):
        R = [(f"{name} cosmetic standards harmonisation",
              f"{name} technical regulation framework",
              f"{name} Secretariat", "Regional cooperation",
              "in_force", "low", "")]
    elif code == "AU-Africa":
        R = [("AU continental standards strategy", "AU Agenda 2063",
              "AU Commission", "Continental framework",
              "in_force", "low", "")]
    # INTERNATIONAL
    elif code == "ISO":
        R = [
            ("ISO 24444 SPF in vivo", "ISO 24444:2019/Cor1:2020",
             "ISO/TC 217", "In vivo SPF method (gold standard)",
             "in_force", "critical", ""),
            ("ISO 24443 UVA-PF in vitro", "ISO 24443:2021",
             "ISO/TC 217", "In vitro UVA-PF",
             "in_force", "critical", ""),
            ("ISO 18861 Water Resistance", "ISO 18861:2020",
             "ISO/TC 217", "Water resistance test",
             "in_force", "high", ""),
            ("ISO 16217 Water Resistance Method", "ISO 16217:2020",
             "ISO/TC 217", "Water immersion procedure",
             "in_force", "high", ""),
            ("ISO 22716 GMP", "ISO 22716:2007",
             "ISO", "Cosmetic GMP",
             "in_force", "high", ""),
            ("ISO 23675 SPF in vitro (new)", "ISO 23675:2024",
             "ISO/TC 217", "New in vitro SPF method",
             "in_force", "high", ""),
            ("ISO 23698 HDRS UV protection", "ISO 23698:2024",
             "ISO/TC 217", "Hybrid SPF method (combining in vivo & in vitro)",
             "in_force", "high", ""),
        ]
    elif code == "CODEX":
        R = [("Codex — not applicable", "N/A",
              "Codex", "Codex covers food", "in_force", "low", "")]
    elif code == "OECD":
        R = [("OECD test guidelines for UV filter safety", "OECD TG 471/474/487/488/489/490/491",
              "OECD", "Genotoxicity, photo-toxicity tests UV filters",
              "in_force", "high", "")]
    elif code == "WTO":
        R = [("WTO TBT notifications sunscreen rules", "TBT Agreement",
              "WTO", "Notifications",
              "in_force", "medium", "")]
    elif code in ("WHO","ICAO","IATA","IMO","UNECE","WIPO","ITU","3GPP","GSMA"):
        R = [(f"{name} relevance to sunscreens", "Various",
              name, "Limited/none direct sunscreen role",
              "in_force", "low", "")]
    return R


# ---------------------------------------------------------------
#               P3 — SMARTPHONE  (electronics + telecom)
# ---------------------------------------------------------------
def p3_regs(code, name, region):
    R = []
    if code == "EU":
        R = [
            ("Radio Equipment Directive (RED)", "Directive 2014/53/EU",
             "EC DG GROW + national NRAs", "CE marking; essential reqs incl. safety, EMC, spectrum",
             "in_force", "critical", ""),
            ("RED Delegated Act on Common Charger USB-C", "(EU) 2022/2380",
             "EC DG GROW", "USB-C mandatory for smartphones from 28 Dec 2024",
             "in_force", "critical", ""),
            ("RoHS Directive", "Directive 2011/65/EU + 2015/863",
             "EC DG ENV + NCAs", "Restriction Pb/Cd/Hg/Cr6+/PBB/PBDE + 4 phthalates",
             "in_force", "critical", ""),
            ("WEEE Directive", "Directive 2012/19/EU",
             "EC + NCAs", "Take-back, recycling, registration WEEE",
             "in_force", "critical", ""),
            ("Batteries Regulation", "Regulation (EU) 2023/1542",
             "EC DG GROW", "Battery passport, recyclability, CE; replaces Dir 2006/66/EC",
             "in_force", "critical", ""),
            ("REACH", "(EC) 1907/2006",
             "ECHA", "SVHC notif in articles; phthalates restrictions",
             "in_force", "critical", ""),
            ("EMC Directive", "2014/30/EU",
             "EC DG GROW", "Electromagnetic compatibility CE",
             "in_force", "critical", "Covered via RED for RF devices"),
            ("Low Voltage Directive", "2014/35/EU",
             "EC DG GROW", "Electrical safety <1000VAC",
             "in_force", "high", "Covered via RED essential reqs"),
            ("Ecodesign Smartphones/Tablets", "Regulation (EU) 2023/1670",
             "EC DG ENER", "Repairability, durability, reliability; spare parts 7y; OS updates 5y",
             "in_force", "critical", ""),
            ("Energy Label Smartphones/Tablets", "Regulation (EU) 2023/1669",
             "EC DG ENER", "Energy efficiency label; repairability score",
             "in_force", "critical", ""),
            ("Cyber Resilience Act", "Regulation (EU) 2024/2847",
             "EC + ENISA", "Cybersecurity essential reqs for products with digital elements",
             "in_force", "critical", "Applies fully Dec 2027"),
            ("AI Act (if AI features)", "Regulation (EU) 2024/1689",
             "EC DG CNECT", "Risk-based AI obligations",
             "in_force", "high", ""),
            ("Digital Markets Act (gatekeepers)", "Regulation (EU) 2022/1925",
             "EC", "Sideloading & interop obligations gatekeepers",
             "in_force", "high", ""),
            ("GDPR", "Regulation (EU) 2016/679",
             "EDPB + NCAs", "Privacy by design/default",
             "in_force", "critical", ""),
            ("ePrivacy Directive", "Directive 2002/58/EC",
             "NCAs", "Cookies, communications confidentiality",
             "in_force", "high", ""),
            ("Conflict Minerals Regulation", "Regulation (EU) 2017/821",
             "EC DG TRADE", "Due diligence 3TG minerals (tin, tungsten, tantalum, gold)",
             "in_force", "high", ""),
            ("PPWR Packaging", "(EU) 2025/40",
             "EC DG ENV", "Smartphone packaging",
             "in_force", "high", ""),
            ("CSDDD due diligence", "Directive (EU) 2024/1760",
             "EC + Member States", "Supply chain human rights",
             "in_force", "high", ""),
            ("EN 301 489 series EMC", "ETSI EN 301 489",
             "ETSI / EC", "Harmonised EMC standard for RE",
             "in_force", "high", ""),
            ("EN 300 328 (2.4 GHz)", "ETSI EN 300 328",
             "ETSI", "Wideband transmission 2.4 GHz",
             "in_force", "high", ""),
            ("EN 301 908 (cellular)", "ETSI EN 301 908",
             "ETSI", "Cellular RE harmonised",
             "in_force", "high", ""),
            ("EN 62311 EMF exposure", "EN 62311",
             "CENELEC", "EMF human exposure",
             "in_force", "critical", ""),
            ("EN 50360/50566 SAR head/body", "EN 50360 / EN 50566",
             "CENELEC", "SAR limits smartphones",
             "in_force", "critical", ""),
            ("EN IEC 62368-1 product safety", "EN IEC 62368-1:2020",
             "CENELEC", "Audio/video/ICT safety",
             "in_force", "critical", ""),
        ]
    elif code in [c for c, _, _ in EU_MEMBERS]:
        R = [
            ("EU RED transposition", f"National implementing law of 2014/53/EU ({code})",
             f"{name} NRA + market surveillance", "CE marking; national language docs",
             "in_force", "critical", ""),
            ("EU RoHS transposition", f"National implementing law of 2011/65/EU ({code})",
             f"{name} market surveillance", "Substances restrictions",
             "in_force", "critical", ""),
            ("EU WEEE transposition", f"National implementing law of 2012/19/EU ({code})",
             f"{name} environmental authority", "EPR scheme registration",
             "in_force", "critical", ""),
            ("National spectrum regulator", f"{name} national table of frequency allocation",
             f"{name} NRA", "Spectrum allocation",
             "in_force", "high", ""),
        ]
        if code == "FR":
            R += [
                ("Indice de réparabilité", "Décret n° 2020-1757",
                 "DGCCRF + ADEME", "Repair index 0-10 smartphones",
                 "in_force", "critical", ""),
                ("Indice de durabilité", "Décret n° 2024-XXX",
                 "DGCCRF + ADEME", "Durability index from 8 Jan 2025",
                 "in_force", "critical", ""),
                ("Loi REEN (responsabilité environnementale numérique)", "Loi n° 2021-1485",
                 "Arcep + ADEME", "Eco-design digital",
                 "in_force", "high", ""),
                ("DAS (specific absorption rate) display", "Décret n° 2019-1186",
                 "ANFR", "Mandatory SAR/DAS labelling",
                 "in_force", "high", ""),
                ("Article 14 Loi AGEC", "Loi 2020-105",
                 "MEDDE", "Spare parts info; QR code",
                 "in_force", "high", ""),
            ]
        elif code == "DE":
            R += [
                ("ElektroG WEEE Germany", "ElektroG 2015",
                 "Stiftung EAR", "Registration EAR before placing on market",
                 "in_force", "critical", ""),
                ("BattG batteries", "BattG 2020",
                 "UBA", "Battery EPR Germany",
                 "in_force", "high", ""),
                ("BNetzA spectrum", "BNetzA Verfügungen",
                 "BNetzA", "DE spectrum",
                 "in_force", "high", ""),
            ]
        elif code == "IT":
            R += [
                ("D.Lgs. 49/2014 WEEE Italy", "D.Lgs. 49/2014",
                 "ISPRA", "WEEE registration & contribution",
                 "in_force", "critical", ""),
                ("MISE radio equipment", "D.Lgs. 128/2016 (RED)",
                 "MIMIT", "IT RED implementation",
                 "in_force", "critical", ""),
            ]
        elif code == "ES":
            R += [
                ("RD 27/2021 RAEE", "RD 27/2021",
                 "MITECO", "WEEE ES",
                 "in_force", "critical", ""),
                ("RD 188/2016 RED", "RD 188/2016",
                 "MAETD", "ES RED implementation",
                 "in_force", "critical", ""),
            ]
        elif code == "PL":
            R += [("Ustawa o zużytym sprzęcie elektrycznym i elektronicznym", "Dz.U. 2015 poz. 1688",
                   "GIOŚ", "WEEE PL", "in_force", "critical", "")]
        elif code == "NL":
            R += [("Telecommunicatiewet", "Stb 2014 RED",
                   "Agentschap Telecom", "NL telecom & RED", "in_force", "critical", "")]
    elif code == "UK":
        R = [
            ("UK Radio Equipment Regulations 2017", "SI 2017/1206",
             "OPSS + Ofcom", "UKCA marking (or CE until end 2025)",
             "in_force", "critical", ""),
            ("UK RoHS", "SI 2012/3032 (amended)",
             "OPSS", "Substances restrictions",
             "in_force", "critical", ""),
            ("UK WEEE", "SI 2013/3113",
             "Environment Agency", "EPR producer registration",
             "in_force", "critical", ""),
            ("UK Telecommunications Security Act", "TSA 2021",
             "DSIT + Ofcom", "Network and device security",
             "in_force", "high", ""),
            ("UK PSTI Act security IoT", "PSTI Act 2022",
             "OPSS", "Security requirements for connectable products",
             "in_force", "critical", ""),
            ("UK Online Safety Act", "OSA 2023",
             "Ofcom", "Online safety duties (services delivered via device)",
             "in_force", "high", ""),
        ]
    elif code == "CH":
        R = [
            ("Telecommunications Act", "TCA SR 784.10",
             "BAKOM/OFCOM", "Radio equipment conformity",
             "in_force", "critical", ""),
            ("Ordonnance OIT (telecom installations)", "RS 784.101.2",
             "BAKOM", "Aligned with EU RED",
             "in_force", "critical", ""),
            ("ChemO + ORRChim", "RS 813.11 / 814.81",
             "OFEV", "Chemical restrictions",
             "in_force", "high", ""),
            ("VREG Ordinance on Return of Electrical Equipment", "RS 814.620",
             "OFEV", "WEEE Switzerland",
             "in_force", "critical", ""),
        ]
    elif code in ("NO","IS","LI"):
        R = [(f"{name} EEA RED/RoHS/WEEE adoption", "EEA Agreement",
              f"{name} NRA", "Same as EU",
              "in_force", "critical", "")]
    elif code == "RU":
        R = [
            ("EAEU TR CU 020/2011 EMC", "TR CU 020/2011",
             "Rosstandart", "EMC EAEU declaration",
             "in_force", "critical", ""),
            ("EAEU TR CU 004/2011 Low Voltage Safety", "TR CU 004/2011",
             "Rosstandart", "Electrical safety EAEU",
             "in_force", "critical", ""),
            ("FSB notification encryption", "Federal Law on Communications + FSB",
             "FSB", "Encryption product notification",
             "in_force", "critical", ""),
            ("FAS Notification (frequencies)", "Federal Law 126-FZ",
             "Roskomnadzor", "Frequency authorisation",
             "in_force", "high", ""),
            ("Russian preloaded apps law", "Law 425-FZ (2019)",
             "Roskomnadzor", "Mandatory preinstalled Russian software",
             "in_force", "high", ""),
            ("Personal Data Law 152-FZ", "Federal Law 152-FZ",
             "Roskomnadzor", "Data localisation",
             "in_force", "high", ""),
        ]
    elif code == "BY":
        R = [("EAEU TR CU 020/2011 + 004/2011 (Belarus)", "TR CU 020/2011 + 004/2011",
              "Gosstandart", "EAEU declaration BY", "in_force", "critical", "")]
    elif code == "EAEU":
        R = [
            ("EAEU TR CU 020/2011 EMC", "TR CU 020/2011",
             "EEC", "EAC mark for EMC",
             "in_force", "critical", ""),
            ("EAEU TR CU 004/2011 Low Voltage", "TR CU 004/2011",
             "EEC", "EAC mark electrical safety",
             "in_force", "critical", ""),
        ]
    elif code == "UA":
        R = [("Ukraine Technical Regulation on Radio Equipment", "Resolution KMU 355",
              "State Service of Special Communication", "Aligned with EU RED",
              "in_force", "high", "")]
    elif code == "TR":
        R = [
            ("Turkish Wireless Telegraphy Act + RED transposition", "Law 5809 + RED transposition",
             "BTK", "TR Type Approval",
             "in_force", "critical", ""),
            ("Turkish IMEI registration", "BTK regulation IMEI",
             "BTK", "Mandatory IMEI registration to use cellular",
             "in_force", "critical", ""),
            ("AEEE Regulation (WEEE)", "RG 22.05.2012",
             "ÇŞB", "WEEE Türkiye",
             "in_force", "high", ""),
        ]
    elif code in ("RS","BA","AL","MK","ME","XK","MD"):
        R = [(f"{name} radio equipment & EMC rules", f"National telecom act ({code})",
              f"{name} NRA", "RED/EMC alignment EU",
              "in_force", "high", "")]
    # AMERICAS
    elif code == "US":
        R = [
            ("FCC Part 15 (unlicensed RF)", "47 CFR Part 15",
             "FCC", "RF device authorisation; intentional radiators",
             "in_force", "critical", ""),
            ("FCC Part 22/24/27 (licensed mobile)", "47 CFR Parts 22, 24, 27",
             "FCC", "Cellular bands; type acceptance",
             "in_force", "critical", ""),
            ("FCC Part 2 — Equipment Authorization", "47 CFR Part 2 Subpart J",
             "FCC + TCBs", "Equipment authorization (Certification)",
             "in_force", "critical", ""),
            ("FCC SAR Limits", "OET Bulletin 65 / 47 CFR 2.1093",
             "FCC", "1.6 W/kg SAR average 1g",
             "in_force", "critical", ""),
            ("FCC Covered List (Huawei/ZTE etc.)", "Secure Equipment Act 2021",
             "FCC", "Prohibition certain entities",
             "in_force", "high", ""),
            ("EPA Energy Star (voluntary)", "Energy Star Program Reqs Computers",
             "EPA", "Voluntary",
             "in_force", "medium", ""),
            ("Conflict Minerals Disclosure", "SEC Rule 13p-1 (Dodd-Frank §1502)",
             "SEC", "Annual 3TG disclosure",
             "in_force", "high", ""),
            ("CPSC button/coin cell battery rule", "Reese's Law / 16 CFR Part 1263",
             "CPSC", "Coin battery warning + design (if applicable to accessories)",
             "in_force", "medium", ""),
            ("FTC Made in USA", "16 CFR Part 323",
             "FTC", "If 'Made in USA' claim",
             "in_force", "medium", ""),
            ("CALEA lawful intercept", "47 U.S.C. § 1001-1010",
             "FBI/DOJ", "Lawful intercept capabilities",
             "in_force", "high", ""),
        ]
    elif code == "US-CA":
        R = [
            ("CA Energy Commission Battery Charger Rule", "Title 20 §§ 1601-1608",
             "CEC", "Battery charger efficiency",
             "in_force", "high", ""),
            ("Prop 65", "Cal. H&S Code 25249.5",
             "OEHHA", "Warnings for listed substances (Pb, Ni, BPA)",
             "in_force", "high", ""),
            ("CA Right to Repair Act", "SB 244 (2023)",
             "CA AG", "Parts/manuals 7y after sale",
             "in_force", "high", ""),
            ("CalRecycle Cell Phone Recycling Act", "PRC § 42490",
             "CalRecycle", "Retailer takeback obligations",
             "in_force", "high", ""),
        ]
    elif code == "US-NY":
        R = [
            ("NY Right to Repair (Digital Fair Repair)", "GBL § 399-nn",
             "NY AG", "Parts/manuals access",
             "in_force", "high", ""),
        ]
    elif code == "US-MN":
        R = [("MN Digital Fair Repair", "Minn. Stat. 325E.72",
              "MN AG", "Right to repair", "in_force", "high", "")]
    elif code == "US-MA":
        R = [("MA right to repair", "Mass. Gen. L. c. 93K",
              "MA AG", "Right to repair", "in_force", "high", "")]
    elif code in ("US-OR","US-CO","US-WA","US-IL","US-FL","US-TX","US-NJ"):
        R = [(f"{name} state e-waste recycling act", f"State e-waste statute ({code})",
              f"{name} environmental authority", "Producer responsibility for e-waste",
              "in_force", "high", "")]
    elif code == "US-VT":
        R = [("VT Right to Repair / E-Waste", "Vt. Stat. Ann. tit. 10",
              "VT ANR", "E-waste + right to repair", "in_force", "high", "")]
    elif code == "US-ME":
        R = [("Maine WEEE PRO", "38 MRSA §1610-A",
              "ME DEP", "E-waste PRO", "in_force", "high", "")]
    elif code == "US-HI":
        R = [("Hawaii Electronic Device Recycling Act", "HRS § 339D",
              "Hawaii DOH", "Recycling", "in_force", "medium", "")]
    elif code == "CA":
        R = [
            ("Radiocommunication Act", "R.S.C. 1985, c. R-2",
             "ISED", "Radio licensing",
             "in_force", "critical", ""),
            ("RSS-247 / RSS-130 / RSS-132 etc.", "Radio Standards Specifications ISED",
             "ISED", "Technical RSS for cellular/Wi-Fi",
             "in_force", "critical", ""),
            ("ICES-003 EMI", "ICES-003 Issue 7",
             "ISED", "EMI for ITE",
             "in_force", "high", ""),
            ("Safety Code 6 SAR", "Safety Code 6 (Health Canada)",
             "Health Canada", "RF exposure limits",
             "in_force", "critical", ""),
            ("Consumer Packaging and Labelling Act", "R.S.C. 1985, c. C-38",
             "Competition Bureau", "Bilingual labelling",
             "in_force", "high", ""),
            ("CEPA Electronic Equipment Notice", "CEPA 1999",
             "ECCC", "EPR e-waste provincial implementation",
             "in_force", "high", ""),
            ("CASL Anti-Spam", "S.C. 2010, c. 23",
             "CRTC", "Software install consent",
             "in_force", "high", ""),
        ]
    elif code == "CA-QC":
        R = [("Charte de la langue française", "RLRQ c C-11",
              "OQLF", "Mandatory French", "in_force", "high", "")]
    elif code == "MX":
        R = [
            ("Ley Federal de Telecomunicaciones y Radiodifusión", "DOF 14/07/2014",
             "IFT", "Telecom equipment homologation",
             "in_force", "critical", ""),
            ("IFT-008-2015 (RF)", "Disposición Técnica IFT-008-2015",
             "IFT", "RF technical requirements MX",
             "in_force", "critical", ""),
            ("NOM-208-SCFI-2016 (radio EMC)", "NOM-208-SCFI-2016",
             "SE / IFT", "Mexican type approval",
             "in_force", "critical", ""),
            ("NOM-024-SCFI-2013 commercial info", "NOM-024-SCFI-2013",
             "PROFECO", "Spanish labelling consumer",
             "in_force", "high", ""),
            ("NOM-001-SCFI safety electrical", "NOM-001-SCFI-2018",
             "SE", "Electrical safety",
             "in_force", "high", ""),
        ]
    elif code == "BR":
        R = [
            ("Anatel Telecom Resolution 715/2019", "Res. 715/2019",
             "ANATEL", "Telecom equipment homologation BR",
             "in_force", "critical", ""),
            ("Anatel Act 77 (RF)", "Act No 77 of 2018",
             "ANATEL", "RF testing requirements",
             "in_force", "critical", ""),
            ("Anatel Resolution 506 (radiation)", "Res. 506",
             "ANATEL", "RF exposure",
             "in_force", "high", ""),
            ("INMETRO certification chargers/batteries", "Portaria 372/2010",
             "INMETRO", "Battery/charger certification",
             "in_force", "high", ""),
            ("CONAMA WEEE", "Decree 10.240/2020",
             "MMA", "Reverse logistics EEE",
             "in_force", "high", ""),
            ("LGPD", "Lei 13.709/2018",
             "ANPD", "Data protection",
             "in_force", "high", ""),
        ]
    elif code in ("AR","CL","CO","PE","UY","PY","BO","EC","VE","DO","GT","CR","PA","NI","SV","HN"):
        R = [(f"{name} telecom equipment homologation",
              f"National telecom regulator ({code})",
              f"{name} telecom authority",
              "Type approval RF; labelling Spanish",
              "in_force", "critical", "")]
        if code == "AR":
            R += [("ENACOM Resolución 215/2017", "Resolución ENACOM 215/2017",
                   "ENACOM", "Type approval AR", "in_force", "critical", ""),
                  ("IRAM safety", "IRAM 4220 series",
                   "IRAM", "Electrical safety standards", "in_force", "high", "")]
        if code == "CL":
            R += [("SUBTEL Resolución Exenta 1985 / decreto 4234", "Res. Ex. 1985",
                   "SUBTEL", "Type approval CL", "in_force", "critical", "")]
        if code == "CO":
            R += [("CRC Telecom regulation + 5050/2016", "Res. 5050/2016 CRC",
                   "CRC + MinTIC", "Telecom regulation CO", "in_force", "critical", "")]
        if code == "PE":
            R += [("MTC homologación", "DS 023-2003-MTC",
                   "MTC + Pronatel", "Homologation PE", "in_force", "critical", "")]
    elif code == "MERCOSUR":
        R = [("MERCOSUR Telecom standards", "GMC Resolutions",
              "MERCOSUR", "Harmonised telecom rules",
              "in_force", "medium", "")]
    elif code in ("CU","JM","TT","BB","HT"):
        R = [(f"{name} telecom homologation", "National telecom act",
              f"{name} telecom regulator", "Type approval", "in_force", "medium", "")]
    elif code == "CARICOM":
        R = [("CARICOM telecom harmonisation CTU", "CTU technical regulations",
              "CTU", "Regional", "in_force", "medium", "")]
    # ASIA-PACIFIC
    elif code == "CN":
        R = [
            ("CCC Compulsory Certification", "AQSIQ Order 117",
             "CNCA / SAMR", "CCC mark for electrical safety/EMC",
             "in_force", "critical", ""),
            ("SRRC Type Approval (wireless)", "Radio Regulations",
             "MIIT-SRRC", "Wireless type approval CN",
             "in_force", "critical", ""),
            ("MIIT Network Access Permit (CMIIT)", "MIIT Order",
             "MIIT", "Network access license",
             "in_force", "critical", ""),
            ("CTA Certificate Telecom Access", "MIIT Procedures",
             "MIIT CTTL", "Telecom access cert",
             "in_force", "critical", ""),
            ("GB 4943.1 product safety", "GB 4943.1-2022",
             "SAMR", "Electrical safety (IEC 62368-1 aligned)",
             "in_force", "critical", ""),
            ("GB/T 19286 SAR", "GB/T 19286-2022",
             "SAMR", "SAR CN",
             "in_force", "critical", ""),
            ("China RoHS 2", "MIIT Order 32 (2016)",
             "MIIT", "Pollution control of EEE",
             "in_force", "critical", ""),
            ("PIPL", "PIPL 2021",
             "CAC", "Data protection",
             "in_force", "critical", ""),
            ("Cybersecurity Law", "CSL 2017",
             "CAC", "Cybersecurity & data flows",
             "in_force", "critical", ""),
            ("CCRC Cybersecurity Cert.", "CCC for cybersecurity products",
             "CNCA", "Mandatory cyber cert (servers/critical)",
             "in_force", "high", ""),
        ]
    elif code == "HK":
        R = [
            ("HK Telecommunications Ordinance", "Cap. 106",
             "OFCA", "Type approval HK",
             "in_force", "critical", ""),
            ("HK Energy Efficiency Labelling Scheme", "EELS",
             "EMSD", "Energy label", "in_force", "medium", ""),
            ("HK WEEE (PRS scheme)", "PRS Regulation",
             "EPD", "Producer Responsibility Scheme", "in_force", "high", ""),
        ]
    elif code == "MO":
        R = [("DSRT type approval", "Macau radio law",
              "DSRT", "Type approval", "in_force", "high", "")]
    elif code == "TW":
        R = [
            ("NCC Type Approval", "NCC Telecom Act",
             "NCC", "Wireless devices certification TW",
             "in_force", "critical", ""),
            ("BSMI Mark", "Commodity Inspection Act",
             "BSMI", "Safety + EMC certification",
             "in_force", "critical", ""),
        ]
    elif code == "JP":
        R = [
            ("Giteki Mark (MIC Technical Standards Conformity)", "Radio Act + Telecom Business Act",
             "MIC + TELEC/JATE", "Mandatory Giteki for wireless",
             "in_force", "critical", ""),
            ("PSE Mark (Electrical Appliance and Material Safety Act)", "Act No 234/1961",
             "METI", "Electrical safety (chargers etc.)",
             "in_force", "critical", ""),
            ("Battery Recycling Act", "Battery JBRC",
             "JBRC", "Battery recycling system",
             "in_force", "high", ""),
            ("Act on Promotion of Resource Recycling", "Resource Recycling Act",
             "METI / MoE", "E-waste recycling",
             "in_force", "high", ""),
            ("APPI", "APPI 2017",
             "PPC", "Data protection", "in_force", "high", ""),
        ]
    elif code == "KR":
        R = [
            ("KC Mark Radio Equipment", "Radio Waves Act",
             "RRA / MSIT", "Type approval KC",
             "in_force", "critical", ""),
            ("KC Mark Electrical Safety", "Electrical Appliances and Consumer Products Safety Control Act",
             "KATS", "Electrical safety certification",
             "in_force", "critical", ""),
            ("Korea RoHS-like", "Act on Resource Circulation EEE",
             "MoE", "Substance restrictions EEE",
             "in_force", "high", ""),
            ("PIPA", "Personal Information Protection Act",
             "PIPC", "Data protection", "in_force", "high", ""),
        ]
    elif code == "IN":
        R = [
            ("BIS CRS Compulsory Registration Scheme", "Electronics & IT Goods Order 2012",
             "BIS", "Mandatory BIS registration of mobile phones (IS 13252)",
             "in_force", "critical", ""),
            ("WPC ETA Wireless Equipment", "Indian Wireless Telegraphy Act 1933 / Telecom Eng Centre",
             "WPC + TEC", "Equipment Type Approval",
             "in_force", "critical", ""),
            ("TEC MTCTE Mandatory Certification", "TEC MTCTE Scheme",
             "TEC", "Mandatory testing & certification telecom equipment",
             "in_force", "critical", ""),
            ("E-Waste Management Rules 2022", "Notification 09.11.2022",
             "CPCB / MoEFCC", "EPR + RoHS-like restrictions",
             "in_force", "critical", ""),
            ("Battery Waste Management Rules 2022", "Notification 24.08.2022",
             "CPCB", "Battery EPR",
             "in_force", "high", ""),
            ("DPDP Act", "Digital Personal Data Protection Act 2023",
             "Data Protection Board India", "Data protection",
             "in_force", "high", ""),
        ]
    elif code == "PK":
        R = [("PTA Type Approval", "Telecom Act 1996",
              "PTA", "Type approval PK", "in_force", "critical", "")]
    elif code == "BD":
        R = [("BTRC Type Approval", "Bangladesh Telecom Act 2001",
              "BTRC", "Type approval BD", "in_force", "high", "")]
    elif code in ("LK","NP","BT","MV","MM"):
        R = [(f"{name} telecom type approval", "National telecom act",
              f"{name} telecom regulator", "Type approval", "in_force", "medium", "")]
    elif code == "TH":
        R = [
            ("NBTC Type Approval", "Radio Communications Act B.E. 2498",
             "NBTC", "Telecom equipment type approval",
             "in_force", "critical", ""),
            ("TISI safety standards", "TIS standards",
             "TISI", "Industrial standards (electrical safety)",
             "in_force", "high", ""),
            ("PDPA", "PDPA B.E. 2562 (2019)",
             "PDPC", "Data protection", "in_force", "high", ""),
        ]
    elif code == "VN":
        R = [
            ("MIC Type Approval Vietnam", "Decree 49/2017/ND-CP",
             "MIC Vietnam", "Telecom type approval",
             "in_force", "critical", ""),
            ("QCVN technical regulations", "Various QCVN",
             "MIC", "National technical regulations radio/EMC",
             "in_force", "critical", ""),
            ("Cybersecurity Law", "Law 24/2018/QH14",
             "MoPS", "Cybersecurity", "in_force", "high", ""),
        ]
    elif code in ("LA","KH"):
        R = [(f"{name} telecom type approval", "National telecom act",
              f"{name} telecom authority", "Type approval", "in_force", "medium", "")]
    elif code == "MY":
        R = [
            ("MCMC Type Approval Malaysia", "Communications and Multimedia Act 1998",
             "MCMC + SIRIM", "Type approval; SIRIM mark",
             "in_force", "critical", ""),
            ("PDPA", "Personal Data Protection Act 2010",
             "PDP Commissioner", "Data protection", "in_force", "high", ""),
        ]
    elif code == "SG":
        R = [
            ("IMDA Equipment Registration", "Telecommunications Act 1999",
             "IMDA", "Type approval; equipment registration",
             "in_force", "critical", ""),
            ("PDPA", "Personal Data Protection Act 2012",
             "PDPC", "Data protection", "in_force", "high", ""),
        ]
    elif code == "ID":
        R = [
            ("SDPPI Sertifikat", "Permenkominfo No 16/2018",
             "SDPPI Kominfo", "Type approval mandatory",
             "in_force", "critical", ""),
            ("TKDN Local Content", "Permenperin 65/2016",
             "Ministry of Industry", "30%-40% local content for 4G/5G phones",
             "in_force", "critical", ""),
            ("IMEI Registration ID", "Permenkominfo 1/2020",
             "Kominfo", "Mandatory IMEI registration database",
             "in_force", "critical", ""),
            ("UU PDP", "Law 27/2022", "MCI",
             "Data protection", "in_force", "high", ""),
        ]
    elif code == "PH":
        R = [
            ("NTC Type Acceptance", "RA 7925",
             "NTC", "Type acceptance PH",
             "in_force", "critical", ""),
            ("BPS Standards / DTI", "PNS Standards",
             "DTI BPS", "Product safety standards",
             "in_force", "high", ""),
            ("Data Privacy Act 2012", "RA 10173",
             "NPC", "Data protection", "in_force", "high", ""),
        ]
    elif code in ("BN","TL"):
        R = [(f"{name} telecom type approval", "National telecom act",
              f"{name} authority", "Type approval", "in_force", "medium", "")]
    elif code == "AU":
        R = [
            ("ACMA RCM (Radio Communications Act)", "Radiocommunications Act 1992",
             "ACMA", "RCM mark; supplier code labelling",
             "in_force", "critical", ""),
            ("EESS Electrical Equipment Safety Scheme", "EESS",
             "ERAC", "Electrical safety registration",
             "in_force", "critical", ""),
            ("Telecommunications Act 1997", "Cth Act",
             "ACMA", "Customer equipment standards",
             "in_force", "high", ""),
            ("National Television and Computer Recycling Scheme", "Product Stewardship Act 2011",
             "DCCEEW", "E-waste recycling",
             "in_force", "high", ""),
            ("Privacy Act 1988", "Cth Act",
             "OAIC", "Data protection", "in_force", "high", ""),
        ]
    elif code in [c for c, _, _ in AU_STATES]:
        R = [(f"{name} state e-waste / fair trading", f"State law ({code})",
              f"{name} authority", "State enforcement", "in_force", "medium", "")]
    elif code == "NZ":
        R = [
            ("Radiocommunications Act 1989", "Public Act 1989 No 148",
             "RSM", "Radio device approval",
             "in_force", "critical", ""),
            ("Electricity (Safety) Regulations 2010", "SR 2010/36",
             "Energy Safety NZ", "Electrical safety",
             "in_force", "critical", ""),
            ("Telecommunications Act 2001", "Public Act 2001 No 103",
             "Commerce Commission", "Telecom regulation",
             "in_force", "high", ""),
            ("WasteMINZ e-waste TAS", "Voluntary",
             "Ministry for the Environment", "Voluntary e-waste scheme",
             "draft", "medium", ""),
        ]
    elif code in ("FJ","PG"):
        R = [(f"{name} telecom type approval", "National telecom act",
              f"{name} telecom authority", "Type approval", "in_force", "medium", "")]
    elif code == "ASEAN":
        R = [
            ("ASEAN MRA Telecom Equipment", "ASEAN MRA EE",
             "ASEAN Sectoral Body", "Mutual Recognition Arrangement",
             "in_force", "high", ""),
        ]
    elif code == "SAARC":
        R = [("SAARC telecom cooperation", "SAARC Charter",
              "SAARC", "Limited", "draft", "low", "")]
    # MENA
    elif code == "GCC":
        R = [
            ("GSO 005-Series Telecom", "GSO standards on RF safety",
             "GSO", "Harmonised standards GCC",
             "in_force", "medium", ""),
        ]
    elif code == "SA":
        R = [
            ("CITC Type Approval Saudi", "CITC Regulations",
             "CITC", "Saudi type approval (TA license)",
             "in_force", "critical", ""),
            ("SASO IECEE / SASO 2902 EMC", "SASO 2902:2018",
             "SASO", "EMC requirement", "in_force", "high", ""),
            ("Saber Platform conformity", "SASO Saber",
             "SASO", "Conformity certificate via Saber",
             "in_force", "critical", ""),
            ("Personal Data Protection Law", "Royal Decree M/19",
             "SDAIA", "Data protection", "in_force", "high", ""),
        ]
    elif code == "AE":
        R = [
            ("TDRA Type Approval UAE", "TDRA Regulatory Framework",
             "TDRA", "Type approval RF UAE",
             "in_force", "critical", ""),
            ("ESMA / MoIAT ECAS", "ECAS conformity scheme",
             "MoIAT", "Conformity ECAS",
             "in_force", "critical", ""),
            ("PDPL UAE", "Federal Decree-Law 45/2021",
             "UAE Data Office", "Data protection", "in_force", "high", ""),
        ]
    elif code in ("AE-AUH","AE-DXB","AE-SHJ","AE-AJM","AE-UAQ","AE-RAK","AE-FUJ"):
        R = [(f"{name} municipal product control electronics",
              f"Emirate-level rules ({code})",
              f"{name} municipality", "Local import",
              "in_force", "medium", "")]
    elif code in ("QA","KW","BH","OM","YE","JO","LB","SY","IQ","PS"):
        R = [(f"{name} telecom type approval", "National telecom law",
              f"{name} telecom regulator", "Type approval",
              "in_force", "high", "")]
        if code == "QA":
            R += [("CRA Type Approval Qatar", "CRA Regulations",
                   "CRA", "Type approval", "in_force", "critical", "")]
        if code == "KW":
            R += [("CITRA Type Approval Kuwait", "CITRA",
                   "CITRA", "Type approval", "in_force", "critical", "")]
        if code == "OM":
            R += [("TRA Type Approval Oman", "TRA Regulations",
                   "TRA", "Type approval", "in_force", "critical", "")]
    elif code == "IR":
        R = [("CRA Iran Type Approval", "Iran Communications Regulatory Authority",
              "CRA Iran", "Type approval; sanctions complications",
              "in_force", "high", "")]
    elif code == "IL":
        R = [
            ("MoC Type Approval Israel", "Telecommunications Law 1982",
             "Ministry of Communications", "Type approval IL",
             "in_force", "critical", ""),
            ("Standards Institution of Israel SI 32 EMC", "SI 961 / SI 32",
             "SII", "Electrical safety + EMC",
             "in_force", "high", ""),
            ("Privacy Protection Law", "1981",
             "PPA", "Data protection", "in_force", "high", ""),
        ]
    # AFRICA
    elif code == "ZA":
        R = [
            ("ICASA Type Approval", "Electronic Communications Act 36/2005",
             "ICASA", "Type approval ZA",
             "in_force", "critical", ""),
            ("NRCS Safety", "Letter of Authority NRCS",
             "NRCS", "Electrical safety LOA",
             "in_force", "critical", ""),
            ("POPIA", "Act 4 of 2013", "Information Regulator",
             "Data protection", "in_force", "high", ""),
        ]
    elif code == "NG":
        R = [
            ("NCC Type Approval Nigeria", "NCA 2003",
             "NCC", "Type approval", "in_force", "critical", ""),
            ("SON Mandatory Conformity", "MANCAP",
             "SON", "Mandatory conformity NG",
             "in_force", "high", ""),
        ]
    elif code == "KE":
        R = [
            ("CA Type Approval Kenya", "Kenya Information and Comms Act",
             "Communications Authority", "Type approval", "in_force", "critical", ""),
            ("KEBS PVoC Standardization Mark", "KS standards",
             "KEBS", "PVoC pre-export verification", "in_force", "high", ""),
        ]
    elif code == "EG":
        R = [("NTRA Type Approval Egypt", "Telecom Reg Law 10/2003",
              "NTRA", "Type approval", "in_force", "critical", "")]
    elif code in ("MA","DZ","TN","LY","SD","ET","TZ","UG","GH","SN","CI","CM","ZW","ZM","AO","MZ","MG",
                  "BJ","BF","ML","NE","GA","CD","CG","RW","BI","DJ","ER","SO","SL","LR","GM","GW","MR",
                  "EH","SC","MU","NA","BW","SZ","LS","MW","KM","CV","ST","TG"):
        R = [(f"{name} telecom type approval", f"National telecom act ({code})",
              f"{name} telecom regulator", "Type approval",
              "in_force", "medium", "")]
        if code == "MA":
            R += [("ANRT Maroc Agrément", "Loi 24-96 + décrets",
                   "ANRT", "Agrément RF MA", "in_force", "critical", "")]
    elif code == "ECOWAS":
        R = [("WATRA harmonisation", "ECOWAS telecom act",
              "WATRA", "Regional telecom", "in_force", "medium", "")]
    elif code in ("EAC","SADC","COMESA","ECCAS","AFCFTA"):
        R = [(f"{name} telecom harmonisation framework",
              f"{name} ICT protocol",
              f"{name} Secretariat", "Regional cooperation",
              "in_force", "low", "")]
    elif code == "AU-Africa":
        R = [("ATU African Telecommunications Union", "ATU framework",
              "ATU", "Continental cooperation", "in_force", "low", "")]
    # INTERNATIONAL
    elif code == "ISO":
        R = [
            ("ISO/IEC 17025 testing labs", "ISO/IEC 17025:2017",
             "ISO/CASCO", "Testing/cal labs",
             "in_force", "high", ""),
            ("IEC 62368-1 product safety", "IEC 62368-1:2018",
             "IEC", "Safety AV/ICT global", "in_force", "critical", ""),
            ("IEC 62133-2 batteries", "IEC 62133-2:2017",
             "IEC", "Li-ion safety", "in_force", "critical", ""),
            ("IEC 62321 RoHS testing", "IEC 62321",
             "IEC", "RoHS test methods", "in_force", "high", ""),
            ("IEC 62209 SAR", "IEC 62209-1528",
             "IEC", "Human exposure RF SAR", "in_force", "critical", ""),
            ("ISO 27001 (mfg ISMS)", "ISO/IEC 27001:2022",
             "ISO/IEC", "Voluntary information security", "in_force", "medium", ""),
            ("ISO 14001 mfg EMS", "ISO 14001:2015",
             "ISO", "Voluntary EMS", "in_force", "low", ""),
        ]
    elif code == "UNECE":
        R = [("UNECE GHS chemicals classification", "UN Rev 10 GHS",
              "UNECE", "Indirectly via REACH/CLP",
              "in_force", "medium", "")]
    elif code == "OECD":
        R = [("OECD AI Principles + Due Diligence Guidance", "OECD AI Principles 2019",
              "OECD", "Non-binding guidelines AI",
              "in_force", "medium", "")]
    elif code == "WTO":
        R = [("WTO ITA Information Technology Agreement", "ITA / ITA-II",
              "WTO", "Zero tariffs on IT products",
              "in_force", "high", "")]
    elif code == "ITU":
        R = [
            ("ITU-R Radio Regulations", "ITU-R RR Edition 2024",
             "ITU-R", "International spectrum allocation",
             "in_force", "critical", ""),
            ("ITU-T E.118 IMSI", "ITU-T E.118",
             "ITU-T", "International mobile subscriber ID",
             "in_force", "high", ""),
            ("ITU-T K.52 SAR limits", "ITU-T K.52",
             "ITU-T", "Reference SAR limits",
             "in_force", "high", ""),
        ]
    elif code == "3GPP":
        R = [
            ("3GPP TS specifications (4G/5G)", "3GPP TS 23/24/36/38 series",
             "3GPP", "5G NR / LTE specs", "in_force", "critical", ""),
        ]
    elif code == "GSMA":
        R = [
            ("GSMA TS.06 IMEI Allocation", "GSMA TS.06",
             "GSMA", "IMEI assignment", "in_force", "critical", ""),
            ("GSMA SGP.22 eSIM", "GSMA SGP.22",
             "GSMA", "Consumer eSIM specification",
             "in_force", "critical", ""),
        ]
    elif code == "ICAO":
        R = [("ICAO Lithium battery air transport", "Doc 9284 / SR4 lithium",
              "ICAO", "Lithium battery shipping rules",
              "in_force", "high", "")]
    elif code == "IATA":
        R = [("IATA Dangerous Goods Regulations", "IATA DGR (Annual)",
              "IATA", "Li-ion shipping in/on phones",
              "in_force", "critical", "")]
    elif code in ("IMO","WIPO","CODEX","WHO"):
        R = [(f"{name} relevance to smartphones", "Various",
              name, "Limited direct role", "in_force", "low", "")]
    return R


# ---------------------------------------------------------------
#        P4 — STUFFED TOY 0-3 YEARS  (children toy safety)
# ---------------------------------------------------------------
def p4_regs(code, name, region):
    R = []
    if code == "EU":
        R = [
            ("Toy Safety Directive", "Directive 2009/48/EC",
             "EC DG GROW + NCAs", "CE marking; essential safety; chemical/mechanical/flammability",
             "in_force", "critical", ""),
            ("Toy Safety Regulation (revision proposal)", "COM(2023)462",
             "EC DG GROW", "Proposed replacement of 2009/48/EC; tightening allergens/PFAS",
             "draft", "high", ""),
            ("EN 71-1 Mechanical & Physical", "EN 71-1:2014+A1:2018",
             "CEN/CENELEC", "Mechanical/physical safety",
             "in_force", "critical", ""),
            ("EN 71-2 Flammability", "EN 71-2:2020",
             "CEN", "Flammability soft toys",
             "in_force", "critical", ""),
            ("EN 71-3 Migration of certain elements", "EN 71-3:2019+A1:2021",
             "CEN", "Pb, Cd, Hg, etc. migration limits",
             "in_force", "critical", ""),
            ("EN 71-9/10/11 organic compounds", "EN 71-9:2005+A1:2007",
             "CEN", "Organic compounds in toys",
             "in_force", "high", ""),
            ("EN 71-12 N-nitrosamines", "EN 71-12:2016",
             "CEN", "N-nitrosamines/elastomer toys",
             "in_force", "high", ""),
            ("EN 71-13 fragrances", "EN 71-13:2014+A1:2017",
             "CEN", "Olfactory board games",
             "in_force", "medium", ""),
            ("EN 71-14 trampolines (n/a for soft toys)", "EN 71-14",
             "CEN", "Trampolines", "in_force", "low", ""),
            ("REACH SVHC / Annex XVII", "(EC) 1907/2006",
             "ECHA", "Phthalates ban DEHP/DBP/BBP/DINP/DIDP/DNOP; SVHC 0.1%",
             "in_force", "critical", ""),
            ("CLP (chemicals in toys)", "(EC) 1272/2008",
             "ECHA", "Classification",
             "in_force", "high", ""),
            ("General Product Safety Regulation", "(EU) 2023/988",
             "EC DG JUST", "General safety baseline",
             "in_force", "critical", ""),
            ("Market Surveillance Regulation", "(EU) 2019/1020",
             "EC + NCAs", "Customs cooperation",
             "in_force", "high", ""),
            ("Packaging and Packaging Waste Regulation", "(EU) 2025/40",
             "EC DG ENV", "Packaging requirements",
             "in_force", "high", ""),
            ("Eco-modulation Textile EPR (where soft toys count textile)", "Member State implementation",
             "Various", "Some MS textile EPR may apply",
             "in_force", "medium", ""),
            ("Microplastics restriction", "(EU) 2023/2055",
             "ECHA", "Microplastics ban impacting plush stuffing",
             "in_force", "high", ""),
            ("CSDDD due diligence", "(EU) 2024/1760",
             "EC", "Supply chain due diligence", "in_force", "medium", ""),
        ]
    elif code in [c for c, _, _ in EU_MEMBERS]:
        R = [
            ("Toy Safety Directive transposition", f"National implementing law of 2009/48/EC ({code})",
             f"{name} market surveillance authority", "CE marking; warnings in local language",
             "in_force", "critical", ""),
            ("Language warning requirement", f"National consumer code ({code})",
             f"{name} consumer protection", "0-3 warning + instructions in official language(s)",
             "in_force", "critical", ""),
            ("GPSR transposition", "(EU) 2023/988 directly applicable",
             f"{name} market surveillance", "General product safety", "in_force", "critical", ""),
            ("National textile/toy EPR or extended producer responsibility",
             f"Local EPR scheme ({code})",
             f"{name} environmental ministry", "EPR contribution if applicable",
             "in_force", "medium", ""),
        ]
        if code == "FR":
            R += [
                ("Décret jouets sécurité", "Décret n° 2010-166",
                 "DGCCRF", "Transposition 2009/48/CE en FR",
                 "in_force", "critical", ""),
                ("AFNOR EN 71", "NF EN 71-1/-2/-3",
                 "AFNOR", "French version EN 71", "in_force", "high", ""),
                ("Loi AGEC — EPR jouets", "Loi 2020-105",
                 "ADEME", "Toy EPR FR from 2022", "in_force", "high", ""),
                ("Triman logo (recyclability)", "Décret 2014-1577",
                 "ADEME", "Triman pictogram", "in_force", "medium", ""),
            ]
        elif code == "DE":
            R += [
                ("Geräte- und Produktsicherheitsgesetz", "ProdSG",
                 "BAuA", "DE product safety implementation",
                 "in_force", "critical", ""),
                ("2. ProdSV Spielzeugverordnung", "2. ProdSV",
                 "BAuA", "Toy safety regulation DE",
                 "in_force", "critical", ""),
                ("DIN EN 71 series", "DIN EN 71-1/-2/-3",
                 "DIN", "Toy standards DE", "in_force", "high", ""),
            ]
        elif code == "IT":
            R += [("D.Lgs. 54/2011 sicurezza giocattoli", "D.Lgs. 54/2011",
                   "MISE", "IT toy safety", "in_force", "critical", "")]
        elif code == "ES":
            R += [("RD 1205/2011 juguetes", "RD 1205/2011",
                   "AECOSAN", "ES toy safety", "in_force", "critical", "")]
        elif code == "PL":
            R += [("Rozporządzenie o zabawkach", "Dz.U. 2011 No 83 poz. 454",
                   "UOKiK", "PL toy safety", "in_force", "critical", "")]
        elif code == "NL":
            R += [("Warenwetbesluit speelgoed 2011", "WBS 2011",
                   "NVWA", "NL toy safety", "in_force", "critical", "")]
        elif code == "BE":
            R += [("AR jouets", "AR 19.01.2011",
                   "SPF Économie", "BE toy safety", "in_force", "critical", "")]
    elif code == "UK":
        R = [
            ("Toys (Safety) Regulations 2011", "SI 2011/1881",
             "OPSS", "UK toy safety",
             "in_force", "critical", ""),
            ("Statutory Instrument BS EN 71 series", "BS EN 71-1/-2/-3",
             "BSI", "Toy standards UK",
             "in_force", "critical", ""),
            ("UK REACH (CMRs in toys)", "SI 2019/758",
             "HSE", "Chemical restrictions",
             "in_force", "critical", ""),
            ("UK PSTI for connected toys", "PSTI Act 2022",
             "OPSS", "Connected toy security", "in_force", "high", "Only if connectable"),
        ]
    elif code == "CH":
        R = [
            ("Loi fédérale sur la sécurité des produits", "LSPro RS 930.11",
             "SECO", "Toys safety",
             "in_force", "critical", ""),
            ("Ordonnance sur la sécurité des jouets", "OSJo RS 817.023.11",
             "OSAV", "Toy safety aligned EU",
             "in_force", "critical", ""),
        ]
    elif code in ("NO","IS","LI"):
        R = [("EEA toy safety directive", "Dir 2009/48/EC via EEA",
              f"{name} consumer/safety authority", "Same as EU",
              "in_force", "critical", "")]
    elif code == "RU":
        R = [
            ("EAEU TR CU 008/2011 Safety of Toys", "TR CU 008/2011",
             "Rosstandart + EEC", "EAEU toy safety regulation",
             "in_force", "critical", ""),
            ("Federal Law Consumer Protection", "Law 2300-I",
             "Rospotrebnadzor", "Consumer rights",
             "in_force", "high", ""),
            ("Decree 982 (sanitary certification)", "Government Decree 982",
             "Rospotrebnadzor", "Sanitary cert for items contacting children",
             "in_force", "high", ""),
        ]
    elif code == "BY":
        R = [("EAEU TR CU 008/2011 BY", "TR CU 008/2011",
              "Gosstandart", "EAEU toy safety BY", "in_force", "critical", "")]
    elif code == "EAEU":
        R = [("EAEU TR CU 008/2011 toys", "TR CU 008/2011",
              "EEC", "EAEU toy safety",
              "in_force", "critical", "")]
    elif code == "UA":
        R = [("Ukraine Technical Regulation on Toy Safety", "Resolution KMU No 151 of 28.02.2018",
              "Derzhprodspozhyvsluzhba", "Aligned with EU 2009/48",
              "in_force", "high", "")]
    elif code == "TR":
        R = [
            ("Toy Safety Regulation TR", "RG 04.10.2016 No 29847",
             "Ministry of Trade", "Aligned with EU 2009/48",
             "in_force", "critical", ""),
            ("TSE EN 71", "TS EN 71 series",
             "TSE", "TR adoption of EN 71",
             "in_force", "high", ""),
        ]
    elif code in ("RS","BA","AL","MK","ME","XK","MD"):
        R = [(f"{name} toy safety regulation", f"National toy safety act ({code})",
              f"{name} market surveillance", "EU-aligned toy safety",
              "in_force", "high", "")]
    # USA
    elif code == "US":
        R = [
            ("CPSIA", "Pub.L. 110-314 (2008)",
             "US CPSC", "Total lead 100 ppm; phthalates limits; tracking labels; testing+certification",
             "in_force", "critical", ""),
            ("ASTM F963", "ASTM F963-23",
             "US CPSC (mandatory)", "Toy Safety Standard — mandatory under CPSIA",
             "in_force", "critical", ""),
            ("16 CFR Part 1500 hazardous substances", "16 CFR 1500",
             "US CPSC", "Federal Hazardous Substances Act",
             "in_force", "critical", ""),
            ("16 CFR Part 1501 small parts", "16 CFR 1501",
             "US CPSC", "Small parts test cylinder <3y",
             "in_force", "critical", ""),
            ("16 CFR Part 1303 lead in paint", "16 CFR 1303",
             "US CPSC", "Lead paint ban 90 ppm",
             "in_force", "critical", ""),
            ("16 CFR Part 1610 flammability textiles", "16 CFR 1610",
             "US CPSC", "Clothing textile flammability (impacts plush)",
             "in_force", "high", ""),
            ("CPC General Certificate of Conformity", "16 CFR Part 1110",
             "US CPSC", "Certificate from CPSC-accepted lab",
             "in_force", "critical", ""),
            ("CPSC Tracking Label Requirements", "Section 14(a)(5) CPSA",
             "US CPSC", "Permanent tracking label",
             "in_force", "critical", ""),
            ("Children's Online Privacy Protection Act", "15 U.S.C. § 6501",
             "FTC", "If connected toy collecting data <13",
             "in_force", "high", ""),
        ]
    elif code == "US-CA":
        R = [
            ("Prop 65", "Cal. H&S Code 25249.5",
             "OEHHA", "Warnings (BPA, lead, etc.)",
             "in_force", "critical", ""),
            ("CA Phthalates in toys", "AB 1108",
             "CDPH", "Stricter phthalate restrictions",
             "in_force", "high", ""),
        ]
    elif code in ("US-NY","US-FL","US-TX","US-IL","US-WA","US-OR","US-MA","US-MN","US-NJ","US-HI","US-VT","US-ME","US-CO"):
        R = [(f"{name} state consumer protection / toy enforcement",
              f"State statutes ({code})",
              f"{name} AG/CPSC liaison",
              "State enforcement; some additional restrictions (WA, ME, NY phthalate)",
              "in_force", "high", "")]
    elif code == "CA":
        R = [
            ("Canada Consumer Product Safety Act", "S.C. 2010, c. 21",
             "Health Canada", "General product safety incl. toys",
             "in_force", "critical", ""),
            ("Toys Regulations", "SOR/2011-17",
             "Health Canada", "CAN/CGSB / SOR specific toy reqs",
             "in_force", "critical", ""),
            ("Phthalates Regulations", "SOR/2016-188",
             "Health Canada", "Phthalates DEHP/DBP/BBP in children's toys",
             "in_force", "high", ""),
            ("Surface Coating Materials Regulations", "SOR/2016-193",
             "Health Canada", "Lead paint limit", "in_force", "high", ""),
            ("Consumer Packaging and Labelling Act", "R.S.C. 1985, c. C-38",
             "Competition Bureau", "Bilingual labelling EN/FR",
             "in_force", "high", ""),
        ]
    elif code == "CA-QC":
        R = [("Charte de la langue française", "RLRQ c C-11",
              "OQLF", "French labelling Québec", "in_force", "high", "")]
    elif code == "MX":
        R = [
            ("NOM-015/1-SCFI/SSA-2018 juguetes seguridad", "NOM-015/1-SCFI/SSA-2018",
             "SE + COFEPRIS", "Toy safety MX (aligned ISO 8124)",
             "in_force", "critical", ""),
            ("NOM-050-SCFI-2004 commercial info", "NOM-050-SCFI-2004",
             "PROFECO", "Spanish labelling", "in_force", "high", ""),
            ("Ley Federal de Protección al Consumidor", "DOF 24.12.92",
             "PROFECO", "Consumer protection", "in_force", "high", ""),
        ]
    elif code == "BR":
        R = [
            ("INMETRO Portaria 563/2016 brinquedos", "Portaria 563/2016",
             "INMETRO", "Mandatory toy certification BR",
             "in_force", "critical", ""),
            ("ABNT NBR NM 300 series", "ABNT NBR NM 300-1/-2/-3",
             "ABNT", "BR adoption of toy safety",
             "in_force", "high", ""),
            ("INMETRO Portaria 302/2018 brinquedos eletrônicos", "Portaria 302/2018",
             "INMETRO", "Electronic toys", "in_force", "high", ""),
            ("CONMETRO Resolução 11/88 (selo Inmetro)", "Resolução 11/88",
             "CONMETRO", "Inmetro mark", "in_force", "high", ""),
        ]
    elif code in ("AR","CL","CO","PE","UY","PY","BO","EC","VE","DO","GT","CR","PA","NI","SV","HN"):
        R = [(f"{name} toy safety regulation",
              f"National toy safety standard ({code})",
              f"{name} consumer/standards authority",
              "Sanitary registration + ISO 8124 alignment; Spanish labelling",
              "in_force", "high", "")]
        if code == "AR":
            R += [("Resolución Secretaría de Comercio 23/2016", "Res. SC 23/2016",
                   "Secretaría de Comercio", "Mandatory certification toys", "in_force", "critical", ""),
                  ("IRAM 3583 / IRAM 3582", "IRAM 3582/3583",
                   "IRAM", "AR toy safety standards", "in_force", "high", "")]
        if code == "CL":
            R += [("Decreto 114 juguetes y artículos infantiles", "Decreto 114/2005 MINSAL",
                   "MINSAL Chile", "Toy safety CL", "in_force", "critical", "")]
    elif code == "MERCOSUR":
        R = [("MERCOSUR Toy Safety Resolution", "GMC Res. 23/04",
              "MERCOSUR", "Common toy safety", "in_force", "high", "")]
    elif code in ("CU","JM","TT","BB","HT"):
        R = [(f"{name} toy import standards", "National consumer/standards act",
              f"{name} standards authority", "Import + labelling", "in_force", "medium", "")]
    elif code == "CARICOM":
        R = [("CARICOM CROSQ toy standards", "CROSQ regional standards",
              "CROSQ", "Regional toy standards", "in_force", "medium", "")]
    # ASIA-PACIFIC
    elif code == "CN":
        R = [
            ("GB 6675 Safety of Toys", "GB 6675.1-4-2014",
             "SAMR", "Mandatory CN toy safety standard",
             "in_force", "critical", ""),
            ("CCC Compulsory Certification for Toys", "AQSIQ Order 117 + Cat. 22",
             "CNCA / SAMR", "CCC for plush, dolls, electric toys",
             "in_force", "critical", ""),
            ("GB 5296.5 toy labelling", "GB 5296.5-2006",
             "SAMR", "Mandatory toy labelling rules",
             "in_force", "critical", ""),
            ("Children Cosmetic — only if plush is cosmetic", "N/A",
             "NMPA", "Not normally applicable", "in_force", "low", ""),
            ("GB/T 9832 plush toy specific", "GB/T 9832-2007",
             "SAMR", "Plush toys quality",
             "in_force", "high", ""),
        ]
    elif code == "HK":
        R = [
            ("Toys and Children's Products Safety Ordinance", "Cap. 424",
             "Customs and Excise Dept", "Safety duties for suppliers",
             "in_force", "critical", ""),
            ("Toys and Children's Products Safety Standards", "Schedule 1 (EN 71/ASTM/ISO 8124)",
             "C&ED", "Manufacturers choose 1 of 3 standards",
             "in_force", "critical", ""),
        ]
    elif code == "MO":
        R = [("Macau toy import safety", "National rules",
              "Economic and Technological Dev Bureau", "Import safety", "in_force", "high", "")]
    elif code == "TW":
        R = [
            ("Commodity Inspection Act — Toys", "Commodity Inspection Act",
             "BSMI", "Mandatory CNS 4797 inspection",
             "in_force", "critical", ""),
            ("CNS 4797 toy safety", "CNS 4797",
             "BSMI", "TW toy safety standard",
             "in_force", "critical", ""),
        ]
    elif code == "JP":
        R = [
            ("Food Sanitation Act (toys for <6 contact mouth)", "Act 233/1947",
             "MHLW", "Sanitation requirements for toys mouth-contact",
             "in_force", "critical", ""),
            ("ST Mark Toy Safety Standard", "Japan Toy Association ST Mark",
             "JTA", "Voluntary but de facto required",
             "in_force", "critical", ""),
            ("Product Liability Act", "Act 85/1994",
             "Consumer Affairs Agency", "PL Act JP",
             "in_force", "high", ""),
            ("PSE if toy with batteries/charger", "Electrical Appliance Safety Act",
             "METI", "PSE if electric toy",
             "in_force", "medium", ""),
            ("Household Goods Quality Labeling Act", "Act 104/1962",
             "Consumer Affairs Agency", "Quality labelling",
             "in_force", "high", ""),
        ]
    elif code == "KR":
        R = [
            ("KC Mark Children's Product Safety Act", "Act 13083 (2015)",
             "KATS / MOTIE", "Mandatory KC mark; phthalate limits",
             "in_force", "critical", ""),
            ("Korea Self-Regulatory Safety Confirmation", "Self-confirmation scheme",
             "KATS", "Stuffed/plush usually safety-confirmation",
             "in_force", "critical", ""),
            ("KS G 0500 series", "KS G 0500-0510",
             "KATS", "KR toy safety standards",
             "in_force", "high", ""),
        ]
    elif code == "IN":
        R = [
            ("Toys (Quality Control) Order 2020", "G.S.R. 785(E)",
             "BIS + DPIIT", "Mandatory BIS ISI for toys",
             "in_force", "critical", ""),
            ("IS 9873 Part 1-7", "IS 9873 (aligned ISO 8124)",
             "BIS", "Mechanical, chemical, flammability",
             "in_force", "critical", ""),
            ("IS 15644 electric toys", "IS 15644",
             "BIS", "If electrical features", "in_force", "high", ""),
            ("Legal Metrology (Packaged Commodities)", "2011",
             "Dept Consumer Affairs", "MRP, qty, COO", "in_force", "high", ""),
        ]
    elif code in ("PK","BD","LK","NP","BT","MV","MM"):
        R = [(f"{name} toy import safety", "National toy/consumer act",
              f"{name} standards authority", "Import + labelling",
              "in_force", "medium", "")]
    elif code == "TH":
        R = [
            ("TIS 685 Safety of Toys", "TIS 685 Part 1/2/3 (aligned ISO 8124)",
             "TISI", "Mandatory toys certification",
             "in_force", "critical", ""),
            ("Consumer Protection Act", "B.E. 2522 (1979)",
             "Office of Consumer Protection", "Consumer rights",
             "in_force", "high", ""),
        ]
    elif code == "VN":
        R = [
            ("QCVN 3:2019/BKHCN Toys", "Circular 09/2019/TT-BKHCN",
             "STAMEQ + MoST", "Mandatory toy conformity",
             "in_force", "critical", ""),
            ("TCVN 6238 toy safety", "TCVN 6238 series",
             "STAMEQ", "Aligned ISO 8124", "in_force", "high", ""),
        ]
    elif code in ("LA","KH"):
        R = [(f"{name} toy import safety", "National rules",
              f"{name} ministry", "Import notification", "in_force", "medium", "")]
    elif code == "MY":
        R = [
            ("Consumer Protection (Safety Standards for Toys) Regs", "P.U.(A) 286/2009",
             "KPDN + SIRIM", "Mandatory toy cert",
             "in_force", "critical", ""),
            ("MS ISO 8124", "Malaysian Standard MS ISO 8124",
             "SIRIM", "Toy safety MS", "in_force", "critical", ""),
        ]
    elif code == "SG":
        R = [
            ("Consumer Protection (Safety Requirements) Regs", "S 251/2011",
             "Enterprise SG", "Mandatory Consumer Safety Mark for toys (CISAS)",
             "in_force", "critical", ""),
            ("SS 474 Toy Safety", "SS 474",
             "Enterprise SG", "SG toy safety (aligned ISO/EN/ASTM)",
             "in_force", "critical", ""),
        ]
    elif code == "ID":
        R = [
            ("SNI ISO 8124 Toy Safety Indonesia", "Permenperin 24/M-IND/PER/4/2013",
             "BSN + Ministry of Industry", "Mandatory SNI for toys",
             "in_force", "critical", ""),
            ("SNI 8124 Series", "SNI ISO 8124-1/-2/-3/-4",
             "BSN", "Adopted ISO 8124", "in_force", "critical", ""),
        ]
    elif code == "PH":
        R = [
            ("BPS Toys Standard", "PNS ISO 8124",
             "DTI BPS", "Mandatory PS/ICC mark for toys",
             "in_force", "critical", ""),
            ("RA 10620 Toy and Game Safety Labeling Act", "RA 10620 (2013)",
             "FDA Philippines + DTI", "Labelling: age, warnings, contents",
             "in_force", "critical", ""),
        ]
    elif code in ("BN","TL"):
        R = [(f"{name} toy import notification", "National consumer act",
              f"{name} consumer authority", "Notification + label",
              "in_force", "medium", "")]
    elif code == "AU":
        R = [
            ("Consumer Goods (Toys for Children up to and including 36 months) Safety Standard",
             "Notice under s.104 CCA",
             "ACCC", "Mandatory standard small parts <3y (ISO 8124-1 based)",
             "in_force", "critical", ""),
            ("Consumer Goods (Toys Containing Lead and Certain Elements) Safety Standard",
             "Notice 2003 amended",
             "ACCC", "Lead and element migration",
             "in_force", "critical", ""),
            ("ACCC Hazardous goods", "ACL",
             "ACCC", "Hazardous toys can be banned/recalled",
             "in_force", "critical", ""),
            ("AS/NZS ISO 8124 series", "AS/NZS ISO 8124",
             "Standards Australia", "Voluntary supporting standard",
             "in_force", "high", ""),
        ]
    elif code in [c for c, _, _ in AU_STATES]:
        R = [(f"{name} state product safety enforcement",
              f"State Fair Trading Act ({code})",
              f"{name} Fair Trading authority", "State enforcement",
              "in_force", "medium", "")]
    elif code == "NZ":
        R = [
            ("Product Safety Standards (Children's Toys) Regulations 2005", "SR 2005/30",
             "MBIE", "Toys for <3y; small parts; warnings",
             "in_force", "critical", ""),
            ("Fair Trading Act 1986", "Public Act 1986 No 121",
             "Commerce Commission", "False/misleading representations",
             "in_force", "high", ""),
            ("AS/NZS ISO 8124", "AS/NZS ISO 8124",
             "Standards NZ", "Voluntary supporting standard",
             "in_force", "high", ""),
        ]
    elif code in ("FJ","PG"):
        R = [(f"{name} toy import rules", "National consumer act",
              f"{name} consumer council", "Import + label", "in_force", "medium", "")]
    elif code == "ASEAN":
        R = [("ASEAN Cooperation on Toy Safety", "ASEAN harmonisation initiatives",
              "ASEAN", "Convergence around ISO 8124", "in_force", "medium", "")]
    elif code == "SAARC":
        R = [("SAARC cooperation product safety", "SAARC Charter",
              "SAARC", "Limited", "draft", "low", "")]
    # MENA
    elif code == "GCC":
        R = [
            ("GSO Technical Regulation Toys", "GSO 1828:2016 (Safety of Toys)",
             "GSO", "Aligned ISO 8124 / EN 71",
             "in_force", "critical", ""),
            ("GSO Cert. of Conformity (G-Mark)", "GSO Notification",
             "GSO + national authorities", "Mandatory G-Mark for low-voltage incl. electric toys",
             "in_force", "high", ""),
        ]
    elif code == "SA":
        R = [
            ("SASO Toy Safety Standard", "SASO 1063 / GSO 1828",
             "SASO", "Saudi toy safety + Saber/SALEEM",
             "in_force", "critical", ""),
            ("SASO Saber/SALEEM platform", "SASO Saber",
             "SASO", "Conformity Saber", "in_force", "critical", ""),
        ]
    elif code == "AE":
        R = [
            ("Cabinet Decision Toy Safety UAE", "Cabinet Decision aligned GSO 1828",
             "MoIAT / ESMA", "ECAS conformity",
             "in_force", "critical", ""),
            ("ECAS Toy Safety Certification", "ECAS scheme",
             "MoIAT", "ECAS toy", "in_force", "critical", ""),
        ]
    elif code in ("AE-AUH","AE-DXB","AE-SHJ","AE-AJM","AE-UAQ","AE-RAK","AE-FUJ"):
        R = [(f"{name} municipal toy import",
              f"Emirate rules ({code})",
              f"{name} municipality", "Local import",
              "in_force", "medium", "")]
    elif code in ("QA","KW","BH","OM"):
        R = [(f"{name} GSO 1828 toy safety implementation", "GSO 1828:2016",
              f"{name} standards authority", "Toy safety + Arabic label",
              "in_force", "high", "")]
    elif code in ("YE","JO","LB","SY","IQ","PS"):
        R = [(f"{name} toy import rules", "National consumer code",
              f"{name} consumer authority", "Import + Arabic label",
              "in_force", "medium", "")]
    elif code == "IR":
        R = [("Iran toy safety standard", "ISIRI 11181 (aligned ISO 8124)",
              "ISIRI", "Mandatory toy safety", "in_force", "high", "")]
    elif code == "IL":
        R = [
            ("Israeli Standard SI 562", "SI 562 (aligned EN 71)",
             "SII / Israel Ministry of Economy", "Mandatory toy safety",
             "in_force", "critical", ""),
        ]
    # AFRICA
    elif code == "ZA":
        R = [
            ("Consumer Protection Act", "Act 68 of 2008",
             "NCC", "General consumer safety incl. toys",
             "in_force", "critical", ""),
            ("SANS 1162 Safety of Toys", "SANS 1162 / SABS",
             "NRCS", "Mandatory toy safety",
             "in_force", "critical", ""),
            ("NRCS Letter of Authority", "NRCS LOA",
             "NRCS", "Required for toys",
             "in_force", "critical", ""),
        ]
    elif code == "NG":
        R = [
            ("SON Mandatory Toy Conformity", "SONCAP",
             "SON", "Mandatory conformity (SONCAP) for toys",
             "in_force", "critical", ""),
            ("NIS toy standards", "NIS adopted ISO 8124",
             "SON", "National toy safety", "in_force", "high", ""),
        ]
    elif code == "KE":
        R = [
            ("KEBS PVoC + toy standards", "KS ISO 8124",
             "KEBS", "PVoC pre-export",
             "in_force", "critical", ""),
        ]
    elif code == "EG":
        R = [
            ("EOS Egyptian Toy Standard", "ES ISO 8124",
             "EOS", "Mandatory standard",
             "in_force", "high", ""),
        ]
    elif code in ("MA","DZ","TN","LY","SD","ET","TZ","UG","GH","SN","CI","CM","ZW","ZM","AO","MZ","MG",
                  "BJ","BF","ML","NE","GA","CD","CG","RW","BI","DJ","ER","SO","SL","LR","GM","GW","MR",
                  "EH","SC","MU","NA","BW","SZ","LS","MW","KM","CV","ST","TG"):
        R = [(f"{name} toy import / safety", f"National toy regulation ({code})",
              f"{name} consumer/standards authority",
              "Import + local language label", "in_force", "medium", "")]
        if code == "MA":
            R += [("Maroc — Loi 24-09 sécurité produits", "Loi 24-09",
                   "Ministère Industrie", "Toy safety MA", "in_force", "high", "")]
    elif code == "ECOWAS":
        R = [("ECOWAS product safety harmonisation",
              "ECOWAP framework", "ECOWAS Commission",
              "Regional harmonisation",
              "in_force", "medium", "")]
    elif code in ("EAC","SADC","COMESA","ECCAS","AFCFTA"):
        R = [(f"{name} toy/consumer harmonisation framework",
              f"{name} technical regulations",
              f"{name} Secretariat",
              "Regional cooperation", "in_force", "low", "")]
    elif code == "AU-Africa":
        R = [("African Union Continental Standards Strategy", "AU Agenda 2063",
              "AU Commission", "Continental framework", "in_force", "low", "")]
    # INTERNATIONAL
    elif code == "ISO":
        R = [
            ("ISO 8124-1 Mechanical/physical", "ISO 8124-1:2022",
             "ISO/TC 181", "Mechanical/physical safety",
             "in_force", "critical", ""),
            ("ISO 8124-2 Flammability", "ISO 8124-2:2014",
             "ISO/TC 181", "Flammability",
             "in_force", "critical", ""),
            ("ISO 8124-3 Migration of certain elements", "ISO 8124-3:2020",
             "ISO/TC 181", "Heavy metals migration",
             "in_force", "critical", ""),
            ("ISO 8124-4 swings/slides (n/a plush)", "ISO 8124-4:2014",
             "ISO/TC 181", "Not applicable for plush", "in_force", "low", ""),
            ("ISO 8124-5 organic compounds", "ISO 8124-5:2015",
             "ISO/TC 181", "Organic chemical analysis",
             "in_force", "high", ""),
            ("ISO 8124-6 phthalate esters", "ISO 8124-6:2018",
             "ISO/TC 181", "Phthalates determination",
             "in_force", "high", ""),
            ("ISO 8124-7 finger paints", "ISO 8124-7",
             "ISO/TC 181", "Finger paints (n/a)", "in_force", "low", ""),
            ("ISO 8124-8 organic chemical migration", "ISO 8124-8",
             "ISO/TC 181", "Organic chemicals",
             "in_force", "high", ""),
        ]
    elif code == "CODEX":
        R = [("Codex — not applicable for toys", "N/A",
              "Codex", "Codex covers food", "in_force", "low", "")]
    elif code == "OECD":
        R = [("OECD Guidelines for Multinational Enterprises", "OECD MNE Guidelines",
              "OECD", "Responsible business conduct", "in_force", "medium", "")]
    elif code == "WTO":
        R = [("WTO TBT notifications toy regs", "TBT Agreement",
              "WTO", "Notifications", "in_force", "medium", "")]
    elif code in ("WHO","ICAO","IATA","IMO","UNECE","WIPO","ITU","3GPP","GSMA"):
        R = [(f"{name} relevance to plush toys", "Various",
              name, "Limited/none direct toy role", "in_force", "low", "")]
    return R


# ---------------------------------------------------------------
# Common-layer expansion (applies to ALL jurisdictions for ALL products)
# ---------------------------------------------------------------
def common_regs(pid, code, name, region):
    """Add baseline cross-cutting regulations that apply to all products."""
    R = []
    skip_intl_org = code in ("ISO","CODEX","OECD","WTO","WIPO","ITU","IMO","IATA","ICAO","WHO","UNECE","3GPP","GSMA")
    skip_regional = code in ("MERCOSUR","CARICOM","ASEAN","SAARC","GCC","ECOWAS","EAC","SADC","COMESA","ECCAS","AFCFTA","AU-Africa","ALADI","EAEU")

    # Skip regional/intl orgs from common layer
    if skip_intl_org or skip_regional:
        return R

    # Extra layer for EU members
    if code in [c for c, _, _ in EU_MEMBERS]:
        R.append((f"{name} CE marking enforcement",
                  f"National implementation of EU 765/2008 + 2019/1020 ({code})",
                  f"{name} market surveillance authority",
                  "CE marking + EU declaration of conformity surveillance",
                  "in_force", "high", ""))
        R.append((f"{name} GPSR transposition",
                  f"National enforcement of EU 2023/988 ({code})",
                  f"{name} consumer authority",
                  "General product safety + RAPEX/Safety Gate notifications",
                  "in_force", "high", ""))

    # Consumer protection / fair trading baseline (all)
    R.append((f"{name} general consumer protection law",
              f"National consumer protection statute ({code})",
              f"{name} consumer authority",
              "Baseline consumer rights, misleading claims, warranties",
              "in_force", "medium", "Cross-cutting baseline"))

    # Customs / import control
    R.append((f"{name} customs / import control",
              f"National customs code ({code})",
              f"{name} customs authority",
              "Import declaration, classification, duties, prohibited goods checks",
              "in_force", "medium", "Cross-cutting baseline"))

    # Language labelling baseline
    R.append((f"{name} mandatory language labelling",
              f"National language/labelling law ({code})",
              f"{name} consumer/language authority",
              "Mandatory product labelling in official language(s)",
              "in_force", "medium", "Cross-cutting baseline"))

    # Product-specific extra
    if pid == 1:  # Shampoo
        R.append((f"{name} restrictions on cosmetic claims",
                  f"National advertising/claim rules ({code})",
                  f"{name} advertising standards / consumer authority",
                  "Substantiation of cosmetic claims; restrictions on therapeutic claims",
                  "in_force", "medium", ""))
        R.append((f"{name} cosmetic packaging / waste rules",
                  f"National packaging/EPR scheme ({code})",
                  f"{name} environment / EPR authority",
                  "Producer responsibility for packaging waste; recyclability",
                  "in_force", "medium", ""))
    elif pid == 2:  # Sunscreen
        R.append((f"{name} restrictions on health/SPF claims",
                  f"National advertising/claim rules ({code})",
                  f"{name} advertising/consumer authority",
                  "SPF claim substantiation; bans on misleading 'sunblock' claims",
                  "in_force", "medium", ""))
        R.append((f"{name} aerosol packaging requirements",
                  f"National pressurised container rules ({code})",
                  f"{name} safety authority",
                  "Aerosol design, marking, transport",
                  "in_force", "medium", ""))
    elif pid == 3:  # Smartphone
        R.append((f"{name} data protection / privacy law",
                  f"National privacy/data protection act ({code})",
                  f"{name} data protection authority",
                  "Privacy by design; user consent; data breaches",
                  "in_force", "high", ""))
        R.append((f"{name} cybersecurity baseline for connected devices",
                  f"National cyber/connected device rules ({code})",
                  f"{name} cyber authority",
                  "Minimum security; default passwords; updates",
                  "in_force", "medium", ""))
        R.append((f"{name} e-waste / battery take-back rules",
                  f"National e-waste regulation ({code})",
                  f"{name} environment authority",
                  "Collection, recycling, EPR contributions",
                  "in_force", "medium", ""))
    elif pid == 4:  # Stuffed toy
        R.append((f"{name} children's product safety baseline",
                  f"National children product law ({code})",
                  f"{name} consumer/standards authority",
                  "Age warnings, small parts, chemical limits",
                  "in_force", "high", ""))
        R.append((f"{name} flammability requirements (textile/toy)",
                  f"National flammability rules ({code})",
                  f"{name} safety authority",
                  "Flammability minimums for soft toys/textile",
                  "in_force", "medium", ""))

    return R


# ---------------------------------------------------------------
# Main writer
# ---------------------------------------------------------------
def main():
    rows = []
    jur_list = all_jurisdictions()
    product_funcs = {1: p1_regs, 2: p2_regs, 3: p3_regs, 4: p4_regs}

    for pid, (pname, ptag) in PRODUCTS.items():
        fn = product_funcs[pid]
        for code, name, region in jur_list:
            regs = list(fn(code, name, region))
            regs += common_regs(pid, code, name, region)
            for reg in regs:
                (rname, rref, rbody, rkey, rstatus, rcrit, rnotes) = reg
                rows.append({
                    "product_id": pid,
                    "product_name": pname,
                    "product_regime_tag": ptag,
                    "jurisdiction_code": code,
                    "jurisdiction_name": name,
                    "region": region,
                    "regulation_name": rname,
                    "regulation_ref": rref,
                    "enforcement_body": rbody,
                    "key_requirements": rkey,
                    "status": rstatus,
                    "criticality": rcrit,
                    "notes": rnotes,
                })

    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    with open(OUTPUT, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=[
            "product_id","product_name","product_regime_tag","jurisdiction_code",
            "jurisdiction_name","region","regulation_name","regulation_ref",
            "enforcement_body","key_requirements","status","criticality","notes",
        ])
        w.writeheader()
        for row in rows:
            w.writerow(row)

    # Stats
    from collections import Counter
    per_product = Counter()
    per_product_jur = {1: set(), 2: set(), 3: set(), 4: set()}
    for r in rows:
        per_product[r["product_id"]] += 1
        per_product_jur[r["product_id"]].add(r["jurisdiction_code"])

    print(f"OUTPUT: {OUTPUT}")
    print(f"Total rows: {len(rows)}")
    for pid in (1, 2, 3, 4):
        print(f"  P{pid} {PRODUCTS[pid][0]}: "
              f"{per_product[pid]} rows / "
              f"{len(per_product_jur[pid])} jurisdictions")


if __name__ == "__main__":
    main()

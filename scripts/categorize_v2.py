"""
Categorize the 1494 sources with multi-tag + confidence levels.
Outputs JSON, CSV, and HTML for visual review.

Run: python3 scripts/categorize_v2.py
"""
import json
import re
import csv
import random
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "public" / "data" / "manifest.json"
OUT_DIR = ROOT / "scripts" / "categorize_out"
OUT_DIR.mkdir(exist_ok=True)

# ────────────────────────────────────────────────────────────────────
# Categories — ordered most-specific first.
# Each rule: (cat_id, group_id, regex, confidence)
#   confidence: "high" (exact identity match) | "medium" (keyword) | "low" (generic)
# ────────────────────────────────────────────────────────────────────

RULES = [
    # ===== JUSTICE (very specific patterns first to avoid false positives) =====

    # Constitutional courts — match exact court names
    ("just_constitutional", "02_justice",
     r"constitutional court|cour constitutionnelle|conseil constitutionnel|"
     r"verfassungsgerichtshof|bundesverfassungsgericht|tribunal constitucional|"
     r"corte costituzionale|gjykata kushtetuese|alkotmánybíróság|"
     r"\bvfgh\b|\btribunalconstitucional\b|\bconstitutionalcourt\b",
     "high"),

    # Administrative courts/jurisdictions
    ("just_administrative", "02_justice",
     r"administrative court|administrative jurisdiction|conseil d.[ée]tat|"
     r"consiglio di stato|council of state|supreme administrative court|"
     r"verwaltungsgerichtshof|bundesverwaltungsgericht|raad van state|"
     r"\bvwgh\b|cour administrative|tribunal administratif",
     "high"),

    # Labor courts → tagged both JUSTICE + SOCIAL (multi-tag)
    ("just_courts", "02_justice",
     r"labor court|labour court|cour du travail|arbeitsgericht|"
     r"tribunal du travail|tribunal superior do trabalho|\btst\b",
     "medium"),
    ("soc_labor", "05_social",
     r"labor court|labour court|cour du travail|arbeitsgericht|"
     r"tribunal du travail|tribunal superior do trabalho|\btst\b|"
     r"labor.appeals|labour.appeals",
     "high"),

    # Tax courts → tagged both JUSTICE + TAX
    ("just_courts", "02_justice",
     r"tax court|finanzhof|cour fiscale|tribunal fiscal|tax appeals",
     "medium"),
    ("econ_tax", "04_economy",
     r"tax court|finanzhof|cour fiscale|tribunal fiscal|tax appeals|"
     r"finanzgericht",
     "high"),

    # International tribunals & treaty bodies (top-level codes INTL/UN/CoE...)
    ("just_international", "02_justice",
     r"^(intl|un|coe|wto|wipo|icj|icc|wada|oecd|imf|fao|ilo|nato|asean|gcc|"
     r"mercosur|eaeu)/|hudoc|venice commission|investment arbitration|"
     r"international.criminal|world.lii|wipo lex",
     "high"),

    # Supreme/cassation courts
    ("just_supreme", "02_justice",
     r"supreme court|cour de cassation|corte suprema|tribunal supremo|"
     r"högsta domstolen|højesteret|hoge raad|oberster gerichtshof|"
     r"hooggerechtshof|bundesgerichtshof|\bogh\b|\bbgh\b|"
     r"supremo tribunal|cour supr[êe]me|cassação|cassazione|"
     r"federal court of justice",
     "high"),

    # General courts / case law portals
    ("just_courts", "02_justice",
     r"court of |cour d.appel|cour d.app|appeals court|appellate court|"
     r"tribunal|district court|magistrate court|circuit court|"
     r"federal court|fed court|judiciary|jurisprudence|judgment|"
     r"\blii\b|\bcase.law\b|saij|caselaw|sentencias|jurisprud",
     "medium"),

    # Criminal justice / prosecution
    ("just_criminal", "02_justice",
     r"public prosecutor|ministère public|fiscalia|crime agency|"
     r"criminal investigation|state prosecutor|attorney general",
     "high"),

    # ===== LEGISLATION & TEXTS =====

    # Gazettes (very specific)
    ("lex_gazette", "01_legislation",
     r"gazette|gazet[ae]|journal officiel|official journal|boletin oficial|"
     r"diario oficial|bundesgesetzblatt|amtsblatt|moniteur belge|"
     r"\bbopa\b|\babmtsblatt\b",
     "high"),

    # Codes / consolidated law
    ("lex_codes", "01_legislation",
     r"\bcodex\b|consolidated.law|consolidated.legislation|codes? civil|"
     r"codes? p[ée]nal|civil code|criminal code|commercial code|"
     r"recueil.l[oé]i|gesetzbuch",
     "high"),

    # National legislative portals (broader, lower confidence)
    ("lex_portal", "01_legislation",
     r"finlex|legifrance|legis.que|legis.qu[ée]bec|gesetze.im.internet|"
     r"riigi.teataja|legislation portal|^[a-z]+/leg[ie]s|^[a-z]+/laws|"
     r"\barlis\b|fedlex|elaw|e-laws|laws of |loi.electroniqu",
     "medium"),

    # ===== ECONOMY =====

    # Tax & customs (strict)
    ("econ_tax", "04_economy",
     r"^.+/(irs|hmrc|ato|dgfip|ssr|sars|cra|carf|cbic|sat|stat-tax|nrs|nbr)|"
     r"revenue agency|revenue service|tax authority|tax office|tax administration|"
     r"agence du revenu|fiscalité|fiscal directorate|customs|douanes?|"
     r"agencia tributaria|agenzia.*entrate|finanzamt",
     "high"),

    # Competition
    ("econ_competition", "04_economy",
     r"competition (authority|commission|board|tribunal)|antitrust|"
     r"autorit[ée].*concurrence|cartel office|\baccc\b|\bcma\b|\bcomco\b|"
     r"cade\b|kkv\b|uokik|antimonopol|competition policy",
     "high"),

    # Central banks
    ("econ_central_bank", "04_economy",
     r"central.bank|banque centrale|banca d.italia|bundesbank|"
     r"banque de france|reserve bank|federal reserve|monetary author|"
     r"\bbcb\b|\brbi\b|\bpboc\b|\becb\b|amla\b|imf decisions",
     "high"),

    # Financial markets (securities)
    ("econ_financial_markets", "04_economy",
     r"securities.commission|securities.authority|financial.supervis|"
     r"financial.services authority|financial market author|capital markets?|"
     r"\bamf\b|\bsec\b|\besma\b|\bfca\b|\bfsma\b|\bcvm\b|\bcnmv\b|\bconsob\b|"
     r"\bbafin\b|\bfinma\b|hellenic capital market|\bknf\b|polish financial",
     "high"),

    # Insurance & pensions
    ("econ_insurance", "04_economy",
     r"insurance.author|insurance.supervisor|pension authority|"
     r"\beiopa\b|\bacpr\b|prudential.regulation",
     "high"),

    # Companies / corporate
    ("econ_companies", "04_economy",
     r"companies house|company.register|registro.*mercantil|"
     r"handelsregister|edgar|registre.commerce|registro empresas|"
     r"opencorporates|\bkbo\b",
     "high"),

    # ===== ADMINISTRATION & GOVERNANCE =====

    # Parliament
    ("gov_parliament", "03_administration",
     r"parliament|assembl[ée]e nationale|s[ée]nat|congress|congreso|"
     r"bundestag|bundesrat|knesset|diet|hansard|riksdag|folketing|"
     r"national assembly|tweede kamer|eerste kamer|cortes generales|"
     r"stortinget|seym|sejm|n[áa]rodn[íý] sov|skupština",
     "high"),

    # Public procurement
    ("gov_procurement", "03_administration",
     r"public procurement|tenders electronic daily|marché.public|"
     r"\bted\b|\bboamp\b|public tender|govt.procure|procurement registry",
     "high"),

    # Regulated professions (bar, doctors, accountants, notaries)
    ("gov_professions", "03_administration",
     r"bar (council|association)|barreau|ordre.des.avocat|ordre.des.médecin|"
     r"solicitors.regul|legal.professions|\bgmc\b|\bsra\b|\bbrak\b|\bcnb\b|"
     r"national.bar|notar(y|ial) (chamber|authority)|chamber of (notaries|advocates)|"
     r"general medical council|accountancy.profession",
     "high"),

    # Anti-corruption / audit / court of accounts
    ("gov_audit", "03_administration",
     r"court of audit|cour des comptes|federal.audit|national audit|"
     r"audit office|tribunal de cuentas|corte dei conti|"
     r"\bnao\b|\bgao\b|\bbrh\b|state audit",
     "high"),

    # AML / financial intelligence / anti-fraud
    ("gov_aml_fraud", "03_administration",
     r"anti.fraud|olaf\b|financial.intelligence|money.laundering|"
     r"national crime agency|\bnca\b|tracfin|fiu\b|fincen|"
     r"anti.corrupt|integrity (commission|office)",
     "high"),

    # Elections / political life
    ("gov_elections", "03_administration",
     r"electoral commission|electoral authority|electoral tribunal|"
     r"\bcnccfp\b|\bfec\b|campaign finance|election supervisor",
     "high"),

    # Foreign affairs & sanctions
    ("gov_foreign", "03_administration",
     r"foreign affairs|affaires étrangères|sanctions|\bofac\b|"
     r"state department|dg trade|trade defence|investment treaty",
     "high"),

    # Ombudsman / civic rights (multi-tag with soc_rights)
    ("gov_general", "03_administration",
     r"ombudsman|défenseur des droits|m[ée]diateur|"
     r"administrative procedure|service-public|government portal",
     "medium"),

    # Advertising / press / media self-regulation
    ("gov_advertising", "03_administration",
     r"advertising standards|publicit[ée].*régul|\barpp\b|\basa\b",
     "high"),

    ("gov_press", "03_administration",
     r"press standards|ipso\b|press council|conseil.de.presse",
     "high"),

    # Charity / civil society regulation
    ("gov_civil_society", "03_administration",
     r"charity commission|charities? regulat|associations? regulat",
     "high"),

    # Land registries / cadastre
    ("gov_registries", "03_administration",
     r"land registry|cadastre|hm.land|registre foncier|catasto|"
     r"property registry",
     "high"),

    # ===== SOCIAL =====

    ("soc_security", "05_social",
     r"social security|s[ée]curit[ée] sociale|pension fund|retirement|"
     r"national.insurance|welfare|appeals board.*social|"
     r"\bcnam\b|\bssa\b|\bdwp\b|sozialversicherung",
     "high"),

    ("soc_labor", "05_social",
     r"\bdol\b|department of labor|ministère du travail|ministry of labor|"
     r"inspection du travail|labor inspectorate|industrial relations|"
     r"convention collective|collective bargaining|\bilo\b natlex",
     "high"),

    ("soc_rights", "05_social",
     r"human rights|droits de l.homme|civil liberties|equality (body|commission)|"
     r"\behrc\b|d[ée]fenseur des droits|national.*human.rights",
     "high"),

    ("soc_immigration", "05_social",
     r"immigration|asylum|asile|citizenship|naturalisation|"
     r"\buscis\b|\bofpra\b|\bukvi\b|\bofii\b|refugee",
     "high"),

    # ===== HEALTH, SAFETY & CONSUMER =====

    ("hs_pharma", "06_health",
     r"medicines? agency|drug administration|pharmaceutical agency|"
     r"medical devices|\bfda\b|\bema\b|\bansm\b|\bmhra\b|\bbfarm\b|\baifa\b|"
     r"health products regulator",
     "high"),

    ("hs_food", "06_health",
     r"food safety|food authority|food agency|food standards|"
     r"\befsa\b|\brasff\b|\baesan\b|\bfsai\b",
     "high"),

    ("hs_consumer", "06_health",
     r"consumer protection|consommat|consumer commission|consumer council|"
     r"\bdgccrf\b|\bcfpb\b|verbraucherzentr|\bcpsc\b",
     "high"),

    ("hs_chemicals", "06_health",
     r"\bechab\b|\bechabo\b|chemical agency|reach|\bclp\b|"
     r"prop.65|\btsca\b|substance.author",
     "high"),

    ("hs_safety_work", "06_health",
     r"occupational (health|safety)|workplace safety|"
     r"\bosha\b|\binrs\b|\bhse\b|eu-osha",
     "high"),

    ("hs_health", "06_health",
     r"public health|sant[ée] publique|department of health|"
     r"ministry of health|\bcdc\b|\becdc\b",
     "high"),

    # ===== ENVIRONMENT, ENERGY & RESOURCES =====

    ("env_energy", "07_environment",
     r"energy regulator|energy authority|energy commission|"
     r"electricity (regulator|commission)|gas regulator|"
     r"nuclear (safety|regulator)|\bcreg\b|\barera\b|\bofgem\b|\bferc\b|"
     r"\bacer\b|\bcre\b/|\basn\b|énergie",
     "high"),

    ("env_environment", "07_environment",
     r"environment(al)? (agency|protection|ministry)|climate (action|change)|"
     r"environnement|\bepa\b|\beea\b|\badem\b|pollution",
     "high"),

    ("env_agri", "07_environment",
     r"agriculture|agricultural|fisheries|forestry|forêt|sylvicul|"
     r"\busda\b|dg agri|\binao\b|\bonf\b|faolex",
     "high"),

    ("env_utilities_water", "07_environment",
     r"water (services|regulat|authority)|\bofwat\b|water utilities",
     "high"),

    # ===== DIGITAL & SECTORAL =====

    ("dig_data_protection", "08_digital",
     r"data protection|privacy (commissioner|authority|office)|"
     r"\bcnil\b|\bico\b|\baepd\b|\bgaranti?e\b|\bedpb\b|datatilsyn|"
     r"datenschutz|gdpr|protection des données",
     "high"),

    ("dig_ai", "08_digital",
     r"ai (act|office|authority|safety)|artificial intelligence|"
     r"algorithmic (governance|accountability)|ai.regulator",
     "high"),

    ("dig_cyber", "08_digital",
     r"cyber(security)?|\benisa\b|\banssi\b|\bcisa\b|\bncsc\b|\bbsi\b|"
     r"computer.emergency.response|\bcert\b|nis2|nis.directive",
     "high"),

    ("dig_telecom", "08_digital",
     r"telecom(munication)? (regulator|author|commission)|"
     r"\barcep\b|\bfcc\b|\bofcom\b|\bbnetza\b|\bbipt\b|anatel|berec|"
     r"electronic communications|\buke\b|\brtr\b",
     "high"),

    ("dig_audiovisual", "08_digital",
     r"audiovisual|broadcasting (author|commission|regulat)|media (commission|regulat)|"
     r"\barcom\b|\bagcom\b|\bkek\b|media concentration|broadcast.author",
     "high"),

    ("dig_ip", "08_digital",
     r"patent|trademark|intellectual property|\buspto\b|\beuipo\b|\binpi\b|"
     r"\bwipo\b|\bepo\b|copyright office|patent court|\bbpatg\b",
     "high"),

    ("dig_digital_services", "08_digital",
     r"digital services|\bdsa\b|\bdma\b|dg cnect|digital markets",
     "high"),

    ("dig_crypto", "08_digital",
     r"crypto|virtual asset|mica\b|digital asset",
     "high"),

    # ===== SECTORAL =====

    ("sect_transport", "08_digital",
     r"aviation (safety|author|admin)|civil aviation|airworthiness|"
     r"\beasa\b|\bdgac\b|\bicao\b|\bfaa\b|maritime author|\bemsa\b|\bimo\b|"
     r"\bera\b|rail (regulat|safety)|road (regulat|transport)|"
     r"\borr\b|transport author|transportation",
     "high"),

    ("sect_construction", "08_digital",
     r"construction (author|board)|housing (author|board)|urbanism|"
     r"planning (author|inspectorate)|\bdguhc\b|\bhud\b|\brics\b",
     "high"),

    ("sect_gambling", "08_digital",
     r"gambling|gaming (commission|author)|paris (sportifs|enligne)|"
     r"\banj\b|gaming board|lotteries|wagering",
     "high"),
]


def categorize(source):
    """Return list of (cat_id, group_id, confidence) tuples (multi-tag)."""
    blob = (
        f"{source.get('id', '')} {source.get('name', '')} "
        f"{' '.join(source.get('data_types', []) or [])} "
        f"{source.get('notes', '') or ''}"
    ).lower()

    matches = []
    seen_cats = set()
    for cat_id, group_id, pattern, confidence in RULES:
        if cat_id in seen_cats:
            continue
        if re.search(pattern, blob):
            matches.append({
                "cat": cat_id,
                "group": group_id,
                "conf": confidence,
            })
            seen_cats.add(cat_id)

    # Heuristic cap: max 3 tags per source (keep highest confidence first)
    matches.sort(key=lambda m: (0 if m["conf"] == "high" else 1 if m["conf"] == "medium" else 2))
    return matches[:3]


def main():
    manifest = json.load(MANIFEST.open())
    sources = []
    for c in manifest["countries"]:
        for s in c["sources"]:
            sources.append({**s, "country": c["code"]})

    print(f"Total sources: {len(sources)}")

    # Categorize all
    results = []
    for s in sources:
        tags = categorize(s)
        results.append({
            "id": s["id"],
            "country": s["country"],
            "name": s.get("name", ""),
            "status": s.get("status", ""),
            "tags": tags,
        })

    # Stats
    by_group = defaultdict(int)
    by_cat = defaultdict(int)
    matched = 0
    unmatched = []
    multi_tagged = 0
    by_confidence = defaultdict(int)

    for r in results:
        if r["tags"]:
            matched += 1
            if len(r["tags"]) > 1:
                multi_tagged += 1
            for t in r["tags"]:
                by_group[t["group"]] += 1
                by_cat[t["cat"]] += 1
                by_confidence[t["conf"]] += 1
        else:
            unmatched.append(r)

    print(f"\n═══ COVERAGE ═══")
    print(f"Matched (≥1 tag):  {matched}/{len(sources)} = {matched/len(sources)*100:.1f}%")
    print(f"Multi-tagged:      {multi_tagged}/{matched} = {multi_tagged/matched*100:.1f}%")
    print(f"Unmatched:         {len(unmatched)} = {len(unmatched)/len(sources)*100:.1f}%")
    print(f"\nConfidence distribution (tag count):")
    for conf, n in by_confidence.items():
        print(f"  {conf:10s} {n}")

    print(f"\n═══ BY GROUP ═══")
    for g in sorted(by_group.keys()):
        print(f"  {g:25s} {by_group[g]}")

    print(f"\n═══ TOP 20 CATEGORIES ═══")
    for cat, n in sorted(by_cat.items(), key=lambda x: -x[1])[:20]:
        print(f"  {cat:30s} {n}")

    # Save full results
    out_json = OUT_DIR / "categorized_full.json"
    with out_json.open("w") as f:
        json.dump({
            "stats": {
                "total": len(sources),
                "matched": matched,
                "unmatched": len(unmatched),
                "multi_tagged": multi_tagged,
                "coverage_pct": round(matched / len(sources) * 100, 2),
                "by_group": dict(by_group),
                "by_category": dict(by_cat),
                "by_confidence": dict(by_confidence),
            },
            "categorized": results,
            "unmatched_samples": unmatched[:50],
        }, f, indent=2, ensure_ascii=False)
    print(f"\nFull JSON: {out_json}")

    # CSV for spreadsheet review
    csv_path = OUT_DIR / "categorized.csv"
    with csv_path.open("w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["id", "country", "name", "status", "tag_1", "tag_1_conf",
                    "tag_2", "tag_2_conf", "tag_3", "tag_3_conf"])
        for r in results:
            tags = r["tags"]
            row = [r["id"], r["country"], r["name"], r["status"]]
            for i in range(3):
                if i < len(tags):
                    row.extend([tags[i]["cat"], tags[i]["conf"]])
                else:
                    row.extend(["", ""])
            w.writerow(row)
    print(f"CSV: {csv_path}")

    # Random sample of 50 sources for visual review
    random.seed(42)
    sample = random.sample(results, 50)

    sample_html = OUT_DIR / "sample_50.html"
    html = ["<!DOCTYPE html><html><head><meta charset='utf-8'><title>Sample 50</title><style>"
            "body{font-family:-apple-system,Inter,sans-serif;background:#f9f8f6;color:#1a1a1a;margin:0;padding:32px;line-height:1.5}"
            "h1{font-size:24px;letter-spacing:-0.02em;margin:0 0 8px}"
            "p.lead{color:#5a5a5a;font-size:14px;max-width:780px;margin:0 0 24px}"
            "table{width:100%;border-collapse:separate;border-spacing:0;background:#fff;"
            "border:1px solid rgba(0,0,0,0.08);border-radius:14px;overflow:hidden;font-size:13px}"
            "th,td{padding:10px 14px;text-align:left;border-bottom:1px solid rgba(0,0,0,0.06);vertical-align:top}"
            "th{background:#f0efec;font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#8a8a8a}"
            "tr:last-child td{border-bottom:none}"
            "tr:hover{background:#f0efec}"
            "code{background:#f0efec;padding:2px 6px;border-radius:4px;font-size:11.5px;font-family:SF Mono,Menlo,monospace}"
            ".tag{display:inline-block;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:600;margin-right:4px;margin-bottom:2px;border:1px solid transparent}"
            ".tag.high{background:#d6f0e1;color:#1a8a4a}"
            ".tag.medium{background:rgba(212,169,12,0.12);color:#946b2d}"
            ".tag.low{background:#f0efec;color:#5a5a5a}"
            ".empty{color:#c4302b;font-style:italic;font-size:11.5px}"
            ".kpi{display:inline-block;background:#fff;border:1px solid rgba(0,0,0,0.08);padding:12px 18px;border-radius:12px;margin-right:10px;margin-bottom:14px}"
            ".kpi-val{font-size:22px;font-weight:700;letter-spacing:-0.01em;font-variant-numeric:tabular-nums}"
            ".kpi-lbl{font-size:10px;color:#8a8a8a;text-transform:uppercase;letter-spacing:0.08em;margin-top:2px}"
            ".country{display:inline-block;background:#0008cf;color:#fff;font-weight:600;font-size:10px;padding:2px 7px;border-radius:5px;letter-spacing:0.05em}"
            "</style></head><body>"]
    html.append(f"<h1>Échantillon aléatoire de 50 sources sur 1 494</h1>")
    html.append("<p class='lead'>Pour validation manuelle de la qualité de la catégorisation. "
                "Confidence high = match exact sur nom officiel ; medium = mot-clé général ; "
                "low = catégorisation par défaut.</p>")
    html.append(f"<div class='kpi'><div class='kpi-val'>{matched}/{len(sources)}</div><div class='kpi-lbl'>Couverture totale</div></div>")
    html.append(f"<div class='kpi'><div class='kpi-val'>{matched/len(sources)*100:.1f}%</div><div class='kpi-lbl'>Pourcentage</div></div>")
    html.append(f"<div class='kpi'><div class='kpi-val'>{multi_tagged}</div><div class='kpi-lbl'>Multi-taggées</div></div>")
    html.append(f"<div class='kpi'><div class='kpi-val'>{len(unmatched)}</div><div class='kpi-lbl'>Non taggées</div></div>")
    html.append("<table><thead><tr><th>Pays</th><th>ID</th><th>Nom</th><th>Tags assignés</th><th>Validation</th></tr></thead><tbody>")

    for r in sample:
        tags_html = "".join(
            f"<span class='tag {t['conf']}'>{t['cat']}</span>"
            for t in r["tags"]
        ) or "<span class='empty'>—  non catégorisée</span>"
        html.append(
            f"<tr><td><span class='country'>{r['country']}</span></td>"
            f"<td><code>{r['id']}</code></td>"
            f"<td style='max-width:340px'>{r['name']}</td>"
            f"<td>{tags_html}</td>"
            f"<td><label><input type='radio' name='v_{r['id']}' value='ok'>OK</label> "
            f"<label><input type='radio' name='v_{r['id']}' value='ko'>KO</label></td></tr>"
        )

    html.append("</tbody></table></body></html>")

    sample_html.write_text("".join(html))
    print(f"HTML sample: {sample_html}")


if __name__ == "__main__":
    main()

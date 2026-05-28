#!/usr/bin/env python3
"""
Enrich master-consolidated.csv with URLs.
Source 1: previous product-compliance.json from git (1691 URLs)
Source 2: url-map.json (82 patterns)
Source 3: country-level portals as fallback
"""
import csv
import json
import re
import subprocess
from pathlib import Path

ROOT = Path("/Users/naomiehalioua/cleo-legaldata-public")
MASTER = ROOT / "audits/product-compliance-worldwide-2026/data/master-consolidated.csv"
URL_MAP = ROOT / "audits/product-compliance-worldwide-2026/data/url-map.json"

# Previous JSON had URLs — extract them
prev = json.loads(subprocess.check_output(
    ["git", "show", "HEAD~2:public/data/product-compliance.json"], cwd=ROOT,
))

url_by_full = {}  # (juris_code, ref, name) -> url
url_by_juris_ref = {}  # (juris_code, ref_normalized) -> url
url_by_juris_name = {}  # (juris_code, name_normalized) -> url

def norm(s):
    return re.sub(r"\s+", " ", (s or "").lower().strip())

for reg in prev["regulations"]:
    if not reg.get("url"):
        continue
    jc = reg["jurisdiction_code"]
    name_n = norm(reg["regulation_name"])
    ref_n = norm(reg["regulation_ref"])
    url_by_full[(jc, ref_n, name_n)] = reg["url"]
    url_by_juris_ref[(jc, ref_n)] = reg["url"]
    url_by_juris_name[(jc, name_n)] = reg["url"]

print(f"Loaded {len(url_by_full)} URLs from previous JSON")

url_map = json.loads(URL_MAP.read_text())  # ref_pattern -> url
print(f"Loaded {len(url_map)} pattern URLs from url-map.json")

# Country portal fallbacks
COUNTRY_PORTAL = {
    "EU": "https://eur-lex.europa.eu/",
    "FR": "https://www.legifrance.gouv.fr/",
    "DE": "https://www.gesetze-im-internet.de/",
    "IT": "https://www.normattiva.it/",
    "ES": "https://www.boe.es/",
    "GB": "https://www.legislation.gov.uk/",
    "US": "https://www.govinfo.gov/",
    "CA": "https://laws-lois.justice.gc.ca/",
    "CN": "https://www.gov.cn/",
    "JP": "https://elaws.e-gov.go.jp/",
    "KR": "https://www.law.go.kr/",
    "IN": "https://www.indiacode.nic.in/",
    "AU": "https://www.legislation.gov.au/",
    "NZ": "https://www.legislation.govt.nz/",
    "BR": "https://www.planalto.gov.br/",
    "MX": "https://www.dof.gob.mx/",
    "AR": "https://www.boletinoficial.gob.ar/",
    "CL": "https://www.bcn.cl/leychile",
    "CO": "https://www.funcionpublica.gov.co/eva/gestornormativo/",
    "PE": "https://www.gob.pe/normas-legales",
    "ZA": "https://www.gov.za/documents/acts",
    "NG": "https://lawsofnigeria.placng.org/",
    "KE": "http://kenyalaw.org/",
    "EG": "https://manshurat.org/",
    "MA": "http://www.sgg.gov.ma/",
    "SA": "https://laws.boe.gov.sa/",
    "AE": "https://elaws.moj.gov.ae/",
    "TR": "https://www.resmigazete.gov.tr/",
    "RU": "http://pravo.gov.ru/",
    "CH": "https://www.fedlex.admin.ch/",
    "NO": "https://lovdata.no/",
    "SE": "https://www.riksdagen.se/sv/dokument-lagar/",
    "FI": "https://www.finlex.fi/",
    "DK": "https://www.retsinformation.dk/",
    "NL": "https://wetten.overheid.nl/",
    "BE": "https://www.ejustice.just.fgov.be/",
    "AT": "https://www.ris.bka.gv.at/",
    "PT": "https://dre.pt/",
    "IE": "https://www.irishstatutebook.ie/",
    "PL": "https://isap.sejm.gov.pl/",
    "GR": "https://www.et.gr/",
    "CZ": "https://www.zakonyprolidi.cz/",
    "HU": "https://njt.hu/",
    "RO": "https://legislatie.just.ro/",
    "BG": "https://lex.bg/",
    "SK": "https://www.slov-lex.sk/",
    "SI": "http://www.pisrs.si/",
    "HR": "https://narodne-novine.nn.hr/",
    "EE": "https://www.riigiteataja.ee/",
    "LV": "https://likumi.lv/",
    "LT": "https://www.e-tar.lt/",
    "CY": "http://www.cylaw.org/",
    "MT": "https://legislation.mt/",
    "LU": "https://legilux.public.lu/",
    "ISO": "https://www.iso.org/standards.html",
    "IEC": "https://www.iec.ch/",
    "CODEX": "https://www.fao.org/fao-who-codexalimentarius/",
    "WHO": "https://www.who.int/",
    "UNECE": "https://unece.org/",
    "OECD": "https://www.oecd.org/",
    "ICAO": "https://www.icao.int/",
    "ITU": "https://www.itu.int/",
    "WTO": "https://www.wto.org/",
    "IMDRF": "https://www.imdrf.org/",
    "ICH": "https://www.ich.org/",
    "WIPO": "https://www.wipo.int/",
    "FAO": "https://www.fao.org/",
    "PIC-S": "https://picscheme.org/",
    "OIE": "https://www.woah.org/",
    "WOAH": "https://www.woah.org/",
}


def lookup_url(row):
    jc = row["jurisdiction_code"]
    name_n = norm(row["regulation_name"])
    ref_n = norm(row["regulation_ref"])

    # 1) Exact match in previous JSON
    u = url_by_full.get((jc, ref_n, name_n))
    if u:
        return u, "prev_exact"
    u = url_by_juris_ref.get((jc, ref_n))
    if u:
        return u, "prev_ref"
    u = url_by_juris_name.get((jc, name_n))
    if u:
        return u, "prev_name"

    # 2) Pattern match against url-map.json (e.g. "1223/2009")
    for pattern, url in url_map.items():
        if pattern in ref_n:
            return url, "pattern"

    # 3) Country portal fallback
    if jc in COUNTRY_PORTAL:
        return COUNTRY_PORTAL[jc], "portal"
    # Strip US-CA etc.
    if "-" in jc:
        base = jc.split("-")[0]
        if base in COUNTRY_PORTAL:
            return COUNTRY_PORTAL[base], "portal_base"
    return None, None


rows = list(csv.DictReader(MASTER.open()))
header = list(rows[0].keys())

stats = {"prev_exact": 0, "prev_ref": 0, "prev_name": 0, "pattern": 0, "portal": 0, "portal_base": 0, "none": 0, "non_solid": 0}
for r in rows:
    match = r["legal_api_match"].strip().upper()
    if match not in ("FOUND", "NOT_FOUND"):
        stats["non_solid"] += 1
        continue
    if r.get("notes", "").startswith("http"):
        continue  # already has URL
    url, method = lookup_url(r)
    if url:
        # Store URL in notes column (existing convention)
        # Don't overwrite existing notes — append or replace
        existing = r.get("notes", "")
        r["notes"] = url if not existing or not existing.startswith("http") else existing
        stats[method] = stats.get(method, 0) + 1
    else:
        stats["none"] += 1

with MASTER.open("w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=header)
    w.writeheader()
    for r in rows:
        w.writerow(r)

print(f"\nURL enrichment summary (solid rows only):")
for k, v in stats.items():
    print(f"  {k}: {v}")

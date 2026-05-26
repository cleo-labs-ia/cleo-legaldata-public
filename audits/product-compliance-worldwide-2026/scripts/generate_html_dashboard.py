#!/usr/bin/env python3
"""Génère outputs/audit-dashboard.html — Dashboard product compliance worldwide, Design System V4."""

import csv
import json
import html as html_mod
from collections import defaultdict, OrderedDict
from pathlib import Path

CSV_PATH = Path(__file__).parent.parent / "data" / "master.csv"
OUT_PATH = Path(__file__).parent.parent / "outputs" / "audit-dashboard.html"


def h(text):
    """HTML-escape."""
    return html_mod.escape(str(text))


def main():
    rows = list(csv.DictReader(open(CSV_PATH, encoding="utf-8")))
    total = len(rows)
    found_rows = [r for r in rows if r["legal_api_match"] == "FOUND"]
    missing_rows = [r for r in rows if r["legal_api_match"] == "NOT_FOUND"]
    found = len(found_rows)
    missing = len(missing_rows)
    pct_global = 100.0 * found / total if total else 0

    # --- Normalize criticality to uppercase ---
    for r in rows:
        r["criticality"] = r["criticality"].strip().upper()

    # --- Products ---
    by_product = defaultdict(list)
    for r in rows:
        by_product[(r["product_id"], r["product_name"])].append(r)

    product_stats = []
    for (pid, pname), prows in sorted(by_product.items(), key=lambda x: int(x[0][0])):
        f = sum(1 for r in prows if r["legal_api_match"] == "FOUND")
        m = len(prows) - f
        pct = 100.0 * f / len(prows) if prows else 0
        product_stats.append({
            "id": pid, "name": pname, "total": len(prows),
            "found": f, "missing": m, "pct": round(pct, 1)
        })

    # Products with found regulations (for "CE QU'ON A")
    found_by_product = defaultdict(list)
    for r in found_rows:
        found_by_product[r["product_name"]].append(r["regulation_ref"])

    # Products at zero
    zero_products = [p for p in product_stats if p["found"] == 0]

    # --- Jurisdictions ---
    by_jurisdiction = defaultdict(list)
    for r in rows:
        by_jurisdiction[(r["jurisdiction_code"], r["jurisdiction_name"], r["region"])].append(r)

    jurisdiction_stats = []
    for (jcode, jname, region), jrows in by_jurisdiction.items():
        f = sum(1 for r in jrows if r["legal_api_match"] == "FOUND")
        m = len(jrows) - f
        jurisdiction_stats.append({
            "code": jcode, "name": jname, "region": region,
            "total": len(jrows), "found": f, "missing": m
        })
    jurisdiction_stats.sort(key=lambda x: (-x["found"], x["name"]))

    # --- Regions (for missing) ---
    by_region = defaultdict(int)
    for r in missing_rows:
        by_region[r["region"]] += 1
    region_missing = sorted(by_region.items(), key=lambda x: -x[1])

    # --- Heatmap: product x jurisdiction ---
    product_names_ordered = [p["name"] for p in product_stats]
    jurisdiction_codes_ordered = [j["code"] for j in jurisdiction_stats]

    heatmap_set = set()
    for r in found_rows:
        heatmap_set.add((r["product_name"], r["jurisdiction_code"]))

    # --- Full table data as JSON ---
    table_data = []
    for r in rows:
        table_data.append({
            "product": r["product_name"],
            "country": r["jurisdiction_name"],
            "country_code": r["jurisdiction_code"],
            "regulation": r["regulation_name"],
            "ref": r["regulation_ref"],
            "authority": r["enforcement_body"],
            "requirements": r["key_requirements"],
            "criticality": r["criticality"],
            "found": r["legal_api_match"] == "FOUND",
            "region": r["region"]
        })

    # Build found_by_product HTML
    found_product_html = ""
    for pname in sorted(found_by_product.keys()):
        refs = found_by_product[pname]
        found_product_html += f'<div style="margin-bottom:12px"><span class="t-h3" style="color:var(--c-text)">{h(pname)}</span>'
        found_product_html += f'<span class="t-caption" style="margin-left:8px">{len(refs)} ref(s)</span>'
        found_product_html += '<div style="margin-top:4px;display:flex;flex-wrap:wrap;gap:4px">'
        for ref in sorted(set(refs)):
            found_product_html += f'<span style="font-size:12px;background:var(--c-blue-light);color:var(--c-blue);padding:3px 8px;border-radius:var(--r-sm);font-weight:500">{h(ref)}</span>'
        found_product_html += '</div></div>'

    # Build zero products HTML
    zero_html = ""
    for p in zero_products:
        zero_html += f'<div style="padding:6px 0;border-bottom:1px solid var(--c-border);font-size:14px;color:var(--c-text)">{h(p["name"])}</div>'

    # Build region missing HTML
    region_missing_html = ""
    for region, count in region_missing:
        region_missing_html += f'<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--c-border);font-size:14px">'
        region_missing_html += f'<span style="color:var(--c-text)">{h(region)}</span>'
        region_missing_html += f'<span style="font-weight:600;color:var(--c-text-2)">{count}</span>'
        region_missing_html += '</div>'

    # Build product table rows
    product_table_html = ""
    for i, p in enumerate(product_stats, 1):
        if p["pct"] > 10:
            badge = '<span class="badge badge-pass">OK</span>'
        elif p["pct"] > 0:
            badge = '<span class="badge badge-risk">FAIBLE</span>'
        else:
            badge = '<span class="badge badge-block">RIEN</span>'

        fill_color = "var(--c-blue)" if p["pct"] > 10 else ("var(--c-risk)" if p["pct"] > 0 else "rgba(0,0,0,0.15)")

        product_table_html += f'''<tr>
            <td style="color:var(--c-text-3)">{i}</td>
            <td style="font-weight:500;color:var(--c-text)">{h(p["name"])}</td>
            <td style="font-weight:600;color:var(--c-text)">{p["found"]}</td>
            <td style="color:var(--c-text-2)">{p["missing"]}</td>
            <td style="min-width:120px">
                <div style="display:flex;align-items:center;gap:8px">
                    <div class="prog" style="flex:1"><div class="prog-fill" style="width:{p["pct"]}%;background:{fill_color}"></div></div>
                    <span style="font-size:12px;font-weight:600;color:var(--c-text-2);min-width:36px">{p["pct"]}%</span>
                </div>
            </td>
            <td>{badge}</td>
        </tr>'''

    # Build jurisdiction table rows
    jurisdiction_table_html = ""
    for j in jurisdiction_stats:
        if j["found"] > 0:
            badge = '<span class="badge badge-pass">OUI</span>'
        else:
            badge = '<span class="badge badge-block">NON</span>'

        jurisdiction_table_html += f'''<tr>
            <td style="font-weight:600;color:var(--c-blue)">{h(j["code"])}</td>
            <td style="font-weight:500;color:var(--c-text)">{h(j["name"])}</td>
            <td style="color:var(--c-text-2)">{h(j["region"])}</td>
            <td style="font-weight:600;color:var(--c-text)">{j["found"]}</td>
            <td style="color:var(--c-text-2)">{j["missing"]}</td>
            <td>{badge}</td>
        </tr>'''

    # Build heatmap HTML
    heatmap_html = '<div style="overflow-x:auto">'
    heatmap_html += '<table style="border-collapse:collapse;font-size:10px;width:100%">'
    # Header row with jurisdiction codes
    heatmap_html += '<tr><td style="min-width:160px;padding:4px 8px;font-weight:600;color:var(--c-text-3);font-size:10px;letter-spacing:0.06em;text-transform:uppercase">Produit / Pays</td>'
    for jcode in jurisdiction_codes_ordered:
        heatmap_html += f'<td style="padding:4px 2px;text-align:center;font-weight:600;color:var(--c-text-3);font-size:9px;writing-mode:vertical-lr;height:60px;letter-spacing:0.03em">{h(jcode)}</td>'
    heatmap_html += '</tr>'

    for pname in product_names_ordered:
        heatmap_html += f'<tr><td style="padding:4px 8px;font-size:11px;font-weight:500;color:var(--c-text);white-space:nowrap;border-bottom:1px solid var(--c-border)">{h(pname)}</td>'
        for jcode in jurisdiction_codes_ordered:
            has = (pname, jcode) in heatmap_set
            bg = "var(--c-ink)" if has else "var(--c-pass-bg)"
            title_text = f"{pname} / {jcode}"
            heatmap_html += f'<td style="padding:2px;border-bottom:1px solid var(--c-border)"><div title="{h(title_text)}" style="width:14px;height:14px;border-radius:3px;background:{bg};margin:auto"></div></td>'
        heatmap_html += '</tr>'
    heatmap_html += '</table></div>'

    # Table data JSON
    table_json = json.dumps(table_data, ensure_ascii=False)

    # Unique products and countries for filters
    unique_products = sorted(set(r["product_name"] for r in rows))
    unique_countries = sorted(set(r["jurisdiction_name"] for r in rows))

    product_options = ''.join(f'<option value="{h(p)}">{h(p)}</option>' for p in unique_products)
    country_options = ''.join(f'<option value="{h(c)}">{h(c)}</option>' for c in unique_countries)

    # ===== HTML =====
    html_content = f'''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Audit Product Compliance Worldwide — Cleo Comply</title>
<style>
@import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700,900&display=swap');

:root {{
    --c-blue: #0008CF;
    --c-blue-hover: #0006A8;
    --c-blue-light: rgba(0, 8, 207, 0.06);
    --c-blue-medium: rgba(0, 8, 207, 0.12);
    --c-ink: #1A1A1A;
    --c-white: #FFFFFF;
    --c-surface: #F9F8F6;
    --c-card: #F0EFEC;
    --c-border: rgba(0, 0, 0, 0.08);
    --c-text: rgba(0, 0, 0, 0.87);
    --c-text-2: rgba(0, 0, 0, 0.62);
    --c-text-3: rgba(0, 0, 0, 0.45);
    --c-pass: #1A1A1A;
    --c-pass-bg: rgba(0,0,0,0.04);
    --c-risk: #946B2D;
    --c-risk-bg: rgba(148,107,45,0.08);
    --c-block: #1A1A1A;
    --c-block-bg: rgba(0,0,0,0.06);
    --r-sm: 8px;
    --r-md: 16px;
    --r-lg: 24px;
    --r-pill: 9999px;
    --shadow-sm: 0 2px 8px rgba(0,0,0,0.04);
    --shadow-md: 0 8px 32px rgba(0,0,0,0.06);
}}

*, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}

body {{
    font-family: 'Satoshi', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--c-surface);
    color: var(--c-text);
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
}}

.container {{ max-width: 1280px; margin: 0 auto; padding: 48px 24px; }}

.t-display {{ font-size: 3.5rem; font-weight: 700; letter-spacing: -0.04em; line-height: 1.1; }}
.t-h1 {{ font-size: 2.25rem; font-weight: 600; letter-spacing: -0.03em; }}
.t-h2 {{ font-size: 1.5rem; font-weight: 600; letter-spacing: -0.02em; }}
.t-h3 {{ font-size: 1.125rem; font-weight: 500; letter-spacing: -0.01em; }}
.t-body {{ font-size: 1rem; color: var(--c-text-2); }}
.t-caption {{ font-size: 0.8125rem; color: var(--c-text-3); }}
.t-label {{ font-size: 0.6875rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--c-text-3); }}

.badge {{ font-size: 11px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; padding: 4px 10px; border-radius: 6px; display: inline-block; }}
.badge-pass {{ background: rgba(0,0,0,0.04); color: #1A1A1A; }}
.badge-risk {{ background: rgba(148,107,45,0.08); color: #946B2D; }}
.badge-block {{ background: rgba(0,0,0,0.06); color: #1A1A1A; }}

.card-warm {{ background: var(--c-card); border-radius: var(--r-md); padding: 24px; }}
.card-white {{ background: var(--c-white); border: 1px solid var(--c-border); border-radius: var(--r-md); padding: 24px; box-shadow: var(--shadow-sm); }}

.app-table {{ width: 100%; border-collapse: collapse; }}
.app-table th {{ font-size: 11px; font-weight: 600; color: var(--c-text-3); letter-spacing: 0.06em; text-transform: uppercase; padding: 12px 16px; border-bottom: 1px solid var(--c-border); text-align: left; }}
.app-table td {{ padding: 14px 16px; border-bottom: 1px solid rgba(0,0,0,0.03); font-size: 14px; }}
.app-table tr:hover {{ background: var(--c-blue-light); }}

.prog {{ height: 5px; border-radius: 3px; background: rgba(0,0,0,0.06); }}
.prog-fill {{ height: 100%; border-radius: 3px; }}

.section {{ margin-bottom: 64px; }}
.section-title {{ margin-bottom: 24px; }}

.grid-2 {{ display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }}
@media (max-width: 768px) {{ .grid-2 {{ grid-template-columns: 1fr; }} }}

.stat-big {{ font-size: 4rem; font-weight: 900; letter-spacing: -0.05em; line-height: 1; }}

.filter-bar {{ display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }}
.filter-bar select, .filter-bar input {{
    font-family: 'Satoshi', sans-serif;
    font-size: 14px;
    padding: 8px 14px;
    border: 1px solid var(--c-border);
    border-radius: var(--r-sm);
    background: var(--c-white);
    color: var(--c-text);
    outline: none;
    min-width: 180px;
}}
.filter-bar select:focus, .filter-bar input:focus {{
    border-color: var(--c-blue);
    box-shadow: 0 0 0 3px var(--c-blue-light);
}}

.header-bar {{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
    margin-bottom: 32px;
    border-bottom: 1px solid var(--c-border);
}}
.logo {{ font-weight: 700; font-size: 1.25rem; color: var(--c-blue); letter-spacing: -0.02em; }}

.footer {{
    text-align: center;
    padding: 32px 0;
    border-top: 1px solid var(--c-border);
    margin-top: 64px;
}}
</style>
</head>
<body>

<div class="container">

<!-- HEADER -->
<div class="header-bar">
    <div class="logo">Cleo Comply</div>
    <span class="t-caption">Audit Product Compliance Worldwide -- 2026-05-26</span>
</div>

<!-- ===== SECTION 1 : LE VERDICT ===== -->
<div class="section">
    <div style="text-align:center;margin-bottom:40px">
        <div class="t-display" style="color:var(--c-ink)">On tracke <span style="color:var(--c-blue)">{pct_global:.0f}%</span> de la reglementation produit mondiale</div>
        <p class="t-body" style="margin-top:12px;max-width:600px;margin-left:auto;margin-right:auto">{found} reglementations trouvees sur {total} attendues -- 20 produits, 50 juridictions</p>
    </div>

    <div class="grid-2">
        <!-- CE QU'ON A -->
        <div class="card-white">
            <div style="margin-bottom:16px">
                <span class="badge badge-pass">{found} REGS TRACKEES</span>
            </div>
            <div class="t-h2" style="margin-bottom:16px;color:var(--c-ink)">Ce qu'on a</div>
            <div style="max-height:400px;overflow-y:auto;padding-right:8px">
                {found_product_html}
            </div>
            <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--c-border)">
                <span class="t-caption">100% en Europe -- zero ailleurs</span>
            </div>
        </div>

        <!-- CE QUI MANQUE -->
        <div class="card-white">
            <div style="margin-bottom:16px">
                <span class="badge badge-block">{missing} REGS MANQUANTES</span>
            </div>
            <div class="t-h2" style="margin-bottom:16px;color:var(--c-ink)">Ce qui manque</div>

            <div class="t-label" style="margin-bottom:8px">Par zone geographique</div>
            <div style="margin-bottom:16px">
                {region_missing_html}
            </div>

            <div class="t-label" style="margin-bottom:8px">{len(zero_products)} produits a zero</div>
            <div style="max-height:200px;overflow-y:auto">
                {zero_html}
            </div>
        </div>
    </div>
</div>

<!-- ===== SECTION 2 : PRODUIT PAR PRODUIT ===== -->
<div class="section">
    <div class="section-title">
        <div class="t-h1" style="color:var(--c-ink)">Produit par produit</div>
        <p class="t-body" style="margin-top:4px">Couverture reglementaire par produit</p>
    </div>
    <div class="card-white" style="overflow-x:auto">
        <table class="app-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Produit</th>
                    <th>On a</th>
                    <th>Il manque</th>
                    <th>Couverture</th>
                    <th>Verdict</th>
                </tr>
            </thead>
            <tbody>
                {product_table_html}
            </tbody>
        </table>
    </div>
</div>

<!-- ===== SECTION 3 : PAYS PAR PAYS ===== -->
<div class="section">
    <div class="section-title">
        <div class="t-h1" style="color:var(--c-ink)">Pays par pays</div>
        <p class="t-body" style="margin-top:4px">Juridictions triees par couverture decroissante</p>
    </div>
    <div class="card-white" style="overflow-x:auto">
        <table class="app-table">
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Pays</th>
                    <th>Region</th>
                    <th>On a</th>
                    <th>Il manque</th>
                    <th>Verdict</th>
                </tr>
            </thead>
            <tbody>
                {jurisdiction_table_html}
            </tbody>
        </table>
    </div>
</div>

<!-- ===== SECTION 4 : HEATMAP ===== -->
<div class="section">
    <div class="section-title">
        <div class="t-h1" style="color:var(--c-ink)">Heatmap produit x pays</div>
        <p class="t-body" style="margin-top:4px">Noir = au moins 1 reg trackee. Clair = rien.</p>
    </div>
    <div class="card-white">
        {heatmap_html}
    </div>
</div>

<!-- ===== SECTION 5 : TABLEAU COMPLET ===== -->
<div class="section">
    <div class="section-title">
        <div class="t-h1" style="color:var(--c-ink)">Tableau complet</div>
        <p class="t-body" style="margin-top:4px">{total} reglementations -- filtrer par produit, pays, criticite, ou statut</p>
    </div>

    <div class="card-white">
        <div class="filter-bar">
            <select id="filter-product" onchange="applyFilters()">
                <option value="">Tous les produits</option>
                {product_options}
            </select>
            <select id="filter-country" onchange="applyFilters()">
                <option value="">Tous les pays</option>
                {country_options}
            </select>
            <select id="filter-criticality" onchange="applyFilters()">
                <option value="">Toutes criticites</option>
                <option value="CRITICAL">Critique</option>
                <option value="HIGH">Haute</option>
                <option value="MEDIUM">Moyenne</option>
                <option value="LOW">Basse</option>
            </select>
            <select id="filter-found" onchange="applyFilters()">
                <option value="">Tous statuts</option>
                <option value="true">On l'a (OUI)</option>
                <option value="false">Manquante (NON)</option>
            </select>
            <input type="text" id="filter-search" placeholder="Rechercher..." oninput="applyFilters()" />
        </div>

        <div id="table-info" class="t-caption" style="margin-bottom:8px"></div>

        <div style="overflow-x:auto;max-height:700px;overflow-y:auto">
            <table class="app-table" id="full-table">
                <thead style="position:sticky;top:0;background:var(--c-white);z-index:1">
                    <tr>
                        <th>Produit</th>
                        <th>Pays</th>
                        <th>Regulation</th>
                        <th>Reference</th>
                        <th>Autorite</th>
                        <th>Exigences</th>
                        <th>Criticite</th>
                        <th>On l'a ?</th>
                    </tr>
                </thead>
                <tbody id="full-table-body"></tbody>
            </table>
        </div>
    </div>
</div>

<!-- FOOTER -->
<div class="footer">
    <span class="t-caption">Audit genere le 2026-05-26 -- 20 produits x 50 juridictions x 1 761 reglementations</span>
</div>

</div>

<script>
const DATA = {table_json};

const PAGE_SIZE = 100;
let currentPage = 0;
let filteredData = DATA;

function critBadge(c) {{
    if (c === 'CRITICAL') return '<span class="badge badge-risk">CRITIQUE</span>';
    if (c === 'HIGH') return '<span class="badge badge-block">HAUTE</span>';
    if (c === 'MEDIUM') return '<span class="badge badge-pass">MOYENNE</span>';
    return '<span class="badge badge-pass">BASSE</span>';
}}

function foundBadge(f) {{
    return f ? '<span class="badge badge-pass">OUI</span>' : '<span class="badge badge-block">NON</span>';
}}

function esc(s) {{
    const d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
}}

function truncate(s, n) {{
    if (!s) return '';
    return s.length > n ? s.substring(0, n) + '...' : s;
}}

function applyFilters() {{
    const product = document.getElementById('filter-product').value;
    const country = document.getElementById('filter-country').value;
    const crit = document.getElementById('filter-criticality').value;
    const found = document.getElementById('filter-found').value;
    const search = document.getElementById('filter-search').value.toLowerCase();

    filteredData = DATA.filter(r => {{
        if (product && r.product !== product) return false;
        if (country && r.country !== country) return false;
        if (crit && r.criticality !== crit) return false;
        if (found === 'true' && !r.found) return false;
        if (found === 'false' && r.found) return false;
        if (search) {{
            const hay = (r.product + ' ' + r.country + ' ' + r.regulation + ' ' + r.ref + ' ' + r.authority + ' ' + r.requirements).toLowerCase();
            if (!hay.includes(search)) return false;
        }}
        return true;
    }});

    currentPage = 0;
    renderTable();
}}

function renderTable() {{
    const tbody = document.getElementById('full-table-body');
    const start = 0;
    const end = Math.min((currentPage + 1) * PAGE_SIZE, filteredData.length);
    const slice = filteredData.slice(start, end);

    let html = '';
    for (const r of slice) {{
        html += '<tr>' +
            '<td style="font-weight:500;color:var(--c-text);white-space:nowrap">' + esc(r.product) + '</td>' +
            '<td style="white-space:nowrap"><span style="font-weight:600;color:var(--c-blue);margin-right:4px">' + esc(r.country_code) + '</span><span style="color:var(--c-text-2)">' + esc(r.country) + '</span></td>' +
            '<td style="max-width:200px;color:var(--c-text)">' + esc(truncate(r.regulation, 60)) + '</td>' +
            '<td style="font-size:12px;color:var(--c-text-2)">' + esc(r.ref) + '</td>' +
            '<td style="font-size:12px;color:var(--c-text-3);max-width:120px">' + esc(truncate(r.authority, 40)) + '</td>' +
            '<td style="font-size:12px;color:var(--c-text-3);max-width:220px">' + esc(truncate(r.requirements, 80)) + '</td>' +
            '<td>' + critBadge(r.criticality) + '</td>' +
            '<td>' + foundBadge(r.found) + '</td>' +
            '</tr>';
    }}

    tbody.innerHTML = html;

    const info = document.getElementById('table-info');
    info.textContent = filteredData.length + ' resultats affiches' + (filteredData.length > end ? ' (scroll ou reduire le filtre)' : '');

    // Lazy load more on scroll
    if (filteredData.length > end) {{
        info.textContent += ' — affichage ' + end + ' sur ' + filteredData.length;
    }}
}}

// Infinite scroll for the table
document.querySelector('#full-table').closest('div[style*="overflow"]').addEventListener('scroll', function(e) {{
    const el = e.target;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {{
        const prevEnd = (currentPage + 1) * PAGE_SIZE;
        if (prevEnd < filteredData.length) {{
            currentPage++;
            // Append new rows
            const start = currentPage * PAGE_SIZE;
            const end = Math.min(start + PAGE_SIZE, filteredData.length);
            const slice = filteredData.slice(start, end);
            const tbody = document.getElementById('full-table-body');
            let html = '';
            for (const r of slice) {{
                html += '<tr>' +
                    '<td style="font-weight:500;color:var(--c-text);white-space:nowrap">' + esc(r.product) + '</td>' +
                    '<td style="white-space:nowrap"><span style="font-weight:600;color:var(--c-blue);margin-right:4px">' + esc(r.country_code) + '</span><span style="color:var(--c-text-2)">' + esc(r.country) + '</span></td>' +
                    '<td style="max-width:200px;color:var(--c-text)">' + esc(truncate(r.regulation, 60)) + '</td>' +
                    '<td style="font-size:12px;color:var(--c-text-2)">' + esc(r.ref) + '</td>' +
                    '<td style="font-size:12px;color:var(--c-text-3);max-width:120px">' + esc(truncate(r.authority, 40)) + '</td>' +
                    '<td style="font-size:12px;color:var(--c-text-3);max-width:220px">' + esc(truncate(r.requirements, 80)) + '</td>' +
                    '<td>' + critBadge(r.criticality) + '</td>' +
                    '<td>' + foundBadge(r.found) + '</td>' +
                    '</tr>';
            }}
            tbody.insertAdjacentHTML('beforeend', html);
            const info = document.getElementById('table-info');
            info.textContent = filteredData.length + ' resultats — affichage ' + Math.min(end, filteredData.length) + ' sur ' + filteredData.length;
        }}
    }}
}});

// Initial render
applyFilters();
</script>

</body>
</html>'''

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(html_content, encoding="utf-8")
    print(f"Dashboard written to {OUT_PATH}")
    print(f"Size: {OUT_PATH.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()

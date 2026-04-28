import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import { COUNTRY_META, SUPRANATIONAL, flagFromIso2 } from "./countries-meta.mjs";
import { classifyDomains, DOMAIN_CODES } from "./classify-domain.mjs";
import { extractVolume } from "./extract-volume.mjs";
import { DOMAIN_GROUPS, DOMAIN_GROUP_ORDER } from "./domain-groups.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const MANIFEST = path.join(ROOT, "manifest.yaml");
const OUT_DIR = path.join(ROOT, "public", "data");
const OUT_FILE = path.join(OUT_DIR, "manifest.json");

const STATUSES = ["complete", "blocked", "planned", "needs_research", "new"];
const DATA_TYPES = ["legislation", "case_law", "doctrine", "parliamentary_proceedings"];

const raw = yaml.load(fs.readFileSync(MANIFEST, "utf8"));
const sources = (raw?.sources ?? []).filter((s) => s && s.id);

const grouped = new Map();
for (const s of sources) {
  // YAML parses bare "NO" as boolean false — recover country from id prefix.
  let code = s.country;
  if (code === false || code === true || !code) {
    const prefix = String(s.id).split("/")[0];
    code = prefix || "UNK";
  }
  if (!grouped.has(code)) grouped.set(code, []);
  const enriched = {
    id: s.id,
    name: s.name ?? s.id,
    country: code,
    status: STATUSES.includes(s.status) ? s.status : "planned",
    data_types: Array.isArray(s.data_types) ? s.data_types.filter((t) => DATA_TYPES.includes(t)) : [],
    url: s.url ?? "",
    auth: s.auth ?? null,
    priority: typeof s.priority === "number" ? s.priority : null,
    notes: s.notes ?? null,
    blocked_reason: s.blocked_reason ?? null,
    preferred_for: Array.isArray(s.preferred_for) ? s.preferred_for : null,
    domains: [],
    estimatedVolume: extractVolume(s.notes),
  };
  enriched.domains = classifyDomains(enriched);
  grouped.get(code).push(enriched);
}

function meta(code) {
  if (SUPRANATIONAL[code]) return SUPRANATIONAL[code];
  const m = COUNTRY_META[code];
  if (m) return { ...m, flag: flagFromIso2(code) };
  return { name: code, flag: "\u{1F3F4}", lat: null, lng: null };
}

const countries = [];
for (const [code, list] of grouped) {
  const m = meta(code);
  const byStatus = Object.fromEntries(STATUSES.map((s) => [s, 0]));
  const byDataType = Object.fromEntries(DATA_TYPES.map((d) => [d, 0]));
  const byDomain = Object.fromEntries(DOMAIN_CODES.map((d) => [d, 0]));
  const byGroup = Object.fromEntries(DOMAIN_GROUP_ORDER.map((g) => [g, 0]));
  let countryVolume = 0;
  let countryVolumeKnown = 0;
  for (const s of list) {
    byStatus[s.status] = (byStatus[s.status] || 0) + 1;
    for (const d of s.data_types) byDataType[d] = (byDataType[d] || 0) + 1;
    for (const d of s.domains) byDomain[d] = (byDomain[d] || 0) + 1;
    // a source counts ONCE per group even if it has several domains within it
    const groups = new Set();
    for (const d of s.domains) {
      for (const g of DOMAIN_GROUP_ORDER) {
        if (DOMAIN_GROUPS[g].includes(d)) groups.add(g);
      }
    }
    for (const g of groups) byGroup[g] += 1;
    if (s.estimatedVolume) {
      countryVolume += s.estimatedVolume;
      countryVolumeKnown += 1;
    }
  }
  list.sort((a, b) => {
    const order = { complete: 0, blocked: 1, planned: 2, needs_research: 3, new: 4 };
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];
    return a.name.localeCompare(b.name);
  });
  const completion = list.length === 0 ? 0 : byStatus.complete / list.length;
  countries.push({
    code,
    name: m.name,
    flag: m.flag,
    lat: m.lat,
    lng: m.lng,
    total: list.length,
    byStatus,
    byDataType,
    byDomain,
    byGroup,
    estimatedVolume: countryVolume,
    sourcesWithVolume: countryVolumeKnown,
    sources: list,
    completion,
  });
}

countries.sort((a, b) => b.total - a.total);

const stats = {
  totalSources: sources.length,
  totalCountries: countries.length,
  byStatus: Object.fromEntries(STATUSES.map((s) => [s, 0])),
  byDataType: Object.fromEntries(DATA_TYPES.map((d) => [d, 0])),
  byDomain: Object.fromEntries(DOMAIN_CODES.map((d) => [d, 0])),
  byGroup: Object.fromEntries(DOMAIN_GROUP_ORDER.map((g) => [g, 0])),
  estimatedTotalVolume: 0,
  sourcesWithVolume: 0,
  generatedAt: new Date().toISOString(),
};
for (const c of countries) {
  for (const s of STATUSES) stats.byStatus[s] += c.byStatus[s];
  for (const d of DATA_TYPES) stats.byDataType[d] += c.byDataType[d];
  for (const d of DOMAIN_CODES) stats.byDomain[d] += c.byDomain[d];
  for (const g of DOMAIN_GROUP_ORDER) stats.byGroup[g] += c.byGroup[g];
  stats.estimatedTotalVolume += c.estimatedVolume;
  stats.sourcesWithVolume += c.sourcesWithVolume;
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify({ stats, countries }));

const missingMeta = countries.filter((c) => c.lat === null);
console.log(
  `built ${OUT_FILE} — ${stats.totalSources} sources / ${stats.totalCountries} jurisdictions` +
    (missingMeta.length ? ` (${missingMeta.length} without coordinates: ${missingMeta.map((c) => c.code).join(",")})` : "")
);

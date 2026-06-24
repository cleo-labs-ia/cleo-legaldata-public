/**
 * Regenerates the Cleo Comply monitoring-coverage snapshot under
 * public/data/coverage-*.json from the live view
 * `mv_produit_hs_reg_autorite` (cleo-comply Supabase tuzjcmvlclpfuroqnuis).
 *
 * The public vitrine ships NO Supabase credential, so this is a MANUAL /
 * opt-in regenerator, not a build step. It shells out to `psql` (no new npm
 * dep) and SOFT-FAILS when the DB is unreachable or the password is absent —
 * the committed snapshot (a dated number) then survives untouched, mirroring
 * scripts/sync-live-stats.mjs.
 *
 * Usage:
 *   SUPABASE_DB_PASSWORD=… node scripts/build-coverage-data.mjs
 *   # or it will read the password from ~/cleo-comply/.env as a local fallback
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { COUNTRY_META, SUPRANATIONAL, flagFromIso2 } from "./countries-meta.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.join(ROOT, "public", "data");

const HOST = "aws-0-eu-west-3.pooler.supabase.com";
const PORT = "5432";
const USER = "postgres.tuzjcmvlclpfuroqnuis";

function dbPassword() {
  if (process.env.SUPABASE_DB_PASSWORD) return process.env.SUPABASE_DB_PASSWORD.trim();
  try {
    const env = fs.readFileSync(path.join(os.homedir(), "cleo-comply", ".env"), "utf8");
    const m = env.match(/^SUPABASE_DB_PASSWORD=(.*)$/m);
    if (m) return m[1].replace(/^["']|["']$/g, "").trim();
  } catch {
    /* no local env — handled by caller */
  }
  return null;
}

const QUERIES = {
  "coverage-totals.json": `select json_build_object(
    'rows', count(*),
    'hs6', count(distinct hs6),
    'familles', count(distinct famille),
    'archetypes', count(distinct archetype),
    'sous', count(distinct sous),
    'marches', count(distinct marche),
    'regs', count(distinct reglementation),
    'autorites', count(distinct autorite),
    'domaines', count(distinct domaine_autorite),
    'rss_rows', count(*) filter (where rss_feed is not null),
    'capture_pct', round(100.0*count(*) filter (where rss_feed is not null)/count(*),1)::float,
    'hs6_with_rss', count(distinct hs6) filter (where rss_feed is not null),
    'marches_with_rss', count(distinct marche) filter (where rss_feed is not null),
    'as_of', to_char(now() at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS"Z"')
  ) from mv_produit_hs_reg_autorite;`,

  "coverage-markets.json": `select coalesce(json_agg(t order by t.r desc),'[]') from (
    select marche c, count(*) r, count(distinct hs6) h, count(distinct reglementation) g,
      count(distinct autorite) a, count(*) filter (where rss_feed is not null) s,
      round(100.0*count(*) filter (where rss_feed is not null)/count(*),1)::float p
    from mv_produit_hs_reg_autorite group by marche) t;`,

  "coverage-archetypes.json": `select coalesce(json_agg(t order by t.h desc),'[]') from (
    select famille f, archetype k, count(distinct hs6) h, count(distinct reglementation) g,
      count(distinct autorite) a, count(distinct marche) m,
      round(100.0*count(*) filter (where rss_feed is not null)/count(*),1)::float p
    from mv_produit_hs_reg_autorite where archetype is not null group by famille, archetype) t;`,

  "coverage-matrix.json": `select coalesce(json_agg(t),'[]') from (
    select archetype k, marche c, count(*) r, count(distinct reglementation) g, count(distinct autorite) a,
      round(100.0*count(*) filter (where rss_feed is not null)/count(*),1)::float p
    from mv_produit_hs_reg_autorite where archetype is not null group by archetype, marche) t;`,

  "coverage-authorities.json": `select coalesce(json_agg(t order by t.g desc),'[]') from (
    select autorite n, min(domaine_autorite) d, count(distinct reglementation) g,
      count(distinct marche) m, count(distinct archetype) k, bool_or(rss_feed is not null) cap
    from mv_produit_hs_reg_autorite where autorite is not null group by autorite) t;`,

  "coverage-archetype-authorities.json": `select coalesce(json_agg(t),'[]') from (
    select archetype k, autorite n, min(domaine_autorite) d, count(distinct reglementation) g,
      bool_or(rss_feed is not null) cap
    from mv_produit_hs_reg_autorite where archetype is not null and autorite is not null group by archetype, autorite) t;`,

  "coverage-hs6.json": `select coalesce(json_agg(t order by t.h),'[]') from (
    select hs6 h, min(hs6_description) d, min(famille) f, min(archetype) k, min(sous) s,
      count(distinct reglementation) g, count(distinct marche) m, count(distinct autorite) a,
      bool_or(rss_feed is not null) rss
    from mv_produit_hs_reg_autorite group by hs6) t;`,
};

/** 12 markets / blocs missing from countries-meta.mjs */
const GEO_OVERRIDES = {
  INT: { name: "International / Global", lat: 15, lng: 0, flag: "\u{1F310}", bloc: true },
  GCC: { name: "Gulf Cooperation Council", lat: 24, lng: 45, flag: "\u{1F310}", bloc: true },
  EAEU: { name: "Eurasian Economic Union", lat: 55, lng: 73, flag: "\u{1F310}", bloc: true },
  ASEAN: { name: "ASEAN", lat: 4, lng: 108, flag: "\u{1F310}", bloc: true },
  EU: { name: "European Union", lat: 50.1, lng: 9.7, flag: "\u{1F1EA}\u{1F1FA}", bloc: true },
  GB: { name: "United Kingdom", lat: 54.0, lng: -2.5, flag: flagFromIso2("GB"), bloc: false },
  BI: { name: "Burundi", lat: -3.4, lng: 29.9, flag: flagFromIso2("BI"), bloc: false },
  AG: { name: "Antigua and Barbuda", lat: 17.1, lng: -61.8, flag: flagFromIso2("AG"), bloc: false },
  DM: { name: "Dominica", lat: 15.4, lng: -61.4, flag: flagFromIso2("DM"), bloc: false },
  KN: { name: "Saint Kitts and Nevis", lat: 17.3, lng: -62.7, flag: flagFromIso2("KN"), bloc: false },
  GW: { name: "Guinea-Bissau", lat: 11.8, lng: -15.2, flag: flagFromIso2("GW"), bloc: false },
  GD: { name: "Grenada", lat: 12.1, lng: -61.7, flag: flagFromIso2("GD"), bloc: false },
  GQ: { name: "Equatorial Guinea", lat: 1.6, lng: 10.3, flag: flagFromIso2("GQ"), bloc: false },
};

function buildGeo(marketCodes) {
  const out = {};
  const missing = [];
  for (const c of marketCodes) {
    if (GEO_OVERRIDES[c]) {
      const o = GEO_OVERRIDES[c];
      out[c] = { name: o.name, lat: o.lat, lng: o.lng, flag: o.flag, bloc: o.bloc };
    } else if (SUPRANATIONAL[c]) {
      const s = SUPRANATIONAL[c];
      out[c] = { name: s.name, lat: s.lat, lng: s.lng, flag: s.flag || "\u{1F310}", bloc: true };
    } else if (COUNTRY_META[c] && COUNTRY_META[c].lat != null) {
      const m = COUNTRY_META[c];
      out[c] = { name: m.name, lat: m.lat, lng: m.lng, flag: flagFromIso2(c), bloc: false };
    } else {
      missing.push(c);
    }
  }
  if (missing.length) console.warn(`[coverage] no centroid for: ${missing.join(", ")}`);
  return out;
}

const pw = dbPassword();
if (!pw) {
  console.warn("[coverage] SUPABASE_DB_PASSWORD unavailable — keeping committed snapshot.");
  process.exit(0);
}

const conn = `host=${HOST} port=${PORT} user=${USER} dbname=postgres sslmode=require`;
fs.mkdirSync(OUT, { recursive: true });

try {
  for (const [file, sql] of Object.entries(QUERIES)) {
    const out = execFileSync("psql", [conn, "-t", "-A", "-X", "-q", "-c", sql], {
      env: { ...process.env, PGPASSWORD: pw },
      maxBuffer: 64 * 1024 * 1024,
    })
      .toString()
      .trim();
    JSON.parse(out); // validate
    fs.writeFileSync(path.join(OUT, file), out);
    console.log(`[coverage] wrote ${file}`);
  }
  const markets = JSON.parse(fs.readFileSync(path.join(OUT, "coverage-markets.json"), "utf8"));
  const geo = buildGeo(markets.map((m) => m.c));
  fs.writeFileSync(path.join(OUT, "coverage-geo.json"), JSON.stringify(geo));
  console.log(`[coverage] wrote coverage-geo.json (${Object.keys(geo).length} markets)`);
} catch (e) {
  console.warn(`[coverage] regeneration failed (${e.message}) — keeping committed snapshot.`);
  process.exit(0);
}

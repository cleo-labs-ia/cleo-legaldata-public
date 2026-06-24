/* ================================================================
   Cleo Comply — live monitoring coverage snapshot.

   Source: view `mv_produit_hs_reg_autorite` in the cleo-comply
   Supabase project (tuzjcmvlclpfuroqnuis). Aggregated to static
   JSON by scripts/build-coverage-data.mjs and committed under
   public/data/. This is a DIFFERENT scope from /products (which
   reports the legal-api catalog of 46,031 product regulations):
   here we report the product -> HS -> regulation -> AUTHORITY
   monitoring chain and how much of it we capture live (RSS feed).
   ================================================================ */

export interface CoverageTotals {
  rows: number;
  hs6: number;
  familles: number;
  archetypes: number;
  sous: number;
  marches: number;
  regs: number;
  autorites: number;
  domaines: number;
  rss_rows: number;
  capture_pct: number;
  hs6_with_rss: number;
  marches_with_rss: number;
  as_of: string;
}

/** one market (country or trade bloc) */
export interface CovMarket {
  c: string; // code (ISO2 or bloc: EU/INT/GCC/EAEU/ASEAN)
  r: number; // rows
  h: number; // distinct hs6
  g: number; // distinct regulations
  a: number; // distinct authorities
  s: number; // rows with a live feed
  p: number; // capture % (s/r)
}

/** one (famille, archetype) product node */
export interface CovArchetype {
  f: string; // famille
  k: string; // archetype
  h: number; // distinct hs6
  g: number; // distinct regulations
  a: number; // distinct authorities
  m: number; // distinct markets
  p: number; // capture %
}

/** one archetype x market cell */
export interface CovMatrixCell {
  k: string; // archetype
  c: string; // market
  r: number; // rows
  g: number; // regulations
  a: number; // authorities
  p: number; // capture %
}

/** one enforcement authority */
export interface CovAuthority {
  n: string; // name
  d: string | null; // domain
  g: number; // regulations
  m: number; // markets
  k: number; // archetypes
  cap: boolean; // captured live (has any feed)
}

/** one archetype -> authority link */
export interface CovArchAuthority {
  k: string; // archetype
  n: string; // authority name
  d: string | null; // domain
  g: number; // regulations
  cap: boolean; // captured live
}

/** one HS6 product line */
export interface CovHs6 {
  h: string; // hs6 code
  d: string; // description
  f: string; // famille
  k: string; // archetype
  s: string; // sous-archetype
  g: number; // regulations
  m: number; // markets
  a: number; // authorities
  rss: boolean; // monitored live
}

export interface CovGeoEntry {
  name: string;
  lat: number;
  lng: number;
  flag: string;
  bloc: boolean;
}
export type CovGeo = Record<string, CovGeoEntry>;

export interface CoverageData {
  totals: CoverageTotals;
  markets: CovMarket[];
  archetypes: CovArchetype[];
  matrix: CovMatrixCell[];
  authorities: CovAuthority[];
  archetypeAuthorities: CovArchAuthority[];
  hs6: CovHs6[];
  geo: CovGeo;
}

/* ── shared presentation helpers ── */

/** capture-rate colour scale (traffic light): >=40% green, 5-40% orange, <5% red */
export function captureColor(pct: number): string {
  if (pct >= 40) return "#1a8a4a"; // green — well monitored
  if (pct >= 5) return "#e8820e"; // orange — partial
  return "#c4302b"; // red — < 5%, blind spot (includes 0)
}

export function captureTier(pct: number): "high" | "medium" | "low" {
  if (pct >= 40) return "high";
  if (pct >= 5) return "medium";
  return "low";
}

/** prettify a kebab-case taxonomy slug into a label */
export function pretty(slug: string): string {
  if (!slug) return "—";
  return slug
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bAnd\b/g, "&");
}

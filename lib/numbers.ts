/**
 * Single source of truth for every quantitative claim on the site.
 * Update here → everything stays consistent across landing, atlases, docs, pricing, playground.
 */

import type { Lang } from "./i18n";

export const NUMBERS = {
  // Legal Atlas (general / cross-topic)
  legalRegulations: 210_508,
  legalDocuments: 1_940_751,
  legalSources: 1494,
  legalJurisdictions: 177,
  legalAuthorities: 55_924,

  // Source coverage breakdown (used for honest coverage statement)
  sourcesComplete: 665,
  sourcesBlocked: 480,
  sourcesPlanned: 236 + 76 + 37, // planned + needs_research + new = 349

  // Legal Product Physical Atlas (specialised for products)
  productRegsPlatform: 46_031,
  productCategories: 20,
  productJurisdictions: 103,
  productRegsAudited: 4_034,
  productRegsInApi: 3_591,
  productCoveragePct: 89,
} as const;

/* ─── formatters ─── */

export function fmt(n: number, lang: Lang): string {
  return n.toLocaleString(lang === "fr" ? "fr-FR" : "en-US");
}

/**
 * Compact format for hero KPIs: 1.94M, 234M, 1,494, etc.
 */
export function fmtCompact(n: number, lang: Lang): string {
  if (n >= 1_000_000_000) {
    const v = n / 1_000_000_000;
    return `${v.toFixed(1).replace(".", lang === "fr" ? "," : ".")}B`;
  }
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return v >= 100
      ? `${Math.round(v)}M`
      : `${v.toFixed(1).replace(".", lang === "fr" ? "," : ".")}M`;
  }
  if (n >= 10_000) return `${Math.round(n / 1000)}k`;
  return fmt(n, lang);
}

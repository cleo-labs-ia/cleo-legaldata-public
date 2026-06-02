/**
 * Single source of truth for every quantitative claim on the site.
 * Update here → everything stays consistent across landing, atlases, docs, pricing, playground.
 */

import type { Lang } from "./i18n";

/**
 * Numbers below are verified against:
 *   - legal-sources / local manifest.yaml (for sources, jurisdictions, source status)
 *   - Supabase production DB (for regulations / documents / authorities / articles)
 * Last verified: 2026-06-02
 */
export const NUMBERS = {
  // Legal Atlas — Sources tracked (from manifest.yaml)
  legalSources: 1494,
  legalJurisdictions: 177,
  sourcesComplete: 665,
  sourcesBlocked: 480,
  sourcesPlanned: 236 + 76 + 37, // planned + needs_research + new = 349

  // Legal Atlas — What we actually scraped & extracted (Supabase live)
  legalDocuments: 1_942_111, // legal_documents table
  legalRegulations: 211_369, // regulations table
  legalArticles: 135_583, // regulation_articles
  legalEnrichedArticles: 413_820, // enriched_articles
  legalChunks: 332_421, // legal_document_chunks (RAG)
  legalAuthorities: 46_428, // distinct enforcement_body in regulations
  legalCountriesWithRegs: 90, // distinct origin_country_code in regulations
  // Estimated volume declared by source portals (Légifrance says 50M, EUR-Lex says 10M…)
  legalDeclaredVolume: 234_502_471,

  // Legal Product Physical Atlas
  productRegsPlatform: 46_031,
  productCategories: 20,
  productJurisdictions: 103,
  productRegsAudited: 4_034,
  productRegsInApi: 3_591,
  productCoveragePct: 89,
  productsTrackedInComply: 2_970, // org_products live
  productRegArticles: 54_630, // product_regulation_articles
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

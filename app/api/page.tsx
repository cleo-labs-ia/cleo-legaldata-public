"use client";

import Link from "next/link";
import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import { STRINGS } from "@/lib/i18n";

const CONTACT_EMAIL = "contact@cleo.academy";

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/v1/catalog/stats",
    fr: "Compteurs globaux : 1 479 sources, 177 juridictions, 234M+ documents recensés, breakdowns par statut, type de document et catégorie.",
    en: "Global counters: 1,479 sources, 177 jurisdictions, 234M+ recensed documents, breakdowns by status, data type and category.",
  },
  {
    method: "GET",
    path: "/api/v1/catalog/sources",
    fr: "Liste paginée de toutes les sources du catalogue. Filtres : country, status, data_type, category, q (recherche texte).",
    en: "Paginated list of every catalog source. Filters: country, status, data_type, category, q (free-text search).",
  },
  {
    method: "GET",
    path: "/api/v1/catalog/sources/{id}",
    fr: "Détail complet d'une source (notes, raison de blocage, volume estimé, classification…).",
    en: "Full detail for a single source (notes, blocked reason, estimated volume, classification…).",
  },
  {
    method: "GET",
    path: "/api/v1/catalog/jurisdictions",
    fr: "Liste paginée des 177 juridictions avec compteurs agrégés (total sources, taux de couverture, volume estimé).",
    en: "Paginated list of all 177 jurisdictions with aggregated counters (total sources, coverage ratio, estimated volume).",
  },
  {
    method: "GET",
    path: "/api/v1/catalog/jurisdictions/{code}",
    fr: "Détail d'une juridiction. Ajoute ?include_sources=true pour embarquer la liste complète des sources de la juridiction.",
    en: "Detail of a jurisdiction. Add ?include_sources=true to embed the full list of its sources.",
  },
  {
    method: "GET",
    path: "/api/v1/catalog/categories",
    fr: "Les 7 catégories réglementaires : IA & Données, Santé & Sécurité, Finance & Marchés, Travail & Fiscal, Environnement, PI & Médias, Généraliste.",
    en: "The 7 regulatory categories: AI & Data, Health & Safety, Finance & Markets, Labor & Tax, Environment, IP & Media, Generalist.",
  },
];

function buildMailto(lang: Lang): string {
  const subject =
    lang === "fr"
      ? "Demande d'accès à l'API Cleo Legal Data"
      : "Cleo Legal Data API access request";
  const body =
    lang === "fr"
      ? `Bonjour,\n\nJe souhaite accéder à l'API Cleo Legal Data.\n\n— Société :\n— Cas d'usage :\n— Volume estimé (requêtes/mois) :\n— Plan envisagé (Pro / Enterprise) :\n\nMerci !`
      : `Hello,\n\nI'd like access to the Cleo Legal Data API.\n\n— Company:\n— Use case:\n— Estimated volume (requests/month):\n— Plan considered (Pro / Enterprise):\n\nThanks!`;
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function ApiDocsPage() {
  const [lang, setLang] = useState<Lang>("fr");

  return (
    <div className="min-h-screen bg-c-bg pb-20">
      <header className="border-b border-c-border bg-c-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
          <Link href="/" className="flex items-center gap-3 text-c-text hover:text-c-brand">
            <img
              src="/cleo-icon.svg"
              alt="Cleo"
              width={36}
              height={36}
              className="h-9 w-9 rounded-md"
            />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">{STRINGS.brand[lang]}</div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-c-text-subtle">
                ← {STRINGS.apiBackToAtlas[lang]}
              </div>
            </div>
          </Link>
          <div className="flex rounded-md border border-c-border bg-c-surface p-0.5 text-[11px] font-medium">
            {(["fr", "en"] as Lang[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`rounded px-2 py-0.5 transition-colors ${
                  lang === l ? "bg-c-brand text-white" : "text-c-text-muted hover:text-c-text"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pt-12">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-c-border bg-c-surface px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-c-text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-c-brand" />
          {STRINGS.apiCalloutEyebrow[lang]}
        </div>
        <h1 className="font-display text-4xl font-light leading-tight tracking-tight md:text-5xl">
          {STRINGS.apiDocsTitle[lang]}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-c-text-muted">
          {STRINGS.apiDocsIntro[lang]}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={buildMailto(lang)}
            className="inline-flex items-center gap-2 rounded-lg bg-c-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-c-brand-ink hover:shadow"
          >
            {STRINGS.apiCtaPrimary[lang]} →
          </a>
          <a
            href="https://insight.cleolabs.co/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-c-border bg-c-surface px-5 py-2.5 text-sm font-medium text-c-text-muted hover:border-c-brand hover:text-c-brand"
          >
            OpenAPI · Swagger UI ↗
          </a>
        </div>

        {/* Authentication */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-light tracking-tight">
            {STRINGS.apiAuthHeader[lang]}
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-c-text-muted">{STRINGS.apiAuthBody[lang]}</p>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-c-border bg-c-ink-night p-4 text-xs leading-relaxed text-white/90">
            <code>
              <span className="text-white/50">$ </span>curl -H{" "}
              <span className="text-emerald-300">&quot;Authorization: Bearer cleo_live_...&quot;</span>{" "}
              \{"\n"}    https://insight.cleolabs.co/api/v1/catalog/stats
            </code>
          </pre>
        </section>

        {/* Endpoints */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-light tracking-tight">
            {STRINGS.apiEndpointsHeader[lang]}
          </h2>
          <ul className="mt-4 divide-y divide-c-border overflow-hidden rounded-xl border border-c-border bg-c-surface">
            {ENDPOINTS.map((ep) => (
              <li key={ep.path} className="px-5 py-4">
                <div className="flex items-baseline gap-3">
                  <span className="rounded bg-c-success-soft px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-c-success">
                    {ep.method}
                  </span>
                  <code className="text-sm font-medium tracking-tight text-c-text">{ep.path}</code>
                </div>
                <p className="mt-1.5 text-sm text-c-text-muted">{ep[lang]}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Example response */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-light tracking-tight">
            {lang === "fr" ? "Exemple de réponse" : "Example response"}
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-c-text-muted">
            <code className="rounded bg-c-surface-2 px-1.5 py-0.5 text-xs">GET /api/v1/catalog/stats</code>
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-c-border bg-c-ink-night p-4 text-xs leading-relaxed text-white/90">
            <code>{`{
  "total_sources": 1479,
  "total_jurisdictions": 177,
  "estimated_total_documents": 234502471,
  "sources_with_estimated_volume": 257,
  "by_status": {
    "complete": 658,
    "blocked": 480,
    "planned": 228,
    "needs_research": 76,
    "new": 37
  },
  "by_category": {
    "ai_data": 30,
    "health_safety": 13,
    "finance_markets": 70,
    "labor_tax": 161,
    "environment": 10,
    "ip_media": 31,
    "generalist": 232
  },
  "snapshot_taken_at": "2026-04-30T11:00:00Z"
}`}</code>
          </pre>
        </section>

        {/* Rate limits */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-light tracking-tight">
            {STRINGS.apiRateHeader[lang]}
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-c-text-muted">{STRINGS.apiRateBody[lang]}</p>
        </section>

        {/* Pagination */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-light tracking-tight">
            {STRINGS.apiPaginationHeader[lang]}
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-c-text-muted">{STRINGS.apiPaginationBody[lang]}</p>
        </section>

        {/* Final CTA */}
        <section className="mt-20 rounded-2xl border border-c-border bg-c-surface p-8 text-center">
          <h2 className="font-display text-2xl font-light tracking-tight">
            {STRINGS.apiCalloutTitle[lang]}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-c-text-muted">
            {STRINGS.apiCalloutBody[lang]}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={buildMailto(lang)}
              className="inline-flex items-center gap-2 rounded-lg bg-c-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-c-brand-ink"
            >
              {STRINGS.apiCtaPrimary[lang]} →
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-c-border bg-c-surface px-5 py-2.5 text-sm font-medium text-c-text-muted hover:border-c-brand hover:text-c-brand"
            >
              ← {STRINGS.apiBackToAtlas[lang]}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

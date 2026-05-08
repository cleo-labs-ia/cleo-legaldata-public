"use client";

import Link from "next/link";
import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import { STRINGS } from "@/lib/i18n";

const MEET_URL = "https://www.cleolabs.co/en/meet";

const CAPABILITIES = [
  {
    fr: { title: "Vue d'ensemble du catalogue", body: "Compteurs globaux et répartition par statut, type et catégorie réglementaire — pour piloter votre couverture en un coup d'œil." },
    en: { title: "Catalog overview", body: "Global counters and breakdowns by status, type and regulatory category — to monitor your coverage at a glance." },
  },
  {
    fr: { title: "Liste des sources", body: "Parcourir l'ensemble des sources avec des filtres simples : juridiction, statut, catégorie ou recherche texte libre." },
    en: { title: "Source listing", body: "Browse every source with simple filters: jurisdiction, status, category, or free-text search." },
  },
  {
    fr: { title: "Détail d'une source", body: "Récupérer toutes les informations d'une source : portail officiel, classification, volume estimé, notes de couverture." },
    en: { title: "Source detail", body: "Pull every detail on a single source: official portal, classification, estimated volume, coverage notes." },
  },
  {
    fr: { title: "Toutes les juridictions", body: "Lister les juridictions couvertes avec leur taux de couverture et leur volume estimé de documents." },
    en: { title: "All jurisdictions", body: "List every covered jurisdiction with its coverage ratio and estimated document volume." },
  },
  {
    fr: { title: "Détail d'une juridiction", body: "Voir le profil d'une juridiction et la liste complète des sources qui la couvrent, en un seul appel." },
    en: { title: "Jurisdiction detail", body: "Get a jurisdiction's profile and the full list of sources covering it, in a single call." },
  },
  {
    fr: { title: "Catégories réglementaires", body: "Naviguer par grande famille : IA & Données, Santé & Sécurité, Finance & Marchés, Travail & Fiscal, Environnement, PI & Médias, Généraliste." },
    en: { title: "Regulatory categories", body: "Navigate by major family: AI & Data, Health & Safety, Finance & Markets, Labor & Tax, Environment, IP & Media, Generalist." },
  },
];

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
            href={MEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-c-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-c-brand-ink hover:shadow"
          >
            {STRINGS.apiCtaPrimary[lang]} →
          </a>
        </div>

        {/* Trust signals */}
        <section className="mt-12">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {[
              { title: STRINGS.trustGdpr[lang], desc: STRINGS.trustGdprDesc[lang] },
              { title: STRINGS.trustEu[lang], desc: STRINGS.trustEuDesc[lang] },
              { title: STRINGS.trustDaily[lang], desc: STRINGS.trustDailyDesc[lang] },
              { title: STRINGS.trustSla[lang], desc: STRINGS.trustSlaDesc[lang] },
              { title: STRINGS.trustSupport[lang], desc: STRINGS.trustSupportDesc[lang] },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-c-border bg-c-surface p-4"
              >
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-c-brand">
                  ✓ {item.title}
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-c-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="mt-20">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-c-brand">
            {STRINGS.pricingHeader[lang]}
          </div>
          <h2 className="mt-1 font-display text-3xl font-light tracking-tight md:text-4xl">
            {STRINGS.pricingTitle[lang]}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-c-text-muted">
            {STRINGS.pricingSubtitle[lang]}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {/* Pro */}
            <div className="rounded-2xl border border-c-border bg-c-surface p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-2xl font-light tracking-tight">
                  {STRINGS.pricingPlanPro[lang]}
                </h3>
                <span className="rounded-full bg-c-brand-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-c-brand-ink">
                  {STRINGS.pricingCustom[lang]}
                </span>
              </div>
              <p className="mt-1 text-sm text-c-text-muted">{STRINGS.pricingPlanProTagline[lang]}</p>
              <ul className="mt-5 space-y-2 text-sm text-c-text">
                <li className="flex items-start gap-2"><span className="text-c-brand">✓</span><span>120 {lang === "fr" ? "requêtes/minute" : "requests/minute"}</span></li>
                <li className="flex items-start gap-2"><span className="text-c-brand">✓</span><span>{lang === "fr" ? "6 endpoints catalog (sources, juridictions, catégories, stats)" : "6 catalog endpoints (sources, jurisdictions, categories, stats)"}</span></li>
                <li className="flex items-start gap-2"><span className="text-c-brand">✓</span><span>{lang === "fr" ? "Authentification Bearer + clés rotables" : "Bearer auth + rotatable keys"}</span></li>
                <li className="flex items-start gap-2"><span className="text-c-brand">✓</span><span>{lang === "fr" ? "Support technique sous 1 jour ouvré" : "Tech support within 1 business day"}</span></li>
                <li className="flex items-start gap-2"><span className="text-c-brand">✓</span><span>{lang === "fr" ? "Connecteur MCP pour Claude / Cursor / agents IA" : "MCP connector for Claude / Cursor / AI agents"}</span></li>
              </ul>
              <a
                href={MEET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-c-border bg-c-surface px-4 py-2.5 text-sm font-semibold text-c-text hover:border-c-brand hover:text-c-brand"
              >
                {STRINGS.bookACall[lang]} →
              </a>
            </div>

            {/* Enterprise */}
            <div className="relative rounded-2xl border-2 border-c-brand bg-c-surface p-6 shadow-sm">
              <div className="absolute -top-3 left-6 rounded-full bg-c-brand px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                {lang === "fr" ? "Recommandé" : "Recommended"}
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-2xl font-light tracking-tight">
                  {STRINGS.pricingPlanEnt[lang]}
                </h3>
                <span className="rounded-full bg-c-brand px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                  {STRINGS.pricingCustom[lang]}
                </span>
              </div>
              <p className="mt-1 text-sm text-c-text-muted">{STRINGS.pricingPlanEntTagline[lang]}</p>
              <ul className="mt-5 space-y-2 text-sm text-c-text">
                <li className="flex items-start gap-2"><span className="text-c-brand">✓</span><span>{lang === "fr" ? "600 requêtes/minute (volumes custom au-delà)" : "600 requests/minute (custom volumes beyond)"}</span></li>
                <li className="flex items-start gap-2"><span className="text-c-brand">✓</span><span>{lang === "fr" ? "Tous les endpoints (catalog + signaux + régulations org-scoped)" : "All endpoints (catalog + signals + org-scoped regulations)"}</span></li>
                <li className="flex items-start gap-2"><span className="text-c-brand">✓</span><span>{lang === "fr" ? "SLA d'uptime contractuel" : "Contractual uptime SLA"}</span></li>
                <li className="flex items-start gap-2"><span className="text-c-brand">✓</span><span>{lang === "fr" ? "Support dédié + Slack partagé" : "Dedicated support + shared Slack"}</span></li>
                <li className="flex items-start gap-2"><span className="text-c-brand">✓</span><span>{lang === "fr" ? "DPA signé, hébergement custom possible" : "Signed DPA, custom hosting available"}</span></li>
                <li className="flex items-start gap-2"><span className="text-c-brand">✓</span><span>{lang === "fr" ? "Onboarding accompagné par notre équipe" : "Hands-on onboarding by our team"}</span></li>
              </ul>
              <a
                href={MEET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-c-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-c-brand-ink"
              >
                {STRINGS.bookACall[lang]} →
              </a>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-light tracking-tight">
            {STRINGS.apiAuthHeader[lang]}
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-c-text-muted">{STRINGS.apiAuthBody[lang]}</p>
          <ol className="mt-6 grid gap-3 md:grid-cols-3">
            {[
              { title: STRINGS.apiStepAccessTitle[lang], body: STRINGS.apiStepAccessBody[lang] },
              { title: STRINGS.apiStepCallTitle[lang], body: STRINGS.apiStepCallBody[lang] },
              { title: STRINGS.apiStepDataTitle[lang], body: STRINGS.apiStepDataBody[lang] },
            ].map((step, i) => (
              <li key={step.title} className="rounded-xl border border-c-border bg-c-surface p-5">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[11px] font-semibold tracking-wider text-c-brand">
                    0{i + 1}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-c-brand">
                    {step.title}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-c-text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* What you can do */}
        <section className="mt-16">
          <h2 className="font-display text-2xl font-light tracking-tight">
            {STRINGS.apiEndpointsHeader[lang]}
          </h2>
          <ul className="mt-4 divide-y divide-c-border overflow-hidden rounded-xl border border-c-border bg-c-surface">
            {CAPABILITIES.map((cap) => (
              <li key={cap.fr.title} className="px-5 py-4">
                <h3 className="text-sm font-semibold tracking-tight text-c-text">
                  {cap[lang].title}
                </h3>
                <p className="mt-1.5 text-sm text-c-text-muted">{cap[lang].body}</p>
              </li>
            ))}
          </ul>
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
              href={MEET_URL}
              target="_blank"
              rel="noopener noreferrer"
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

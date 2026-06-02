"use client";

import { useState } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { STRINGS } from "@/lib/i18n";
import { NUMBERS, fmt } from "@/lib/numbers";
import SiteHeader from "./SiteHeader";

const MEET_URL = "https://www.cleolabs.co/en/meet";
const SIGNUP_URL = "/api/checkout?plan=pro";

const PRODUCT_CATEGORY_IMAGES = [
  "/images/categories/family/cosmetics-personal-care.jpg",
  "/images/categories/family/electronics-telecom.jpg",
  "/images/categories/family/toys.jpg",
  "/images/categories/family/medical-devices.jpg",
  "/images/categories/family/food-supplements.jpg",
  "/images/categories/family/textile-apparel.jpg",
  "/images/categories/family/pharmaceuticals.jpg",
  "/images/categories/family/household-chemicals.jpg",
];

export default function HomeChooser() {
  const [lang, setLang] = useState<Lang>("en");

  const T = {
    heroEyebrow: { fr: "Cleo Legal Data API", en: "Cleo Legal Data API" },
    heroTitleA: { fr: "Le droit du monde,", en: "The world's law," },
    heroTitleB: { fr: "par une API.", en: "via one API." },
    heroSub: {
      fr: `Une API REST + connecteur MCP pour interroger ${fmt(NUMBERS.productRegsPlatform, "fr")} réglementations produit et ${fmt(NUMBERS.legalRegulations, "fr")} régulations légales dans ${NUMBERS.legalJurisdictions} juridictions — depuis votre produit, vos pipelines de veille, ou vos agents IA.`,
      en: `A REST API + MCP connector to query ${fmt(NUMBERS.productRegsPlatform, "en")} product regulations and ${fmt(NUMBERS.legalRegulations, "en")} legal regulations across ${NUMBERS.legalJurisdictions} jurisdictions — from your product, monitoring pipelines, or AI agents.`,
    },
    kpiProduct: { fr: "régs produit", en: "product regs" },
    kpiLegal: { fr: "régs légales", en: "legal regs" },
    kpiJurisdictions: { fr: "juridictions", en: "jurisdictions" },
    kpiDocs: { fr: "documents juridiques", en: "legal documents" },
    ctaBookCall: { fr: "Prendre un call", en: "Book a call" },
    ctaSeeDocs: { fr: "Voir la doc", en: "See the docs" },

    howTitle: { fr: "Comment fonctionne l'API", en: "How the API works" },
    howSub: {
      fr: "Trois étapes pour brancher Cleo dans votre stack, sans gestion d'infrastructure ni rafraîchissement manuel des données.",
      en: "Three steps to plug Cleo into your stack, no infrastructure or manual refresh.",
    },
    codeTitle: { fr: "Un appel · un résultat", en: "One call · one result" },
    codeSub: {
      fr: "Filtrez par juridiction, par catégorie produit, ou par autorité émettrice. Pagination, webhooks et MCP inclus.",
      en: "Filter by jurisdiction, product category, or enforcement body. Pagination, webhooks and MCP included.",
    },

    playgroundEyebrow: { fr: "Playground", en: "Playground" },
    playgroundTitle: {
      fr: "Composez votre appel en 30 secondes.",
      en: "Compose your call in 30 seconds.",
    },
    playgroundSub: {
      fr: "Choisissez un endpoint, ajustez les filtres, copiez le curl ou voyez la réponse type. Aucune clé requise pour tester.",
      en: "Pick an endpoint, tune the filters, copy the curl or see the sample response. No API key required to try.",
    },
    playgroundFeat1: { fr: "5 endpoints prêts", en: "5 ready endpoints" },
    playgroundFeat1Desc: {
      fr: "regulations · sources · jurisdictions · product-categories · product/check",
      en: "regulations · sources · jurisdictions · product-categories · product/check",
    },
    playgroundFeat2: { fr: "curl généré en live", en: "Live curl generation" },
    playgroundFeat2Desc: {
      fr: "Avec authentification, query strings et JSON body — copiez-collez dans votre terminal.",
      en: "With authentication, query strings and JSON body — paste right into your terminal.",
    },
    playgroundFeat3: { fr: "Réponse type complète", en: "Full sample response" },
    playgroundFeat3Desc: {
      fr: "Voyez la forme exacte du JSON avant même d'écrire une ligne de code côté client.",
      en: "See the exact JSON shape before writing a line of client-side code.",
    },
    openPlayground: { fr: "Ouvrir le playground", en: "Open the playground" },

    coveragesEyebrow: { fr: "Trois coverages, une API", en: "Three coverages, one API" },
    coveragesTitle: {
      fr: "Choisissez votre atlas",
      en: "Pick your atlas",
    },
    coveragesSub: {
      fr: "Le même catalogue, trois points de vue : transverse (toute thématique), conformité produit physique, ou douane & HS code.",
      en: "Same catalog, three viewpoints: cross-topic (all subjects), physical-product compliance, or customs & HS code.",
    },

    pricingEyebrow: { fr: "Tarification", en: "Pricing" },
    pricingTitle: {
      fr: "Cinq plans, mêmes prix sur les trois atlas",
      en: "Five plans, same prices across all three atlases",
    },
    pricingSub: {
      fr: "Démarrez gratuitement, montez en charge progressivement. Pas d'engagement annuel obligatoire.",
      en: "Start free, scale up gradually. No mandatory annual commitment.",
    },
    seePricing: { fr: "Voir tous les plans", en: "See all plans" },

    trustTitle: { fr: "Garanties", en: "Guarantees" },
  };

  const t = (key: keyof typeof T) => T[key][lang];

  return (
    <div className="min-h-screen bg-c-bg">
      <SiteHeader lang={lang} setLang={setLang} active={null} />

      <main className="mx-auto max-w-7xl px-6 pb-20">
        {/* ── 1. HERO ── */}
        <section className="mx-auto max-w-4xl pt-16 pb-10 text-center md:pt-24 md:pb-14">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-c-border bg-c-surface px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-c-text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-c-brand" />
            {t("heroEyebrow")}
          </div>
          <h1 className="t-display">
            {t("heroTitleA")}{" "}
            <span className="italic text-c-brand">{t("heroTitleB")}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl t-body">
            {t("heroSub")}
          </p>

          {/* CTAs — primary self-serve, secondary talk to team */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href={SIGNUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              {lang === "fr" ? "Obtenir une clé API" : "Get API key"} →
            </a>
            <Link
              href="/docs"
              className="btn btn-secondary"
            >
              {t("ctaSeeDocs")} →
            </Link>
            <a
              href={MEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-c-text-subtle underline-offset-2 hover:text-c-brand hover:underline"
            >
              {lang === "fr" ? "ou parler à l'équipe" : "or talk to the team"}
            </a>
          </div>

          {/* 4 combined KPIs */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Kpi value={fmt(NUMBERS.productRegsPlatform, lang)} label={t("kpiProduct")} accent />
            <Kpi value={fmt(NUMBERS.legalRegulations, lang)} label={t("kpiLegal")} />
            <Kpi value={fmt(NUMBERS.legalJurisdictions, lang)} label={t("kpiJurisdictions")} />
            <Kpi value="1.9M+" label={t("kpiDocs")} />
          </div>
        </section>

        {/* ── 2. HOW THE API WORKS ── */}
        <section className="mt-8 rounded-3xl border border-c-border bg-c-surface p-8 md:p-12">
          <div className="text-center">
            <h2 className="t-h1">
              {t("howTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-c-text-muted">
              {t("howSub")}
            </p>
          </div>

          {/* 3 steps */}
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <Step
              n={1}
              title={STRINGS.apiStepAccessTitle[lang]}
              body={STRINGS.apiStepAccessBody[lang]}
            />
            <Step
              n={2}
              title={STRINGS.apiStepCallTitle[lang]}
              body={STRINGS.apiStepCallBody[lang]}
            />
            <Step
              n={3}
              title={STRINGS.apiStepDataTitle[lang]}
              body={STRINGS.apiStepDataBody[lang]}
            />
          </div>

          {/* Code sample */}
          <div className="mt-10">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-c-text-subtle">
                {t("codeTitle")}
              </h3>
              <span className="text-[11px] font-medium text-c-text-subtle">
                {t("codeSub")}
              </span>
            </div>
            <div className="overflow-hidden rounded-xl border border-c-border bg-[#0b0b1a]">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/40">
                <span className="h-2 w-2 rounded-full bg-white/20" />
                <span className="h-2 w-2 rounded-full bg-white/20" />
                <span className="h-2 w-2 rounded-full bg-white/20" />
                <span className="ml-3">curl · GET /regulations</span>
              </div>
              <pre className="overflow-x-auto px-4 py-4 text-[12.5px] leading-relaxed text-white/90">
                <code>{`curl https://api.legaldata.cleolabs.co/v1/regulations \\
  -H "Authorization: Bearer $CLEO_KEY" \\
  --data-urlencode "jurisdiction=FR" \\
  --data-urlencode "category=cosmetics" \\
  --data-urlencode "limit=20"

# → {
#   "data": [
#     {
#       "id": "reg_eu_1223_2009",
#       "name": "EU Cosmetics Regulation",
#       "ref": "(EC) No 1223/2009",
#       "jurisdiction": "EU",
#       "enforcement_body": "EC DG GROW + NCAs",
#       "url": "https://eur-lex.europa.eu/..."
#     }, ...
#   ],
#   "next_page": "/v1/regulations?cursor=..."
# }`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* ── 3. PLAYGROUND ── */}
        <section className="mt-12 overflow-hidden rounded-3xl border border-c-border bg-c-surface">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_1fr]">
            {/* Left: pitch + features + CTA */}
            <div className="p-8 md:p-12">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-c-brand-soft px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-c-brand-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-c-brand" />
                {t("playgroundEyebrow")}
              </div>
              <h2 className="font-display text-3xl font-light leading-tight tracking-tight text-c-text md:text-4xl">
                {t("playgroundTitle")}
              </h2>
              <p className="mt-3 max-w-md text-[15px] leading-relaxed text-c-text-muted">
                {t("playgroundSub")}
              </p>

              <ul className="mt-7 space-y-4">
                <PlaygroundFeat title={t("playgroundFeat1")} desc={t("playgroundFeat1Desc")} />
                <PlaygroundFeat title={t("playgroundFeat2")} desc={t("playgroundFeat2Desc")} />
                <PlaygroundFeat title={t("playgroundFeat3")} desc={t("playgroundFeat3Desc")} />
              </ul>

              <div className="mt-8">
                <Link
                  href="/playground"
                  className="btn btn-primary"
                >
                  {t("openPlayground")} →
                </Link>
              </div>
            </div>

            {/* Right: visual preview of the playground UI */}
            <div className="border-t border-c-border bg-c-surface-2 p-6 md:p-8 lg:border-l lg:border-t-0">
              <div className="space-y-3">
                {/* Endpoint pill */}
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-c-surface-2 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-c-text">
                    GET
                  </span>
                  <code className="font-mono text-[11.5px] text-c-text">
                    /v1/regulations
                  </code>
                </div>

                {/* Params row */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-c-border bg-c-surface px-3 py-2">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-c-text-subtle">
                      jurisdiction
                    </div>
                    <div className="mt-0.5 font-mono text-[12px] text-c-text">FR</div>
                  </div>
                  <div className="rounded-lg border border-c-border bg-c-surface px-3 py-2">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-c-text-subtle">
                      category
                    </div>
                    <div className="mt-0.5 font-mono text-[12px] text-c-text">cosmetics</div>
                  </div>
                </div>

                {/* curl block (dark) */}
                <div className="overflow-hidden rounded-lg border border-c-border bg-[#0b0b1a]">
                  <div className="border-b border-white/10 px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-wider text-white/40">
                    curl
                  </div>
                  <pre className="overflow-hidden px-3 py-2.5 text-[11px] leading-relaxed text-white/90">
                    <code>{`curl ${"https://api.legaldata.cleolabs.co/v1/regulations"} \\
  -H "Authorization: Bearer $CLEO_KEY" -G \\
  -d "jurisdiction=FR" -d "category=cosmetics"`}</code>
                  </pre>
                </div>

                {/* Response preview (light) */}
                <div className="overflow-hidden rounded-lg border border-c-border bg-c-surface">
                  <div className="border-b border-c-border px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-wider text-c-text-subtle">
                    200 OK · application/json
                  </div>
                  <pre className="overflow-hidden px-3 py-2.5 text-[10.5px] leading-relaxed text-c-text">
                    <code>{`{
  "data": [
    {
      "id": "reg_eu_1223_2009",
      "name": "EU Cosmetics Regulation",
      "ref": "(EC) No 1223/2009",
      "url": "https://eur-lex.europa.eu/..."
    }
  ],
  "total": 1318
}`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. TWO COVERAGES ── */}
        <section className="mt-16">
          <div className="text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-c-border bg-c-surface-2 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-c-text-muted">
              {t("coveragesEyebrow")}
            </div>
            <h2 className="t-h1">
              {t("coveragesTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-c-text-muted">
              {t("coveragesSub")}
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {/* Card 1 — Legal Atlas (general) */}
            <Link
              href="/general"
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-c-border bg-c-surface p-8 transition-all hover:border-c-brand hover:shadow-lg"
            >
              <div className="mb-7 overflow-hidden rounded-xl">
                <div
                  className="relative flex h-[156px] items-center justify-center overflow-hidden"
                  style={{
                    background:
                      "radial-gradient(ellipse 80% 60% at 25% 10%, rgba(107, 116, 255, 0.35), transparent 60%), radial-gradient(ellipse 60% 50% at 90% 95%, rgba(0, 8, 207, 0.55), transparent 70%), linear-gradient(180deg, #02021a 0%, #06061a 100%)",
                  }}
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-50"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                      maskImage:
                        "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 80%)",
                    }}
                  />
                  <div className="relative grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur">
                      <div className="font-display text-xl font-light tabular-nums text-white">
                        {fmt(NUMBERS.legalSources, lang)}
                      </div>
                      <div className="text-[9px] font-medium uppercase tracking-wider text-white/60">
                        sources
                      </div>
                    </div>
                    <div className="rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur">
                      <div className="font-display text-xl font-light tabular-nums text-white">
                        177
                      </div>
                      <div className="text-[9px] font-medium uppercase tracking-wider text-white/60">
                        {lang === "fr" ? "juridictions" : "jurisdictions"}
                      </div>
                    </div>
                    <div className="rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur">
                      <div className="font-display text-xl font-light tabular-nums text-white">
                        1.9M+
                      </div>
                      <div className="text-[9px] font-medium uppercase tracking-wider text-white/60">
                        docs
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full bg-c-surface-2 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-c-text-muted">
                {lang === "fr" ? "Coverage transverse" : "Cross-topic coverage"}
              </div>
              <h3 className="font-display text-3xl font-light leading-tight tracking-tight text-c-text md:text-4xl">
                {STRINGS.homeGeneralCardTitle[lang]}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-c-text-muted">
                {STRINGS.homeGeneralCardDesc[lang]}
              </p>
              <div className="mt-6 rounded-xl border border-c-border bg-c-surface-2 px-4 py-3 text-[13px] font-medium tabular-nums text-c-text-muted">
                {STRINGS.homeGeneralCardStats[lang]}
              </div>
              <div className="mt-auto pt-7">
                <span className="btn btn-primary group-hover:bg-c-brand">
                  {STRINGS.homeGeneralCardCta[lang]} →
                </span>
              </div>
            </Link>

            {/* Card 2 — Legal Product Physical Atlas */}
            <Link
              href="/products"
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-c-border bg-c-surface p-8 transition-all hover:border-c-brand hover:shadow-lg"
            >
              <div className="mb-7 flex flex-wrap items-center gap-2">
                {PRODUCT_CATEGORY_IMAGES.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className="h-11 w-11 rounded-xl object-cover ring-1 ring-c-border transition-transform group-hover:scale-105"
                  />
                ))}
              </div>

              <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full bg-c-brand-soft px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-c-brand-ink">
                {lang === "fr" ? "Coverage produit physique" : "Physical-product coverage"}
              </div>
              <h3 className="font-display text-3xl font-light leading-tight tracking-tight text-c-text md:text-4xl">
                {STRINGS.homeProductCardTitle[lang]}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-c-text-muted">
                {STRINGS.homeProductCardDesc[lang]}
              </p>
              <div className="mt-6 rounded-xl border border-c-border bg-c-surface-2 px-4 py-3 text-[13px] font-medium tabular-nums text-c-text-muted">
                {STRINGS.homeProductCardStats[lang]}
              </div>
              <div className="mt-auto pt-7">
                <span className="btn btn-primary group-hover:bg-c-brand">
                  {STRINGS.homeProductCardCta[lang]} →
                </span>
              </div>
            </Link>

            {/* Card 3 — HS Code */}
            <Link
              href="/hs-code"
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-c-border bg-c-surface p-8 transition-all hover:border-c-brand hover:shadow-lg"
            >
              <div className="mb-7 overflow-hidden rounded-xl">
                <div
                  className="relative flex h-[156px] items-center justify-center overflow-hidden"
                  style={{
                    background:
                      "radial-gradient(ellipse 80% 60% at 25% 10%, rgba(15,182,122,0.35), transparent 60%), radial-gradient(ellipse 60% 50% at 90% 95%, rgba(0,8,207,0.55), transparent 70%), linear-gradient(180deg,#02021a 0%,#06061a 100%)",
                  }}
                >
                  <div className="relative grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur">
                      <div className="font-display text-xl font-light tabular-nums text-white">177</div>
                      <div className="text-[9px] font-medium uppercase tracking-wider text-white/60">
                        {lang === "fr" ? "juridictions" : "jurisdictions"}
                      </div>
                    </div>
                    <div className="rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur">
                      <div className="font-display text-xl font-light tabular-nums text-white">HS6→10</div>
                      <div className="text-[9px] font-medium uppercase tracking-wider text-white/60">
                        {lang === "fr" ? "chiffres" : "digits"}
                      </div>
                    </div>
                    <div className="rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur">
                      <div className="font-display text-xl font-light tabular-nums text-white">1</div>
                      <div className="text-[9px] font-medium uppercase tracking-wider text-white/60">
                        {lang === "fr" ? "appel" : "call"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full bg-c-brand-soft px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-c-brand-ink">
                {lang === "fr" ? "Coverage douane & HS" : "Customs & HS coverage"}
              </div>
              <h3 className="font-display text-3xl font-light leading-tight tracking-tight text-c-text md:text-4xl">
                HS Code
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-c-text-muted">
                {lang === "fr"
                  ? "Classez un produit en code HS, calculez droits et coût rendu, screenez dual-use & sanctions — en un seul appel."
                  : "Classify a product to its HS code, compute duties and landed cost, screen dual-use & sanctions — in one call."}
              </p>
              <div className="mt-6 rounded-xl border border-c-border bg-c-surface-2 px-4 py-3 text-[13px] font-medium tabular-nums text-c-text-muted">
                lookup · duties · landed-cost · dual-use · sanctions
              </div>
              <div className="mt-auto pt-7">
                <span className="btn btn-primary group-hover:bg-c-brand">
                  {lang === "fr" ? "Explorer HS Code" : "Explore HS Code"} →
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* ── 4. PRICING TEASER ── */}
        <section className="mt-16 rounded-3xl border border-c-border bg-c-surface p-8 md:p-12">
          <div className="text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-c-border bg-c-surface-2 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-c-text-muted">
              {t("pricingEyebrow")}
            </div>
            <h2 className="t-h1">
              {t("pricingTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-c-text-muted">
              {t("pricingSub")}
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <PricingTier
              name="Light"
              price={lang === "fr" ? "100 € /mois" : "€100 /mo"}
              tagline={lang === "fr" ? "1k vérifs ou 100k req" : "1k checks or 100k req"}
              href="/pricing#light"
              cta={lang === "fr" ? "Get Light" : "Get Light"}
            />
            <PricingTier
              name="Pro"
              price={lang === "fr" ? "349 € /mois" : "€349 /mo"}
              tagline={lang === "fr" ? "10k vérifs ou 1M req" : "10k checks or 1M req"}
              featured
              href="/pricing#pro"
              cta={lang === "fr" ? "Get Pro" : "Get Pro"}
            />
            <PricingTier
              name="Business"
              price={lang === "fr" ? "999 € /mois" : "€999 /mo"}
              tagline={lang === "fr" ? "50k vérifs ou 5M req" : "50k checks or 5M req"}
              href="/pricing#business"
              cta={lang === "fr" ? "Get Business" : "Get Business"}
            />
            <PricingTier
              name="Enterprise"
              price={lang === "fr" ? "Sur devis" : "Custom"}
              tagline={lang === "fr" ? "Volumes illimités · SLA" : "Unlimited · SLA"}
              href="/pricing#enterprise"
              cta={lang === "fr" ? "Contact" : "Contact"}
            />
          </div>

          <p className="mt-6 text-center text-[13px] text-c-text-muted">
            {lang === "fr"
              ? "Vous voulez tester sans payer ? Le "
              : "Want to try before paying? The "}
            <Link href="/playground" className="font-semibold text-c-brand hover:underline">
              {lang === "fr" ? "Playground" : "Playground"}
            </Link>
            {lang === "fr"
              ? " est gratuit, aucune clé nécessaire."
              : " is free, no API key needed."}
          </p>
        </section>

        {/* ── 5. TRUST BADGES ── */}
        <section className="mt-16">
          <h2 className="text-center t-h2">
            {t("trustTitle")}
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <TrustBadge title={STRINGS.trustGdpr[lang]} desc={STRINGS.trustGdprDesc[lang]} />
            <TrustBadge title={STRINGS.trustEu[lang]} desc={STRINGS.trustEuDesc[lang]} />
            <TrustBadge title={STRINGS.trustDaily[lang]} desc={STRINGS.trustDailyDesc[lang]} />
            <TrustBadge title={STRINGS.trustSla[lang]} desc={STRINGS.trustSlaDesc[lang]} />
            <TrustBadge title={STRINGS.trustSupport[lang]} desc={STRINGS.trustSupportDesc[lang]} />
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="mt-16 border-t border-c-border pt-6 text-xs text-c-text-subtle">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>{STRINGS.homeFooterTagline[lang]}</span>
            <span className="flex flex-wrap items-center gap-x-3">
              <a
                href="https://cleolabs.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-c-text-muted hover:text-c-brand"
              >
                Cleo Labs
              </a>
              <span>·</span>
              <Link href="/general" className="text-c-text-muted hover:text-c-brand">
                {STRINGS.navGeneral[lang]}
              </Link>
              <span>·</span>
              <Link href="/products" className="text-c-text-muted hover:text-c-brand">
                {STRINGS.navProducts[lang]}
              </Link>
              <span>·</span>
              <Link href="/hs-code" className="text-c-text-muted hover:text-c-brand">
                {STRINGS.navHsCode[lang]}
              </Link>
              <span>·</span>
              <Link href="/docs" className="text-c-text-muted hover:text-c-brand">
                {STRINGS.navDocs[lang]}
              </Link>
              <span>·</span>
              <Link href="/pricing" className="text-c-text-muted hover:text-c-brand">
                {STRINGS.navPricing[lang]}
              </Link>
              <span>·</span>
              <Link href="/privacy" className="text-c-text-muted hover:text-c-brand">
                {STRINGS.privacyLink[lang]}
              </Link>
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}

function Kpi({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className="card-warm">
      <div
        className={`tabular-display text-2xl font-light leading-none md:text-3xl ${accent ? "text-c-brand" : "text-c-text"}`}
      >
        {value}
        {accent ? <span className="text-c-glow">+</span> : null}
      </div>
      <div className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-c-text-subtle">
        {label}
      </div>
    </div>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-c-border bg-c-surface-2 p-6">
      <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-c-brand text-sm font-semibold text-white">
        {n}
      </div>
      <h4 className="font-display text-lg font-medium text-c-text">{title}</h4>
      <p className="mt-2 text-[13.5px] leading-relaxed text-c-text-muted">{body}</p>
    </div>
  );
}

function PricingTier({
  name,
  price,
  tagline,
  featured,
  href,
  cta,
}: {
  name: string;
  price: string;
  tagline: string;
  featured?: boolean;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      className={`group flex flex-col rounded-2xl p-5 text-center transition-all ${
        featured
          ? "border-2 border-c-brand bg-c-brand-soft/30 hover:shadow-md"
          : "border border-c-border bg-c-surface hover:border-c-brand hover:shadow-sm"
      }`}
    >
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-c-text-subtle">
        {name}
      </div>
      <div className="mt-2 font-display text-xl font-medium tabular-nums text-c-text">
        {price}
      </div>
      <div className="mt-2 text-[11px] leading-tight text-c-text-muted">{tagline}</div>
      <div
        className={`mt-3 inline-flex items-center justify-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ${
          featured
            ? "bg-c-brand text-white"
            : "bg-c-surface-2 text-c-text group-hover:bg-c-brand group-hover:text-white"
        }`}
      >
        {cta} →
      </div>
    </Link>
  );
}

function PlaygroundFeat({ title, desc }: { title: string; desc: string }) {
  return (
    <li className="flex gap-3">
      <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-c-brand-soft text-[11px] font-semibold text-c-brand-ink">
        ✓
      </span>
      <div>
        <div className="text-[14px] font-semibold text-c-text">{title}</div>
        <div className="mt-0.5 text-[12.5px] leading-relaxed text-c-text-muted">{desc}</div>
      </div>
    </li>
  );
}

function TrustBadge({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-c-border bg-c-surface p-5">
      <h4 className="text-sm font-semibold text-c-text">{title}</h4>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-c-text-muted">{desc}</p>
    </div>
  );
}

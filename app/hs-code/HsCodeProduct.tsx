"use client";

import { useState } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import SiteHeader from "../components/SiteHeader";

const STEPS = [
  {
    k: "Classify",
    p: "/v2/customs/lookup",
    fr: "Description produit → codes HS classés par confiance.",
    en: "Product description → HS codes ranked by confidence.",
  },
  {
    k: "Duties",
    p: "/v2/customs/duties",
    fr: "Taux de droits, TVA, accise par code & pays.",
    en: "Tariff, VAT, excise by code & country.",
  },
  {
    k: "Landed cost",
    p: "/v2/customs/landed-cost",
    fr: "FOB + droits + TVA + frais = coût rendu total.",
    en: "FOB + duty + VAT + fees = total delivered cost.",
  },
  {
    k: "Dual-use",
    p: "/v2/customs/dual-use",
    fr: "Contrôle export Wassenaar / EU 2021-821 / US CCL.",
    en: "Wassenaar / EU 2021-821 / US CCL export control.",
  },
  {
    k: "Sanctions",
    p: "/v2/sanctions/screen",
    fr: "Screening denied-party, 8 autorités.",
    en: "Denied-party screening, 8 authorities.",
  },
];

const SIGNALS = [
  { label_en: "Jurisdictions", label_fr: "Juridictions", value: "177" },
  { label_en: "Sanctions lists", label_fr: "Listes sanctions", value: "8" },
  { label_en: "Dual-use regimes", label_fr: "Régimes dual-use", value: "7" },
  { label_en: "FTA preferential rates", label_fr: "Accords préférentiels", value: "CETA · TCA · USMCA · RCEP · AfCFTA…" },
];

type FaqItem = { q: string; a: string };
type UseCase = { title: string; desc: string; icon: string };

export default function HsCodeProduct({
  faq,
  useCases,
}: {
  faq: FaqItem[];
  useCases: UseCase[];
}) {
  const [lang, setLang] = useState<Lang>("en");
  const fr = lang === "fr";

  return (
    <div className="min-h-screen bg-c-bg">
      <SiteHeader lang={lang} setLang={setLang} active="atlas-hs" />

      <main className="mx-auto max-w-7xl px-6 pb-20">
        {/* ── 1. HERO ── */}
        <section className="mx-auto max-w-4xl pt-16 pb-10 text-center md:pt-24">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-c-border bg-c-surface px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-c-text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {fr ? "Douane & HS Code · Cleo Legal Data" : "Customs & HS Code · Cleo Legal Data"}
          </div>
          <h1 className="font-display text-4xl font-light leading-[1.05] tracking-tight text-c-text md:text-6xl">
            {fr ? "Le code HS, c'est le plus dur." : "The HS code is the hard part."}{" "}
            <span className="italic text-c-brand">
              {fr ? "Un appel suffit." : "One API call solves it."}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-c-text-muted md:text-lg">
            {fr
              ? "Classez un produit, calculez droits et coût rendu, screenez dual-use & sanctions — sur 177 juridictions, en un seul appel API."
              : "Classify a product, compute duties and landed cost, screen dual-use & sanctions — across 177 jurisdictions, in a single API call."}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/playground"
              className="inline-flex items-center rounded-full bg-c-text px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-c-brand"
            >
              {fr ? "Essayer dans le playground" : "Try in the playground"} →
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center rounded-full border border-c-border bg-c-surface px-5 py-2.5 text-sm font-semibold text-c-text-muted transition-colors hover:border-c-brand hover:text-c-brand"
            >
              {fr ? "Voir les tarifs" : "See pricing"} →
            </Link>
          </div>
        </section>

        {/* ── 2. SIGNALS ── */}
        <section className="mx-auto mb-12 max-w-5xl">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {SIGNALS.map((s) => (
              <div
                key={s.label_en}
                className="rounded-2xl border border-c-border bg-c-surface p-4 text-center"
              >
                <div className="font-display text-2xl font-light tabular-nums text-c-text">
                  {s.value}
                </div>
                <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-c-text-subtle">
                  {fr ? s.label_fr : s.label_en}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. 5 STEPS ── */}
        <section className="mx-auto max-w-5xl">
          <div className="mb-6 text-center">
            <h2 className="font-display text-3xl font-light tracking-tight text-c-text md:text-4xl">
              {fr ? "Cinq endpoints, un seul flux" : "Five endpoints, one flow"}
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-[14px] text-c-text-muted">
              {fr
                ? "Du nom de produit au coût rendu, sanctions screenées au passage."
                : "From product name to landed cost, sanctions screened along the way."}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-5">
            {STEPS.map((s, i) => (
              <div
                key={s.k}
                className="rounded-2xl border border-c-border bg-c-surface p-5"
              >
                <div className="mb-2 font-mono text-[10px] font-semibold text-emerald-600">
                  0{i + 1}
                </div>
                <div className="font-display text-lg text-c-text">{s.k}</div>
                <code className="mt-1 block text-[11px] text-c-text-subtle">{s.p}</code>
                <p className="mt-3 text-[13px] leading-relaxed text-c-text-muted">
                  {fr ? s.fr : s.en}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-[12px] text-c-text-subtle">
            {fr
              ? "Informatif uniquement — pas un conseil douanier contraignant. Score de confiance, pas certitude : sous le seuil, demandez un BTI."
              : "For information only — not binding customs advice. Confidence score, not certainty: below threshold, request a BTI."}
          </p>
        </section>

        {/* ── 4. CODE SAMPLE ── */}
        <section className="mx-auto mt-16 max-w-5xl">
          <div className="mb-6 text-center">
            <h2 className="font-display text-3xl font-light tracking-tight text-c-text md:text-4xl">
              {fr ? "Un appel · un résultat" : "One call · one result"}
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-[14px] text-c-text-muted">
              {fr
                ? "Classez « shampoing SPF50 » pour la France et obtenez tout en moins de 800 ms."
                : "Classify “sunscreen SPF50” for France and get everything in under 800 ms."}
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-c-border bg-[#0b0b1a]">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/40">
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="ml-3">curl · GET /v2/customs/lookup</span>
            </div>
            <pre className="overflow-x-auto px-4 py-4 text-[12.5px] leading-relaxed text-white/90">
              <code>{`curl https://api.legaldata.cleolabs.co/v2/customs/lookup \\
  -H "Authorization: Bearer $CLEO_KEY" \\
  -G \\
  --data-urlencode "description=sunscreen SPF50" \\
  --data-urlencode "country=FR" \\
  --data-urlencode "limit=3"

# → {
#   "data": [
#     {
#       "code": "330420",
#       "description": "Skin-care preparations with SPF",
#       "confidence": 0.92,
#       "duty_pct": 0,
#       "vat_pct": 20,
#       "obligations": ["EU Reg 1223/2009", "FR Code de la santé publique"]
#     }, ...
#   ],
#   "query": "sunscreen SPF50",
#   "ms": 743
# }`}</code>
            </pre>
          </div>
        </section>

        {/* ── 5. USE CASES ── */}
        <section className="mx-auto mt-16 max-w-5xl">
          <div className="mb-6 text-center">
            <h2 className="font-display text-3xl font-light tracking-tight text-c-text md:text-4xl">
              {fr ? "Pour qui c'est fait" : "Built for"}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {useCases.map((u) => (
              <div
                key={u.title}
                className="rounded-2xl border border-c-border bg-c-surface p-6"
              >
                <div className="mb-2 text-2xl">{u.icon}</div>
                <h3 className="font-display text-lg font-medium text-c-text">{u.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-c-text-muted">{u.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. FAQ ── */}
        <section className="mx-auto mt-16 max-w-3xl">
          <div className="mb-6 text-center">
            <h2 className="font-display text-3xl font-light tracking-tight text-c-text md:text-4xl">
              {fr ? "Questions fréquentes" : "Frequently asked"}
            </h2>
          </div>
          <div className="divide-y divide-c-border rounded-2xl border border-c-border bg-c-surface">
            {faq.map((f) => (
              <details
                key={f.q}
                className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-4">
                  <h3 className="font-display text-base font-medium text-c-text">{f.q}</h3>
                  <span className="mt-0.5 text-c-text-subtle transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[14px] leading-relaxed text-c-text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── 7. CTA ── */}
        <section className="mx-auto mt-16 max-w-3xl rounded-3xl border-2 border-emerald-500/40 bg-emerald-50 p-8 text-center md:p-12">
          <h2 className="font-display text-3xl font-light tracking-tight text-c-text md:text-4xl">
            {fr ? "Prêt à classer votre premier produit ?" : "Ready to classify your first product?"}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-c-text-muted">
            {fr
              ? "Aucune clé requise pour tester dans le Playground. Clé Stripe instantanée pour passer en prod."
              : "No key needed to test in the Playground. Instant Stripe key to ship to production."}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/playground"
              className="inline-flex items-center rounded-full bg-c-text px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              {fr ? "Ouvrir le Playground" : "Open the Playground"} →
            </Link>
            <a
              href="/api/checkout?plan=pro"
              className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md"
            >
              {fr ? "Obtenir une clé API" : "Get API key"} →
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

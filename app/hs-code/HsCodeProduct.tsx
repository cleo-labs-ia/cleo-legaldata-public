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

export default function HsCodeProduct() {
  const [lang, setLang] = useState<Lang>("en");
  const fr = lang === "fr";

  return (
    <div className="min-h-screen bg-c-bg">
      <SiteHeader lang={lang} setLang={setLang} active="atlas-hs" />

      <main className="mx-auto max-w-7xl px-6 pb-20">
        <section className="mx-auto max-w-4xl pt-16 pb-10 text-center md:pt-24">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-c-border bg-c-surface px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-c-text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-c-brand" />
            {fr ? "Douane & HS Code" : "Customs & HS Code"}
          </div>
          <h1 className="font-display text-4xl font-light leading-[1.05] tracking-tight text-c-text md:text-6xl">
            {fr ? "Le code HS, c'est le plus dur." : "The HS code is the hard part."}{" "}
            <span className="italic text-c-brand">
              {fr ? "Un appel suffit." : "One API call solves it."}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-c-text-muted md:text-lg">
            {fr
              ? "Classez un produit, calculez droits et coût rendu, screenez dual-use & sanctions — sur 177 juridictions, en un seul appel."
              : "Classify a product, compute duties and landed cost, screen dual-use & sanctions — across 177 jurisdictions, in a single call."}
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

        <section className="mx-auto max-w-5xl">
          <div className="grid gap-4 md:grid-cols-5">
            {STEPS.map((s, i) => (
              <div
                key={s.k}
                className="rounded-2xl border border-c-border bg-c-surface p-5"
              >
                <div className="mb-2 font-mono text-[10px] font-semibold text-c-brand">
                  0{i + 1}
                </div>
                <div className="font-display text-lg text-c-text">{s.k}</div>
                <code className="mt-1 block text-[11px] text-c-text-subtle">
                  {s.p}
                </code>
                <p className="mt-3 text-[13px] leading-relaxed text-c-text-muted">
                  {fr ? s.fr : s.en}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-[12px] text-c-text-subtle">
            {fr
              ? "Informatif uniquement — pas un conseil douanier contraignant. Score de confiance, pas certitude : sous le seuil, demandez un BTI."
              : "For information only — not binding customs advice. Confidence score, not certainty: below threshold, request a BTI."}
          </p>
        </section>
      </main>
    </div>
  );
}

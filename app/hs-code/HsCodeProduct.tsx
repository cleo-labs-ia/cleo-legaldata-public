"use client";

import { useState } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import SiteHeader from "../components/SiteHeader";

const STEPS = [
  { k: "Classify",    p: "/v2/customs/lookup",          fr: "Description produit → codes HS classés par confiance.",      en: "Product description → HS codes ranked by confidence." },
  { k: "Duties",      p: "/v2/customs/duties",          fr: "Taux de droits, TVA, accise par code & pays.",                en: "Tariff, VAT, excise by code & country." },
  { k: "Landed cost", p: "/v2/customs/landed-cost",     fr: "FOB + droits + TVA + frais = coût rendu total.",              en: "FOB + duty + VAT + fees = total delivered cost." },
  { k: "Dual-use",    p: "/v2/customs/dual-use",        fr: "Contrôle export Wassenaar / EU 2021-821 / US CCL.",           en: "Wassenaar / EU 2021-821 / US CCL export control." },
  { k: "Sanctions",   p: "/v2/sanctions/screen",        fr: "Screening denied-party, 8 autorités.",                        en: "Denied-party screening, 8 authorities." },
];

const SIGNALS = [
  { label_en: "Jurisdictions",          label_fr: "Juridictions",            value: "177" },
  { label_en: "Sanctions lists",        label_fr: "Listes sanctions",        value: "8" },
  { label_en: "Dual-use regimes",       label_fr: "Régimes dual-use",        value: "7" },
  { label_en: "FTA preferential rates", label_fr: "Accords préférentiels",   value: "CETA · TCA · USMCA · RCEP · AfCFTA…" },
];

type FaqItem = { q: string; a: string };
type UseCase = { title: string; desc: string };

export default function HsCodeProduct({ faq, useCases }: { faq: FaqItem[]; useCases: UseCase[] }) {
  const [lang, setLang] = useState<Lang>("en");
  const fr = lang === "fr";

  return (
    <div className="min-h-screen bg-c-bg">
      <SiteHeader lang={lang} setLang={setLang} active="atlas-hs" />

      <main className="wrap" style={{ paddingTop: "var(--s-48)", paddingBottom: "var(--s-128)" }}>
        {/* ── 1. HERO — DSV4 gc-blue canvas ── */}
        <section className="gc gc-blue" style={{ padding: "var(--s-96) var(--s-48)", textAlign: "center", marginBottom: "var(--s-48)" }}>
          <div className="t-label" style={{ marginBottom: "var(--s-16)" }}>
            {fr ? "Douane & HS Code · Cleo Legal Data" : "Customs & HS Code · Cleo Legal Data"}
          </div>
          <h1 className="t-display" style={{ marginBottom: "var(--s-16)", fontSize: "clamp(2.5rem, 6vw, 3.5rem)" }}>
            {fr ? "Le code HS, c'est le plus dur." : "The HS code is the hard part."}
            <br />
            <span style={{ color: "var(--color-c-brand)" }}>
              {fr ? "Un appel suffit." : "One API call solves it."}
            </span>
          </h1>
          <p className="t-body" style={{ maxWidth: "600px", margin: "0 auto var(--s-32)" }}>
            {fr
              ? "Classez un produit, calculez droits et coût rendu, screenez dual-use & sanctions — sur 177 juridictions, en un seul appel API."
              : "Classify a product, compute duties and landed cost, screen dual-use & sanctions — across 177 jurisdictions, in a single API call."}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "var(--s-12)" }}>
            <Link href="/playground" className="btn btn-primary">
              {fr ? "Essayer dans le playground" : "Try in the playground"} →
            </Link>
            <Link href="/pricing" className="btn btn-secondary">
              {fr ? "Voir les tarifs" : "See pricing"} →
            </Link>
          </div>
        </section>

        {/* ── 2. SIGNALS — card-warm grid ── */}
        <section style={{ marginBottom: "var(--s-64)" }}>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {SIGNALS.map((s) => (
              <div key={s.label_en} className="card-warm" style={{ textAlign: "center" }}>
                <div className="tabular-display" style={{ fontSize: "1.75rem", color: "var(--color-c-text)" }}>
                  {s.value}
                </div>
                <div className="t-label" style={{ marginTop: "var(--s-8)" }}>
                  {fr ? s.label_fr : s.label_en}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. 5 STEPS — card-white grid ── */}
        <section style={{ marginBottom: "var(--s-64)" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--s-32)" }}>
            <div className="t-label" style={{ marginBottom: "var(--s-8)" }}>Flow</div>
            <h2 className="t-h1" style={{ marginBottom: "var(--s-8)" }}>
              {fr ? "Cinq endpoints, un seul flux" : "Five endpoints, one flow"}
            </h2>
            <p className="t-body" style={{ maxWidth: "600px", margin: "0 auto" }}>
              {fr
                ? "Du nom de produit au coût rendu, sanctions screenées au passage."
                : "From product name to landed cost, sanctions screened along the way."}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-5">
            {STEPS.map((s, i) => (
              <div key={s.k} className="card-white">
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "var(--color-c-brand)", marginBottom: "var(--s-8)" }}>
                  0{i + 1}
                </div>
                <div className="t-h3" style={{ marginBottom: "var(--s-4)" }}>{s.k}</div>
                <code style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-c-text-subtle)", marginBottom: "var(--s-12)" }}>
                  {s.p}
                </code>
                <p className="t-body" style={{ fontSize: 13.5, lineHeight: 1.55 }}>
                  {fr ? s.fr : s.en}
                </p>
              </div>
            ))}
          </div>
          <p className="t-caption" style={{ textAlign: "center", marginTop: "var(--s-24)", maxWidth: "640px", marginLeft: "auto", marginRight: "auto" }}>
            {fr
              ? "Informatif uniquement — pas un conseil douanier contraignant. Score de confiance, pas certitude : sous le seuil, demandez un BTI."
              : "For information only — not binding customs advice. Confidence score, not certainty: below threshold, request a BTI."}
          </p>
        </section>

        {/* ── 4. CODE SAMPLE — terminal mockup nested in card-warm ── */}
        <section style={{ marginBottom: "var(--s-64)" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--s-32)" }}>
            <div className="t-label" style={{ marginBottom: "var(--s-8)" }}>API · curl</div>
            <h2 className="t-h1">{fr ? "Un appel · un résultat" : "One call · one result"}</h2>
          </div>
          <div className="card-warm" style={{ padding: "var(--s-12)" }}>
            <div style={{ background: "#0b0b1a", borderRadius: "var(--r-md)", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--s-8)", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
                <span style={{ marginLeft: "var(--s-12)", fontFamily: "var(--font-mono)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.4)" }}>
                  curl · GET /v2/customs/lookup
                </span>
              </div>
              <pre style={{ padding: "16px 24px", fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 1.7, color: "rgba(255,255,255,0.9)", overflowX: "auto", margin: 0 }}>
                <code>{`curl https://api.legaldata.cleolabs.co/v2/customs/lookup \\
  -H "Authorization: Bearer $CLEO_KEY" -G \\
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
          </div>
        </section>

        {/* ── 5. USE CASES — card-warm with icons ── */}
        <section style={{ marginBottom: "var(--s-64)" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--s-32)" }}>
            <div className="t-label" style={{ marginBottom: "var(--s-8)" }}>
              {fr ? "Cas d'usage" : "Use cases"}
            </div>
            <h2 className="t-h1">{fr ? "Pour qui c'est fait" : "Built for"}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {useCases.map((u, i) => (
              <div key={u.title} className="card-warm">
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--color-c-brand)",
                    marginBottom: "var(--s-8)",
                    letterSpacing: "0.04em",
                  }}
                >
                  0{i + 1}
                </div>
                <h3 className="t-h3" style={{ marginBottom: "var(--s-8)" }}>{u.title}</h3>
                <p className="t-body" style={{ fontSize: 14, lineHeight: 1.65 }}>{u.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. FAQ — card-white accordion ── */}
        <section style={{ marginBottom: "var(--s-64)", maxWidth: "780px", marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ textAlign: "center", marginBottom: "var(--s-32)" }}>
            <div className="t-label" style={{ marginBottom: "var(--s-8)" }}>FAQ</div>
            <h2 className="t-h1">{fr ? "Questions fréquentes" : "Frequently asked"}</h2>
          </div>
          <div className="card-white" style={{ padding: 0 }}>
            {faq.map((f, idx) => (
              <details
                key={f.q}
                style={{
                  padding: "var(--s-24)",
                  borderBottom: idx === faq.length - 1 ? "none" : "1px solid var(--color-c-border)",
                }}
                className="group [&_summary::-webkit-details-marker]:hidden"
              >
                <summary style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--s-16)", cursor: "pointer" }}>
                  <span className="t-h3" style={{ fontWeight: 500 }}>{f.q}</span>
                  <span style={{ color: "var(--color-c-text-subtle)", transition: "transform 200ms" }} className="group-open:rotate-45">+</span>
                </summary>
                <p className="t-body" style={{ fontSize: 14, marginTop: "var(--s-12)" }}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── 7. CTA — gc-blue canvas, pill buttons ── */}
        <section
          className="gc gc-blue"
          style={{ padding: "var(--s-64) var(--s-48)", textAlign: "center", maxWidth: "780px", marginLeft: "auto", marginRight: "auto" }}
        >
          <h2 className="t-h1" style={{ marginBottom: "var(--s-12)" }}>
            {fr ? "Prêt à classer votre premier produit ?" : "Ready to classify your first product?"}
          </h2>
          <p className="t-body" style={{ maxWidth: "500px", margin: "0 auto var(--s-24)" }}>
            {fr
              ? "Aucune clé requise pour tester dans le Playground. Clé Stripe instantanée pour passer en prod."
              : "No key needed to test in the Playground. Instant Stripe key to ship to production."}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "var(--s-12)" }}>
            <Link href="/playground" className="btn btn-secondary">
              {fr ? "Ouvrir le Playground" : "Open the Playground"} →
            </Link>
            <a href="/api/checkout?plan=pro" className="btn btn-primary">
              {fr ? "Obtenir une clé API" : "Get API key"} →
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

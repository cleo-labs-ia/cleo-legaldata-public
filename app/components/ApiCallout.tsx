"use client";

import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { STRINGS } from "@/lib/i18n";

const MEET_URL = "https://www.cleolabs.co/en/meet";
const SIGNUP_URL = "/api/checkout?plan=pro";

export default function ApiCallout({ lang }: { lang: Lang }) {
  return (
    <section className="mt-16">
      <div className="relative overflow-hidden rounded-3xl border border-c-border bg-gradient-to-br from-c-ink-deep via-c-ink-night to-c-brand-ink p-8 text-white md:p-12">
        <div
          aria-hidden
          className="absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(107,116,255,0.7), transparent 70%)" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 hero-grid opacity-40"
        />
        <div className="relative grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-c-brand shadow-[0_0_10px_2px_rgba(0,8,207,0.45)]" />
              {STRINGS.apiCalloutEyebrow[lang]}
            </div>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight md:text-4xl">
              {STRINGS.apiCalloutTitle[lang]}
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/70 md:text-[15px]">
              {STRINGS.apiCalloutBody[lang]}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {/* PRIMARY — white pill on dark gradient (DSV4 btn-primary inverted) */}
              <a
                href={SIGNUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{ background: "#fff", color: "var(--color-c-text)", fontSize: 15, padding: "14px 28px", borderRadius: 9999 }}
              >
                {lang === "fr" ? "Obtenir une clé API" : "Get API key"} →
              </a>
              {/* SECONDARY — ghost pill (DSV4 btn-secondary inverted) */}
              <Link
                href="/playground"
                className="btn"
                style={{ background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 15, padding: "14px 28px", borderRadius: 9999, border: "1px solid rgba(255,255,255,0.2)" }}
              >
                {lang === "fr" ? "Tester dans le Playground" : "Try in the Playground"} →
              </Link>
              {/* TERTIARY — text link */}
              <a
                href={MEET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="t-caption hover:underline"
                style={{ color: "rgba(255,255,255,0.6)", textUnderlineOffset: 2 }}
              >
                {lang === "fr" ? "ou parler à l'équipe" : "or talk to the team"}
              </a>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.14em] text-white/50">
                    {STRINGS.apiPlansHeader[lang]}
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-2xl font-light">{STRINGS.apiPlanPro[lang]}</span>
                  </div>
                  <p className="mt-1 text-xs text-white/60">{STRINGS.apiPlanProDesc[lang]}</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-2xl font-light">{STRINGS.apiPlanEnterprise[lang]}</span>
                  </div>
                  <p className="mt-1 text-xs text-white/60">{STRINGS.apiPlanEntDesc[lang]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

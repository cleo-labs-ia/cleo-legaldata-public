"use client";

import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { STRINGS } from "@/lib/i18n";

const CONTACT_EMAIL = "contact@cleo.academy";

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
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.6)]" />
              {STRINGS.apiCalloutEyebrow[lang]}
            </div>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight tracking-tight md:text-4xl">
              {STRINGS.apiCalloutTitle[lang]}
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/70 md:text-[15px]">
              {STRINGS.apiCalloutBody[lang]}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={buildMailto(lang)}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-c-brand-ink transition-all hover:bg-white/90 hover:shadow-lg"
              >
                {STRINGS.apiCtaPrimary[lang]} →
              </a>
              <Link
                href="/api"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur transition-colors hover:border-white/40 hover:bg-white/10"
              >
                {STRINGS.apiCtaSecondary[lang]}
              </Link>
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

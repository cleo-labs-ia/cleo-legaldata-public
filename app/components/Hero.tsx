"use client";

import { useEffect, useState } from "react";
import type { GlobalStats } from "@/lib/types";
import type { Lang } from "@/lib/i18n";
import { STRINGS } from "@/lib/i18n";
import AnimatedNumber from "./AnimatedNumber";

interface Props {
  stats: GlobalStats;
  lang: Lang;
  onLangChange: (lang: Lang) => void;
}

function formatVolume(n: number, lang: Lang): string {
  // 234,502,471 -> "234M+" or "234,5M+"
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1).replace(".", lang === "fr" ? "," : ".")}B`;
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return m >= 100
      ? `${Math.round(m)}M`
      : `${m.toFixed(1).replace(".", lang === "fr" ? "," : ".")}M`;
  }
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return n.toString();
}

function formatNumber(n: number, lang: Lang): string {
  return n.toLocaleString(lang === "fr" ? "fr-FR" : "en-US");
}

export default function Hero({ stats, lang, onLangChange }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      className="hero-bg relative isolate overflow-hidden text-white"
      style={{ minHeight: "min(100svh, 920px)" }}
    >
      <div aria-hidden className="absolute inset-0 hero-grid" />
      <div
        aria-hidden
        className="absolute -left-[20%] top-[-10%] h-[60vh] w-[60vh] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(107,116,255,0.45), transparent 70%)", animation: "hero-pulse 8s ease-in-out infinite" }}
      />
      <div
        aria-hidden
        className="absolute right-[-15%] bottom-[-15%] h-[55vh] w-[55vh] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(0,8,207,0.65), transparent 70%)", animation: "hero-pulse 11s ease-in-out infinite reverse" }}
      />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-bold text-c-brand">
            c
          </div>
          <div className="leading-tight">
            <div className="text-sm font-medium">Cleo Comply</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">{STRINGS.heroEyebrow[lang]}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/Cleo-Labs-IA/legal-sources"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur transition-colors hover:border-white/40 hover:text-white"
          >
            {STRINGS.github[lang]} ↗
          </a>
          <div className="flex rounded-md border border-white/20 bg-white/5 p-0.5 text-[11px] font-medium backdrop-blur">
            {(["fr", "en"] as Lang[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => onLangChange(l)}
                className={`rounded px-2 py-1 transition-colors ${
                  lang === l ? "bg-white text-c-brand-ink" : "text-white/70 hover:text-white"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="hero-fade hero-fade-1 mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/70 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.6)]" />
          {STRINGS.heroEyebrow[lang]}
        </div>

        <h1 className="font-display text-5xl font-light leading-[0.95] tracking-tight md:text-7xl lg:text-[88px]">
          <span className="block hero-fade hero-fade-2">{STRINGS.heroTitleA[lang]}</span>
          <span className="block hero-fade hero-fade-3 italic text-white/85">{STRINGS.heroTitleB[lang]}</span>
        </h1>

        <p className="hero-fade hero-fade-4 mt-8 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
          {STRINGS.heroSubtitleClean[lang]}
        </p>

        <div className="hero-fade hero-fade-5 mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur sm:grid-cols-3">
          <Kpi
            value={stats.estimatedTotalVolume}
            label={STRINGS.heroKpiDocuments[lang]}
            sublabel={`+ · ${STRINGS.heroVolumeNote[lang]}`}
            format={(n) => formatVolume(n, lang)}
            featured
          />
          <Kpi
            value={stats.totalSources}
            label={STRINGS.heroKpiSources[lang]}
            format={(n) => formatNumber(n, lang)}
          />
          <Kpi
            value={stats.totalCountries}
            label={STRINGS.heroKpiCountries[lang]}
            format={(n) => formatNumber(n, lang)}
          />
        </div>

        <div className={`hero-fade hero-fade-6 mt-14 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-white/50 transition-opacity duration-500 ${scrolled ? "opacity-0" : "opacity-100"}`}>
          <span className="h-px w-8 bg-white/30" />
          <span>{STRINGS.heroScrollHint[lang]}</span>
        </div>
      </div>
    </section>
  );
}

function Kpi({
  value,
  label,
  sublabel,
  format,
  featured,
}: {
  value: number;
  label: string;
  sublabel?: string;
  format: (n: number) => string;
  featured?: boolean;
}) {
  return (
    <div
      className={`relative px-6 py-7 sm:px-8 sm:py-8 ${
        featured ? "bg-white/[0.06]" : "bg-transparent"
      }`}
    >
      <div className="tabular-display text-5xl font-light leading-none text-white sm:text-6xl">
        <AnimatedNumber value={value} format={format} />
        {featured ? <span className="text-c-glow">+</span> : null}
      </div>
      <div className="mt-3 text-sm font-medium uppercase tracking-[0.14em] text-white/65">
        {label}
      </div>
      {sublabel ? (
        <div className="mt-1 text-[11px] text-white/40">{sublabel}</div>
      ) : null}
    </div>
  );
}

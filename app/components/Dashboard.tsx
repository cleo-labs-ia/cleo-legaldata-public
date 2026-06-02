"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { DashboardData, DomainGroup } from "@/lib/types";
import type { Lang } from "@/lib/i18n";
import { STRINGS } from "@/lib/i18n";
import { NUMBERS } from "@/lib/numbers";
import SiteHeader from "./SiteHeader";
import AnimatedNumber from "./AnimatedNumber";
import Link from "next/link";
import StatsHeader from "./StatsHeader";
import CountriesGrid from "./CountriesGrid";
import SourcesTable, { type Filters } from "./SourcesTable";
import CountryDrawer from "./CountryDrawer";
import DomainMatrix from "./DomainMatrix";
import ApiCallout from "./ApiCallout";

const MapView = dynamic(() => import("./MapView"), { ssr: false, loading: () => <MapPlaceholder /> });

function MapPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-2xl border border-c-border bg-c-surface-2 text-sm text-c-text-subtle">
      Loading map…
    </div>
  );
}

const EMPTY_FILTERS: Filters = {
  query: "",
  status: "",
  dataType: "",
  group: "",
  country: "",
};

function formatVolume(n: number, lang: Lang): string {
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

export default function Dashboard({ data }: { data: DashboardData }) {
  const [lang, setLang] = useState<Lang>("en");
  const [drawer, setDrawer] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  const drawerCountry = useMemo(
    () => (drawer ? data.countries.find((c) => c.code === drawer) ?? null : null),
    [data.countries, drawer]
  );

  const generated = new Date(data.stats.generatedAt).toLocaleDateString(
    lang === "fr" ? "fr-FR" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  function setMatrixSelection(country: string | null, group: DomainGroup | null) {
    setFilters((f) => ({
      ...f,
      country: country ?? "",
      group: (group ?? "") as Filters["group"],
    }));
    if (country) {
      const el = document.getElementById("exhaustive");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="min-h-screen pb-16">
      <SiteHeader lang={lang} setLang={setLang} active="atlas" />

      <main className="mx-auto max-w-7xl px-6 pt-6">
        {/* Compact intro: title + 3 KPIs (live, real, no double-counting) */}
        <section className="mb-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="t-h1">
              {STRINGS.heroTitleA[lang]}{" "}
              <span className="italic text-c-brand">{STRINGS.heroTitleB[lang]}</span>
            </h1>
            <p className="mt-2 text-sm text-c-text-muted md:text-[15px]">
              {STRINGS.heroSubtitleClean[lang]}
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-x-8 gap-y-2">
            <Kpi
              value={NUMBERS.legalDocuments}
              label={lang === "fr" ? "documents indexés" : "documents indexed"}
              format={(n) => formatVolume(n, lang)}
              accent
            />
            <Kpi value={data.stats.totalSources} label={STRINGS.heroKpiSources[lang]} format={(n) => formatNumber(n, lang)} />
            <Kpi value={data.stats.totalCountries} label={STRINGS.heroKpiCountries[lang]} format={(n) => formatNumber(n, lang)} />
          </div>
        </section>

        {/* The map is the first thing the visitor sees, full width */}
        <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="h-[520px] lg:h-[600px]">
            <MapView
              countries={data.countries}
              selected={drawer}
              onSelect={setDrawer}
              lang={lang}
              groupFilter={(filters.group || null) as DomainGroup | null}
            />
          </div>
          <aside className="rounded-2xl border border-c-border bg-c-surface p-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-c-text-subtle">
              {STRINGS.totalCountries[lang]}
            </h3>
            <p className="mt-0.5 text-xs text-c-text-muted">
              {STRINGS.heroVolumeNote[lang]}
            </p>
            <ul className="mt-3 max-h-[480px] space-y-1 overflow-y-auto scrollbar-thin pr-1">
              {data.countries.slice(0, 30).map((c) => {
                const completion = Math.round(c.completion * 100);
                return (
                  <li key={c.code}>
                    <button
                      type="button"
                      onClick={() => setDrawer(c.code)}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-c-surface-2 ${
                        drawer === c.code ? "bg-c-brand-soft" : ""
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="text-base leading-none">{c.flag}</span>
                        <span className="truncate text-sm font-medium">{c.name}</span>
                      </span>
                      <span className="flex shrink-0 items-center gap-2">
                        <span className="text-[10px] tabular-nums text-c-text-subtle">{completion}%</span>
                        <span className="rounded-md bg-c-surface-2 px-1.5 py-0.5 text-xs font-semibold tabular-nums">
                          {c.total}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>
        </section>

        <section className="mt-10">
          <StatsHeader stats={data.stats} lang={lang} />
        </section>

        <DomainMatrix
          countries={data.countries}
          lang={lang}
          selectedCountry={filters.country || null}
          selectedGroup={(filters.group || null) as DomainGroup | null}
          onSelect={setMatrixSelection}
        />

        <CountriesGrid
          countries={data.countries}
          lang={lang}
          groupFilter={(filters.group || null) as DomainGroup | null}
          onSelect={setDrawer}
        />

        <SourcesTable
          countries={data.countries}
          lang={lang}
          filters={filters}
          onFiltersChange={setFilters}
          onCountrySelect={setDrawer}
        />

        <ApiCallout lang={lang} />

        <footer className="mt-12 border-t border-c-border pt-6 text-xs text-c-text-subtle">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>
              {STRINGS.generatedAt[lang]} {generated} · {STRINGS.classifierBadge[lang]}
            </span>
            <span className="flex flex-wrap items-center gap-x-2">
              <a href="https://cleolabs.co" target="_blank" rel="noopener noreferrer" className="text-c-text-muted hover:text-c-brand">
                Cleo Labs
              </a>
              <span>·</span>
              <Link href="/privacy" className="text-c-text-muted hover:text-c-brand">
                {STRINGS.privacyLink[lang]}
              </Link>
            </span>
          </div>
        </footer>
      </main>

      <CountryDrawer country={drawerCountry} lang={lang} onClose={() => setDrawer(null)} />
    </div>
  );
}

function Kpi({
  value,
  label,
  format,
  accent,
}: {
  value: number;
  label: string;
  format: (n: number) => string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <div className={`tabular-display text-3xl font-light leading-none md:text-4xl ${accent ? "text-c-brand" : "text-c-text"}`}>
        <AnimatedNumber value={value} format={format} />
        {accent ? <span className="text-c-glow">+</span> : null}
      </div>
      <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-c-text-subtle">
        {label}
      </div>
    </div>
  );
}


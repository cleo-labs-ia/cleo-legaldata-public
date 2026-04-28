"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { DashboardData, Domain } from "@/lib/types";
import type { Lang } from "@/lib/i18n";
import { STRINGS } from "@/lib/i18n";
import Hero from "./Hero";
import StatsHeader from "./StatsHeader";
import CountriesGrid from "./CountriesGrid";
import SourcesTable, { type Filters } from "./SourcesTable";
import CountryDrawer from "./CountryDrawer";
import DomainMatrix from "./DomainMatrix";

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
  domain: "",
  country: "",
};

export default function Dashboard({ data }: { data: DashboardData }) {
  const [lang, setLang] = useState<Lang>("fr");
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

  function setMatrixSelection(country: string | null, domain: Domain | null) {
    setFilters((f) => ({
      ...f,
      country: country ?? "",
      domain: (domain ?? "") as Filters["domain"],
    }));
    if (country) {
      const el = document.getElementById("exhaustive");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="min-h-screen pb-16">
      <Hero stats={data.stats} lang={lang} onLangChange={setLang} />

      <main id="explore" className="mx-auto max-w-7xl px-6 pt-12">
        <div className="mb-10 border-l-2 border-c-brand pl-4">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-c-brand">
            {lang === "fr" ? "Atlas — section 1" : "Atlas — section 1"}
          </div>
          <h2 className="mt-1 font-display text-3xl font-light tracking-tight text-c-text">
            {lang === "fr" ? "La photo globale" : "The global picture"}
          </h2>
        </div>

        <StatsHeader stats={data.stats} lang={lang} />

        <section className="mt-8 grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="h-[560px] lg:h-[640px]">
            <MapView
              countries={data.countries}
              selected={drawer}
              onSelect={setDrawer}
              lang={lang}
              domainFilter={(filters.domain || null) as Domain | null}
            />
          </div>
          <aside className="rounded-2xl border border-c-border bg-c-surface p-5">
            <h3 className="text-sm font-semibold tracking-tight">{STRINGS.totalCountries[lang]}</h3>
            <p className="mt-1 text-xs text-c-text-muted">
              {data.stats.totalCountries} · {data.stats.totalSources.toLocaleString(lang === "fr" ? "fr-FR" : "en-US")} {STRINGS.totalSources[lang].toLowerCase()}
            </p>
            <ul className="mt-3 max-h-[520px] space-y-1 overflow-y-auto scrollbar-thin pr-1">
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

        <div className="mt-16 mb-6 border-l-2 border-c-brand pl-4">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-c-brand">
            {lang === "fr" ? "Atlas — section 2" : "Atlas — section 2"}
          </div>
          <h2 className="mt-1 font-display text-3xl font-light tracking-tight text-c-text">
            {lang === "fr" ? "Par domaine réglementaire" : "By regulatory domain"}
          </h2>
        </div>

        <DomainMatrix
          countries={data.countries}
          lang={lang}
          selectedCountry={filters.country || null}
          selectedDomain={(filters.domain || null) as Domain | null}
          onSelect={setMatrixSelection}
        />

        <div className="mt-16 mb-6 border-l-2 border-c-brand pl-4">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-c-brand">
            {lang === "fr" ? "Atlas — section 3" : "Atlas — section 3"}
          </div>
          <h2 className="mt-1 font-display text-3xl font-light tracking-tight text-c-text">
            {lang === "fr" ? "Par juridiction" : "By jurisdiction"}
          </h2>
        </div>

        <CountriesGrid
          countries={data.countries}
          lang={lang}
          domainFilter={(filters.domain || null) as Domain | null}
          onSelect={setDrawer}
        />

        <div className="mt-16 mb-6 border-l-2 border-c-brand pl-4">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-c-brand">
            {lang === "fr" ? "Atlas — section 4" : "Atlas — section 4"}
          </div>
          <h2 className="mt-1 font-display text-3xl font-light tracking-tight text-c-text">
            {lang === "fr" ? "L'inventaire complet" : "The full inventory"}
          </h2>
        </div>

        <SourcesTable
          countries={data.countries}
          lang={lang}
          filters={filters}
          onFiltersChange={setFilters}
          onCountrySelect={setDrawer}
        />

        <footer className="mt-16 border-t border-c-border pt-6 text-xs text-c-text-subtle">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>
              {STRINGS.generatedAt[lang]} {generated} · {STRINGS.classifierBadge[lang]}
            </span>
            <span>
              <a href="https://cleolabs.co" target="_blank" rel="noopener noreferrer" className="text-c-text-muted hover:text-c-brand">
                Cleo Labs
              </a>
              {" · "}
              <a href="https://github.com/Cleo-Labs-IA/legal-sources" target="_blank" rel="noopener noreferrer" className="text-c-text-muted hover:text-c-brand">
                Cleo-Labs-IA/legal-sources
              </a>
            </span>
          </div>
        </footer>
      </main>

      <CountryDrawer country={drawerCountry} lang={lang} onClose={() => setDrawer(null)} />
    </div>
  );
}

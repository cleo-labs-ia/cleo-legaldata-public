"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { DashboardData } from "@/lib/types";
import type { Lang } from "@/lib/i18n";
import { STRINGS } from "@/lib/i18n";
import StatsHeader from "./StatsHeader";
import CountriesGrid from "./CountriesGrid";
import SourcesTable from "./SourcesTable";
import CountryDrawer from "./CountryDrawer";

const MapView = dynamic(() => import("./MapView"), { ssr: false, loading: () => <MapPlaceholder /> });

function MapPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-2xl border border-c-border bg-c-surface-2 text-sm text-c-text-subtle">
      Loading map…
    </div>
  );
}

export default function Dashboard({ data }: { data: DashboardData }) {
  const [lang, setLang] = useState<Lang>("fr");
  const [selected, setSelected] = useState<string | null>(null);

  const selectedCountry = useMemo(
    () => (selected ? data.countries.find((c) => c.code === selected) ?? null : null),
    [data.countries, selected]
  );

  const generated = new Date(data.stats.generatedAt).toLocaleDateString(
    lang === "fr" ? "fr-FR" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="min-h-screen pb-16">
      <header className="border-b border-c-border bg-c-surface">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-c-brand text-sm font-bold text-white">
              c
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">{STRINGS.brand[lang]}</h1>
              <p className="text-xs text-c-text-muted">{STRINGS.tagline[lang]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/Cleo-Labs-IA/legal-sources"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-c-border bg-c-surface px-3 py-1.5 text-xs font-medium text-c-text-muted hover:border-c-brand hover:text-c-brand"
            >
              {STRINGS.github[lang]} ↗
            </a>
            <div className="flex rounded-md border border-c-border bg-c-surface p-0.5 text-xs font-medium">
              {(["fr", "en"] as Lang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`rounded px-2.5 py-1 transition-colors ${
                    lang === l ? "bg-c-brand text-white" : "text-c-text-muted hover:text-c-text"
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pt-8">
        <StatsHeader stats={data.stats} lang={lang} />

        <section className="mt-8 grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="h-[560px] lg:h-[640px]">
            <MapView
              countries={data.countries}
              selected={selected}
              onSelect={setSelected}
              lang={lang}
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
                      onClick={() => setSelected(c.code)}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-c-surface-2 ${
                        selected === c.code ? "bg-c-brand-soft" : ""
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="text-base leading-none">{c.flag}</span>
                        <span className="truncate text-sm font-medium">{c.name}</span>
                      </span>
                      <span className="flex shrink-0 items-center gap-2">
                        <span className="text-[10px] tabular-nums text-c-text-subtle">
                          {completion}%
                        </span>
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

        <CountriesGrid countries={data.countries} lang={lang} onSelect={setSelected} />
        <SourcesTable countries={data.countries} lang={lang} onCountrySelect={setSelected} />

        <footer className="mt-12 border-t border-c-border pt-6 text-xs text-c-text-subtle">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>
              {STRINGS.generatedAt[lang]} {generated}
            </span>
            <span>
              <a
                href="https://cleolabs.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-c-text-muted hover:text-c-brand"
              >
                Cleo Labs
              </a>
              {" · "}
              <a
                href="https://github.com/Cleo-Labs-IA/legal-sources"
                target="_blank"
                rel="noopener noreferrer"
                className="text-c-text-muted hover:text-c-brand"
              >
                Cleo-Labs-IA/legal-sources
              </a>
            </span>
          </div>
        </footer>
      </main>

      <CountryDrawer
        country={selectedCountry}
        lang={lang}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

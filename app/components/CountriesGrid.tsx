"use client";

import { useMemo, useState } from "react";
import type { CountryStats, Domain } from "@/lib/types";
import type { Lang } from "@/lib/i18n";
import { STRINGS } from "@/lib/i18n";

interface Props {
  countries: CountryStats[];
  lang: Lang;
  domainFilter: Domain | null;
  onSelect: (code: string) => void;
}

type Sort = "sources_desc" | "sources_asc" | "completion_desc" | "name_asc";

export default function CountriesGrid({ countries, lang, domainFilter, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("sources_desc");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = countries;
    if (domainFilter) out = out.filter((c) => (c.byDomain[domainFilter] || 0) > 0);
    if (q) {
      out = out.filter(
        (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
      );
    }
    const score = (c: CountryStats) => (domainFilter ? c.byDomain[domainFilter] || 0 : c.total);
    return [...out].sort((a, b) => {
      switch (sort) {
        case "sources_asc":
          return score(a) - score(b);
        case "completion_desc":
          return b.completion - a.completion || score(b) - score(a);
        case "name_asc":
          return a.name.localeCompare(b.name);
        default:
          return score(b) - score(a);
      }
    });
  }, [countries, query, sort, domainFilter]);

  return (
    <section className="mt-12">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{STRINGS.jurisdictionsHeader[lang]}</h2>
          <p className="text-sm text-c-text-muted">
            {filtered.length} / {countries.length}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={STRINGS.searchPlaceholder[lang]}
            className="rounded-lg border border-c-border bg-c-surface px-3 py-1.5 text-sm focus:border-c-brand focus:outline-none focus:ring-2 focus:ring-c-brand-soft"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-lg border border-c-border bg-c-surface px-3 py-1.5 text-sm focus:border-c-brand focus:outline-none"
          >
            <option value="sources_desc">↓ {STRINGS.totalSources[lang]}</option>
            <option value="sources_asc">↑ {STRINGS.totalSources[lang]}</option>
            <option value="completion_desc">↓ {STRINGS.completion[lang]}</option>
            <option value="name_asc">A → Z</option>
          </select>
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.map((c) => {
          const completionPct = Math.round(c.completion * 100);
          const value = domainFilter ? c.byDomain[domainFilter] || 0 : c.total;
          const valueLabel = domainFilter
            ? STRINGS.domain[domainFilter][lang].toLowerCase()
            : STRINGS.totalSources[lang].toLowerCase();
          return (
            <li key={c.code}>
              <button
                type="button"
                onClick={() => onSelect(c.code)}
                className="group flex w-full items-center justify-between gap-3 rounded-xl border border-c-border bg-c-surface p-3 text-left transition-all hover:border-c-brand hover:shadow-sm"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl leading-none">{c.flag}</span>
                    <span className="truncate text-sm font-medium">{c.name}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-c-border">
                      <div
                        className="h-full rounded-full bg-c-success"
                        style={{ width: `${completionPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] tabular-nums text-c-text-subtle">{completionPct}%</span>
                  </div>
                </div>
                <span className="shrink-0 text-right">
                  <span className={`block text-base font-semibold tabular-nums leading-none ${domainFilter ? "text-c-brand" : ""}`}>{value}</span>
                  <span className="block text-[10px] uppercase tracking-wider text-c-text-subtle">
                    {valueLabel}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

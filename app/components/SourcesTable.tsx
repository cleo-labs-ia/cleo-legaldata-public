"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import type { CountryStats, Source, SourceStatus, DataType, DomainGroup } from "@/lib/types";
import { DOMAIN_GROUPS, DOMAIN_GROUP_ORDER, groupOfDomain } from "@/lib/types";
import type { Lang } from "@/lib/i18n";
import { STRINGS } from "@/lib/i18n";
import { StatusBadge, DataTypePill } from "./StatusBadge";

const STATUSES: SourceStatus[] = ["complete", "blocked", "planned", "needs_research", "new"];
const DATA_TYPES: DataType[] = ["legislation", "case_law", "doctrine", "parliamentary_proceedings"];

const PAGE_SIZE = 50;

interface Filters {
  query: string;
  status: SourceStatus | "";
  dataType: DataType | "";
  group: DomainGroup | "";
  country: string;
}

interface Props {
  countries: CountryStats[];
  lang: Lang;
  filters: Filters;
  onFiltersChange: (next: Filters) => void;
  onCountrySelect: (code: string) => void;
}

function sourceMatchesGroup(s: Source, g: DomainGroup): boolean {
  const ds = DOMAIN_GROUPS[g];
  return s.domains.some((d) => ds.includes(d));
}

function sourceGroups(s: Source): DomainGroup[] {
  const set = new Set<DomainGroup>();
  for (const d of s.domains) set.add(groupOfDomain(d));
  return [...set];
}

export default function SourcesTable({ countries, lang, filters, onFiltersChange, onCountrySelect }: Props) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const deferredQuery = useDeferredValue(filters.query);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters]);

  const flat = useMemo(() => {
    const out: (Source & { _country: CountryStats })[] = [];
    for (const c of countries) for (const s of c.sources) out.push({ ...s, _country: c });
    return out;
  }, [countries]);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return flat.filter((s) => {
      if (filters.status && s.status !== filters.status) return false;
      if (filters.dataType && !s.data_types.includes(filters.dataType)) return false;
      if (filters.group && !sourceMatchesGroup(s, filters.group)) return false;
      if (filters.country && s._country.code !== filters.country) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s._country.name.toLowerCase().includes(q) ||
        s._country.code.toLowerCase().includes(q)
      );
    });
  }, [flat, deferredQuery, filters]);

  const sortedCountries = useMemo(
    () => [...countries].sort((a, b) => a.name.localeCompare(b.name)),
    [countries]
  );

  const visibleGroups = useMemo(() => {
    const counts: Partial<Record<DomainGroup, number>> = {};
    for (const c of countries) for (const g of DOMAIN_GROUP_ORDER) counts[g] = (counts[g] || 0) + (c.byGroup[g] || 0);
    return DOMAIN_GROUP_ORDER.filter((g) => (counts[g] || 0) > 0);
  }, [countries]);

  const visible = filtered.slice(0, visibleCount);

  function reset() {
    onFiltersChange({ query: "", status: "", dataType: "", group: "", country: "" });
  }

  function update<K extends keyof Filters>(key: K, value: Filters[K]) {
    onFiltersChange({ ...filters, [key]: value });
  }

  return (
    <section id="exhaustive" className="mt-10 scroll-mt-24">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{STRINGS.exhaustiveList[lang]}</h2>
          <p className="text-sm text-c-text-muted">
            {STRINGS.resultCount[lang](filtered.length)}
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-c-border bg-c-surface px-3 py-1.5 text-sm text-c-text-muted hover:bg-c-surface-2"
        >
          {STRINGS.resetFilters[lang]}
        </button>
      </div>

      <div className="mb-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <input
          type="search"
          value={filters.query}
          onChange={(e) => update("query", e.target.value)}
          placeholder={STRINGS.searchPlaceholder[lang]}
          className="rounded-lg border border-c-border bg-c-surface px-3 py-2 text-sm focus:border-c-brand focus:outline-none focus:ring-2 focus:ring-c-brand-soft sm:col-span-2 lg:col-span-1"
        />
        <select
          value={filters.group}
          onChange={(e) => update("group", e.target.value as DomainGroup | "")}
          className="rounded-lg border border-c-border bg-c-surface px-3 py-2 text-sm focus:border-c-brand focus:outline-none"
        >
          <option value="">{STRINGS.allDomains[lang]}</option>
          {visibleGroups.map((g) => (
            <option key={g} value={g}>
              {STRINGS.group[g][lang]}
            </option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) => update("status", e.target.value as SourceStatus | "")}
          className="rounded-lg border border-c-border bg-c-surface px-3 py-2 text-sm focus:border-c-brand focus:outline-none"
        >
          <option value="">{STRINGS.allStatuses[lang]}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STRINGS.status[s][lang]}
            </option>
          ))}
        </select>
        <select
          value={filters.dataType}
          onChange={(e) => update("dataType", e.target.value as DataType | "")}
          className="rounded-lg border border-c-border bg-c-surface px-3 py-2 text-sm focus:border-c-brand focus:outline-none"
        >
          <option value="">{STRINGS.allDataTypes[lang]}</option>
          {DATA_TYPES.map((t) => (
            <option key={t} value={t}>
              {STRINGS.dataType[t][lang]}
            </option>
          ))}
        </select>
        <select
          value={filters.country}
          onChange={(e) => update("country", e.target.value)}
          className="rounded-lg border border-c-border bg-c-surface px-3 py-2 text-sm focus:border-c-brand focus:outline-none"
        >
          <option value="">{STRINGS.allCountries[lang]}</option>
          {sortedCountries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name} ({c.total})
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-c-border bg-c-surface">
        <table className="min-w-full text-sm">
          <thead className="bg-c-surface-2 text-left text-xs uppercase tracking-wider text-c-text-subtle">
            <tr>
              <th className="px-4 py-2.5 font-medium">{STRINGS.sourceColumn[lang]}</th>
              <th className="px-4 py-2.5 font-medium">{STRINGS.countryColumn[lang]}</th>
              <th className="px-4 py-2.5 font-medium">{STRINGS.filterDomain[lang]}</th>
              <th className="px-4 py-2.5 font-medium">{STRINGS.statusColumn[lang]}</th>
              <th className="px-4 py-2.5 font-medium">{STRINGS.typesColumn[lang]}</th>
              <th className="px-4 py-2.5 text-right font-medium">{STRINGS.visit[lang]}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-c-border">
            {visible.map((s) => {
              const groups = sourceGroups(s);
              return (
                <tr key={s.id} className="hover:bg-c-surface-2/50">
                  <td className="px-4 py-3">
                    <div className="font-medium leading-tight">{s.name}</div>
                    <code className="text-[11px] text-c-text-subtle">{s.id}</code>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onCountrySelect(s._country.code)}
                      className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-xs hover:bg-c-brand-soft hover:text-c-brand-ink"
                    >
                      <span>{s._country.flag}</span>
                      <span className="font-medium">{s._country.name}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {groups.length === 0 ? (
                        <span className="text-[10px] text-c-text-subtle">—</span>
                      ) : (
                        groups.map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => update("group", filters.group === g ? "" : g)}
                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
                              filters.group === g
                                ? "bg-c-brand text-white"
                                : "bg-c-brand-soft text-c-brand-ink hover:bg-c-brand hover:text-white"
                            }`}
                            title={STRINGS.groupSubtitle[g][lang]}
                          >
                            {STRINGS.groupShort[g][lang]}
                          </button>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={s.status} lang={lang} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {s.data_types.map((d) => (
                        <DataTypePill key={d} type={d} lang={lang} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {s.url ? (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-c-text-muted hover:text-c-brand"
                      >
                        ↗
                      </a>
                    ) : null}
                  </td>
                </tr>
              );
            })}
            {visible.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-c-text-muted">
                  {STRINGS.noResults[lang]}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        {filtered.length > visibleCount ? (
          <div className="flex justify-center border-t border-c-border bg-c-surface-2/40 py-3">
            <button
              type="button"
              onClick={() => setVisibleCount((n) => n + PAGE_SIZE * 2)}
              className="rounded-md border border-c-border bg-c-surface px-4 py-1.5 text-sm font-medium text-c-text-muted hover:bg-c-surface-2"
            >
              + {Math.min(PAGE_SIZE * 2, filtered.length - visibleCount)} / {filtered.length - visibleCount}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export type { Filters };

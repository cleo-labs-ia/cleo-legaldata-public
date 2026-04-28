"use client";

import { useDeferredValue, useMemo, useState } from "react";
import type { CountryStats, Source, SourceStatus, DataType } from "@/lib/types";
import type { Lang } from "@/lib/i18n";
import { STRINGS } from "@/lib/i18n";
import { StatusBadge, DataTypePill } from "./StatusBadge";

interface Props {
  countries: CountryStats[];
  lang: Lang;
  onCountrySelect: (code: string) => void;
}

const STATUSES: SourceStatus[] = ["complete", "blocked", "planned", "needs_research", "new"];
const DATA_TYPES: DataType[] = ["legislation", "case_law", "doctrine", "parliamentary_proceedings"];

const PAGE_SIZE = 50;

export default function SourcesTable({ countries, lang, onCountrySelect }: Props) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<SourceStatus | "">("");
  const [typeFilter, setTypeFilter] = useState<DataType | "">("");
  const [countryFilter, setCountryFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const deferredQuery = useDeferredValue(query);

  const flat = useMemo(() => {
    const out: (Source & { _country: CountryStats })[] = [];
    for (const c of countries) for (const s of c.sources) out.push({ ...s, _country: c });
    return out;
  }, [countries]);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return flat.filter((s) => {
      if (statusFilter && s.status !== statusFilter) return false;
      if (typeFilter && !s.data_types.includes(typeFilter)) return false;
      if (countryFilter && s._country.code !== countryFilter) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s._country.name.toLowerCase().includes(q) ||
        s._country.code.toLowerCase().includes(q)
      );
    });
  }, [flat, deferredQuery, statusFilter, typeFilter, countryFilter]);

  const sortedCountries = useMemo(
    () => [...countries].sort((a, b) => a.name.localeCompare(b.name)),
    [countries]
  );

  const visible = filtered.slice(0, visibleCount);

  function reset() {
    setQuery("");
    setStatusFilter("");
    setTypeFilter("");
    setCountryFilter("");
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <section id="exhaustive" className="mt-12 scroll-mt-24">
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

      <div className="mb-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setVisibleCount(PAGE_SIZE);
          }}
          placeholder={STRINGS.searchPlaceholder[lang]}
          className="rounded-lg border border-c-border bg-c-surface px-3 py-2 text-sm focus:border-c-brand focus:outline-none focus:ring-2 focus:ring-c-brand-soft"
        />
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as SourceStatus | "");
            setVisibleCount(PAGE_SIZE);
          }}
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
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value as DataType | "");
            setVisibleCount(PAGE_SIZE);
          }}
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
          value={countryFilter}
          onChange={(e) => {
            setCountryFilter(e.target.value);
            setVisibleCount(PAGE_SIZE);
          }}
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
              <th className="px-4 py-2.5 font-medium">{STRINGS.statusColumn[lang]}</th>
              <th className="px-4 py-2.5 font-medium">{STRINGS.typesColumn[lang]}</th>
              <th className="px-4 py-2.5 text-right font-medium">{STRINGS.visit[lang]}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-c-border">
            {visible.map((s) => (
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
            ))}
            {visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-c-text-muted">
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

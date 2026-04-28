"use client";

import { useMemo } from "react";
import type { CountryStats, DomainGroup } from "@/lib/types";
import { DOMAIN_GROUP_ORDER } from "@/lib/types";
import type { Lang } from "@/lib/i18n";
import { STRINGS } from "@/lib/i18n";

interface Props {
  countries: CountryStats[];
  lang: Lang;
  selectedCountry: string | null;
  selectedGroup: DomainGroup | null;
  onSelect: (country: string | null, group: DomainGroup | null) => void;
}

export default function DomainMatrix({
  countries,
  lang,
  selectedCountry,
  selectedGroup,
  onSelect,
}: Props) {
  const groupTotals = useMemo(() => {
    const totals = Object.fromEntries(DOMAIN_GROUP_ORDER.map((g) => [g, 0])) as Record<DomainGroup, number>;
    for (const c of countries) for (const g of DOMAIN_GROUP_ORDER) totals[g] += c.byGroup[g] || 0;
    return totals;
  }, [countries]);

  const visibleGroups = useMemo(
    () => DOMAIN_GROUP_ORDER.filter((g) => groupTotals[g] > 0),
    [groupTotals]
  );

  const rows = useMemo(() => {
    const filtered = countries.filter((c) => visibleGroups.some((g) => (c.byGroup[g] || 0) > 0));
    filtered.sort((a, b) => {
      const aSum = visibleGroups.reduce((acc, g) => acc + (a.byGroup[g] || 0), 0);
      const bSum = visibleGroups.reduce((acc, g) => acc + (b.byGroup[g] || 0), 0);
      return bSum - aSum;
    });
    return filtered.slice(0, 30);
  }, [countries, visibleGroups]);

  const maxByCol = useMemo(() => {
    const max: Record<DomainGroup, number> = {} as Record<DomainGroup, number>;
    for (const g of visibleGroups) {
      max[g] = Math.max(1, ...rows.map((r) => r.byGroup[g] || 0));
    }
    return max;
  }, [rows, visibleGroups]);

  function bg(value: number, max: number, isActive: boolean) {
    if (value === 0) return "transparent";
    const ratio = Math.min(1, value / max);
    const alpha = 0.12 + ratio * 0.55;
    return isActive ? `rgba(0, 8, 207, ${0.25 + ratio * 0.65})` : `rgba(0, 8, 207, ${alpha})`;
  }

  return (
    <section className="mt-10">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight">{STRINGS.matrixHeader[lang]}</h2>
            <span className="rounded-full bg-c-warn-soft px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-c-warn">
              {lang === "fr" ? "heuristique" : "heuristic"}
            </span>
          </div>
          <p className="text-sm text-c-text-muted">{STRINGS.matrixHelp[lang]}</p>
        </div>
        {(selectedCountry || selectedGroup) && (
          <button
            type="button"
            onClick={() => onSelect(null, null)}
            className="rounded-md border border-c-border bg-c-surface px-3 py-1.5 text-sm text-c-text-muted hover:bg-c-surface-2"
          >
            {STRINGS.resetFilters[lang]}
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-c-border bg-c-surface">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 border-b border-c-border bg-c-surface px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-c-text-subtle">
                {STRINGS.countryColumn[lang]}
              </th>
              {visibleGroups.map((g) => {
                const isActive = selectedGroup === g;
                return (
                  <th
                    key={g}
                    className={`border-b border-c-border px-2 py-3 text-center text-[10px] font-medium uppercase tracking-wider transition-colors ${
                      isActive ? "bg-c-brand-soft text-c-brand-ink" : "text-c-text-subtle"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelect(selectedCountry, isActive ? null : g)}
                      className="flex w-full flex-col items-center gap-0.5 hover:text-c-brand"
                      title={STRINGS.groupSubtitle[g][lang]}
                    >
                      <span className="whitespace-nowrap">{STRINGS.groupShort[g][lang]}</span>
                      <span className="text-[9px] tabular-nums opacity-70">{groupTotals[g]}</span>
                    </button>
                  </th>
                );
              })}
              <th className="border-b border-l border-c-border px-3 py-3 text-right text-[10px] font-medium uppercase tracking-wider text-c-text-subtle">
                Σ
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => {
              const rowSum = visibleGroups.reduce((acc, g) => acc + (c.byGroup[g] || 0), 0);
              const isActiveRow = selectedCountry === c.code;
              return (
                <tr key={c.code} className="group">
                  <th
                    scope="row"
                    className={`sticky left-0 z-10 border-b border-c-border px-3 py-1.5 text-left ${
                      isActiveRow ? "bg-c-brand-soft" : "bg-c-surface group-hover:bg-c-surface-2"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelect(isActiveRow ? null : c.code, selectedGroup)}
                      className="flex w-full items-center gap-2 text-left"
                    >
                      <span className="text-base leading-none">{c.flag}</span>
                      <span className="truncate text-xs font-medium">{c.name}</span>
                    </button>
                  </th>
                  {visibleGroups.map((g) => {
                    const v = c.byGroup[g] || 0;
                    const isActiveCell = selectedCountry === c.code && selectedGroup === g;
                    return (
                      <td
                        key={g}
                        className="border-b border-c-border p-0"
                        style={{ background: bg(v, maxByCol[g], isActiveRow || selectedGroup === g) }}
                      >
                        <button
                          type="button"
                          disabled={v === 0}
                          onClick={() =>
                            onSelect(
                              isActiveCell ? null : c.code,
                              isActiveCell ? null : g
                            )
                          }
                          className={`flex h-9 w-full items-center justify-center text-[11px] font-medium tabular-nums transition-colors ${
                            v === 0
                              ? "text-c-text-subtle/40"
                              : isActiveCell
                              ? "ring-2 ring-inset ring-c-brand text-c-brand-ink font-semibold"
                              : "text-c-text hover:ring-1 hover:ring-inset hover:ring-c-brand-ink/30"
                          }`}
                        >
                          {v || "·"}
                        </button>
                      </td>
                    );
                  })}
                  <td className="border-b border-l border-c-border bg-c-surface-2/40 px-3 py-1.5 text-right text-xs font-semibold tabular-nums">
                    {rowSum}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

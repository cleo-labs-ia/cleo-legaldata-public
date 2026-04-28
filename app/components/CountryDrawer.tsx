"use client";

import { useEffect } from "react";
import type { CountryStats } from "@/lib/types";
import type { Lang } from "@/lib/i18n";
import { STRINGS } from "@/lib/i18n";
import { StatusBadge, DataTypePill } from "./StatusBadge";

interface Props {
  country: CountryStats | null;
  lang: Lang;
  onClose: () => void;
}

export default function CountryDrawer({ country, lang, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!country) return null;

  const completionPct = Math.round(country.completion * 100);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-c-text/30 backdrop-blur-[2px] animate-in fade-in"
        onClick={onClose}
      />
      <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-xl flex-col border-l border-c-border bg-c-surface shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-c-border px-6 py-5">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none">{country.flag}</span>
              <div className="min-w-0">
                <h2 className="truncate text-xl font-semibold tracking-tight">{country.name}</h2>
                <div className="text-xs uppercase tracking-wider text-c-text-subtle">{country.code}</div>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-c-border px-2.5 py-1 text-sm text-c-text-muted hover:bg-c-surface-2"
            aria-label={STRINGS.closeDrawer[lang]}
          >
            ✕
          </button>
        </header>

        <div className="border-b border-c-border bg-c-surface-2/40 px-6 py-4">
          <div className="grid grid-cols-3 gap-3">
            <Stat label={STRINGS.totalSources[lang]} value={country.total.toString()} />
            <Stat label={STRINGS.completion[lang]} value={`${completionPct}%`} />
            <Stat
              label={STRINGS.status.complete[lang]}
              value={country.byStatus.complete.toString()}
              tone="success"
            />
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-c-border">
            <div
              className="h-full rounded-full bg-c-success transition-all"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(["legislation", "case_law", "doctrine", "parliamentary_proceedings"] as const).map((d) => {
              const n = country.byDataType[d];
              if (!n) return null;
              return (
                <span
                  key={d}
                  className="inline-flex items-center gap-1 rounded-md bg-c-surface px-2 py-0.5 text-[11px] text-c-text-muted ring-1 ring-c-border"
                >
                  <DataTypePill type={d} lang={lang} />
                  <span className="font-semibold text-c-text">{n}</span>
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-4">
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-c-text-subtle">
            {STRINGS.inThisJurisdiction[lang]}
          </h3>
          <ul className="space-y-3">
            {country.sources.map((s) => (
              <li
                key={s.id}
                className="rounded-xl border border-c-border bg-c-surface p-4 transition-shadow hover:shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-medium leading-tight">{s.name}</h4>
                      <StatusBadge status={s.status} lang={lang} />
                    </div>
                    <code className="mt-0.5 block text-[11px] text-c-text-subtle">{s.id}</code>
                  </div>
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 rounded-md border border-c-border px-2 py-1 text-[11px] font-medium text-c-text-muted hover:border-c-brand hover:text-c-brand"
                    >
                      {STRINGS.visit[lang]} ↗
                    </a>
                  ) : null}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {s.data_types.map((d) => (
                    <DataTypePill key={d} type={d} lang={lang} />
                  ))}
                  {s.domains.map((d) => (
                    <span
                      key={`d-${d}`}
                      className="inline-flex items-center rounded-md bg-c-brand-soft px-1.5 py-0.5 text-[10px] font-medium text-c-brand-ink"
                    >
                      {STRINGS.domainShort[d][lang]}
                    </span>
                  ))}
                </div>
                {s.notes ? (
                  <details className="mt-2 text-xs text-c-text-muted">
                    <summary className="cursor-pointer text-c-text-subtle hover:text-c-text-muted">
                      {STRINGS.notesHeading[lang]}
                    </summary>
                    <p className="mt-1 whitespace-pre-wrap leading-relaxed">{s.notes}</p>
                  </details>
                ) : null}
                {s.blocked_reason ? (
                  <div className="mt-2 rounded-md bg-c-danger-soft px-2 py-1 text-xs text-c-danger">
                    <span className="font-medium">{STRINGS.blockedReason[lang]}: </span>
                    {s.blocked_reason}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "success" }) {
  return (
    <div className="rounded-lg bg-c-surface px-3 py-2 ring-1 ring-c-border">
      <div className="text-[10px] uppercase tracking-wider text-c-text-subtle">{label}</div>
      <div className={`mt-0.5 text-lg font-semibold ${tone === "success" ? "text-c-success" : ""}`}>
        {value}
      </div>
    </div>
  );
}

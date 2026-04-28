import type { GlobalStats } from "@/lib/types";
import type { Lang } from "@/lib/i18n";
import { STRINGS } from "@/lib/i18n";

const STATUS_DOT: Record<string, string> = {
  complete: "bg-c-success",
  blocked: "bg-c-danger",
  planned: "bg-c-text-subtle",
  needs_research: "bg-c-warn",
  new: "bg-c-info",
};

export default function StatsHeader({ stats, lang }: { stats: GlobalStats; lang: Lang }) {
  const fmt = (n: number) => n.toLocaleString(lang === "fr" ? "fr-FR" : "en-US");
  const completion = stats.totalSources === 0 ? 0 : (stats.byStatus.complete / stats.totalSources) * 100;

  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Big label={STRINGS.totalSources[lang]} value={fmt(stats.totalSources)} />
      <Big label={STRINGS.totalCountries[lang]} value={fmt(stats.totalCountries)} />
      <Big
        label={STRINGS.status.complete[lang]}
        value={fmt(stats.byStatus.complete)}
        accent={`${Math.round(completion)}% ${STRINGS.completion[lang].toLowerCase()}`}
      />
      <div className="rounded-xl border border-c-border bg-c-surface p-4">
        <div className="text-[11px] uppercase tracking-wider text-c-text-subtle">
          {STRINGS.filterStatus[lang]}
        </div>
        <ul className="mt-2 space-y-1.5 text-sm">
          {(["complete", "blocked", "planned", "needs_research", "new"] as const).map((s) => (
            <li key={s} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${STATUS_DOT[s]}`} />
                <span className="text-c-text-muted">{STRINGS.status[s][lang]}</span>
              </span>
              <span className="font-medium tabular-nums">{fmt(stats.byStatus[s])}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Big({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-c-border bg-c-surface p-5">
      <div className="text-[11px] uppercase tracking-wider text-c-text-subtle">{label}</div>
      <div className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">{value}</div>
      {accent ? <div className="mt-1 text-xs text-c-success">{accent}</div> : null}
    </div>
  );
}

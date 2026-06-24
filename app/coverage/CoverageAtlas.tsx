"use client";

import { useDeferredValue, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type {
  CoverageData,
  CovMarket,
  CovHs6,
} from "@/lib/coverage-data";
import { captureColor, pretty } from "@/lib/coverage-data";
import type { Lang } from "@/lib/i18n";
import { STRINGS } from "@/lib/i18n";
import { URLS } from "@/lib/urls";
import SiteHeader from "../components/SiteHeader";

const CoverageMapView = dynamic(() => import("./CoverageMapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-2xl border border-c-border bg-c-surface-2 text-sm text-c-text-subtle">
      Loading map…
    </div>
  ),
});

const T = {
  eyebrow: { en: "Coverage Atlas · Cleo Comply", fr: "Atlas de couverture · Cleo Comply" },
  titleA: { en: "Every product, every authority,", fr: "Chaque produit, chaque autorité," },
  titleB: { en: "and what we monitor live.", fr: "et ce qu'on surveille en direct." },
  subtitle: {
    en: "A live map of the product → HS code → regulation → enforcement-authority chain, and how much of it Cleo captures with a live monitoring feed. Green is covered. Grey is a blind spot.",
    fr: "Une carte vivante de la chaîne produit → code SH → réglementation → autorité, et de la part que Cleo capte via un flux de veille live. Le vert est couvert. Le gris est un angle mort.",
  },
  ctaApi: { en: "Get API access", fr: "Obtenir un accès API" },
  ctaExplore: { en: "Explore coverage", fr: "Explorer la couverture" },
  kHs6: { en: "HS6 product codes", fr: "codes produit SH6" },
  kRegs: { en: "regulations mapped", fr: "réglementations mappées" },
  kAuth: { en: "enforcement authorities", fr: "autorités de contrôle" },
  kMarkets: { en: "markets", fr: "marchés" },
  kCapture: { en: "live-monitored", fr: "veille live" },
  scopeNote: {
    en: "Scope: Cleo Comply product-monitoring graph (HS-coded). Distinct from the /products regulatory catalog.",
    fr: "Périmètre : graphe de veille produit Cleo Comply (codé SH). Distinct du catalogue réglementaire /products.",
  },
  mapTitle: { en: "Live monitoring by market", fr: "Veille live par marché" },
  mapHint: {
    en: "Bubble size = regulations tracked · colour = share with a live feed. Click a market.",
    fr: "Taille = réglementations suivies · couleur = part avec flux live. Cliquez un marché.",
  },
  selectMarket: { en: "Select a market on the map", fr: "Sélectionnez un marché sur la carte" },
  topArchetypes: { en: "Top product types here", fr: "Top types de produits ici" },
  matrixTitle: { en: "Coverage matrix — product type × market", fr: "Matrice — type de produit × marché" },
  matrixHint: {
    en: "Each cell = share of that product type's regulations in that market we monitor live.",
    fr: "Chaque cellule = part des réglementations de ce type de produit, dans ce marché, surveillée en direct.",
  },
  showAll: { en: "Show all", fr: "Tout afficher" },
  showTop: { en: "Show top 28", fr: "Top 28" },
  explorerTitle: { en: "Product → authorities", fr: "Produit → autorités" },
  explorerHint: {
    en: "Pick a product family, then a type, to see every authority that regulates it and whether we capture it live.",
    fr: "Choisissez une famille puis un type pour voir chaque autorité qui le régule et si on la capte en direct.",
  },
  pickType: { en: "Pick a product type", fr: "Choisissez un type de produit" },
  authorities: { en: "authorities", fr: "autorités" },
  monitored: { en: "monitored", fr: "surveillée" },
  notMonitored: { en: "no live feed", fr: "pas de flux" },
  regs: { en: "regs", fr: "régs" },
  hs6Title: { en: "HS6 product explorer", fr: "Explorateur produit SH6" },
  search: { en: "Search HS6 code or description…", fr: "Chercher un code SH6 ou une description…" },
  allFamilies: { en: "All families", fr: "Toutes familles" },
  allStatus: { en: "All", fr: "Tous" },
  onlyMon: { en: "Monitored only", fr: "Surveillés seulement" },
  onlyBlind: { en: "Blind spots only", fr: "Angles morts seulement" },
  showing: { en: "Showing", fr: "Affichés" },
  of: { en: "of", fr: "sur" },
  colCode: { en: "HS6", fr: "SH6" },
  colDesc: { en: "Product", fr: "Produit" },
  colType: { en: "Type", fr: "Type" },
  colMarkets: { en: "Markets", fr: "Marchés" },
  colAuth: { en: "Authorities", fr: "Autorités" },
  colMon: { en: "Live", fr: "Veille" },
  asOf: { en: "Snapshot as of", fr: "Instantané au" },
  source: {
    en: "Source: mv_produit_hs_reg_autorite (Cleo Comply). All figures computed directly from the view.",
    fr: "Source : mv_produit_hs_reg_autorite (Cleo Comply). Tous les chiffres calculés directement depuis la vue.",
  },
};

const tr = (k: keyof typeof T, lang: Lang) => T[k][lang];

const MATRIX_MARKET_COUNT = 16;

export default function CoverageAtlas({ data }: { data: CoverageData }) {
  const [lang, setLang] = useState<Lang>("en");
  const { totals, markets, archetypes, matrix, archetypeAuthorities, hs6, geo } = data;

  /* archetype-level totals (matrix is the clean archetype grain) */
  const archTotals = useMemo(() => {
    const m = new Map<
      string,
      { rows: number; rss: number; regs: number; auth: number; markets: number }
    >();
    for (const c of matrix) {
      const e = m.get(c.k) ?? { rows: 0, rss: 0, regs: 0, auth: 0, markets: 0 };
      e.rows += c.r;
      e.rss += (c.r * c.p) / 100;
      e.regs += c.g;
      e.auth = Math.max(e.auth, c.a);
      e.markets += 1;
      m.set(c.k, e);
    }
    return m;
  }, [matrix]);

  /* familles → their (famille,archetype) nodes */
  const familles = useMemo(() => {
    const fam = new Map<
      string,
      { archetypes: typeof archetypes; hs6: number; regs: number; capWeighted: number; rows: number }
    >();
    for (const a of archetypes) {
      const e =
        fam.get(a.f) ?? { archetypes: [], hs6: 0, regs: 0, capWeighted: 0, rows: 0 };
      e.archetypes.push(a);
      e.hs6 += a.h;
      e.regs += a.g;
      fam.set(a.f, e);
    }
    const list = [...fam.entries()].map(([f, e]) => ({
      f,
      hs6: e.hs6,
      regs: e.regs,
      archetypes: [...e.archetypes].sort((x, y) => y.h - x.h),
    }));
    return list.sort((a, b) => b.regs - a.regs);
  }, [archetypes]);

  return (
    <div className="min-h-screen bg-c-bg">
      <SiteHeader lang={lang} setLang={setLang} active="atlas-coverage" />
      <main className="mx-auto max-w-[1280px] px-5 py-10 lg:px-12">
        {/* ── Hero ── */}
        <section className="pb-8">
          <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-c-brand">
            {tr("eyebrow", lang)}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-tight text-c-text sm:text-5xl">
            {tr("titleA", lang)}{" "}
            <span className="text-c-brand">{tr("titleB", lang)}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-c-text-muted">
            {tr("subtitle", lang)}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href={URLS.SIGNUP}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-full px-6 text-[14px] font-semibold text-white"
              style={{ background: "#0008CF" }}
            >
              {tr("ctaApi", lang)}
            </a>
            <a
              href="#explorer"
              className="inline-flex h-11 items-center justify-center rounded-full border border-c-border bg-white px-6 text-[14px] font-semibold text-c-text hover:bg-c-surface-2"
            >
              {tr("ctaExplore", lang)}
            </a>
          </div>
        </section>

        {/* ── KPIs ── */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <Kpi value={totals.hs6.toLocaleString()} label={tr("kHs6", lang)} />
          <Kpi value={totals.regs.toLocaleString()} label={tr("kRegs", lang)} />
          <Kpi value={totals.autorites.toLocaleString()} label={tr("kAuth", lang)} />
          <Kpi value={totals.marches.toLocaleString()} label={tr("kMarkets", lang)} />
          <Kpi
            value={`${totals.capture_pct}%`}
            label={tr("kCapture", lang)}
            accent={`${Math.round(totals.rss_rows / 1000)}k / ${Math.round(totals.rows / 1000)}k`}
          />
        </section>
        <p className="mt-3 text-[11px] text-c-text-subtle">{tr("scopeNote", lang)}</p>

        {/* ── Map ── */}
        <section className="mt-10">
          <SectionHead title={tr("mapTitle", lang)} hint={tr("mapHint", lang)} />
          <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
            <div className="h-[460px]">
              <MapWithPanel markets={markets} geo={geo} matrix={matrix} lang={lang} />
            </div>
            <MarketTopList markets={markets} geo={geo} lang={lang} />
          </div>
        </section>

        {/* ── Matrix ── */}
        <section className="mt-12">
          <SectionHead title={tr("matrixTitle", lang)} hint={tr("matrixHint", lang)} />
          <Matrix
            markets={markets}
            matrix={matrix}
            archTotals={archTotals}
            geo={geo}
            lang={lang}
          />
        </section>

        {/* ── Explorer ── */}
        <section id="explorer" className="mt-12 scroll-mt-16">
          <SectionHead title={tr("explorerTitle", lang)} hint={tr("explorerHint", lang)} />
          <Explorer
            familles={familles}
            archetypeAuthorities={archetypeAuthorities}
            archTotals={archTotals}
            lang={lang}
          />
        </section>

        {/* ── HS6 table ── */}
        <section className="mt-12">
          <SectionHead title={tr("hs6Title", lang)} hint="" />
          <Hs6Table hs6={hs6} familles={familles.map((f) => f.f)} lang={lang} />
        </section>

        {/* ── Footer ── */}
        <footer className="mt-12 border-t border-c-border pt-6 text-xs text-c-text-subtle">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>
              {tr("asOf", lang)} {totals.as_of.slice(0, 10)} · {tr("source", lang)}
            </span>
            <span className="flex flex-wrap items-center gap-x-2">
              <Link href="/products" className="text-c-text-muted hover:text-c-brand">
                /products
              </Link>
              <span>·</span>
              <a
                href="https://cleolabs.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-c-text-muted hover:text-c-brand"
              >
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
    </div>
  );
}

/* ================================================================
   Sub-components
   ================================================================ */

function Kpi({ value, label, accent }: { value: string; label: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-c-border bg-c-surface p-4">
      <div className="text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
        {value}
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-c-text-subtle">
        {label}
      </div>
      {accent ? <div className="mt-0.5 text-[11px] text-c-text-muted tabular-nums">{accent}</div> : null}
    </div>
  );
}

function SectionHead({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="mb-4">
      <h2 className="font-display text-2xl font-medium tracking-tight text-c-text">{title}</h2>
      {hint ? <p className="mt-1 text-[13px] text-c-text-muted">{hint}</p> : null}
    </div>
  );
}

/* ── Map + selected-market panel ── */
function MapWithPanel({
  markets,
  geo,
  matrix,
  lang,
}: {
  markets: CovMarket[];
  geo: CoverageData["geo"];
  matrix: CoverageData["matrix"];
  lang: Lang;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = useMemo(() => markets.find((m) => m.c === selected) ?? null, [markets, selected]);
  const topHere = useMemo(() => {
    if (!selected) return [];
    return matrix
      .filter((c) => c.c === selected)
      .sort((a, b) => b.g - a.g)
      .slice(0, 8);
  }, [matrix, selected]);

  return (
    <div className="grid h-full gap-4 lg:grid-cols-[1fr_300px]">
      <CoverageMapView
        markets={markets}
        geo={geo}
        selected={selected}
        onSelect={setSelected}
        lang={lang}
      />
      <div className="rounded-2xl border border-c-border bg-c-surface p-4">
        {sel && geo[sel.c] ? (
          <>
            <div className="flex items-center gap-2">
              <span className="text-xl">{geo[sel.c].flag}</span>
              <span className="font-semibold text-c-text">{geo[sel.c].name}</span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span
                className="text-3xl font-semibold tabular-nums"
                style={{ color: captureColor(sel.p) }}
              >
                {sel.p}%
              </span>
              <span className="text-[12px] text-c-text-muted">{tr("kCapture", lang)}</span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[11px] text-c-text-muted">
              <MiniStat n={sel.h} label={tr("kHs6", lang)} />
              <MiniStat n={sel.g} label={tr("kRegs", lang)} />
              <MiniStat n={sel.a} label={tr("kAuth", lang)} />
            </div>
            <div className="mt-3 text-[11px] font-medium uppercase tracking-wider text-c-text-subtle">
              {tr("topArchetypes", lang)}
            </div>
            <ul className="mt-2 space-y-1.5">
              {topHere.map((c) => (
                <li key={c.k} className="flex items-center justify-between gap-2 text-[12px]">
                  <span className="truncate text-c-text">{pretty(c.k)}</span>
                  <span className="flex items-center gap-1.5 tabular-nums text-c-text-muted">
                    <span className="h-2 w-2 rounded-full" style={{ background: captureColor(c.p) }} />
                    {c.p}%
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-center text-[13px] text-c-text-subtle">
            {tr("selectMarket", lang)}
          </div>
        )}
      </div>
    </div>
  );
}

function MiniStat({ n, label }: { n: number; label: string }) {
  return (
    <div className="rounded-lg bg-c-surface-2 p-2">
      <div className="text-sm font-semibold tabular-nums text-c-text">{n.toLocaleString()}</div>
      <div className="mt-0.5 leading-tight">{label}</div>
    </div>
  );
}

/* ── Right-hand market ranking next to the map ── */
function MarketTopList({
  markets,
  geo,
  lang,
}: {
  markets: CovMarket[];
  geo: CoverageData["geo"];
  lang: Lang;
}) {
  const top = useMemo(() => markets.slice(0, 14), [markets]);
  return (
    <div className="rounded-2xl border border-c-border bg-c-surface p-4">
      <div className="mb-2 text-[11px] font-medium uppercase tracking-wider text-c-text-subtle">
        {lang === "fr" ? "Plus gros marchés" : "Largest markets"}
      </div>
      <ul className="space-y-2">
        {top.map((m) => (
          <li key={m.c} className="flex items-center gap-2">
            <span className="w-5 text-base">{geo[m.c]?.flag ?? "🌐"}</span>
            <span className="w-7 shrink-0 text-[12px] text-c-text-muted">{m.c}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-c-surface-2">
              <div
                className="h-full rounded-full"
                style={{ width: `${m.p}%`, background: captureColor(m.p) }}
              />
            </div>
            <span className="w-10 shrink-0 text-right text-[12px] tabular-nums text-c-text">
              {m.p}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Matrix heatmap ── */
function Matrix({
  markets,
  matrix,
  archTotals,
  geo,
  lang,
}: {
  markets: CovMarket[];
  matrix: CoverageData["matrix"];
  archTotals: Map<string, { rows: number; rss: number; regs: number; auth: number; markets: number }>;
  geo: CoverageData["geo"];
  lang: Lang;
}) {
  const [showAll, setShowAll] = useState(false);
  const cols = useMemo(() => markets.slice(0, MATRIX_MARKET_COUNT).map((m) => m.c), [markets]);
  const cell = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of matrix) m.set(`${c.k}|${c.c}`, c.p);
    return m;
  }, [matrix]);

  const rows = useMemo(() => {
    const arr = [...archTotals.entries()]
      .map(([k, e]) => ({ k, regs: e.regs, rows: e.rows }))
      .sort((a, b) => b.rows - a.rows);
    return showAll ? arr : arr.slice(0, 28);
  }, [archTotals, showAll]);

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-c-border bg-c-surface">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-c-surface px-3 py-2 text-left font-medium text-c-text-subtle">
                {lang === "fr" ? "Type de produit" : "Product type"}
              </th>
              {cols.map((c) => (
                <th key={c} className="px-1 py-2 text-center font-medium text-c-text-subtle" title={geo[c]?.name}>
                  <div className="text-base leading-none">{geo[c]?.flag ?? "🌐"}</div>
                  <div className="mt-0.5 text-[10px]">{c}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.k} className="border-t border-c-border/60">
                <td className="sticky left-0 z-10 max-w-[200px] truncate bg-c-surface px-3 py-1.5 text-c-text" title={pretty(r.k)}>
                  {pretty(r.k)}
                </td>
                {cols.map((c) => {
                  const p = cell.get(`${r.k}|${c}`);
                  if (p === undefined)
                    return <td key={c} className="px-1 py-1.5 text-center text-c-text-subtle/40">·</td>;
                  return (
                    <td key={c} className="px-1 py-1.5 text-center">
                      <span
                        className="inline-flex h-6 w-9 items-center justify-center rounded text-[10.5px] font-medium tabular-nums text-white"
                        style={{ background: captureColor(p) }}
                        title={`${pretty(r.k)} · ${geo[c]?.name}: ${p}%`}
                      >
                        {Math.round(p)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={() => setShowAll((v) => !v)}
        className="mt-3 rounded-full border border-c-border bg-white px-4 py-1.5 text-[12px] font-medium text-c-text hover:bg-c-surface-2"
      >
        {showAll ? tr("showTop", lang) : tr("showAll", lang)}
      </button>
    </div>
  );
}

/* ── Product → authorities explorer ── */
function Explorer({
  familles,
  archetypeAuthorities,
  archTotals,
  lang,
}: {
  familles: { f: string; hs6: number; regs: number; archetypes: CoverageData["archetypes"] }[];
  archetypeAuthorities: CoverageData["archetypeAuthorities"];
  archTotals: Map<string, { rows: number; rss: number; regs: number; auth: number; markets: number }>;
  lang: Lang;
}) {
  const [openFam, setOpenFam] = useState<string | null>(familles[0]?.f ?? null);
  const [archetype, setArchetype] = useState<string | null>(null);

  const authsByArch = useMemo(() => {
    const m = new Map<string, CoverageData["archetypeAuthorities"]>();
    for (const a of archetypeAuthorities) {
      const arr = m.get(a.k) ?? [];
      arr.push(a);
      m.set(a.k, arr);
    }
    return m;
  }, [archetypeAuthorities]);

  const auths = useMemo(() => {
    if (!archetype) return [];
    return [...(authsByArch.get(archetype) ?? [])].sort((a, b) => {
      if (a.cap !== b.cap) return a.cap ? -1 : 1;
      return b.g - a.g;
    });
  }, [authsByArch, archetype]);

  const monCount = auths.filter((a) => a.cap).length;

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      {/* families + archetypes */}
      <div className="max-h-[520px] overflow-y-auto rounded-2xl border border-c-border bg-c-surface p-2">
        {familles.map((fam) => {
          const open = openFam === fam.f;
          return (
            <div key={fam.f} className="border-b border-c-border/50 last:border-0">
              <button
                type="button"
                onClick={() => setOpenFam(open ? null : fam.f)}
                className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left hover:bg-c-surface-2"
              >
                <span className="text-[13px] font-semibold text-c-text">{pretty(fam.f)}</span>
                <span className="text-[11px] tabular-nums text-c-text-subtle">{fam.regs.toLocaleString()} {tr("regs", lang)}</span>
              </button>
              {open && (
                <ul className="pb-1">
                  {fam.archetypes.map((a) => {
                    const active = archetype === a.k;
                    return (
                      <li key={`${fam.f}-${a.k}`}>
                        <button
                          type="button"
                          onClick={() => setArchetype(a.k)}
                          className={`flex w-full items-center justify-between gap-2 rounded-md px-3 py-1.5 pl-5 text-left text-[12.5px] ${
                            active ? "bg-c-brand-soft text-c-brand" : "text-c-text-muted hover:bg-c-surface-2"
                          }`}
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: captureColor(a.p) }} />
                            {pretty(a.k)}
                          </span>
                          <span className="shrink-0 tabular-nums opacity-70">{a.a}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* authorities for selected archetype */}
      <div className="rounded-2xl border border-c-border bg-c-surface p-4">
        {archetype ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-lg font-medium text-c-text">{pretty(archetype)}</h3>
              <span className="text-[12px] text-c-text-muted">
                {auths.length} {tr("authorities", lang)} · {monCount} {tr("monitored", lang)} ·{" "}
                {archTotals.get(archetype)?.markets ?? 0} {tr("kMarkets", lang)}
              </span>
            </div>
            <div className="mt-3 grid max-h-[440px] grid-cols-1 gap-1.5 overflow-y-auto sm:grid-cols-2">
              {auths.map((a, i) => (
                <div
                  key={`${a.n}-${i}`}
                  className="flex items-start justify-between gap-2 rounded-lg border border-c-border/70 bg-c-bg px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="truncate text-[12.5px] font-medium text-c-text" title={a.n}>
                      {a.n}
                    </div>
                    {a.d ? (
                      <a
                        href={`https://${a.d}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-[11px] text-c-text-subtle hover:text-c-brand"
                      >
                        {a.d}
                      </a>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                        a.cap ? "bg-c-success-soft text-c-success" : "bg-c-surface-2 text-c-text-subtle"
                      }`}
                    >
                      {a.cap ? `● ${tr("monitored", lang)}` : `○ ${tr("notMonitored", lang)}`}
                    </span>
                    <span className="text-[10.5px] tabular-nums text-c-text-subtle">
                      {a.g} {tr("regs", lang)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex h-full min-h-[200px] items-center justify-center text-[13px] text-c-text-subtle">
            {tr("pickType", lang)}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── HS6 searchable table ── */
const PAGE = 60;

function Hs6Table({
  hs6,
  familles,
  lang,
}: {
  hs6: CovHs6[];
  familles: string[];
  lang: Lang;
}) {
  const [q, setQ] = useState("");
  const [fam, setFam] = useState("");
  const [status, setStatus] = useState<"all" | "mon" | "blind">("all");
  const [limit, setLimit] = useState(PAGE);
  const dq = useDeferredValue(q);

  const filtered = useMemo(() => {
    const needle = dq.trim().toLowerCase();
    return hs6.filter((r) => {
      if (fam && r.f !== fam) return false;
      if (status === "mon" && !r.rss) return false;
      if (status === "blind" && r.rss) return false;
      if (needle) {
        if (
          !r.h.includes(needle) &&
          !r.d.toLowerCase().includes(needle) &&
          !r.k.toLowerCase().includes(needle) &&
          !r.s.toLowerCase().includes(needle)
        )
          return false;
      }
      return true;
    });
  }, [hs6, dq, fam, status]);

  const shown = filtered.slice(0, limit);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setLimit(PAGE);
          }}
          placeholder={tr("search", lang)}
          className="h-10 min-w-[240px] flex-1 rounded-full border border-c-border bg-white px-4 text-[13px] outline-none focus:border-c-brand"
        />
        <select
          value={fam}
          onChange={(e) => {
            setFam(e.target.value);
            setLimit(PAGE);
          }}
          className="h-10 rounded-full border border-c-border bg-white px-3 text-[13px] outline-none"
        >
          <option value="">{tr("allFamilies", lang)}</option>
          {familles.map((f) => (
            <option key={f} value={f}>
              {pretty(f)}
            </option>
          ))}
        </select>
        <div className="flex h-10 items-center overflow-hidden rounded-full border border-c-border bg-white text-[12px]">
          {(["all", "mon", "blind"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setStatus(s);
                setLimit(PAGE);
              }}
              className={`h-full px-3 ${status === s ? "bg-c-brand text-white" : "text-c-text-muted hover:bg-c-surface-2"}`}
            >
              {s === "all" ? tr("allStatus", lang) : s === "mon" ? tr("onlyMon", lang) : tr("onlyBlind", lang)}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-2 text-[12px] text-c-text-subtle">
        {tr("showing", lang)} {Math.min(limit, filtered.length).toLocaleString()} {tr("of", lang)}{" "}
        {filtered.length.toLocaleString()}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-c-border bg-c-surface">
        <table className="w-full border-collapse text-[12.5px]">
          <thead>
            <tr className="text-left text-c-text-subtle">
              <th className="px-3 py-2 font-medium">{tr("colCode", lang)}</th>
              <th className="px-3 py-2 font-medium">{tr("colDesc", lang)}</th>
              <th className="px-3 py-2 font-medium">{tr("colType", lang)}</th>
              <th className="px-3 py-2 text-right font-medium">{tr("regs", lang)}</th>
              <th className="px-3 py-2 text-right font-medium">{tr("colMarkets", lang)}</th>
              <th className="px-3 py-2 text-right font-medium">{tr("colAuth", lang)}</th>
              <th className="px-3 py-2 text-center font-medium">{tr("colMon", lang)}</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.h} className="border-t border-c-border/60 hover:bg-c-surface-2/50">
                <td className="px-3 py-1.5 font-mono text-[12px] text-c-text">{r.h}</td>
                <td className="max-w-[320px] truncate px-3 py-1.5 text-c-text" title={r.d}>
                  {r.d}
                </td>
                <td className="px-3 py-1.5 text-c-text-muted">{pretty(r.k)}</td>
                <td className="px-3 py-1.5 text-right tabular-nums text-c-text">{r.g}</td>
                <td className="px-3 py-1.5 text-right tabular-nums text-c-text-muted">{r.m}</td>
                <td className="px-3 py-1.5 text-right tabular-nums text-c-text-muted">{r.a}</td>
                <td className="px-3 py-1.5 text-center">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full ${r.rss ? "" : "opacity-40"}`}
                    style={{ background: r.rss ? "#1a8a4a" : "#9ca3af" }}
                    title={r.rss ? tr("monitored", lang) : tr("notMonitored", lang)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {limit < filtered.length && (
        <button
          type="button"
          onClick={() => setLimit((l) => l + PAGE * 2)}
          className="mt-3 rounded-full border border-c-border bg-white px-5 py-2 text-[13px] font-medium text-c-text hover:bg-c-surface-2"
        >
          {lang === "fr" ? "Charger plus" : "Load more"}
        </button>
      )}
    </div>
  );
}
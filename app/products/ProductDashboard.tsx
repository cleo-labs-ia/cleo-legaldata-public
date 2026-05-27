"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type {
  ProductComplianceData,
  ProductJurisdiction,
  ProductRegulation,
} from "@/lib/product-data";
import type { Lang } from "@/lib/i18n";
import { STRINGS } from "@/lib/i18n";
import AnimatedNumber from "../components/AnimatedNumber";
import ApiCallout from "../components/ApiCallout";

const ProductMapView = dynamic(() => import("./ProductMapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-2xl border border-c-border bg-c-surface-2 text-sm text-c-text-subtle">
      Loading map…
    </div>
  ),
});

/* ── i18n product strings ── */
const PS = {
  eyebrow: {
    fr: "Atlas conformité produit · Cleo Comply",
    en: "Product Compliance Atlas · Cleo Comply",
  },
  badge: {
    fr: "Product Compliance Atlas",
    en: "Product Compliance Atlas",
  },
  titleA: { fr: "La conformité produit,", en: "Product compliance data," },
  titleB: { fr: "à l'échelle mondiale.", en: "worldwide." },
  subtitle: {
    fr: "De la cosmétique européenne aux normes alimentaires japonaises — un inventaire public de chaque réglementation produit dans 50 juridictions.",
    en: "From EU cosmetics to Japanese food standards — a public inventory of every product regulation across 50 jurisdictions.",
  },
  kpiRegs: { fr: "réglementations", en: "regulations" },
  kpiAuthorities: { fr: "autorités", en: "authorities" },
  kpiCountries: { fr: "pays", en: "countries" },
  kpiProducts: { fr: "produits trackés", en: "products tracked" },
  kpiDocs: { fr: "documents juridiques", en: "legal documents" },
  coverageLabel: { fr: "Couverture", en: "Coverage" },
  ctaApi: { fr: "Demander un accès API", en: "Get API access" },
  ctaCoverage: { fr: "Voir la couverture", en: "See coverage" },
  allCategories: { fr: "Toutes", en: "All" },
  jurisdictionsHeader: {
    fr: "Couverture par juridiction",
    en: "Coverage by jurisdiction",
  },
  categoriesHeader: {
    fr: "Couverture par industrie",
    en: "Coverage by industry",
  },
  regsLabel: { fr: "réglementations", en: "regulations" },
  inApi: { fr: "Dans l'API", en: "In API" },
  comingSoon: { fr: "Q3 2026", en: "Q3 2026" },
  officialText: { fr: "Texte officiel", en: "Official text" },
  categoriesInDrawer: {
    fr: "Réglementations par catégorie",
    en: "Regulations by category",
  },
  closeDrawer: { fr: "Fermer", en: "Close" },
  searchPlaceholder: {
    fr: "Rechercher une juridiction…",
    en: "Search a jurisdiction…",
  },
  searchCatPlaceholder: {
    fr: "Rechercher une catégorie…",
    en: "Search a category…",
  },
  backToSources: { fr: "Atlas des sources", en: "Sources Atlas" },
  navProducts: { fr: "Produits", en: "Products" },
  scrollHint: { fr: "Explorer", en: "Explore" },
  statsCategories: { fr: "Catégories produit", en: "Product categories" },
  statsCoverage: { fr: "Couverture moyenne", en: "Average coverage" },
  statsRegsIdentified: {
    fr: "Réglementations identifiées",
    en: "Regulations identified",
  },
  statsJurisdictions: { fr: "Juridictions", en: "Jurisdictions" },
} as const;

function pt(lang: Lang, key: keyof typeof PS): string {
  return PS[key][lang];
}

/* ── Helpers ── */
function formatNumber(n: number, lang: Lang): string {
  return n.toLocaleString(lang === "fr" ? "fr-FR" : "en-US");
}

function formatCompact(n: number, lang: Lang): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return m >= 100
      ? `${Math.round(m)}M`
      : `${m.toFixed(1).replace(".", lang === "fr" ? "," : ".")}M`;
  }
  if (n >= 1_000) {
    const k = n / 1_000;
    return k >= 100
      ? `${Math.round(k)}k`
      : `${k.toFixed(1).replace(".", lang === "fr" ? "," : ".")}k`;
  }
  return n.toString();
}

function coverageColor(pct: number): string {
  if (pct >= 80) return "bg-c-success";
  if (pct >= 50) return "bg-c-warn";
  return "bg-c-danger";
}

function coverageTextColor(pct: number): string {
  if (pct >= 80) return "text-c-success";
  if (pct >= 50) return "text-c-warn";
  return "text-c-danger";
}

const MEET_URL = "https://www.cleolabs.co/en/meet";

/* ── Main component ── */
export default function ProductDashboard({
  data,
}: {
  data: ProductComplianceData;
}) {
  const [lang, setLang] = useState<Lang>("fr");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [drawerJur, setDrawerJur] = useState<string | null>(null);
  const [jurQuery, setJurQuery] = useState("");
  const [catQuery, setCatQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Filtered regulations by category */
  const filteredRegs = useMemo(() => {
    if (!selectedCategory) return data.regulations;
    return data.regulations.filter((r) => r.category === selectedCategory);
  }, [data.regulations, selectedCategory]);

  /* Jurisdictions list for the sidebar */
  const sortedJurisdictions = useMemo(() => {
    const q = jurQuery.trim().toLowerCase();
    let jurs = [...data.jurisdictions];
    if (q) {
      jurs = jurs.filter(
        (j) =>
          j.name.toLowerCase().includes(q) || j.code.toLowerCase().includes(q)
      );
    }
    return jurs.sort((a, b) => b.total - a.total);
  }, [data.jurisdictions, jurQuery]);

  /* Filtered categories */
  const filteredCategories = useMemo(() => {
    const q = catQuery.trim().toLowerCase();
    if (!q) return data.categories;
    return data.categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [data.categories, catQuery]);

  /* Average coverage */
  const avgCoverage = useMemo(() => {
    if (data.jurisdictions.length === 0) return 0;
    return Math.round(
      data.jurisdictions.reduce((s, j) => s + j.pct, 0) /
        data.jurisdictions.length
    );
  }, [data.jurisdictions]);

  /* Drawer data */
  const drawerData = useMemo(() => {
    if (!drawerJur) return null;
    const jur = data.jurisdictions.find((j) => j.code === drawerJur);
    if (!jur) return null;
    const regs = filteredRegs.filter((r) => r.jurisdiction_code === drawerJur);
    const grouped: Record<string, ProductRegulation[]> = {};
    for (const r of regs) {
      const cat = r.category || "Other";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(r);
    }
    return { jur, regs, grouped };
  }, [drawerJur, data.jurisdictions, filteredRegs]);

  const generated = new Date().toLocaleDateString(
    lang === "fr" ? "fr-FR" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <div className="min-h-screen pb-16">
      {/* ── Hero (identical style to main Hero.tsx) ── */}
      <section
        className="hero-bg relative isolate overflow-hidden text-white"
        style={{ minHeight: "min(100svh, 920px)" }}
      >
        <div aria-hidden className="absolute inset-0 hero-grid" />
        <div
          aria-hidden
          className="absolute -left-[20%] top-[-10%] h-[60vh] w-[60vh] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(107,116,255,0.45), transparent 70%)",
            animation: "hero-pulse 8s ease-in-out infinite",
          }}
        />
        <div
          aria-hidden
          className="absolute right-[-15%] bottom-[-15%] h-[55vh] w-[55vh] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(0,8,207,0.65), transparent 70%)",
            animation: "hero-pulse 11s ease-in-out infinite reverse",
          }}
        />

        {/* Hero header (dark variant, matching Hero.tsx) */}
        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-sm font-bold text-c-brand">
              c
            </div>
            <div className="leading-tight">
              <div className="text-sm font-medium">Cleo Comply</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">
                {pt(lang, "eyebrow")}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-md border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur transition-colors hover:border-white/40 hover:text-white"
            >
              {pt(lang, "backToSources")} ↗
            </Link>
            <div className="flex rounded-md border border-white/20 bg-white/5 p-0.5 text-[11px] font-medium backdrop-blur">
              {(["fr", "en"] as Lang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`rounded px-2 py-1 transition-colors ${
                    lang === l
                      ? "bg-white text-c-brand-ink"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Hero content */}
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="hero-fade hero-fade-1 mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-white/70 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.6)]" />
            {pt(lang, "badge")}
          </div>

          <h1 className="font-display text-5xl font-light leading-[0.95] tracking-tight md:text-7xl lg:text-[88px]">
            <span className="block hero-fade hero-fade-2">
              {pt(lang, "titleA")}
            </span>
            <span className="block hero-fade hero-fade-3 italic text-white/85">
              {pt(lang, "titleB")}
            </span>
          </h1>

          <p className="hero-fade hero-fade-4 mt-8 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            {pt(lang, "subtitle")}
          </p>

          {/* 5 KPIs with growth (matching Hero.tsx glass card grid) */}
          <div className="hero-fade hero-fade-5 mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur sm:grid-cols-5">
            <GrowthKpi
              before="25,000"
              afterValue={209468}
              multiplier="x8"
              label={pt(lang, "kpiRegs")}
              lang={lang}
              featured
            />
            <GrowthKpi
              before="19,000"
              afterValue={27518}
              label={pt(lang, "kpiAuthorities")}
              lang={lang}
            />
            <GrowthKpi
              before="152"
              afterValue={163}
              label={pt(lang, "kpiCountries")}
              lang={lang}
            />
            <GrowthKpi
              before="2,697"
              afterValue={2839}
              multiplier="+5%"
              label={pt(lang, "kpiProducts")}
              lang={lang}
            />
            <div className="relative px-6 py-7 sm:px-8 sm:py-8">
              <div className="tabular-display text-4xl font-light leading-none text-white sm:text-5xl">
                <AnimatedNumber
                  value={1700000}
                  format={(n) => formatCompact(n, lang)}
                />
                <span className="text-c-glow">+</span>
              </div>
              <div className="mt-3 text-sm font-medium uppercase tracking-[0.14em] text-white/65">
                {pt(lang, "kpiDocs")}
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="hero-fade hero-fade-5 mt-8 flex flex-wrap gap-3">
            <a
              href={MEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-c-brand-ink transition-all hover:bg-white/90 hover:shadow-lg"
            >
              {pt(lang, "ctaApi")} →
            </a>
            <a
              href="#coverage"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur transition-colors hover:border-white/40 hover:bg-white/10"
            >
              {pt(lang, "ctaCoverage")}
            </a>
          </div>

          <div
            className={`hero-fade hero-fade-6 mt-14 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-white/50 transition-opacity duration-500 ${
              scrolled ? "opacity-0" : "opacity-100"
            }`}
          >
            <span className="h-px w-8 bg-white/30" />
            <span>{pt(lang, "scrollHint")}</span>
          </div>
        </div>
      </section>

      {/* ── Dashboard nav (matching Dashboard.tsx light header) ── */}
      <header className="sticky top-0 z-50 border-b border-c-border bg-c-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <img
              src="/cleo-icon.svg"
              alt="Cleo"
              width={36}
              height={36}
              className="h-9 w-9 rounded-md"
            />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">
                {STRINGS.brand[lang]}
              </div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-c-text-subtle">
                {pt(lang, "eyebrow")}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-md border border-c-border bg-c-surface px-2.5 py-1 text-[11px] font-medium text-c-text-muted hover:border-c-brand hover:text-c-brand"
            >
              {pt(lang, "backToSources")} →
            </Link>
            <Link
              href="/products"
              className="rounded-md border border-c-brand bg-c-brand-soft px-2.5 py-1 text-[11px] font-medium text-c-brand-ink"
            >
              {STRINGS.navProducts[lang]}
            </Link>
            <Link
              href="/api"
              className="rounded-md border border-c-border bg-c-surface px-2.5 py-1 text-[11px] font-medium text-c-text-muted hover:border-c-brand hover:text-c-brand"
            >
              {STRINGS.navApi[lang]} →
            </Link>
            <div className="flex rounded-md border border-c-border bg-c-surface p-0.5 text-[11px] font-medium">
              {(["fr", "en"] as Lang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`rounded px-2 py-0.5 transition-colors ${
                    lang === l
                      ? "bg-c-brand text-white"
                      : "text-c-text-muted hover:text-c-text"
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="mx-auto max-w-7xl px-6 pt-6">
        {/* Compact title + animated KPIs inline (matching Dashboard.tsx) */}
        <section className="mb-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-display text-3xl font-light leading-[1.05] tracking-tight text-c-text md:text-4xl">
              {pt(lang, "titleA")}{" "}
              <span className="italic text-c-brand">{pt(lang, "titleB")}</span>
            </h1>
            <p className="mt-2 text-sm text-c-text-muted md:text-[15px]">
              {pt(lang, "subtitle")}
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-x-8 gap-y-2">
            <InlineKpi
              value={data.totals.regulations}
              label={pt(lang, "kpiRegs")}
              format={(n) => formatNumber(n, lang)}
              accent
            />
            <InlineKpi
              value={data.jurisdictions.length}
              label={pt(lang, "kpiCountries")}
              format={(n) => formatNumber(n, lang)}
            />
            <InlineKpi
              value={data.categories.length}
              label={pt(lang, "statsCategories")}
              format={(n) => formatNumber(n, lang)}
            />
          </div>
        </section>

        {/* Stats header (matching StatsHeader.tsx) */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatsBig
            label={pt(lang, "statsRegsIdentified")}
            value={formatNumber(data.totals.regulations, lang)}
          />
          <StatsBig
            label={pt(lang, "statsJurisdictions")}
            value={formatNumber(data.jurisdictions.length, lang)}
          />
          <StatsBig
            label={pt(lang, "statsCoverage")}
            value={`${avgCoverage}%`}
            accent={
              avgCoverage >= 50
                ? `${avgCoverage >= 80 ? "+" : ""}${avgCoverage}% ${pt(lang, "coverageLabel").toLowerCase()}`
                : undefined
            }
          />
          <div className="rounded-xl border border-c-border bg-c-surface p-4">
            <div className="text-[11px] uppercase tracking-wider text-c-text-subtle">
              {pt(lang, "statsCategories")}
            </div>
            <ul className="mt-2 space-y-1.5 text-sm">
              {data.categories.slice(0, 5).map((cat) => (
                <li
                  key={cat.name}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${coverageColor(cat.pct)}`}
                    />
                    <span className="truncate text-c-text-muted">
                      {cat.name}
                    </span>
                  </span>
                  <span className="font-medium tabular-nums">{cat.pct}%</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Category pills */}
        <section className="mt-8 mb-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === null
                  ? "border-c-brand bg-c-brand-soft text-c-brand-ink"
                  : "border-c-border bg-c-surface text-c-text-muted hover:border-c-brand hover:text-c-brand"
              }`}
            >
              {pt(lang, "allCategories")}
            </button>
            {data.categories.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === cat.name ? null : cat.name
                  )
                }
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedCategory === cat.name
                    ? "border-c-brand bg-c-brand-soft text-c-brand-ink"
                    : "border-c-border bg-c-surface text-c-text-muted hover:border-c-brand hover:text-c-brand"
                }`}
              >
                {cat.name}
                <span className="ml-1.5 text-[10px] tabular-nums opacity-70">
                  {cat.found}/{cat.total_regs}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Map + sidebar (matching Dashboard.tsx layout) */}
        <section id="coverage" className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="h-[520px] lg:h-[600px]">
            <ProductMapView
              jurisdictions={data.jurisdictions}
              selected={drawerJur}
              onSelect={setDrawerJur}
              lang={lang}
            />
          </div>
          <aside className="rounded-2xl border border-c-border bg-c-surface p-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-c-text-subtle">
              {pt(lang, "statsJurisdictions")}
            </h3>
            <p className="mt-0.5 text-xs text-c-text-muted">
              {lang === "fr"
                ? "Couverture réglementaire par pays"
                : "Regulatory coverage by country"}
            </p>
            <div className="mt-2 mb-3">
              <input
                type="search"
                value={jurQuery}
                onChange={(e) => setJurQuery(e.target.value)}
                placeholder={pt(lang, "searchPlaceholder")}
                className="w-full rounded-lg border border-c-border bg-c-surface-2 px-3 py-1.5 text-sm focus:border-c-brand focus:outline-none focus:ring-2 focus:ring-c-brand-soft"
              />
            </div>
            <ul className="mt-3 max-h-[480px] space-y-1 overflow-y-auto scrollbar-thin pr-1">
              {sortedJurisdictions.map((j) => (
                <li key={j.code}>
                  <button
                    type="button"
                    onClick={() => setDrawerJur(j.code)}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-c-surface-2 ${
                      drawerJur === j.code ? "bg-c-brand-soft" : ""
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="text-base leading-none">{j.flag}</span>
                      <span className="truncate text-sm font-medium">
                        {j.name}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <span
                        className={`text-[10px] tabular-nums ${coverageTextColor(j.pct)}`}
                      >
                        {j.pct}%
                      </span>
                      <span className="rounded-md bg-c-surface-2 px-1.5 py-0.5 text-xs font-semibold tabular-nums">
                        {j.total}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        {/* Category coverage cards (matching CountriesGrid.tsx style) */}
        <section className="mt-12">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                {pt(lang, "categoriesHeader")}
              </h2>
              <p className="text-sm text-c-text-muted">
                {filteredCategories.length} / {data.categories.length}
                {" · "}
                {formatNumber(data.regulations.length, lang)}{" "}
                {pt(lang, "regsLabel")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                type="search"
                value={catQuery}
                onChange={(e) => setCatQuery(e.target.value)}
                placeholder={pt(lang, "searchCatPlaceholder")}
                className="rounded-lg border border-c-border bg-c-surface px-3 py-1.5 text-sm focus:border-c-brand focus:outline-none focus:ring-2 focus:ring-c-brand-soft"
              />
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCategories.map((cat) => (
              <li key={cat.name}>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === cat.name ? null : cat.name
                    )
                  }
                  className={`group flex w-full flex-col rounded-xl border p-4 text-left transition-all hover:shadow-sm ${
                    selectedCategory === cat.name
                      ? "border-c-brand bg-c-brand-soft/30"
                      : "border-c-border bg-c-surface hover:border-c-brand"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold leading-tight">
                      {cat.name}
                    </h3>
                    <span
                      className={`shrink-0 text-lg font-semibold tabular-nums ${coverageTextColor(cat.pct)}`}
                    >
                      {cat.pct}%
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-c-text-muted line-clamp-2">
                    {cat.description}
                  </p>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-c-border">
                    <div
                      className={`h-full rounded-full transition-all ${coverageColor(cat.pct)}`}
                      style={{ width: `${cat.pct}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-c-text-subtle">
                    <span>
                      {cat.found}/{cat.total_regs} {pt(lang, "regsLabel")}
                    </span>
                    <span>
                      {cat.jurisdictions} {pt(lang, "kpiCountries")}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* API Callout (reuse existing component) */}
        <ApiCallout lang={lang} />

        {/* Footer (matching Dashboard.tsx) */}
        <footer className="mt-12 border-t border-c-border pt-6 text-xs text-c-text-subtle">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>
              {STRINGS.generatedAt[lang]} {generated}
            </span>
            <span className="flex flex-wrap items-center gap-x-2">
              <Link
                href="/"
                className="text-c-text-muted hover:text-c-brand"
              >
                {pt(lang, "backToSources")}
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
              <Link
                href="/privacy"
                className="text-c-text-muted hover:text-c-brand"
              >
                {STRINGS.privacyLink[lang]}
              </Link>
            </span>
          </div>
        </footer>
      </main>

      {/* ── Country Drawer (matching CountryDrawer.tsx style) ── */}
      {drawerData && (
        <ProductDrawer
          data={drawerData}
          lang={lang}
          onClose={() => setDrawerJur(null)}
        />
      )}
    </div>
  );
}

/* ── Growth KPI for hero (with AnimatedNumber) ── */
function GrowthKpi({
  before,
  afterValue,
  multiplier,
  label,
  lang,
  featured,
}: {
  before: string;
  afterValue: number;
  multiplier?: string;
  label: string;
  lang: Lang;
  featured?: boolean;
}) {
  return (
    <div
      className={`relative px-6 py-7 sm:px-8 sm:py-8 ${featured ? "bg-white/[0.06]" : "bg-transparent"}`}
    >
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-light text-white/40 line-through decoration-white/20">
          {before}
        </span>
        <span className="text-white/40">→</span>
      </div>
      <div className="tabular-display mt-1 text-3xl font-light leading-none text-white sm:text-4xl">
        <AnimatedNumber
          value={afterValue}
          format={(n) => formatNumber(n, lang)}
        />
        {multiplier && (
          <span className="ml-2 text-sm font-medium text-emerald-400">
            {multiplier}
          </span>
        )}
      </div>
      <div className="mt-3 text-sm font-medium uppercase tracking-[0.14em] text-white/65">
        {label}
      </div>
    </div>
  );
}

/* ── Inline KPI (matching Dashboard.tsx compact KPI) ── */
function InlineKpi({
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
      <div
        className={`tabular-display text-3xl font-light leading-none md:text-4xl ${accent ? "text-c-brand" : "text-c-text"}`}
      >
        <AnimatedNumber value={value} format={format} />
        {accent ? <span className="text-c-glow">+</span> : null}
      </div>
      <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-c-text-subtle">
        {label}
      </div>
    </div>
  );
}

/* ── Stats Big card (matching StatsHeader.tsx Big) ── */
function StatsBig({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-c-border bg-c-surface p-5">
      <div className="text-[11px] uppercase tracking-wider text-c-text-subtle">
        {label}
      </div>
      <div className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">
        {value}
      </div>
      {accent ? (
        <div className="mt-1 text-xs text-c-success">{accent}</div>
      ) : null}
    </div>
  );
}

/* ── Country Drawer (matching CountryDrawer.tsx) ── */
function ProductDrawer({
  data,
  lang,
  onClose,
}: {
  data: {
    jur: ProductJurisdiction;
    regs: ProductRegulation[];
    grouped: Record<string, ProductRegulation[]>;
  };
  lang: Lang;
  onClose: () => void;
}) {
  const { jur, regs, grouped } = data;
  const categories = Object.keys(grouped).sort();

  /* Escape key to close */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* Lock body scroll while drawer is open (matching CountryDrawer) */
  useEffect(() => {
    const prev = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0)
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.body.style.overflow = prev;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 z-[1100] bg-c-text/40 backdrop-blur-[2px] transition-opacity duration-200"
        onClick={onClose}
      />
      <aside className="fixed right-0 top-0 z-[1101] flex h-[100dvh] w-full max-w-xl flex-col border-l border-c-border bg-c-surface shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-c-border px-6 py-5">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none">{jur.flag}</span>
              <div className="min-w-0">
                <h2 className="truncate text-xl font-semibold tracking-tight">
                  {jur.name}
                </h2>
                <div className="text-xs uppercase tracking-wider text-c-text-subtle">
                  {jur.code}
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-c-border px-2.5 py-1 text-sm text-c-text-muted hover:bg-c-surface-2"
            aria-label={pt(lang, "closeDrawer")}
          >
            ✕
          </button>
        </header>

        {/* Stats bar */}
        <div className="border-b border-c-border bg-c-surface-2/40 px-6 py-4">
          <div className="grid grid-cols-3 gap-3">
            <DrawerStat
              label={lang === "fr" ? "Total" : "Total"}
              value={jur.total.toString()}
            />
            <DrawerStat
              label={pt(lang, "coverageLabel")}
              value={`${jur.pct}%`}
              tone={jur.pct >= 80 ? "success" : undefined}
            />
            <DrawerStat
              label={lang === "fr" ? "Couvert" : "Covered"}
              value={jur.found.toString()}
              tone="success"
            />
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-c-border">
            <div
              className={`h-full rounded-full transition-all ${coverageColor(jur.pct)}`}
              style={{ width: `${jur.pct}%` }}
            />
          </div>
        </div>

        {/* Regulations grouped by category */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-4">
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-c-text-subtle">
            {pt(lang, "categoriesInDrawer")} ({regs.length})
          </h3>
          {categories.map((cat) => (
            <div key={cat} className="mb-4">
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-c-text">
                {cat}
                <span className="rounded-full bg-c-surface-2 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-c-text-subtle">
                  {grouped[cat].length}
                </span>
              </h4>
              <ul className="space-y-2">
                {grouped[cat].map((r, i) => (
                  <li
                    key={`${r.regulation_ref}-${i}`}
                    className="rounded-xl border border-c-border bg-c-surface p-3 transition-shadow hover:shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h5 className="text-sm font-medium leading-tight">
                            {r.regulation_name}
                          </h5>
                          {r.in_api ? (
                            <span className="inline-flex items-center rounded-full bg-c-success-soft px-2 py-0.5 text-[10px] font-medium text-c-success">
                              {pt(lang, "inApi")}
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-c-warn-soft px-2 py-0.5 text-[10px] font-medium text-c-warn">
                              {pt(lang, "comingSoon")}
                            </span>
                          )}
                          {r.criticality === "critical" && (
                            <span className="inline-flex items-center rounded-full bg-c-danger-soft px-2 py-0.5 text-[10px] font-medium text-c-danger">
                              Critical
                            </span>
                          )}
                        </div>
                        <code className="mt-0.5 block text-[11px] text-c-text-subtle">
                          {r.regulation_ref}
                        </code>
                        {r.enforcement_body && (
                          <div className="mt-1 text-[11px] text-c-text-muted">
                            {r.enforcement_body}
                          </div>
                        )}
                      </div>
                      {r.url && (
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 rounded-md border border-c-border px-2 py-1 text-[11px] font-medium text-c-text-muted hover:border-c-brand hover:text-c-brand"
                        >
                          {pt(lang, "officialText")} ↗
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}

function DrawerStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "success";
}) {
  return (
    <div className="rounded-lg bg-c-surface px-3 py-2 ring-1 ring-c-border">
      <div className="text-[10px] uppercase tracking-wider text-c-text-subtle">
        {label}
      </div>
      <div
        className={`mt-0.5 text-lg font-semibold ${tone === "success" ? "text-c-success" : ""}`}
      >
        {value}
      </div>
    </div>
  );
}

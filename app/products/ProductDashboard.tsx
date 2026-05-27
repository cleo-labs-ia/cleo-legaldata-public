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
      Loading map...
    </div>
  ),
});

/* ── i18n product strings ── */
const PS = {
  eyebrow: {
    fr: "Atlas conformite produit · Cleo Comply",
    en: "Product Compliance Atlas · Cleo Comply",
  },
  badge: {
    fr: "Product Compliance Atlas",
    en: "Product Compliance Atlas",
  },
  titleA: { fr: "La conformite produit,", en: "Product compliance data," },
  titleB: { fr: "a l'echelle mondiale.", en: "worldwide." },
  subtitle: {
    fr: "De la cosmetique europeenne aux normes alimentaires japonaises — un inventaire public de chaque reglementation produit dans 50 juridictions.",
    en: "From EU cosmetics to Japanese food standards — a public inventory of every product regulation across 50 jurisdictions.",
  },
  kpiRegs: { fr: "reglementations", en: "regulations" },
  kpiAuthorities: { fr: "autorites", en: "authorities" },
  kpiCountries: { fr: "pays", en: "countries" },
  kpiProducts: { fr: "produits trackes", en: "products tracked" },
  kpiDocs: { fr: "documents juridiques", en: "legal documents" },
  coverageLabel: { fr: "Couverture", en: "Coverage" },
  ctaApi: { fr: "Demander un acces API", en: "Get API access" },
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
  regsLabel: { fr: "reglementations", en: "regulations" },
  inApi: { fr: "Dans l'API", en: "In API" },
  comingSoon: { fr: "Q3 2026", en: "Q3 2026" },
  officialText: { fr: "Texte officiel", en: "Official text" },
  categoriesInDrawer: {
    fr: "Reglementations par categorie",
    en: "Regulations by category",
  },
  closeDrawer: { fr: "Fermer", en: "Close" },
  searchPlaceholder: {
    fr: "Rechercher une juridiction...",
    en: "Search a jurisdiction...",
  },
  searchCatPlaceholder: {
    fr: "Rechercher une categorie...",
    en: "Search a category...",
  },
  backToSources: { fr: "Atlas des sources", en: "Sources Atlas" },
  navProducts: { fr: "Produits", en: "Products" },
  scrollHint: { fr: "Explorer", en: "Explore" },
  statsCategories: { fr: "Categories produit", en: "Product categories" },
  statsCoverage: { fr: "Couverture moyenne", en: "Average coverage" },
  statsRegsIdentified: {
    fr: "Reglementations identifiees",
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

/* V4 monochrome coverage — no green/red */
function coverageBg(pct: number): string {
  if (pct >= 80) return "bg-[rgba(0,0,0,0.87)]";
  if (pct >= 50) return "bg-[#946B2D]";
  return "bg-[rgba(0,0,0,0.25)]";
}

function coverageTextColor(pct: number): string {
  if (pct >= 80) return "text-[rgba(0,0,0,0.87)]";
  if (pct >= 50) return "text-[#946B2D]";
  return "text-[rgba(0,0,0,0.45)]";
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
    <div className="min-h-screen bg-[#F9F8F6]">
      {/* ── 1. Sticky Nav — light, glass blur ── */}
      <header
        className={`sticky top-0 z-50 transition-shadow duration-200 ${
          scrolled ? "shadow-[0_2px_8px_rgba(0,0,0,0.04)]" : ""
        }`}
        style={{
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "saturate(180%) blur(28px)",
          WebkitBackdropFilter: "saturate(180%) blur(28px)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight" style={{ color: "#1A1A1A" }}>
              cleo
            </span>
          </div>
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/"
              className="rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors"
              style={{ color: "rgba(0,0,0,0.55)" }}
            >
              {pt(lang, "backToSources")}
            </Link>
            <Link
              href="/products"
              className="rounded-full px-3 py-1.5 text-[13px] font-semibold"
              style={{
                color: "#0008CF",
                background: "rgba(0,8,207,0.06)",
              }}
            >
              {STRINGS.navProducts[lang]}
            </Link>
            <Link
              href="/api"
              className="rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors"
              style={{ color: "rgba(0,0,0,0.55)" }}
            >
              {STRINGS.navApi[lang]}
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            {/* Lang switcher */}
            <div
              className="flex rounded-full p-0.5 text-[11px] font-medium"
              style={{ border: "1px solid rgba(0,0,0,0.08)" }}
            >
              {(["fr", "en"] as Lang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`rounded-full px-2.5 py-1 transition-colors ${
                    lang === l
                      ? "bg-[#1A1A1A] text-white"
                      : "text-[rgba(0,0,0,0.45)] hover:text-[rgba(0,0,0,0.87)]"
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            {/* CTA pill button */}
            <a
              href={MEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full px-4 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#333] sm:inline-flex"
              style={{ background: "#1A1A1A" }}
            >
              Get API key
            </a>
          </div>
        </div>
      </header>

      {/* ── 2. Hero Section — light background ── */}
      <section className="px-6 pb-16 pt-16 md:pt-24" style={{ background: "#F9F8F6" }}>
        <div className="mx-auto max-w-7xl">
          {/* Badge pill */}
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-semibold tracking-wide"
            style={{
              background: "rgba(0,8,207,0.06)",
              color: "#0008CF",
            }}
          >
            {pt(lang, "badge")}
          </div>

          {/* Title — Satoshi 700, not Fraunces */}
          <h1
            className="max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl lg:text-[72px]"
            style={{ color: "#1A1A1A", fontFamily: "'Satoshi', sans-serif" }}
          >
            {pt(lang, "titleA")}
            <br />
            <span style={{ color: "#1A1A1A" }}>
              {pt(lang, "titleB")}
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="mt-6 max-w-2xl text-base leading-relaxed md:text-lg"
            style={{ color: "rgba(0,0,0,0.55)" }}
          >
            {pt(lang, "subtitle")}
          </p>

          {/* 5 KPIs — white cards, "before -> after" format */}
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <KpiCard
              before="25,000"
              afterValue={209468}
              multiplier="x8"
              label={pt(lang, "kpiRegs")}
              lang={lang}
            />
            <KpiCard
              before="19,000"
              afterValue={27518}
              label={pt(lang, "kpiAuthorities")}
              lang={lang}
            />
            <KpiCard
              before="152"
              afterValue={163}
              label={pt(lang, "kpiCountries")}
              lang={lang}
            />
            <KpiCard
              before="2,697"
              afterValue={2839}
              multiplier="+5%"
              label={pt(lang, "kpiProducts")}
              lang={lang}
            />
            <div
              className="flex flex-col justify-between rounded-2xl p-5"
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <div
                className="text-3xl font-bold tabular-nums leading-none md:text-4xl"
                style={{ color: "#1A1A1A" }}
              >
                <AnimatedNumber
                  value={1700000}
                  format={(n) => formatCompact(n, lang)}
                />
                <span style={{ color: "#0008CF" }}>+</span>
              </div>
              <div
                className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em]"
                style={{ color: "rgba(0,0,0,0.45)" }}
              >
                {pt(lang, "kpiDocs")}
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={MEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#333]"
              style={{ background: "#1A1A1A" }}
            >
              {pt(lang, "ctaApi")} &rarr;
            </a>
            <a
              href="#coverage"
              className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-colors"
              style={{
                border: "1px solid rgba(0,0,0,0.15)",
                color: "rgba(0,0,0,0.62)",
              }}
            >
              {pt(lang, "ctaCoverage")}
            </a>
          </div>
        </div>
      </section>

      {/* ── 3. Map Section ── */}
      <main className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <section className="mb-6 pt-8">
          <h2
            className="text-2xl font-bold tracking-tight md:text-3xl"
            style={{ color: "#1A1A1A" }}
          >
            {pt(lang, "jurisdictionsHeader")}
          </h2>
          <p
            className="mt-1 text-sm"
            style={{ color: "rgba(0,0,0,0.55)" }}
          >
            {formatNumber(data.jurisdictions.length, lang)}{" "}
            {pt(lang, "kpiCountries")} &middot;{" "}
            {formatNumber(data.totals.regulations, lang)}{" "}
            {pt(lang, "regsLabel")}
          </p>
        </section>

        {/* Category pills */}
        <section className="mb-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
              style={
                selectedCategory === null
                  ? {
                      background: "rgba(0,8,207,0.06)",
                      color: "#0008CF",
                      borderColor: "rgba(0,8,207,0.15)",
                    }
                  : {
                      background: "#FFFFFF",
                      color: "rgba(0,0,0,0.62)",
                      borderColor: "rgba(0,0,0,0.08)",
                    }
              }
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
                className="rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
                style={
                  selectedCategory === cat.name
                    ? {
                        background: "rgba(0,8,207,0.06)",
                        color: "#0008CF",
                        borderColor: "rgba(0,8,207,0.15)",
                      }
                    : {
                        background: "#FFFFFF",
                        color: "rgba(0,0,0,0.62)",
                        borderColor: "rgba(0,0,0,0.08)",
                      }
                }
              >
                {cat.name}
                <span className="ml-1.5 text-[10px] tabular-nums opacity-60">
                  {cat.found}/{cat.total_regs}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Map + sidebar */}
        <section id="coverage" className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="h-[520px] lg:h-[600px]">
            <ProductMapView
              jurisdictions={data.jurisdictions}
              selected={drawerJur}
              onSelect={setDrawerJur}
              lang={lang}
            />
          </div>
          <aside
            className="rounded-2xl p-4"
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <h3
              className="text-[11px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: "rgba(0,0,0,0.45)" }}
            >
              {pt(lang, "statsJurisdictions")}
            </h3>
            <p
              className="mt-0.5 text-xs"
              style={{ color: "rgba(0,0,0,0.55)" }}
            >
              {lang === "fr"
                ? "Couverture reglementaire par pays"
                : "Regulatory coverage by country"}
            </p>
            <div className="mt-2 mb-3">
              <input
                type="search"
                value={jurQuery}
                onChange={(e) => setJurQuery(e.target.value)}
                placeholder={pt(lang, "searchPlaceholder")}
                className="w-full rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2"
                style={{
                  background: "#F9F8F6",
                  border: "1px solid rgba(0,0,0,0.08)",
                }}
              />
            </div>
            <ul className="mt-3 max-h-[480px] space-y-1 overflow-y-auto scrollbar-thin pr-1">
              {sortedJurisdictions.map((j) => (
                <li key={j.code}>
                  <button
                    type="button"
                    onClick={() => setDrawerJur(j.code)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl px-2 py-1.5 text-left transition-colors"
                    style={{
                      background:
                        drawerJur === j.code
                          ? "rgba(0,8,207,0.06)"
                          : "transparent",
                    }}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span className="text-base leading-none">{j.flag}</span>
                      <span
                        className="truncate text-sm font-medium"
                        style={{ color: "rgba(0,0,0,0.87)" }}
                      >
                        {j.name}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <span
                        className={`text-[10px] tabular-nums ${coverageTextColor(j.pct)}`}
                      >
                        {j.pct}%
                      </span>
                      <span
                        className="rounded-lg px-1.5 py-0.5 text-xs font-semibold tabular-nums"
                        style={{
                          background: "#F0EFEC",
                          color: "rgba(0,0,0,0.62)",
                        }}
                      >
                        {j.total}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        {/* ── 4. Category Coverage Cards ── */}
        <section className="mt-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2
                className="text-2xl font-bold tracking-tight md:text-3xl"
                style={{ color: "#1A1A1A" }}
              >
                {pt(lang, "categoriesHeader")}
              </h2>
              <p
                className="mt-1 text-sm"
                style={{ color: "rgba(0,0,0,0.55)" }}
              >
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
                className="rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(0,0,0,0.08)",
                }}
              />
            </div>
          </div>

          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCategories.map((cat) => (
              <li key={cat.name}>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === cat.name ? null : cat.name
                    )
                  }
                  className="group flex w-full flex-col rounded-2xl p-5 text-left transition-all hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)]"
                  style={{
                    background:
                      selectedCategory === cat.name
                        ? "rgba(0,8,207,0.04)"
                        : "#FFFFFF",
                    border:
                      selectedCategory === cat.name
                        ? "1px solid rgba(0,8,207,0.15)"
                        : "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className="text-sm font-semibold leading-tight"
                      style={{ color: "rgba(0,0,0,0.87)" }}
                    >
                      {cat.name}
                    </h3>
                    <span
                      className={`shrink-0 text-lg font-bold tabular-nums ${coverageTextColor(cat.pct)}`}
                    >
                      {cat.pct}%
                    </span>
                  </div>
                  <p
                    className="mt-1.5 text-xs leading-relaxed line-clamp-2"
                    style={{ color: "rgba(0,0,0,0.55)" }}
                  >
                    {cat.description}
                  </p>
                  {/* V4 progress bar: 5px height, monochrome */}
                  <div
                    className="mt-4 h-[5px] w-full overflow-hidden rounded-full"
                    style={{ background: "rgba(0,0,0,0.06)" }}
                  >
                    <div
                      className={`h-full rounded-full transition-all ${coverageBg(cat.pct)}`}
                      style={{ width: `${cat.pct}%` }}
                    />
                  </div>
                  <div
                    className="mt-2.5 flex items-center justify-between text-[10px] font-medium"
                    style={{ color: "rgba(0,0,0,0.45)" }}
                  >
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

        {/* ── 5. API Callout ── */}
        <ApiCallout lang={lang} />

        {/* ── 6. Footer — light, simple ── */}
        <footer
          className="mt-16 pb-8 pt-6 text-xs"
          style={{
            borderTop: "1px solid rgba(0,0,0,0.08)",
            color: "rgba(0,0,0,0.45)",
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>
              {STRINGS.generatedAt[lang]} {generated}
            </span>
            <span className="flex flex-wrap items-center gap-x-2">
              <Link
                href="/"
                className="transition-colors hover:text-[#0008CF]"
                style={{ color: "rgba(0,0,0,0.55)" }}
              >
                {pt(lang, "backToSources")}
              </Link>
              <span>&middot;</span>
              <a
                href="https://cleolabs.co"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#0008CF]"
                style={{ color: "rgba(0,0,0,0.55)" }}
              >
                Cleo Labs
              </a>
              <span>&middot;</span>
              <Link
                href="/privacy"
                className="transition-colors hover:text-[#0008CF]"
                style={{ color: "rgba(0,0,0,0.55)" }}
              >
                {STRINGS.privacyLink[lang]}
              </Link>
            </span>
          </div>
        </footer>
      </main>

      {/* ── Country Drawer ── */}
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

/* ── KPI Card (white card, "before -> after") ── */
function KpiCard({
  before,
  afterValue,
  multiplier,
  label,
  lang,
}: {
  before: string;
  afterValue: number;
  multiplier?: string;
  label: string;
  lang: Lang;
}) {
  return (
    <div
      className="flex flex-col justify-between rounded-2xl p-5"
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <div className="flex items-baseline gap-2">
        <span
          className="text-sm line-through"
          style={{ color: "rgba(0,0,0,0.35)" }}
        >
          {before}
        </span>
        <span style={{ color: "rgba(0,0,0,0.25)" }}>&rarr;</span>
      </div>
      <div
        className="mt-1.5 text-3xl font-bold tabular-nums leading-none md:text-4xl"
        style={{ color: "#1A1A1A" }}
      >
        <AnimatedNumber
          value={afterValue}
          format={(n) => formatNumber(n, lang)}
        />
        {multiplier && (
          <span
            className="ml-2 text-sm font-semibold"
            style={{ color: "#0008CF" }}
          >
            {multiplier}
          </span>
        )}
      </div>
      <div
        className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em]"
        style={{ color: "rgba(0,0,0,0.45)" }}
      >
        {label}
      </div>
    </div>
  );
}

/* ── Country Drawer ── */
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

  /* Lock body scroll while drawer is open */
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
        className="fixed inset-0 z-[1100] backdrop-blur-[2px] transition-opacity duration-200"
        style={{ background: "rgba(0,0,0,0.25)" }}
        onClick={onClose}
      />
      <aside
        className="fixed right-0 top-0 z-[1101] flex h-[100dvh] w-full max-w-xl flex-col"
        style={{
          background: "#F9F8F6",
          borderLeft: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.10)",
        }}
      >
        <header
          className="flex items-start justify-between gap-4 px-6 py-5"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none">{jur.flag}</span>
              <div className="min-w-0">
                <h2
                  className="truncate text-xl font-bold tracking-tight"
                  style={{ color: "#1A1A1A" }}
                >
                  {jur.name}
                </h2>
                <div
                  className="text-xs uppercase tracking-wider"
                  style={{ color: "rgba(0,0,0,0.45)" }}
                >
                  {jur.code}
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2.5 py-1 text-sm transition-colors"
            style={{
              color: "rgba(0,0,0,0.55)",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
            aria-label={pt(lang, "closeDrawer")}
          >
            &#x2715;
          </button>
        </header>

        {/* Stats bar */}
        <div
          className="px-6 py-4"
          style={{
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            background: "#F0EFEC",
          }}
        >
          <div className="grid grid-cols-3 gap-3">
            <DrawerStat
              label={lang === "fr" ? "Total" : "Total"}
              value={jur.total.toString()}
            />
            <DrawerStat
              label={pt(lang, "coverageLabel")}
              value={`${jur.pct}%`}
            />
            <DrawerStat
              label={lang === "fr" ? "Couvert" : "Covered"}
              value={jur.found.toString()}
            />
          </div>
          {/* V4 progress bar */}
          <div
            className="mt-3 h-[5px] w-full overflow-hidden rounded-full"
            style={{ background: "rgba(0,0,0,0.06)" }}
          >
            <div
              className={`h-full rounded-full transition-all ${coverageBg(jur.pct)}`}
              style={{ width: `${jur.pct}%` }}
            />
          </div>
        </div>

        {/* Regulations grouped by category */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-4">
          <h3
            className="mb-3 text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: "rgba(0,0,0,0.45)" }}
          >
            {pt(lang, "categoriesInDrawer")} ({regs.length})
          </h3>
          {categories.map((cat) => (
            <div key={cat} className="mb-4">
              <h4
                className="mb-2 flex items-center gap-2 text-sm font-semibold"
                style={{ color: "rgba(0,0,0,0.87)" }}
              >
                {cat}
                <span
                  className="rounded-lg px-1.5 py-0.5 text-[10px] font-medium tabular-nums"
                  style={{
                    background: "#F0EFEC",
                    color: "rgba(0,0,0,0.55)",
                  }}
                >
                  {grouped[cat].length}
                </span>
              </h4>
              <ul className="space-y-2">
                {grouped[cat].map((r, i) => (
                  <li
                    key={`${r.regulation_ref}-${i}`}
                    className="rounded-2xl p-3 transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid rgba(0,0,0,0.08)",
                    }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h5
                            className="text-sm font-medium leading-tight"
                            style={{ color: "rgba(0,0,0,0.87)" }}
                          >
                            {r.regulation_name}
                          </h5>
                          {r.in_api ? (
                            <span
                              className="inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-medium"
                              style={{
                                background: "rgba(0,0,0,0.04)",
                                color: "rgba(0,0,0,0.62)",
                              }}
                            >
                              {pt(lang, "inApi")}
                            </span>
                          ) : (
                            <span
                              className="inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-medium"
                              style={{
                                background: "rgba(148,107,45,0.08)",
                                color: "#946B2D",
                              }}
                            >
                              {pt(lang, "comingSoon")}
                            </span>
                          )}
                          {r.criticality === "critical" && (
                            <span
                              className="inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-medium"
                              style={{
                                background: "rgba(0,0,0,0.06)",
                                color: "rgba(0,0,0,0.62)",
                              }}
                            >
                              Critical
                            </span>
                          )}
                        </div>
                        <code
                          className="mt-0.5 block text-[11px]"
                          style={{ color: "rgba(0,0,0,0.45)" }}
                        >
                          {r.regulation_ref}
                        </code>
                        {r.enforcement_body && (
                          <div
                            className="mt-1 text-[11px]"
                            style={{ color: "rgba(0,0,0,0.55)" }}
                          >
                            {r.enforcement_body}
                          </div>
                        )}
                      </div>
                      {r.url && (
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 rounded-lg px-2 py-1 text-[11px] font-medium transition-colors hover:text-[#0008CF]"
                          style={{
                            color: "rgba(0,0,0,0.55)",
                            border: "1px solid rgba(0,0,0,0.08)",
                          }}
                        >
                          {pt(lang, "officialText")} &nearr;
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
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="rounded-xl px-3 py-2"
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <div
        className="text-[10px] font-medium uppercase tracking-wider"
        style={{ color: "rgba(0,0,0,0.45)" }}
      >
        {label}
      </div>
      <div
        className="mt-0.5 text-lg font-bold"
        style={{ color: "#1A1A1A" }}
      >
        {value}
      </div>
    </div>
  );
}

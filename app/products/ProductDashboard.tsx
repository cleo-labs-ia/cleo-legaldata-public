"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
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

/* ── Lazy-load Leaflet map (client only) ── */
const ProductMapView = dynamic(() => import("./ProductMapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-2xl border border-c-border bg-c-surface-2 text-sm text-c-text-subtle">
      Loading map...
    </div>
  ),
});

/* ================================================================
   i18n strings specific to the product dashboard
   ================================================================ */
const PS = {
  eyebrow: {
    fr: "Atlas Produit · Cleo Legal Data",
    en: "Product Atlas · Cleo Legal Data",
  },
  titleA: { fr: "La plus grande base de donnees", en: "The world's largest" },
  titleB: {
    fr: "conformite produit au monde.",
    en: "product compliance database.",
  },
  subtitle: {
    fr: "46 000+ reglementations produit dans 158 sources officielles. Verifiez n'importe quel produit contre les exigences de n'importe quel pays en un seul appel API.",
    en: "46,000+ product regulations across 158 official sources. Check any product against any country's requirements in one API call.",
  },
  ctaApi: { fr: "Obtenir un acces API", en: "Get API access" },
  ctaCoverage: { fr: "Voir la couverture", en: "See coverage" },
  kpiProductRegs: { fr: "reglementations produit", en: "product regulations" },
  kpiProducts: { fr: "produits trackes", en: "products tracked" },
  kpiSources: { fr: "sources officielles", en: "official sources" },
  kpiCategories: { fr: "categories produit", en: "product categories" },
  kpiDocs: { fr: "documents juridiques", en: "legal documents" },
  kpiAuditedRegs: { fr: "réglementations auditées", en: "audited regulations" },
  kpiInApi: { fr: "dans l'API", en: "in API" },
  kpiCoverage: { fr: "couverture vérifiée", en: "verified coverage" },
  allCategories: { fr: "Toutes categories", en: "All categories" },
  categoriesHeader: {
    fr: "Couverture par categorie",
    en: "Coverage by category",
  },
  regsLabel: { fr: "reglementations", en: "regulations" },
  inApi: { fr: "In API", en: "In API" },
  comingSoon: { fr: "Q3 2026", en: "Q3 2026" },
  officialText: { fr: "Texte officiel", en: "Official text" },
  categoriesInDrawer: {
    fr: "Reglementations par categorie",
    en: "Regulations by category",
  },
  closeDrawer: { fr: "Fermer", en: "Close" },
  backToSources: { fr: "Atlas", en: "Atlas" },
  statsCategories: { fr: "Categories produit", en: "Product categories" },
  statsCoverage: { fr: "Couverture moyenne", en: "Average coverage" },
  statsRegsIdentified: {
    fr: "Reglementations identifiees",
    en: "Regulations identified",
  },
  statsJurisdictions: { fr: "Juridictions", en: "Jurisdictions" },
  coverageLabel: { fr: "Couverture", en: "Coverage" },
  matrixHeader: {
    fr: "Matrice categorie x juridiction",
    en: "Category x jurisdiction matrix",
  },
  matrixHelp: {
    fr: "Nombre de reglementations par couple categorie / pays. Cliquez une cellule pour filtrer.",
    en: "Number of regulations per category / country pair. Click a cell to filter.",
  },
  jurisdictionsGridHeader: {
    fr: "Toutes les juridictions",
    en: "All jurisdictions",
  },
  exhaustiveList: {
    fr: "Reglementations produit dans le monde",
    en: "Product regulations worldwide",
  },
  searchPlaceholder: {
    fr: "Rechercher une reglementation, un pays...",
    en: "Search a regulation, a country...",
  },
  searchCountryPlaceholder: {
    fr: "Rechercher un pays...",
    en: "Search a country...",
  },
  allCriticalities: { fr: "Toutes criticites", en: "All criticalities" },
  allStatuses: { fr: "Tous statuts", en: "All statuses" },
  allCountries: { fr: "Tous pays", en: "All countries" },
  regulationColumn: { fr: "Reglementation", en: "Regulation" },
  referenceColumn: { fr: "Reference", en: "Reference" },
  countryColumn: { fr: "Pays", en: "Country" },
  categoryColumn: { fr: "Categorie", en: "Category" },
  enforcementColumn: { fr: "Autorite", en: "Enforcement" },
  criticalityColumn: { fr: "Criticite", en: "Criticality" },
  statusColumn: { fr: "Statut", en: "Status" },
  linkColumn: { fr: "Lien", en: "Link" },
  noResults: {
    fr: "Aucune reglementation ne correspond aux filtres.",
    en: "No regulation matches the filters.",
  },
  resultCount: {
    fr: (n: number) =>
      `${n.toLocaleString("fr-FR")} reglementation${n > 1 ? "s" : ""}`,
    en: (n: number) =>
      `${n.toLocaleString("en-US")} regulation${n !== 1 ? "s" : ""}`,
  },
  sortVolume: { fr: "Volume", en: "Volume" },
  sortCoverage: { fr: "Couverture", en: "Coverage" },
  sortAlpha: { fr: "A → Z", en: "A → Z" },
} as const;

/* ================================================================
   Category images (40px sidebar, 28px matrix, 32px drawer)
   ================================================================ */
const CAT_IMAGES: Record<string, string> = {
  "Shampoo & Hair Care": "/images/categories/cosmetics.png",
  "Sunscreen & Sun Care": "/images/categories/sunscreen.png",
  "Smartphones & Mobile": "/images/categories/electronics.png",
  "Stuffed Toys (0-3 years)": "/images/categories/toys.png",
  "Adhesive Bandages (Class I)": "/images/categories/medical-devices.png",
  "E-cigarettes & Vaping": "/images/categories/tobacco.png",
  "Laundry Detergent Pods": "/images/categories/chemicals.png",
  "Dietary Supplements": "/images/categories/food.png",
  "Athletic Apparel & Textile": "/images/categories/textile.png",
  "Bicycle Helmets (PPE)": "/images/categories/ppe.png",
  "Wine & Spirits": "/images/categories/alcohol.png",
  "Fresh Meat (Animal Food)": "/images/categories/food.png",
  "OTC Pharmaceuticals": "/images/categories/pharma.png",
  "Tyres & Automotive": "/images/categories/automotive.png",
  "Household Insecticides": "/images/categories/chemicals.png",
  "Consumer Drones": "/images/categories/drones.png",
  "Smart Connected Appliances": "/images/categories/electronics.png",
  "Dental Implants (Class III)": "/images/categories/medical-devices.png",
  "Interior Paints & Coatings": "/images/categories/paints.png",
  "Pet Food": "/images/categories/petfood.png",
};

/* ================================================================
   Helpers
   ================================================================ */
function pt(lang: Lang, key: keyof typeof PS): string {
  const v = PS[key];
  if (
    typeof v === "function" ||
    (typeof v === "object" && "fr" in v && typeof v.fr === "function")
  )
    return "";
  if (typeof v === "object" && "fr" in v)
    return (v as Record<Lang, string>)[lang];
  return String(key);
}

function formatNumber(n: number, lang: Lang): string {
  return n.toLocaleString(lang === "fr" ? "fr-FR" : "en-US");
}

function formatVolume(n: number, lang: Lang): string {
  if (n >= 1_000_000_000)
    return `${(n / 1_000_000_000).toFixed(1).replace(".", lang === "fr" ? "," : ".")}B`;
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return m >= 100
      ? `${Math.round(m)}M`
      : `${m.toFixed(1).replace(".", lang === "fr" ? "," : ".")}M`;
  }
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return n.toString();
}

/* ================================================================
   Constants
   ================================================================ */
const MATRIX_COUNTRIES = [
  "EU",
  "US",
  "GB",
  "FR",
  "DE",
  "CN",
  "JP",
  "KR",
  "IN",
  "AU",
  "BR",
];

interface Filters {
  query: string;
  category: string;
  country: string;
  criticality: string;
  status: string; // "in_api" | "q3_2026" | ""
}

const EMPTY_FILTERS: Filters = {
  query: "",
  category: "",
  country: "",
  criticality: "",
  status: "",
};

const PAGE_SIZE = 100;

/* ================================================================
   MAIN COMPONENT
   ================================================================ */
export default function ProductDashboard({
  data,
}: {
  data: ProductComplianceData;
}) {
  const [lang, setLang] = useState<Lang>("fr");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [drawerJur, setDrawerJur] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const deferredQuery = useDeferredValue(filters.query);

  /* Reset pagination when filters change */
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters]);

  /* ── Category selection: sync filters only, no auto-scroll ── */
  function selectCategory(cat: string | null) {
    setSelectedCategory(cat);
    setFilters((f) => ({ ...f, category: cat ?? "" }));
  }

  /* ── Matrix cell click ── */
  function setMatrixSelection(
    country: string | null,
    category: string | null,
  ) {
    setSelectedCategory(category);
    setFilters((f) => ({
      ...f,
      country: country ?? "",
      category: category ?? "",
    }));
    if (country || category) {
      const el = document.getElementById("exhaustive");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  /* ── Country click in grid ── */
  function selectCountry(code: string) {
    setDrawerJur(code);
    setFilters((f) => ({ ...f, country: code }));
  }

  /* ── Jurisdictions filtered by selected category (for map) ── */
  const filteredJurisdictions = useMemo(() => {
    if (!selectedCategory) return data.jurisdictions;
    const regsByJur: Record<string, { total: number; found: number }> = {};
    for (const r of data.regulations) {
      if (r.category !== selectedCategory) continue;
      const code = r.jurisdiction_code;
      if (!regsByJur[code]) regsByJur[code] = { total: 0, found: 0 };
      regsByJur[code].total++;
      if (r.in_api) regsByJur[code].found++;
    }
    return data.jurisdictions
      .filter((j) => regsByJur[j.code])
      .map((j) => ({
        ...j,
        total: regsByJur[j.code].total,
        found: regsByJur[j.code].found,
        pct: Math.round(
          (regsByJur[j.code].found / regsByJur[j.code].total) * 100,
        ),
      }));
  }, [data.jurisdictions, data.regulations, selectedCategory]);

  /* ── Regulations filtered for the table ── */
  const filteredRegs = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return data.regulations.filter((r) => {
      if (filters.category && r.category !== filters.category) return false;
      if (filters.country && r.jurisdiction_code !== filters.country)
        return false;
      if (
        filters.criticality &&
        r.criticality.toLowerCase() !== filters.criticality.toLowerCase()
      )
        return false;
      if (filters.status === "in_api" && !r.in_api) return false;
      if (filters.status === "q3_2026" && r.in_api) return false;
      if (!q) return true;
      return (
        r.regulation_name.toLowerCase().includes(q) ||
        r.regulation_ref.toLowerCase().includes(q) ||
        r.jurisdiction_name.toLowerCase().includes(q) ||
        r.jurisdiction_code.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      );
    });
  }, [data.regulations, deferredQuery, filters]);

  /* ── Matrix: category x country counts ── */
  const matrixData = useMemo(() => {
    const m: Record<string, Record<string, number>> = {};
    for (const cat of data.categories) {
      m[cat.name] = {};
      for (const code of MATRIX_COUNTRIES) {
        m[cat.name][code] = 0;
      }
    }
    for (const r of data.regulations) {
      if (MATRIX_COUNTRIES.includes(r.jurisdiction_code) && m[r.category]) {
        m[r.category][r.jurisdiction_code]++;
      }
    }
    return m;
  }, [data.regulations, data.categories]);

  const matrixMaxByCol = useMemo(() => {
    const max: Record<string, number> = {};
    for (const code of MATRIX_COUNTRIES) {
      max[code] = Math.max(
        1,
        ...data.categories.map((cat) => matrixData[cat.name]?.[code] || 0),
      );
    }
    return max;
  }, [matrixData, data.categories]);

  /* ── Countries grid data (follows category filter) ── */
  const countriesGridData = useMemo(() => {
    if (!selectedCategory) return data.jurisdictions;
    return filteredJurisdictions;
  }, [selectedCategory, data.jurisdictions, filteredJurisdictions]);

  /* ── Sorted countries for the dropdown ── */
  const sortedCountries = useMemo(
    () => [...data.jurisdictions].sort((a, b) => a.name.localeCompare(b.name)),
    [data.jurisdictions],
  );

  /* ── Unique criticalities ── */
  const criticalities = useMemo(() => {
    const set = new Set<string>();
    for (const r of data.regulations) set.add(r.criticality.toLowerCase());
    return [...set].sort();
  }, [data.regulations]);

  /* ── Drawer data — always show ALL regs for the jurisdiction ── */
  const drawerData = useMemo(() => {
    if (!drawerJur) return null;
    const jur = data.jurisdictions.find((j) => j.code === drawerJur);
    if (!jur) return null;
    const regs = data.regulations.filter(
      (r) => r.jurisdiction_code === drawerJur,
    );
    const grouped: Record<string, ProductRegulation[]> = {};
    for (const r of regs) {
      const cat = r.category || "Other";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(r);
    }
    return { jur, regs, grouped };
  }, [drawerJur, data.jurisdictions, data.regulations]);

  const generated = new Date().toLocaleDateString(
    lang === "fr" ? "fr-FR" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  const visible = filteredRegs.slice(0, visibleCount);

  function resetFilters() {
    setFilters(EMPTY_FILTERS);
    setSelectedCategory(null);
  }

  function updateFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((f) => ({ ...f, [key]: value }));
    if (key === "category") {
      setSelectedCategory(value || null);
    }
  }

  function matrixBg(value: number, max: number, isActive: boolean) {
    if (value === 0) return "transparent";
    const ratio = Math.min(1, value / max);
    const alpha = 0.12 + ratio * 0.55;
    return isActive
      ? `rgba(0, 8, 207, ${0.25 + ratio * 0.65})`
      : `rgba(0, 8, 207, ${alpha})`;
  }

  /* ================================================================
     RENDER
     ================================================================ */
  return (
    <div className="min-h-screen pb-16">
      {/* ── 1. Header (identical to Dashboard.tsx) ── */}
      <header className="border-b border-c-border bg-c-surface">
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
                {PS.eyebrow[lang]}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-md border border-c-border bg-c-surface px-2.5 py-1 text-[11px] font-medium text-c-text-muted hover:border-c-brand hover:text-c-brand"
            >
              {STRINGS.navHome[lang]}
            </Link>
            <Link
              href="/general"
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
              href="/docs"
              className="rounded-md border border-c-border bg-c-surface px-2.5 py-1 text-[11px] font-medium text-c-text-muted hover:border-c-brand hover:text-c-brand"
            >
              {STRINGS.navDocs[lang]}
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border border-c-border bg-c-surface px-2.5 py-1 text-[11px] font-medium text-c-text-muted hover:border-c-brand hover:text-c-brand"
            >
              {STRINGS.navPricing[lang]}
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

      <main className="mx-auto max-w-7xl px-6 pt-6">
        {/* ── 2. Badge + Title + Subtitle + 5 KPI cards + CTAs ── */}
        <section className="mb-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-c-brand/20 bg-c-brand-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-c-brand-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-c-brand" />
              {lang === "fr" ? "Atlas Produit" : "Product Atlas"}
            </div>
            <h1 className="font-display text-4xl font-light leading-[1.05] tracking-tight text-c-text md:text-5xl">
              {pt(lang, "titleA")}{" "}
              <span className="italic text-c-brand">
                {pt(lang, "titleB")}
              </span>
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-c-text-muted">
              {pt(lang, "subtitle")}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/api"
                className="inline-flex items-center rounded-lg bg-c-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-c-brand-ink"
              >
                {pt(lang, "ctaApi")} →
              </Link>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("coverage-section");
                  if (el)
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="inline-flex items-center rounded-lg border border-c-border bg-c-surface px-4 py-2 text-sm font-medium text-c-text-muted transition-colors hover:border-c-brand hover:text-c-brand"
              >
                {pt(lang, "ctaCoverage")} ↓
              </button>
            </div>
          </div>

          {/* 5 KPI cards — 100% product compliance focused (not platform-wide) */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <div className="rounded-2xl border border-c-brand bg-c-brand-soft/40 p-5">
              <div className="text-3xl font-bold tabular-nums text-c-brand">
                <AnimatedNumber
                  value={data.totals.platform_product_regs}
                  format={(n) => formatNumber(n, lang)}
                />
              </div>
              <div className="mt-2 text-[11px] font-medium uppercase tracking-wider text-c-text-subtle">
                {pt(lang, "kpiProductRegs")}
              </div>
            </div>
            <div className="rounded-2xl border border-c-border bg-c-surface p-5">
              <div className="text-3xl font-bold tabular-nums text-c-text">
                <AnimatedNumber
                  value={data.totals.product_categories}
                  format={(n) => formatNumber(n, lang)}
                />
              </div>
              <div className="mt-2 text-[11px] font-medium uppercase tracking-wider text-c-text-subtle">
                {pt(lang, "kpiCategories")}
              </div>
            </div>
            <div className="rounded-2xl border border-c-border bg-c-surface p-5">
              <div className="text-3xl font-bold tabular-nums text-c-text">
                <AnimatedNumber
                  value={data.totals.jurisdictions_audited}
                  format={(n) => formatNumber(n, lang)}
                />
              </div>
              <div className="mt-2 text-[11px] font-medium uppercase tracking-wider text-c-text-subtle">
                {lang === "fr" ? "juridictions" : "jurisdictions"}
              </div>
            </div>
            <div className="rounded-2xl border border-c-border bg-c-surface p-5">
              <div className="text-3xl font-bold tabular-nums text-c-text">
                <AnimatedNumber
                  value={data.totals.product_regs_in_api}
                  format={(n) => formatNumber(n, lang)}
                />
              </div>
              <div className="mt-2 text-[11px] font-medium uppercase tracking-wider text-c-text-subtle">
                {pt(lang, "kpiInApi")}
              </div>
            </div>
            <div className="rounded-2xl border border-c-border bg-c-surface p-5">
              <div className="text-3xl font-bold tabular-nums text-c-success">
                {data.totals.product_coverage_pct}%
              </div>
              <div className="mt-2 text-[11px] font-medium uppercase tracking-wider text-c-text-subtle">
                {pt(lang, "kpiCoverage")}
              </div>
            </div>
          </div>

          {/* Distinguish from general Legal Data */}
          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-c-border bg-c-surface-2 px-4 py-2">
            <p className="text-xs text-c-text-muted">
              {lang === "fr"
                ? "Pour le droit mondial complet (santé, finance, environnement…) : "
                : "Looking for full worldwide law (health, finance, environment…)? "}
              <Link href="/general" className="font-semibold text-c-brand hover:underline">
                {lang === "fr" ? "Atlas →" : "Atlas →"}
              </Link>
            </p>
            <span className="text-[10px] text-c-text-subtle">209 498 régs · 1,94M docs · 177 juridictions</span>
          </div>
        </section>

        {/* ── 3. Map [1fr 320px] + Sidebar categories ── */}
        {selectedCategory && (
          <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-c-brand bg-c-brand-soft px-4 py-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-c-text-subtle">{lang === "fr" ? "Filtré par :" : "Filtered by:"}</span>
              <span className="font-semibold text-c-brand-ink">{selectedCategory}</span>
            </div>
            <button
              type="button"
              onClick={() => selectCategory(null)}
              className="rounded-md border border-c-border bg-c-surface px-2.5 py-1 text-xs font-medium text-c-text-muted hover:border-c-brand hover:text-c-brand"
            >
              {lang === "fr" ? "Réinitialiser ×" : "Clear ×"}
            </button>
          </div>
        )}
        {/* Sidebar categories (left) + Map (right) */}
        <section id="coverage-section" className="scroll-mt-8 grid gap-3 lg:grid-cols-[240px_1fr]">
          {/* Sidebar catégories — scrolling squares */}
          <aside className="h-[520px] lg:h-[600px] overflow-y-auto scrollbar-thin rounded-2xl border border-c-border bg-c-surface p-2">
            {/* "All" button */}
            <button
              type="button"
              onClick={() => selectCategory(null)}
              className={`mb-2 w-full rounded-xl px-3 py-2 text-left text-xs font-semibold transition-colors ${
                selectedCategory === null
                  ? "bg-c-brand text-white"
                  : "bg-c-surface-2 text-c-text-muted hover:bg-c-bg"
              }`}
            >
              {pt(lang, "allCategories")} · {data.regulations.length}
            </button>

            {/* Grid 2 columns of square images */}
            <div className="grid grid-cols-2 gap-2">
              {data.categories.map((cat) => {
                const isActive = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => selectCategory(isActive ? null : cat.name)}
                    className={`group overflow-hidden rounded-xl border bg-c-surface transition-all ${
                      isActive
                        ? "border-c-brand ring-2 ring-c-brand-soft"
                        : "border-c-border hover:border-c-text-subtle"
                    }`}
                  >
                    {CAT_IMAGES[cat.name] && (
                      <div className="aspect-square overflow-hidden bg-c-surface-2">
                        <img
                          src={CAT_IMAGES[cat.name]}
                          alt={cat.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="px-2 py-1.5">
                      <div className="line-clamp-2 text-[10px] font-semibold leading-tight text-c-text min-h-[2.4em]">
                        {cat.name}
                      </div>
                      <div className="mt-0.5 text-[9px] tabular-nums text-c-text-subtle">
                        {cat.pct}% · {cat.found}/{cat.total_regs}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Map */}
          <div className="h-[520px] lg:h-[600px]">
            <ProductMapView
              jurisdictions={filteredJurisdictions}
              selected={drawerJur}
              onSelect={(code) => setDrawerJur(code)}
              lang={lang}
              activeCategory={selectedCategory}
            />
          </div>
        </section>

        {/* ── 4. Stats header (4 cards) ── */}
        <section className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label={pt(lang, "statsRegsIdentified")}
            value={formatNumber(data.regulations.length, lang)}
          />
          <StatCard
            label={pt(lang, "statsJurisdictions")}
            value={formatNumber(data.jurisdictions.length, lang)}
          />
          <StatCard
            label={pt(lang, "statsCoverage")}
            value={`${data.totals.product_coverage_pct}%`}
            accent={`${data.categories.filter((c) => c.pct >= 70).length}/${data.categories.length} ${lang === "fr" ? "categories > 70%" : "categories > 70%"}`}
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
                    <span className="h-2 w-2 rounded-full bg-c-brand" />
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

        {/* ── 5. Category x jurisdiction matrix ── */}
        <section className="mt-10">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                {pt(lang, "matrixHeader")}
              </h2>
              <p className="text-sm text-c-text-muted">
                {pt(lang, "matrixHelp")}
              </p>
            </div>
            {(filters.category || filters.country) && (
              <button
                type="button"
                onClick={resetFilters}
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
                    {pt(lang, "categoryColumn")}
                  </th>
                  {MATRIX_COUNTRIES.map((code) => {
                    const jur = data.jurisdictions.find(
                      (j) => j.code === code,
                    );
                    const isActive = filters.country === code;
                    return (
                      <th
                        key={code}
                        className={`border-b border-c-border px-2 py-3 text-center text-[10px] font-medium uppercase tracking-wider transition-colors ${
                          isActive
                            ? "bg-c-brand-soft text-c-brand-ink"
                            : "text-c-text-subtle"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setMatrixSelection(
                              isActive ? null : code,
                              selectedCategory,
                            )
                          }
                          className="flex w-full flex-col items-center gap-0.5 hover:text-c-brand"
                        >
                          <span className="whitespace-nowrap">
                            {jur?.flag || ""} {code}
                          </span>
                        </button>
                      </th>
                    );
                  })}
                  <th className="border-b border-l border-c-border px-3 py-3 text-right text-[10px] font-medium uppercase tracking-wider text-c-text-subtle">
                    &Sigma;
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.categories.map((cat) => {
                  const rowSum = MATRIX_COUNTRIES.reduce(
                    (acc, code) => acc + (matrixData[cat.name]?.[code] || 0),
                    0,
                  );
                  const isActiveRow = selectedCategory === cat.name;
                  return (
                    <tr key={cat.name} className="group">
                      <th
                        scope="row"
                        className={`sticky left-0 z-10 border-b border-c-border px-3 py-1.5 text-left ${
                          isActiveRow
                            ? "bg-c-brand-soft"
                            : "bg-c-surface group-hover:bg-c-surface-2"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            selectCategory(isActiveRow ? null : cat.name)
                          }
                          className="flex w-full items-center gap-2 text-left"
                        >
                          {CAT_IMAGES[cat.name] && (
                            <img
                              src={CAT_IMAGES[cat.name]}
                              alt=""
                              className="h-9 w-9 rounded-lg object-cover"
                            />
                          )}
                          <span className="truncate text-xs font-medium">
                            {cat.name}
                          </span>
                        </button>
                      </th>
                      {MATRIX_COUNTRIES.map((code) => {
                        const v = matrixData[cat.name]?.[code] || 0;
                        const isActiveCell =
                          selectedCategory === cat.name &&
                          filters.country === code;
                        return (
                          <td
                            key={code}
                            className="border-b border-c-border p-0"
                            style={{
                              background: matrixBg(
                                v,
                                matrixMaxByCol[code],
                                isActiveRow || filters.country === code,
                              ),
                            }}
                          >
                            <button
                              type="button"
                              disabled={v === 0}
                              onClick={() =>
                                setMatrixSelection(
                                  isActiveCell ? null : code,
                                  isActiveCell ? null : cat.name,
                                )
                              }
                              className={`flex h-9 w-full items-center justify-center text-[11px] font-medium tabular-nums transition-colors ${
                                v === 0
                                  ? "text-c-text-subtle/40"
                                  : isActiveCell
                                    ? "font-semibold text-c-brand-ink ring-2 ring-inset ring-c-brand"
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

        {/* ── 6. Countries grid ── */}
        <CountriesGridSection
          jurisdictions={countriesGridData}
          lang={lang}
          selectedCategory={selectedCategory}
          onSelect={selectCountry}
        />

        {/* ── 7. Filterable regulations table ── */}
        <section id="exhaustive" className="mt-10 scroll-mt-24">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                {pt(lang, "exhaustiveList")}
              </h2>
              <p className="text-sm text-c-text-muted">
                {PS.resultCount[lang](filteredRegs.length)}
              </p>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-md border border-c-border bg-c-surface px-3 py-1.5 text-sm text-c-text-muted hover:bg-c-surface-2"
            >
              {STRINGS.resetFilters[lang]}
            </button>
          </div>

          {/* Filter row */}
          <div className="mb-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            <input
              type="search"
              value={filters.query}
              onChange={(e) => updateFilter("query", e.target.value)}
              placeholder={pt(lang, "searchPlaceholder")}
              className="rounded-lg border border-c-border bg-c-surface px-3 py-2 text-sm focus:border-c-brand focus:outline-none focus:ring-2 focus:ring-c-brand-soft sm:col-span-2 lg:col-span-1"
            />
            <select
              value={filters.category}
              onChange={(e) => updateFilter("category", e.target.value)}
              className="rounded-lg border border-c-border bg-c-surface px-3 py-2 text-sm focus:border-c-brand focus:outline-none"
            >
              <option value="">{pt(lang, "allCategories")}</option>
              {data.categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name} ({cat.total_regs})
                </option>
              ))}
            </select>
            <select
              value={filters.country}
              onChange={(e) => updateFilter("country", e.target.value)}
              className="rounded-lg border border-c-border bg-c-surface px-3 py-2 text-sm focus:border-c-brand focus:outline-none"
            >
              <option value="">{pt(lang, "allCountries")}</option>
              {sortedCountries.map((j) => (
                <option key={j.code} value={j.code}>
                  {j.flag} {j.name} ({j.total})
                </option>
              ))}
            </select>
            <select
              value={filters.criticality}
              onChange={(e) => updateFilter("criticality", e.target.value)}
              className="rounded-lg border border-c-border bg-c-surface px-3 py-2 text-sm focus:border-c-brand focus:outline-none"
            >
              <option value="">{pt(lang, "allCriticalities")}</option>
              {criticalities.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
            <select
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
              className="rounded-lg border border-c-border bg-c-surface px-3 py-2 text-sm focus:border-c-brand focus:outline-none"
            >
              <option value="">{pt(lang, "allStatuses")}</option>
              <option value="in_api">{pt(lang, "inApi")}</option>
              <option value="q3_2026">{pt(lang, "comingSoon")}</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-c-border bg-c-surface">
            <table className="min-w-full text-sm">
              <thead className="bg-c-surface-2 text-left text-xs uppercase tracking-wider text-c-text-subtle">
                <tr>
                  <th className="px-4 py-2.5 font-medium">
                    {pt(lang, "regulationColumn")}
                  </th>
                  <th className="px-4 py-2.5 font-medium">
                    {pt(lang, "referenceColumn")}
                  </th>
                  <th className="px-4 py-2.5 font-medium">
                    {pt(lang, "countryColumn")}
                  </th>
                  <th className="px-4 py-2.5 font-medium">
                    {pt(lang, "categoryColumn")}
                  </th>
                  <th className="px-4 py-2.5 font-medium">
                    {pt(lang, "enforcementColumn")}
                  </th>
                  <th className="px-4 py-2.5 font-medium">
                    {pt(lang, "criticalityColumn")}
                  </th>
                  <th className="px-4 py-2.5 font-medium">
                    {pt(lang, "statusColumn")}
                  </th>
                  <th className="px-4 py-2.5 text-right font-medium">
                    {pt(lang, "linkColumn")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-c-border">
                {visible.map((r, i) => {
                  const jur = data.jurisdictions.find(
                    (j) => j.code === r.jurisdiction_code,
                  );
                  return (
                    <tr
                      key={`${r.regulation_ref}-${i}`}
                      className="hover:bg-c-surface-2/50"
                    >
                      <td className="px-4 py-3">
                        <div className="max-w-xs font-medium leading-tight">
                          {r.regulation_name}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-[11px] text-c-text-subtle">
                          {r.regulation_ref}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => selectCountry(r.jurisdiction_code)}
                          className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-xs hover:bg-c-brand-soft hover:text-c-brand-ink"
                        >
                          <span>{jur?.flag || ""}</span>
                          <span className="font-medium">
                            {r.jurisdiction_name}
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() =>
                            updateFilter(
                              "category",
                              filters.category === r.category
                                ? ""
                                : r.category,
                            )
                          }
                          className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium transition-colors ${
                            filters.category === r.category
                              ? "bg-c-brand text-white"
                              : "bg-c-brand-soft text-c-brand-ink hover:bg-c-brand hover:text-white"
                          }`}
                        >
                          {r.category}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-xs text-c-text-muted">
                        {r.enforcement_body || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <CriticalityBadge criticality={r.criticality} />
                      </td>
                      <td className="px-4 py-3">
                        {r.in_api ? (
                          <span className="inline-flex items-center rounded-md bg-c-surface-2 px-2 py-0.5 text-[10px] font-medium text-c-text">
                            {pt(lang, "inApi")}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-c-surface-2 px-2 py-0.5 text-[10px] font-medium text-c-text-muted">
                            {pt(lang, "comingSoon")}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {r.url ? (
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-c-text-muted hover:text-c-brand"
                          >
                            &#x2197;
                          </a>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
                {visible.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-8 text-center text-sm text-c-text-muted"
                    >
                      {pt(lang, "noResults")}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
            {filteredRegs.length > visibleCount ? (
              <div className="flex justify-center border-t border-c-border bg-c-surface-2/40 py-3">
                <button
                  type="button"
                  onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                  className="rounded-md border border-c-border bg-c-surface px-4 py-1.5 text-sm font-medium text-c-text-muted hover:bg-c-surface-2"
                >
                  + {Math.min(PAGE_SIZE, filteredRegs.length - visibleCount)} /{" "}
                  {filteredRegs.length - visibleCount}
                </button>
              </div>
            ) : null}
          </div>
        </section>

        {/* ── 8. ApiCallout ── */}
        <ApiCallout lang={lang} />

        {/* ── 9. Footer ── */}
        <footer className="mt-12 border-t border-c-border pt-6 text-xs text-c-text-subtle">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>
              {STRINGS.generatedAt[lang]} {generated}
            </span>
            <span className="flex flex-wrap items-center gap-x-2">
              <Link
                href="/general"
                className="text-c-text-muted hover:text-c-brand"
              >
                {pt(lang, "backToSources")}
              </Link>
              <span>&middot;</span>
              <a
                href="https://cleolabs.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-c-text-muted hover:text-c-brand"
              >
                Cleo Labs
              </a>
              <span>&middot;</span>
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

/* ================================================================
   SUB-COMPONENTS
   ================================================================ */

/* ── StatCard ── */
function StatCard({
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

/* ── CriticalityBadge ── */
function CriticalityBadge({ criticality }: { criticality: string }) {
  const c = criticality.toLowerCase();
  let classes = "rounded-md px-2 py-0.5 text-[10px] font-medium ";
  if (c === "critical")
    classes += "bg-c-surface-2 text-c-text font-semibold";
  else if (c === "high") classes += "bg-c-surface-2 text-c-text";
  else if (c === "medium") classes += "bg-c-surface-2 text-c-text-muted";
  else classes += "bg-c-surface-2 text-c-text-subtle";
  return (
    <span className={classes}>
      {c.charAt(0).toUpperCase() + c.slice(1)}
    </span>
  );
}

/* ── Countries Grid Section ── */
type CountrySort = "volume_desc" | "coverage_desc" | "name_asc";

function CountriesGridSection({
  jurisdictions,
  lang,
  selectedCategory,
  onSelect,
}: {
  jurisdictions: ProductJurisdiction[];
  lang: Lang;
  selectedCategory: string | null;
  onSelect: (code: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<CountrySort>("volume_desc");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = jurisdictions;
    if (q) {
      out = out.filter(
        (j) =>
          j.name.toLowerCase().includes(q) ||
          j.code.toLowerCase().includes(q),
      );
    }
    return [...out].sort((a, b) => {
      switch (sort) {
        case "coverage_desc":
          return b.pct - a.pct || b.total - a.total;
        case "name_asc":
          return a.name.localeCompare(b.name);
        default:
          return b.total - a.total;
      }
    });
  }, [jurisdictions, query, sort]);

  return (
    <section className="mt-12">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            {PS.jurisdictionsGridHeader[lang]}
          </h2>
          <p className="text-sm text-c-text-muted">
            {filtered.length} / {jurisdictions.length}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={PS.searchCountryPlaceholder[lang]}
            className="rounded-lg border border-c-border bg-c-surface px-3 py-1.5 text-sm focus:border-c-brand focus:outline-none focus:ring-2 focus:ring-c-brand-soft"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as CountrySort)}
            className="rounded-lg border border-c-border bg-c-surface px-3 py-1.5 text-sm focus:border-c-brand focus:outline-none"
          >
            <option value="volume_desc">
              &darr; {PS.sortVolume[lang]}
            </option>
            <option value="coverage_desc">
              &darr; {PS.sortCoverage[lang]}
            </option>
            <option value="name_asc">{PS.sortAlpha[lang]}</option>
          </select>
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.map((j) => (
          <li key={`${j.code}-${j.total}-${j.pct}`}>
            <button
              type="button"
              onClick={() => onSelect(j.code)}
              className="group flex w-full items-center justify-between gap-3 rounded-xl border border-c-border bg-c-surface p-3 text-left transition-all hover:border-c-brand hover:shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl leading-none">{j.flag}</span>
                  <span className="truncate text-sm font-medium">
                    {j.name}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-c-border">
                    <div
                      className="h-full rounded-full bg-c-brand"
                      style={{ width: `${j.pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] tabular-nums text-c-text-subtle">
                    {j.pct}%
                  </span>
                </div>
              </div>
              <span className="shrink-0 text-right">
                <span
                  className={`block text-base font-semibold tabular-nums leading-none ${selectedCategory ? "text-c-brand" : ""}`}
                >
                  {j.total}
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-c-text-subtle">
                  {PS.regsLabel[lang]}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
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

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

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
        className="fixed inset-0 z-[1100] bg-black/25 backdrop-blur-[2px] transition-opacity duration-200"
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
            className="rounded-md border border-c-border bg-c-surface px-2.5 py-1 text-sm text-c-text-muted hover:bg-c-surface-2"
            aria-label={PS.closeDrawer[lang]}
          >
            &#x2715;
          </button>
        </header>

        {/* Stats bar */}
        <div className="border-b border-c-border bg-c-surface-2 px-6 py-4">
          <div className="grid grid-cols-3 gap-3">
            <DrawerStat
              label={lang === "fr" ? "Total" : "Total"}
              value={jur.total.toString()}
            />
            <DrawerStat
              label={PS.coverageLabel[lang]}
              value={`${jur.pct}%`}
            />
            <DrawerStat
              label={lang === "fr" ? "Couvert" : "Covered"}
              value={jur.found.toString()}
            />
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-c-border">
            <div
              className="h-full rounded-full bg-c-brand"
              style={{ width: `${jur.pct}%` }}
            />
          </div>
        </div>

        {/* Regulations grouped by category */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-4">
          <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-c-text-subtle">
            {PS.categoriesInDrawer[lang]} ({regs.length})
          </h3>
          {categories.map((cat) => (
            <div key={cat} className="mb-4">
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                {CAT_IMAGES[cat] && (
                  <img
                    src={CAT_IMAGES[cat]}
                    alt=""
                    className="h-12 w-12 rounded-xl object-cover shadow-sm"
                  />
                )}
                {cat}
                <span className="rounded-md bg-c-surface-2 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-c-text-subtle">
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
                            <span className="inline-flex items-center rounded-md bg-c-surface-2 px-2 py-0.5 text-[10px] font-medium text-c-text">
                              {PS.inApi[lang]}
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-md bg-c-surface-2 px-2 py-0.5 text-[10px] font-medium text-c-text-muted">
                              {PS.comingSoon[lang]}
                            </span>
                          )}
                          {r.criticality.toLowerCase() === "critical" && (
                            <span className="inline-flex items-center rounded-md bg-c-surface-2 px-2 py-0.5 text-[10px] font-medium text-c-text">
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
                          className="shrink-0 rounded-md border border-c-border bg-c-surface px-2 py-1 text-[11px] font-medium text-c-text-muted hover:text-c-brand"
                        >
                          {PS.officialText[lang]} &#x2197;
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

function DrawerStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-c-border bg-c-surface px-3 py-2">
      <div className="text-[10px] font-medium uppercase tracking-wider text-c-text-subtle">
        {label}
      </div>
      <div className="mt-0.5 text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}

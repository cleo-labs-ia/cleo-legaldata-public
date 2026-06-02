"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { STRINGS } from "@/lib/i18n";
import SiteHeader from "../components/SiteHeader";

const BASE_URL = "https://api.legaldata.cleolabs.co/v1";

type EndpointId =
  | "regulations"
  | "sources"
  | "jurisdictions"
  | "categories"
  | "product_check";

type Param = {
  key: string;
  label: { fr: string; en: string };
  placeholder: string;
  optional?: boolean;
};

type EndpointDef = {
  id: EndpointId;
  method: "GET" | "POST";
  path: string;
  title: { fr: string; en: string };
  desc: { fr: string; en: string };
  coverage: "legal" | "product" | "shared";
  params: Param[];
  sampleResponse: unknown;
};

const ENDPOINTS: EndpointDef[] = [
  {
    id: "regulations",
    method: "GET",
    path: "/regulations",
    title: {
      fr: "Lister les régulations",
      en: "List regulations",
    },
    desc: {
      fr: "Toutes les régulations indexées. Filtre par juridiction, catégorie, autorité, statut.",
      en: "All indexed regulations. Filter by jurisdiction, category, enforcement body, status.",
    },
    coverage: "shared",
    params: [
      { key: "jurisdiction", label: { fr: "Juridiction", en: "Jurisdiction" }, placeholder: "FR" },
      { key: "category", label: { fr: "Catégorie", en: "Category" }, placeholder: "cosmetics", optional: true },
      { key: "status", label: { fr: "Statut", en: "Status" }, placeholder: "in_force", optional: true },
      { key: "limit", label: { fr: "Limite", en: "Limit" }, placeholder: "20", optional: true },
    ],
    sampleResponse: {
      data: [
        {
          id: "reg_eu_1223_2009",
          name: "EU Cosmetics Regulation",
          ref: "(EC) No 1223/2009",
          jurisdiction: "EU",
          category: "cosmetics",
          enforcement_body: "EC DG GROW + NCAs",
          status: "in_force",
          criticality: "critical",
          url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32009R1223",
          last_updated: "2026-05-12",
        },
        {
          id: "reg_fr_csp_l5131",
          name: "Code de la santé publique – cosmétiques",
          ref: "Articles L5131-1 à L5131-13",
          jurisdiction: "FR",
          category: "cosmetics",
          enforcement_body: "ANSM",
          status: "in_force",
          criticality: "critical",
          url: "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072665/LEGISCTA000006171151/",
          last_updated: "2026-03-08",
        },
      ],
      pagination: { next_cursor: "eyJpZCI6InJlZ19mcl9hbnNtX2NwbnAifQ", has_more: true },
      total: 1318,
    },
  },
  {
    id: "sources",
    method: "GET",
    path: "/sources",
    title: { fr: "Lister les sources officielles", en: "List official sources" },
    desc: {
      fr: "1 494 portails officiels (Légifrance, EUR-Lex, FDA, etc.). Filtre par pays et catégorie réglementaire.",
      en: "1,494 official portals (Légifrance, EUR-Lex, FDA…). Filter by country and regulatory category.",
    },
    coverage: "legal",
    params: [
      { key: "country", label: { fr: "Pays", en: "Country" }, placeholder: "FR" },
      { key: "domain", label: { fr: "Domaine", en: "Domain" }, placeholder: "health", optional: true },
      { key: "data_type", label: { fr: "Type", en: "Data type" }, placeholder: "legislation", optional: true },
    ],
    sampleResponse: {
      data: [
        {
          id: "src_fr_legifrance",
          name: "Légifrance",
          country: "FR",
          domain: "generalist",
          data_type: ["legislation", "case_law", "doctrine"],
          url: "https://www.legifrance.gouv.fr",
          status: "operational",
        },
        {
          id: "src_fr_ansm",
          name: "ANSM",
          country: "FR",
          domain: "health",
          data_type: ["legislation"],
          url: "https://ansm.sante.fr",
          status: "operational",
        },
      ],
      total: 47,
    },
  },
  {
    id: "jurisdictions",
    method: "GET",
    path: "/jurisdictions",
    title: { fr: "Lister les juridictions couvertes", en: "List covered jurisdictions" },
    desc: {
      fr: "177 juridictions avec leur statut, score de couverture et volume.",
      en: "177 jurisdictions with their status, coverage score and volume.",
    },
    coverage: "legal",
    params: [
      { key: "region", label: { fr: "Région", en: "Region" }, placeholder: "Europe", optional: true },
      { key: "min_coverage", label: { fr: "Couverture min", en: "Min coverage %" }, placeholder: "80", optional: true },
    ],
    sampleResponse: {
      data: [
        { code: "FR", name: "France", region: "Europe", coverage_pct: 94, total_sources: 47, total_regs: 18329 },
        { code: "DE", name: "Germany", region: "Europe", coverage_pct: 91, total_sources: 38, total_regs: 14702 },
        { code: "US", name: "United States", region: "Americas", coverage_pct: 89, total_sources: 52, total_regs: 21804 },
      ],
      total: 177,
    },
  },
  {
    id: "categories",
    method: "GET",
    path: "/product-categories",
    title: { fr: "Lister les catégories produit", en: "List product categories" },
    desc: {
      fr: "20 catégories couvertes par le Legal Product Physical Atlas (Atlas Produit).",
      en: "20 categories covered by the Legal Product Physical Atlas.",
    },
    coverage: "product",
    params: [],
    sampleResponse: {
      data: [
        { id: 1, name: "Shampoo & Hair Care", regs: 1701, jurisdictions: 103, coverage_pct: 87 },
        { id: 2, name: "Sunscreen & Sun Care", regs: 1683, jurisdictions: 103, coverage_pct: 91 },
        { id: 3, name: "Smartphones & Mobile", regs: 2037, jurisdictions: 103, coverage_pct: 92 },
      ],
      total: 20,
    },
  },
  {
    id: "product_check",
    method: "POST",
    path: "/product/check",
    title: { fr: "Vérifier un produit", en: "Check a product" },
    desc: {
      fr: "Retourne toutes les régulations applicables pour un produit donné dans une juridiction.",
      en: "Returns every regulation applicable to a given product in a jurisdiction.",
    },
    coverage: "product",
    params: [
      { key: "product_category", label: { fr: "Catégorie", en: "Product category" }, placeholder: "cosmetics" },
      { key: "jurisdiction", label: { fr: "Juridiction", en: "Jurisdiction" }, placeholder: "FR" },
      { key: "subtype", label: { fr: "Sous-type", en: "Subtype" }, placeholder: "shampoo", optional: true },
    ],
    sampleResponse: {
      product: { category: "cosmetics", subtype: "shampoo", jurisdiction: "FR" },
      regulations_applicable: 23,
      critical_count: 8,
      regulations: [
        {
          id: "reg_eu_1223_2009",
          name: "EU Cosmetics Regulation",
          criticality: "critical",
          key_requirements: "Enregistrement CPNP, déclaration de mise sur le marché, dossier d'information produit (PIF)",
          enforcement_body: "ANSM",
          url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32009R1223",
        },
        {
          id: "reg_fr_csp_l5131",
          name: "Code de la santé publique – cosmétiques",
          criticality: "critical",
          key_requirements: "Cosmétovigilance, étiquetage français obligatoire",
          enforcement_body: "ANSM",
          url: "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072665/LEGISCTA000006171151/",
        },
      ],
      next_to_check: ["packaging waste (FR REP)", "claims regulation"],
    },
  },
];

export default function Playground() {
  const [lang, setLang] = useState<Lang>("fr");
  const [endpointId, setEndpointId] = useState<EndpointId>("regulations");
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const endpoint = useMemo(
    () => ENDPOINTS.find((e) => e.id === endpointId)!,
    [endpointId],
  );

  function selectEndpoint(id: EndpointId) {
    setEndpointId(id);
    setParamValues({});
  }

  function setParam(key: string, val: string) {
    setParamValues((p) => ({ ...p, [key]: val }));
  }

  const filledValues: Record<string, string> = {};
  for (const p of endpoint.params) {
    const v = paramValues[p.key];
    if (v && v.trim()) filledValues[p.key] = v.trim();
    else if (!p.optional) filledValues[p.key] = p.placeholder;
  }

  const curlCommand = useMemo(() => {
    if (endpoint.method === "GET") {
      const queryString = Object.entries(filledValues)
        .map(([k, v]) => `--data-urlencode "${k}=${v}"`)
        .join(" \\\n  ");
      return [
        `curl ${BASE_URL}${endpoint.path} \\`,
        `  -H "Authorization: Bearer $CLEO_KEY" \\`,
        `  -G${queryString ? ` \\\n  ${queryString}` : ""}`,
      ].join("\n");
    }
    return [
      `curl -X POST ${BASE_URL}${endpoint.path} \\`,
      `  -H "Authorization: Bearer $CLEO_KEY" \\`,
      `  -H "Content-Type: application/json" \\`,
      `  -d '${JSON.stringify(filledValues, null, 2)}'`,
    ].join("\n");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, JSON.stringify(filledValues)]);

  async function copyCurl() {
    await navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const T = {
    eyebrow: { fr: "Playground · API", en: "Playground · API" },
    title: {
      fr: "Testez l'API en direct.",
      en: "Test the API live.",
    },
    sub: {
      fr: "Choisissez un endpoint, ajustez les filtres, copiez la commande curl ou voyez la réponse type.",
      en: "Pick an endpoint, tune the filters, copy the curl command or see the sample response.",
    },
    endpointsHeader: { fr: "Endpoints", en: "Endpoints" },
    paramsHeader: { fr: "Paramètres", en: "Parameters" },
    requestHeader: { fr: "Requête générée", en: "Generated request" },
    responseHeader: { fr: "Réponse type", en: "Sample response" },
    copy: { fr: "Copier", en: "Copy" },
    copied: { fr: "Copié", en: "Copied" },
    needsKey: {
      fr: "Pas encore de clé API ? Réservez 20 min pour onboarder votre équipe.",
      en: "No API key yet? Book 20 min to onboard your team.",
    },
    bookCall: { fr: "Prendre un call", en: "Book a call" },
    coverageLabel: {
      legal: { fr: "Legal Atlas", en: "Legal Atlas" },
      product: { fr: "Legal Product Physical Atlas", en: "Legal Product Physical Atlas" },
      shared: { fr: "Les deux atlas", en: "Both atlases" },
    },
    optional: { fr: "optionnel", en: "optional" },
  };

  return (
    <div className="min-h-screen bg-c-bg">
      <SiteHeader lang={lang} setLang={setLang} active={null} />

      <main className="mx-auto max-w-7xl px-6 pt-10 pb-16">
        {/* Hero */}
        <section className="max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-c-border bg-c-surface-2 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-c-text-muted">
            {T.eyebrow[lang]}
          </div>
          <h1 className="font-display text-3xl font-light leading-tight tracking-tight text-c-text md:text-4xl">
            {T.title[lang]}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-c-text-muted">
            {T.sub[lang]}
          </p>
        </section>

        {/* Main grid: endpoint picker | request + response */}
        <section className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Left: endpoint list */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-c-text-subtle">
              {T.endpointsHeader[lang]}
            </h2>
            <div className="space-y-1.5">
              {ENDPOINTS.map((e) => {
                const active = e.id === endpointId;
                return (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => selectEndpoint(e.id)}
                    className={`group w-full rounded-xl border px-3 py-2.5 text-left transition-colors ${
                      active
                        ? "border-c-brand bg-c-brand-soft/40"
                        : "border-c-border bg-c-surface hover:border-c-text-subtle"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-mono font-semibold ${
                          e.method === "GET"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {e.method}
                      </span>
                      <code className="font-mono text-[11px] text-c-text-muted">
                        {e.path}
                      </code>
                    </div>
                    <div className="mt-1.5 text-sm font-medium text-c-text">
                      {e.title[lang]}
                    </div>
                    <div className="mt-0.5 text-[11px] uppercase tracking-wider text-c-text-subtle">
                      {T.coverageLabel[e.coverage][lang]}
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right: params + request + response */}
          <div className="space-y-6">
            {/* Endpoint description */}
            <div className="rounded-2xl border border-c-border bg-c-surface p-5">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-mono font-semibold ${
                    endpoint.method === "GET"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {endpoint.method}
                </span>
                <code className="font-mono text-[13px] text-c-text">
                  {BASE_URL}
                  {endpoint.path}
                </code>
              </div>
              <p className="mt-3 text-[14px] leading-relaxed text-c-text-muted">
                {endpoint.desc[lang]}
              </p>
            </div>

            {/* Parameters form */}
            {endpoint.params.length > 0 && (
              <div className="rounded-2xl border border-c-border bg-c-surface p-5">
                <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-c-text-subtle">
                  {T.paramsHeader[lang]}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {endpoint.params.map((p) => (
                    <label key={p.key} className="block">
                      <span className="flex items-center justify-between text-[12px] font-medium text-c-text-muted">
                        <span>
                          <code className="font-mono text-c-text">{p.key}</code>{" "}
                          · {p.label[lang]}
                        </span>
                        {p.optional && (
                          <span className="text-[10px] uppercase tracking-wider text-c-text-subtle">
                            {T.optional[lang]}
                          </span>
                        )}
                      </span>
                      <input
                        type="text"
                        value={paramValues[p.key] ?? ""}
                        onChange={(ev) => setParam(p.key, ev.target.value)}
                        placeholder={p.placeholder}
                        className="mt-1.5 w-full rounded-lg border border-c-border bg-c-bg px-3 py-2 font-mono text-[13px] text-c-text outline-none transition-colors focus:border-c-brand"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Generated curl */}
            <div className="overflow-hidden rounded-2xl border border-c-border bg-[#0b0b1a]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
                <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-white/40">
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="h-2 w-2 rounded-full bg-white/20" />
                  <span className="ml-3">{T.requestHeader[lang]}</span>
                </div>
                <button
                  type="button"
                  onClick={copyCurl}
                  className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white/70 transition-colors hover:bg-white/10"
                >
                  {copied ? T.copied[lang] : T.copy[lang]}
                </button>
              </div>
              <pre className="overflow-x-auto px-4 py-4 text-[12.5px] leading-relaxed text-white/90">
                <code>{curlCommand}</code>
              </pre>
            </div>

            {/* Sample response */}
            <div className="overflow-hidden rounded-2xl border border-c-border bg-c-surface-2">
              <div className="border-b border-c-border px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.14em] text-c-text-subtle">
                {T.responseHeader[lang]}
              </div>
              <pre className="overflow-x-auto px-4 py-4 text-[12.5px] leading-relaxed text-c-text">
                <code>{JSON.stringify(endpoint.sampleResponse, null, 2)}</code>
              </pre>
            </div>

            {/* CTA — book a call */}
            <div className="rounded-2xl border border-c-border bg-c-surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[14px] text-c-text-muted">{T.needsKey[lang]}</p>
                <a
                  href="https://www.cleolabs.co/en/meet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-c-text px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-c-brand"
                >
                  {T.bookCall[lang]} →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-c-border pt-6 text-xs text-c-text-subtle">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>{STRINGS.homeFooterTagline[lang]}</span>
            <span className="flex flex-wrap items-center gap-x-3">
              <Link href="/" className="text-c-text-muted hover:text-c-brand">
                {lang === "fr" ? "Accueil" : "Home"}
              </Link>
              <span>·</span>
              <Link href="/docs" className="text-c-text-muted hover:text-c-brand">
                {STRINGS.navDocs[lang]}
              </Link>
              <span>·</span>
              <Link href="/pricing" className="text-c-text-muted hover:text-c-brand">
                {STRINGS.navPricing[lang]}
              </Link>
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}

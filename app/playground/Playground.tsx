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
};

const ENDPOINTS: EndpointDef[] = [
  {
    id: "regulations",
    method: "GET",
    path: "/regulations",
    title: { fr: "Lister les régulations", en: "List regulations" },
    desc: {
      fr: "Toutes les régulations indexées. Filtre par juridiction, catégorie, autorité, statut.",
      en: "All indexed regulations. Filter by jurisdiction, category, enforcement body, status.",
    },
    coverage: "shared",
    params: [
      { key: "jurisdiction", label: { fr: "Juridiction", en: "Jurisdiction" }, placeholder: "FR" },
      { key: "category", label: { fr: "Catégorie", en: "Category" }, placeholder: "Shampoo & Hair Care", optional: true },
      { key: "criticality", label: { fr: "Criticité", en: "Criticality" }, placeholder: "critical", optional: true },
      { key: "limit", label: { fr: "Limite", en: "Limit" }, placeholder: "10", optional: true },
    ],
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
      { key: "data_type", label: { fr: "Type", en: "Data type" }, placeholder: "legislation", optional: true },
      { key: "status", label: { fr: "Statut", en: "Status" }, placeholder: "complete", optional: true },
      { key: "limit", label: { fr: "Limite", en: "Limit" }, placeholder: "10", optional: true },
    ],
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
      { key: "min_completion", label: { fr: "Complétude min", en: "Min completion" }, placeholder: "0.8", optional: true },
      { key: "limit", label: { fr: "Limite", en: "Limit" }, placeholder: "10", optional: true },
    ],
  },
  {
    id: "categories",
    method: "GET",
    path: "/product-categories",
    title: { fr: "Lister les catégories produit", en: "List product categories" },
    desc: {
      fr: "20 catégories couvertes par le Legal Product Physical Atlas.",
      en: "20 categories covered by the Legal Product Physical Atlas.",
    },
    coverage: "product",
    params: [],
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
      { key: "category", label: { fr: "Catégorie", en: "Product category" }, placeholder: "Shampoo & Hair Care" },
      { key: "jurisdiction", label: { fr: "Juridiction", en: "Jurisdiction" }, placeholder: "FR" },
    ],
  },
];

type ResponseMode =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; data: unknown; took: number }
  | { kind: "error"; message: string };

export default function Playground() {
  const [lang, setLang] = useState<Lang>("en");
  const [endpointId, setEndpointId] = useState<EndpointId>("regulations");
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [response, setResponse] = useState<ResponseMode>({ kind: "idle" });
  const [copied, setCopied] = useState(false);

  const endpoint = useMemo(
    () => ENDPOINTS.find((e) => e.id === endpointId)!,
    [endpointId],
  );

  function selectEndpoint(id: EndpointId) {
    setEndpointId(id);
    setParamValues({});
    setResponse({ kind: "idle" });
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

  async function handleRun() {
    setResponse({ kind: "loading" });
    const start = performance.now();
    try {
      const data = await runEndpoint(endpoint.id, filledValues);
      const took = Math.round(performance.now() - start);
      setResponse({ kind: "success", data, took });
    } catch (e) {
      setResponse({
        kind: "error",
        message: e instanceof Error ? e.message : "Unknown error",
      });
    }
  }

  const T = {
    eyebrow: { fr: "Playground · API", en: "Playground · API" },
    title: { fr: "Testez l'API en direct.", en: "Test the API live." },
    sub: {
      fr: "Choisissez un endpoint, ajustez les filtres, lancez la requête sur les données indexées par Cleo.",
      en: "Pick an endpoint, tune the filters, run the call against Cleo's indexed data.",
    },
    endpointsHeader: { fr: "Endpoints", en: "Endpoints" },
    paramsHeader: { fr: "Paramètres", en: "Parameters" },
    requestHeader: { fr: "Requête curl", en: "curl request" },
    responseHeader: { fr: "Réponse", en: "Response" },
    copy: { fr: "Copier", en: "Copy" },
    copied: { fr: "Copié", en: "Copied" },
    run: { fr: "Lancer", en: "Run" },
    running: { fr: "Chargement…", en: "Loading…" },
    reset: { fr: "Réinitialiser", en: "Reset" },
    sampleHint: {
      fr: "Cliquez sur Lancer pour interroger l'index Cleo.",
      en: "Click Run to query the Cleo index.",
    },
    tookMs: { fr: (ms: number) => `${ms} ms`, en: (ms: number) => `${ms} ms` },
    livePill: { fr: "Live · données réelles", en: "Live · real data" },
    errorPill: { fr: "Erreur", en: "Error" },
    needsKey: {
      fr: "Pour appeler l'API depuis votre propre code, il vous faut une clé. Réservez 20 min pour onboarder votre équipe.",
      en: "To call the API from your own code you need a key. Book 20 min to onboard your team.",
    },
    bookCall: { fr: "Prendre un call", en: "Book a call" },
    coverageLabel: {
      legal: { fr: "Legal Atlas", en: "Legal Atlas" },
      product: { fr: "Legal Product Physical Atlas", en: "Legal Product Physical Atlas" },
      shared: { fr: "Les deux atlas", en: "Both atlases" },
    },
    optional: { fr: "optionnel", en: "optional" },
  };

  const tookStr =
    response.kind === "success" ? T.tookMs[lang](response.took) : null;
  const responsePreview =
    response.kind === "success"
      ? JSON.stringify(response.data, null, 2)
      : response.kind === "error"
        ? `{\n  "error": ${JSON.stringify(response.message)}\n}`
        : null;

  return (
    <div className="min-h-screen bg-c-bg">
      <SiteHeader lang={lang} setLang={setLang} active={null} />

      <main className="mx-auto max-w-7xl px-6 pt-10 pb-16">
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

        <section className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Endpoint picker */}
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
                    className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors ${
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

          {/* Right panel */}
          <div className="space-y-6">
            {/* Endpoint header */}
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

            {/* Params */}
            {endpoint.params.length > 0 ? (
              <div className="rounded-2xl border border-c-border bg-c-surface p-5">
                <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-c-text-subtle">
                  {T.paramsHeader[lang]}
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {endpoint.params.map((p) => (
                    <label key={p.key} className="block">
                      <span className="flex items-center justify-between text-[12px] font-medium text-c-text-muted">
                        <span>
                          <code className="font-mono text-c-text">{p.key}</code> · {p.label[lang]}
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
            ) : (
              <div className="rounded-2xl border border-c-border bg-c-surface px-5 py-4 text-[13px] text-c-text-muted">
                {lang === "fr" ? "Pas de paramètre nécessaire." : "No parameters required."}
              </div>
            )}

            {/* BIG RUN BUTTON */}
            <button
              type="button"
              onClick={handleRun}
              disabled={response.kind === "loading"}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-c-brand px-6 py-4 text-base font-semibold text-white shadow-sm transition-all hover:bg-c-brand-ink hover:shadow-md disabled:opacity-60"
            >
              {response.kind === "loading" ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  {T.running[lang]}
                </>
              ) : (
                <>
                  <span className="text-lg">▶</span>
                  {lang === "fr" ? "Lancer la requête" : "Send request"}
                </>
              )}
            </button>

            {/* curl */}
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

            {/* Response */}
            <div className="overflow-hidden rounded-2xl border border-c-border bg-c-surface-2">
              <div className="flex items-center justify-between border-b border-c-border px-4 py-2.5">
                <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.14em] text-c-text-subtle">
                  <span>{T.responseHeader[lang]}</span>
                  {response.kind === "success" && (
                    <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-semibold text-emerald-800">
                      200 OK
                    </span>
                  )}
                  {response.kind === "error" && (
                    <span className="ml-1 rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-semibold text-red-800">
                      {T.errorPill[lang]}
                    </span>
                  )}
                  {response.kind === "success" && (
                    <span className="ml-2 rounded-full bg-c-brand-soft px-2 py-0.5 text-[9px] font-semibold text-c-brand-ink">
                      {T.livePill[lang]}
                    </span>
                  )}
                </div>
                {tookStr && (
                  <span className="font-mono text-[10px] text-c-text-subtle">
                    {tookStr}
                  </span>
                )}
              </div>
              {response.kind === "idle" ? (
                <div className="px-4 py-6 text-center text-[13px] text-c-text-subtle">
                  {T.sampleHint[lang]}
                </div>
              ) : response.kind === "loading" ? (
                <div className="px-4 py-6 text-center text-[13px] text-c-text-subtle">
                  {T.running[lang]}
                </div>
              ) : (
                <pre className="max-h-[480px] overflow-auto px-4 py-4 text-[12.5px] leading-relaxed text-c-text">
                  <code>{responsePreview}</code>
                </pre>
              )}
            </div>

            {/* CTA */}
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

/* ─── Live data fetchers (browser, against the static JSON we already ship) ─── */

type AnyRow = Record<string, unknown>;
type ProductComplianceData = {
  totals: AnyRow;
  categories: AnyRow[];
  jurisdictions: AnyRow[];
  regulations: AnyRow[];
};
type ManifestData = {
  stats: AnyRow;
  countries: (AnyRow & { sources?: AnyRow[] })[];
};

let _productCache: ProductComplianceData | null = null;
async function loadProduct(): Promise<ProductComplianceData> {
  if (_productCache) return _productCache;
  const res = await fetch("/data/product-compliance.json");
  if (!res.ok) throw new Error(`failed to load product compliance data (${res.status})`);
  _productCache = await res.json();
  return _productCache!;
}

let _manifestCache: ManifestData | null = null;
async function loadManifest(): Promise<ManifestData> {
  if (_manifestCache) return _manifestCache;
  const res = await fetch("/data/manifest.json");
  if (!res.ok) throw new Error(`failed to load manifest (${res.status})`);
  _manifestCache = await res.json();
  return _manifestCache!;
}

function ci(a: string | undefined, b: string): boolean {
  return (a ?? "").toLowerCase() === b.toLowerCase();
}

function ciIncl(a: string | undefined, b: string): boolean {
  return (a ?? "").toLowerCase().includes(b.toLowerCase());
}

async function runEndpoint(
  id: EndpointId,
  params: Record<string, string>,
): Promise<unknown> {
  if (id === "regulations" || id === "categories" || id === "product_check") {
    const data = await loadProduct();
    if (id === "regulations") {
      let regs = data.regulations as AnyRow[];
      if (params.jurisdiction)
        regs = regs.filter((r) =>
          ci(String(r.jurisdiction_code ?? ""), params.jurisdiction),
        );
      if (params.category)
        regs = regs.filter((r) =>
          ciIncl(String(r.category ?? ""), params.category),
        );
      if (params.criticality)
        regs = regs.filter((r) =>
          ci(String(r.criticality ?? ""), params.criticality),
        );
      const limit = Math.max(1, Math.min(50, parseInt(params.limit) || 10));
      return {
        data: regs.slice(0, limit).map((r) => ({
          id: `reg_${String(r.jurisdiction_code).toLowerCase()}_${slug(String(r.regulation_name))}`,
          name: r.regulation_name,
          ref: r.regulation_ref,
          jurisdiction: r.jurisdiction_code,
          category: r.category,
          enforcement_body: r.enforcement_body,
          criticality: r.criticality,
          in_api: r.in_api,
          url: r.url || null,
        })),
        pagination: { limit, returned: Math.min(limit, regs.length) },
        total: regs.length,
      };
    }
    if (id === "categories") {
      return {
        data: data.categories.map((c) => ({
          id: slug(String(c.name)),
          name: c.name,
          total_regulations: c.total_regs,
          jurisdictions: c.jurisdictions,
          in_api: c.found,
          coverage_pct: c.pct,
        })),
        total: data.categories.length,
      };
    }
    // product_check
    let regs = data.regulations as AnyRow[];
    if (params.jurisdiction)
      regs = regs.filter((r) => ci(String(r.jurisdiction_code), params.jurisdiction));
    if (params.category)
      regs = regs.filter((r) => ciIncl(String(r.category), params.category));
    const critical = regs.filter((r) => String(r.criticality).toLowerCase() === "critical");
    return {
      product: {
        category: params.category ?? null,
        jurisdiction: params.jurisdiction ?? null,
      },
      regulations_applicable: regs.length,
      critical_count: critical.length,
      regulations: regs.slice(0, 5).map((r) => ({
        name: r.regulation_name,
        ref: r.regulation_ref,
        criticality: r.criticality,
        enforcement_body: r.enforcement_body,
        url: r.url || null,
      })),
    };
  }

  // sources / jurisdictions → manifest
  const manifest = await loadManifest();
  if (id === "sources") {
    const all: AnyRow[] = [];
    for (const c of manifest.countries) {
      for (const s of c.sources ?? []) all.push(s);
    }
    let sources = all;
    if (params.country)
      sources = sources.filter((s) => ci(String(s.country), params.country));
    if (params.data_type)
      sources = sources.filter((s) =>
        Array.isArray(s.data_types) &&
        (s.data_types as string[]).some((d) => ci(d, params.data_type)),
      );
    if (params.status)
      sources = sources.filter((s) => ci(String(s.status), params.status));
    const limit = Math.max(1, Math.min(50, parseInt(params.limit) || 10));
    return {
      data: sources.slice(0, limit).map((s) => ({
        id: s.id,
        name: s.name,
        country: s.country,
        url: s.url,
        data_types: s.data_types,
        status: s.status,
      })),
      pagination: { limit, returned: Math.min(limit, sources.length) },
      total: sources.length,
    };
  }
  // jurisdictions
  let countries = manifest.countries;
  if (params.region) {
    // manifest has no explicit region — approximate via code or skip filter
    countries = countries.filter((c) => regionGuess(String(c.code)) === params.region);
  }
  if (params.min_completion) {
    const min = parseFloat(params.min_completion);
    countries = countries.filter((c) => (Number(c.completion) || 0) >= min);
  }
  const limit = Math.max(1, Math.min(50, parseInt(params.limit) || 10));
  return {
    data: countries
      .slice(0, limit)
      .map((c) => ({
        code: c.code,
        name: c.name,
        flag: c.flag,
        total_sources: c.total,
        completion: c.completion,
        estimated_volume: c.estimatedVolume,
      })),
    pagination: { limit, returned: Math.min(limit, countries.length) },
    total: countries.length,
  };
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 32);
}

function regionGuess(code: string): string {
  if (/^(US|US-..|CA|MX|BR|AR|CL|CO|PE|VE|EC|UY|PY|BO|DO|JM|CU)/.test(code)) return "Americas";
  if (/^(CN|JP|KR|IN|PK|BD|LK|MY|SG|TH|VN|ID|PH|HK|TW|MO|AU|NZ|KH|MM|LA|NP|BT|MV|MN|KP)/.test(code))
    return "Asia-Pacific";
  if (/^(SA|AE|QA|KW|BH|OM|YE|IR|IQ|SY|JO|LB|IL|PS|TR|EG|MA|DZ|TN|LY|SD)/.test(code))
    return "MENA";
  if (/^(ZA|NG|KE|GH|CI|SN|UG|TZ|ET|CM|MZ|MG|AO|ZM|ZW)/.test(code)) return "Africa";
  return "Europe";
}

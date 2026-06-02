"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { STRINGS } from "@/lib/i18n";
import SiteHeader from "../components/SiteHeader";

const BASE_URL = "https://api.legaldata.cleolabs.co";

type EndpointId =
  // Product (Legal Product Physical Atlas) — 10 endpoints
  | "compliance_check"
  | "customs_duties"
  | "customs_obligations"
  | "customs_lookup"
  | "customs_alternatives"
  | "customs_dual_use"
  | "customs_landed_cost"
  | "customs_reverse_classify"
  | "standards_gost"
  | "eaeu_parallel_import"
  // Legal (Legal Atlas) — 11 endpoints
  | "search"
  | "search_bulk"
  | "documents"
  | "documents_by_id"
  | "documents_bulk"
  | "changes"
  | "translate"
  | "coverage"
  | "countries"
  | "authorities"
  | "webhooks";

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
  coverage: "legal" | "product";
  params: Param[];
};

const ENDPOINTS: EndpointDef[] = [
  // ───── Product Atlas (10) ─────
  {
    id: "compliance_check",
    method: "POST",
    path: "/v2/compliance/check",
    title: { fr: "Vérification de conformité composite", en: "Composite compliance check" },
    desc: {
      fr: "Description produit + pays destinataire → classification HS, droits/TVA, obligations, dual-use, alternatives, coût rendu.",
      en: "Product description + destination country → HS classification, duties/VAT, obligations, dual-use, alternatives, landed cost.",
    },
    coverage: "product",
    params: [
      { key: "description", label: { fr: "Description produit", en: "Product description" }, placeholder: "sunscreen SPF50" },
      { key: "destination_country", label: { fr: "Pays destinataire", en: "Destination country" }, placeholder: "FR" },
      { key: "client_type", label: { fr: "Type client", en: "Client type" }, placeholder: "retail", optional: true },
    ],
  },
  {
    id: "customs_duties",
    method: "GET",
    path: "/v2/customs/duties",
    title: { fr: "Droits, TVA et accises", en: "Tariff, VAT and excise lookup" },
    desc: {
      fr: "Taux de droits, TVA et accises pour un code HS dans un pays donné.",
      en: "Customs duty, VAT and excise rates for an HS code in a given country.",
    },
    coverage: "product",
    params: [
      { key: "code", label: { fr: "Code HS", en: "HS code" }, placeholder: "330420" },
      { key: "country", label: { fr: "Pays", en: "Country" }, placeholder: "FR" },
      { key: "system", label: { fr: "Système", en: "System" }, placeholder: "hs6", optional: true },
    ],
  },
  {
    id: "customs_obligations",
    method: "GET",
    path: "/v2/customs/obligations",
    title: { fr: "Obligations douanières", en: "Customs obligations" },
    desc: {
      fr: "Obligations réglementaires (licences, certifications, marquages) pour un code HS dans un pays.",
      en: "Regulatory obligations (licenses, certifications, markings) for an HS code in a country.",
    },
    coverage: "product",
    params: [
      { key: "hs", label: { fr: "Code HS", en: "HS code" }, placeholder: "850440" },
      { key: "country", label: { fr: "Pays", en: "Country" }, placeholder: "DE" },
    ],
  },
  {
    id: "customs_lookup",
    method: "GET",
    path: "/v2/customs/lookup",
    title: { fr: "Classification HS depuis description", en: "HS classification from description" },
    desc: {
      fr: "Suggère un ou plusieurs codes HS à partir d'une description produit en langage naturel.",
      en: "Suggests one or more HS codes from a natural-language product description.",
    },
    coverage: "product",
    params: [
      { key: "description", label: { fr: "Description", en: "Description" }, placeholder: "lithium ion battery" },
      { key: "country", label: { fr: "Pays", en: "Country" }, placeholder: "US", optional: true },
      { key: "limit", label: { fr: "Limite", en: "Limit" }, placeholder: "5", optional: true },
    ],
  },
  {
    id: "customs_alternatives",
    method: "GET",
    path: "/v2/customs/alternatives",
    title: { fr: "Codes HS alternatifs", en: "Alternative HS codes" },
    desc: {
      fr: "Propose des classifications alternatives plausibles pour un code HS donné.",
      en: "Suggests plausible alternative classifications for a given HS code.",
    },
    coverage: "product",
    params: [
      { key: "code", label: { fr: "Code HS", en: "HS code" }, placeholder: "330420" },
    ],
  },
  {
    id: "customs_dual_use",
    method: "GET",
    path: "/v2/customs/dual-use",
    title: { fr: "Contrôle dual-use", en: "Dual-use screening" },
    desc: {
      fr: "Le produit tombe-t-il sous un régime de contrôle d'export pour une destination donnée (EU 2021/821, US EAR…) ?",
      en: "Does the product fall under an export-control regime for a given destination (EU 2021/821, US EAR…)?",
    },
    coverage: "product",
    params: [
      { key: "description", label: { fr: "Description", en: "Description" }, placeholder: "encryption module", optional: true },
      { key: "code", label: { fr: "Code HS", en: "HS code" }, placeholder: "854231", optional: true },
      { key: "destination", label: { fr: "Destination", en: "Destination" }, placeholder: "CN" },
    ],
  },
  {
    id: "customs_landed_cost",
    method: "POST",
    path: "/v2/customs/landed-cost",
    title: { fr: "Calcul de coût rendu", en: "Landed-cost calculator" },
    desc: {
      fr: "Coût rendu (CIF + droits + TVA + frais) depuis un HS, origine, destination, prix FOB USD.",
      en: "Landed cost (CIF + duties + VAT + fees) from HS, origin, destination, FOB USD price.",
    },
    coverage: "product",
    params: [
      { key: "code", label: { fr: "Code HS", en: "HS code" }, placeholder: "850440" },
      { key: "origin", label: { fr: "Origine", en: "Origin" }, placeholder: "CN" },
      { key: "destination", label: { fr: "Destination", en: "Destination" }, placeholder: "FR" },
      { key: "fob_usd", label: { fr: "Prix FOB (USD)", en: "FOB price (USD)" }, placeholder: "12500" },
    ],
  },
  {
    id: "customs_reverse_classify",
    method: "POST",
    path: "/v2/customs/reverse-classify",
    title: { fr: "Code HS → description produit", en: "HS code → product description" },
    desc: {
      fr: "Génère une description produit défendable à partir d'un code HS.",
      en: "Generates a defensible product description from an HS code.",
    },
    coverage: "product",
    params: [
      { key: "code", label: { fr: "Code HS", en: "HS code" }, placeholder: "330420" },
    ],
  },
  {
    id: "standards_gost",
    method: "GET",
    path: "/v2/standards/gost",
    title: { fr: "Standards GOST / EAEU", en: "GOST / EAEU standards" },
    desc: {
      fr: "Standards GOST / TR EAEU applicables à un code HS dans un pays de l'EAEU.",
      en: "GOST / TR EAEU standards applicable to an HS code in a Eurasian Economic Union country.",
    },
    coverage: "product",
    params: [
      { key: "hs", label: { fr: "Code HS", en: "HS code" }, placeholder: "850440", optional: true },
      { key: "country", label: { fr: "Pays", en: "Country" }, placeholder: "RU", optional: true },
      { key: "limit", label: { fr: "Limite", en: "Limit" }, placeholder: "10", optional: true },
    ],
  },
  {
    id: "eaeu_parallel_import",
    method: "GET",
    path: "/v2/eaeu/parallel-import",
    title: { fr: "Importation parallèle EAEU", en: "EAEU parallel-import rules" },
    desc: {
      fr: "Un certificat émis par un pays EAEU est-il reconnu dans les autres états membres pour un produit donné ?",
      en: "Is a certificate issued by an EAEU country recognised in other member states for a given product?",
    },
    coverage: "product",
    params: [
      { key: "cert_country", label: { fr: "Pays certificat", en: "Cert country" }, placeholder: "KZ" },
      { key: "cert_type", label: { fr: "Type", en: "Cert type" }, placeholder: "tr_cu" },
      { key: "product_code", label: { fr: "Code produit", en: "Product code" }, placeholder: "850440", optional: true },
    ],
  },
  // ───── Legal Atlas (11) ─────
  {
    id: "search",
    method: "GET",
    path: "/v2/search",
    title: { fr: "Recherche hybride", en: "Hybrid search" },
    desc: {
      fr: "Recherche dans le corpus juridique : sémantique (embeddings) + lexical (BM25). Filtres pays, type, langue.",
      en: "Search across the legal corpus: semantic (embeddings) + lexical (BM25). Filter by country, type, language.",
    },
    coverage: "legal",
    params: [
      { key: "q", label: { fr: "Requête", en: "Query" }, placeholder: "cosmetic labeling requirements" },
      { key: "country", label: { fr: "Pays", en: "Country" }, placeholder: "FR", optional: true },
      { key: "type", label: { fr: "Type", en: "Type" }, placeholder: "legislation", optional: true },
      { key: "limit", label: { fr: "Limite", en: "Limit" }, placeholder: "10", optional: true },
    ],
  },
  {
    id: "search_bulk",
    method: "POST",
    path: "/v2/search/bulk",
    title: { fr: "Recherche groupée", en: "Bulk search" },
    desc: {
      fr: "Jusqu'à 25 recherches sémantiques en un seul appel.",
      en: "Up to 25 semantic searches in a single call.",
    },
    coverage: "legal",
    params: [
      { key: "queries", label: { fr: "Requêtes (séparées par |)", en: "Queries (pipe-separated)" }, placeholder: "GDPR data subject rights | cookie consent banner ruling" },
    ],
  },
  {
    id: "documents",
    method: "GET",
    path: "/v2/documents",
    title: { fr: "Liste de documents", en: "List documents" },
    desc: {
      fr: "Liste paginée des documents juridiques. Filtres source, pays.",
      en: "Paginated list of legal documents. Filter by source, country.",
    },
    coverage: "legal",
    params: [
      { key: "country", label: { fr: "Pays", en: "Country" }, placeholder: "FR", optional: true },
      { key: "source", label: { fr: "Source", en: "Source" }, placeholder: "legifrance", optional: true },
      { key: "limit", label: { fr: "Limite", en: "Limit" }, placeholder: "10", optional: true },
    ],
  },
  {
    id: "documents_by_id",
    method: "GET",
    path: "/v2/documents/{id}",
    title: { fr: "Document par identifiant", en: "Document by ID" },
    desc: {
      fr: "Récupère un document complet (texte intégral + métadonnées) à partir de son identifiant.",
      en: "Fetches a full document (text + metadata) from its ID.",
    },
    coverage: "legal",
    params: [
      { key: "id", label: { fr: "ID document", en: "Document ID" }, placeholder: "fr_legifrance_R5131-1" },
    ],
  },
  {
    id: "documents_bulk",
    method: "POST",
    path: "/v2/documents/bulk",
    title: { fr: "Récupération groupée", en: "Bulk fetch" },
    desc: {
      fr: "Récupère jusqu'à 50 documents en un seul appel.",
      en: "Fetches up to 50 documents in a single call.",
    },
    coverage: "legal",
    params: [
      { key: "ids", label: { fr: "IDs (séparés par ,)", en: "IDs (comma-separated)" }, placeholder: "fr_legifrance_R5131-1,fr_legifrance_R5131-2" },
    ],
  },
  {
    id: "changes",
    method: "GET",
    path: "/v2/changes",
    title: { fr: "Changements depuis une date", en: "Changes since timestamp" },
    desc: {
      fr: "Documents créés/modifiés/supprimés depuis un timestamp. Fenêtre max 90 jours.",
      en: "Documents created/modified/deleted since a timestamp. Max 90-day window.",
    },
    coverage: "legal",
    params: [
      { key: "since", label: { fr: "Depuis (ISO)", en: "Since (ISO)" }, placeholder: "2026-05-01T00:00:00Z" },
      { key: "country", label: { fr: "Pays", en: "Country" }, placeholder: "FR", optional: true },
      { key: "limit", label: { fr: "Limite", en: "Limit" }, placeholder: "10", optional: true },
    ],
  },
  {
    id: "translate",
    method: "POST",
    path: "/v2/translate",
    title: { fr: "Traduction juridique", en: "Legal translation" },
    desc: {
      fr: "Traduit un fragment juridique en préservant la terminologie et les références d'articles.",
      en: "Translates a legal fragment preserving technical terminology and article references.",
    },
    coverage: "legal",
    params: [
      { key: "text", label: { fr: "Texte", en: "Text" }, placeholder: "L'article 5 du RGPD impose..." },
      { key: "target_lang", label: { fr: "Langue cible", en: "Target lang" }, placeholder: "en" },
      { key: "source_lang", label: { fr: "Langue source", en: "Source lang" }, placeholder: "fr", optional: true },
    ],
  },
  {
    id: "coverage",
    method: "GET",
    path: "/v2/coverage",
    title: { fr: "Couverture par source", en: "Coverage snapshot" },
    desc: {
      fr: "Snapshot global de couverture : volumes documents, dernière collecte réussie, statut.",
      en: "Global coverage snapshot: document volumes, last successful crawl, status.",
    },
    coverage: "legal",
    params: [],
  },
  {
    id: "countries",
    method: "GET",
    path: "/v2/countries",
    title: { fr: "Liste des pays", en: "Supported countries" },
    desc: {
      fr: "Pays couverts par Cleo Legal Data, avec code ISO-2, nom et nombre de sources actives.",
      en: "Countries covered by Cleo Legal Data, with ISO-2 code, name and active sources count.",
    },
    coverage: "legal",
    params: [],
  },
  {
    id: "authorities",
    method: "GET",
    path: "/v2/authorities",
    title: { fr: "Liste des autorités", en: "Regulatory authorities" },
    desc: {
      fr: "Autorités réglementaires suivies (ANSM, CNIL, FDA, EMA…), avec pays et domaines de compétence.",
      en: "Regulatory authorities tracked (ANSM, CNIL, FDA, EMA…), with country and area of competence.",
    },
    coverage: "legal",
    params: [
      { key: "country", label: { fr: "Pays", en: "Country" }, placeholder: "FR", optional: true },
      { key: "limit", label: { fr: "Limite", en: "Limit" }, placeholder: "10", optional: true },
    ],
  },
  {
    id: "webhooks",
    method: "GET",
    path: "/v2/webhooks",
    title: { fr: "Souscriptions webhooks", en: "Webhook subscriptions" },
    desc: {
      fr: "Liste les souscriptions webhooks actives sur votre compte.",
      en: "Lists active webhook subscriptions on your account.",
    },
    coverage: "legal",
    params: [],
  },
];

type ResponseMode =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; data: unknown; took: number }
  | { kind: "error"; message: string };

export default function Playground() {
  const [lang, setLang] = useState<Lang>("en");
  const [endpointId, setEndpointId] = useState<EndpointId>("compliance_check");
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
  // Endpoints that filter Cleo data live ──────────────────────────────
  if (id === "compliance_check") {
    const product = await loadProduct();
    const dest = (params.destination_country || "FR").toUpperCase();
    const desc = params.description || "sunscreen SPF50";
    const cat = guessCategoryFromDesc(desc);
    let regs = product.regulations as AnyRow[];
    if (cat) regs = regs.filter((r) => ciIncl(String(r.category), cat));
    regs = regs.filter((r) => ci(String(r.jurisdiction_code), dest));
    const hs = guessHsFromDesc(desc);
    return {
      data: {
        hs_code: hs.code,
        hs_description: hs.description,
        duties: hs.duties,
        obligations: regs.slice(0, 5).map((r) => ({
          code: String(r.regulation_ref || r.regulation_name),
          title: r.regulation_name,
          authority: r.enforcement_body,
          criticality: r.criticality,
          url: r.url || null,
        })),
        dual_use: { controlled: /encrypt|drone|defense|nuclear/i.test(desc) },
        alternatives: hs.alternatives,
        landed_cost_hint: "Use POST /v2/customs/landed-cost with FOB price.",
      },
      coverage_status: regs.length > 0 ? "covered" : "partial",
      next_check_at: in30Days(),
      advisory_disclaimer: "Cleo provides advisory data; final compliance is the importer's responsibility.",
    };
  }

  if (id === "customs_duties") {
    const code = params.code || "330420";
    const country = (params.country || "FR").toUpperCase();
    return mockDuties(code, country);
  }

  if (id === "customs_obligations") {
    const product = await loadProduct();
    const country = (params.country || "DE").toUpperCase();
    const hs = params.hs || "850440";
    const cat = guessCategoryFromHs(hs);
    let regs = product.regulations as AnyRow[];
    regs = regs.filter((r) => ci(String(r.jurisdiction_code), country));
    if (cat) regs = regs.filter((r) => ciIncl(String(r.category), cat));
    return {
      data: regs.slice(0, 10).map((r) => ({
        code: r.regulation_ref,
        title: r.regulation_name,
        authority: r.enforcement_body,
        criticality: r.criticality,
        url: r.url || null,
      })),
      hs_code: hs,
      country,
      total: regs.length,
    };
  }

  if (id === "customs_lookup") {
    const desc = params.description || "lithium ion battery";
    const limit = Math.max(1, Math.min(20, parseInt(params.limit) || 5));
    return {
      data: hsCodeSuggestions(desc).slice(0, limit),
      query: desc,
    };
  }

  if (id === "customs_alternatives") {
    const code = params.code || "330420";
    return {
      base: code,
      alternatives: [
        { code: code.slice(0, 4) + "99", match: 0.78, label: "Other cosmetics, not elsewhere specified" },
        { code: code.slice(0, 4) + "30", match: 0.64, label: "Make-up or skin-care preparations" },
        { code: code.slice(0, 4) + "10", match: 0.52, label: "Lip make-up preparations" },
      ],
    };
  }

  if (id === "customs_dual_use") {
    const desc = params.description || "";
    const code = params.code || "";
    const dest = (params.destination || "CN").toUpperCase();
    const controlled = /encrypt|drone|defense|nuclear|missile|biotech/i.test(desc + code);
    return {
      controlled,
      destination: dest,
      regime: controlled ? "EU Reg 2021/821 — Cat 5A002 (Information security)" : null,
      requires_license: controlled,
      reason: controlled
        ? "Product description matches dual-use category 5A002 (cryptography ≥ 56-bit symmetric)."
        : "No dual-use category matched.",
      references: controlled
        ? [
            { name: "EU Dual-Use Reg 2021/821 — Annex I", url: "https://eur-lex.europa.eu/eli/reg/2021/821" },
          ]
        : [],
    };
  }

  if (id === "customs_landed_cost") {
    const code = params.code || "850440";
    const origin = (params.origin || "CN").toUpperCase();
    const destination = (params.destination || "FR").toUpperCase();
    const fob = parseFloat(params.fob_usd) || 12500;
    const duty = mockDuties(code, destination);
    const dutyPct = (duty as { duty_pct: number }).duty_pct;
    const vatPct = (duty as { vat_pct: number }).vat_pct;
    const cif = Math.round(fob * 1.08 * 100) / 100; // freight + insurance ~8%
    const dutyAmt = Math.round(cif * (dutyPct / 100) * 100) / 100;
    const vatAmt = Math.round((cif + dutyAmt) * (vatPct / 100) * 100) / 100;
    const customsFees = 85;
    const landed = Math.round((cif + dutyAmt + vatAmt + customsFees) * 100) / 100;
    return {
      currency: "USD",
      code,
      origin,
      destination,
      breakdown: {
        fob: fob,
        cif: cif,
        duty: { rate_pct: dutyPct, amount: dutyAmt },
        vat: { rate_pct: vatPct, amount: vatAmt },
        customs_fees: customsFees,
      },
      landed_cost: landed,
    };
  }

  if (id === "customs_reverse_classify") {
    const code = params.code || "330420";
    const cat = guessCategoryFromHs(code);
    return {
      code,
      hs_section: code.slice(0, 2),
      description_en: `Product classified under HS ${code} — typical category: ${cat || "unspecified"}.`,
      defensible_text: `Product falling within HS ${code} corresponding to ${cat || "the specified tariff position"}, packaged for retail sale.`,
      confidence: 0.86,
    };
  }

  if (id === "standards_gost") {
    const hs = params.hs || "850440";
    const country = (params.country || "RU").toUpperCase();
    const limit = Math.max(1, Math.min(20, parseInt(params.limit) || 10));
    const all = [
      { code: "GOST 30804.3.2-2013", title: "Electromagnetic compatibility — harmonic current emissions", country: "RU", binding: true },
      { code: "TR CU 004/2011", title: "Safety of low-voltage equipment", country: "EAEU", binding: true },
      { code: "TR CU 020/2011", title: "Electromagnetic compatibility of technical means", country: "EAEU", binding: true },
      { code: "GOST R 51317.3.2-2014", title: "Russian equivalent of IEC 61000-3-2", country: "RU", binding: false },
      { code: "GOST IEC 60950-1-2014", title: "IT equipment safety", country: "RU", binding: true },
    ];
    return { data: all.slice(0, limit), hs_code: hs, country, total: all.length };
  }

  if (id === "eaeu_parallel_import") {
    const certCountry = (params.cert_country || "KZ").toUpperCase();
    const certType = params.cert_type || "tr_cu";
    const productCode = params.product_code || "850440";
    return {
      recognised: certType === "tr_cu",
      cert_country: certCountry,
      cert_type: certType,
      product_code: productCode,
      recognised_in: certType === "tr_cu" ? ["RU", "KZ", "BY", "AM", "KG"] : [certCountry],
      reasoning:
        certType === "tr_cu"
          ? "TR CU certificates are mutually recognised across all 5 EAEU member states under Treaty Article 53."
          : `${certType} certificates are valid only in the issuing country.`,
      reference: "EAEU Treaty Article 53, Annex 9 (Technical Regulations)",
    };
  }

  if (id === "search") {
    const q = params.q || "cosmetic labeling requirements";
    const country = params.country ? params.country.toUpperCase() : undefined;
    const type = params.type;
    const limit = Math.max(1, Math.min(50, parseInt(params.limit) || 10));
    const product = await loadProduct();
    let regs = product.regulations as AnyRow[];
    if (country) regs = regs.filter((r) => ci(String(r.jurisdiction_code), country));
    const qLower = q.toLowerCase();
    regs = regs.filter(
      (r) =>
        String(r.regulation_name).toLowerCase().includes(qLower) ||
        String(r.regulation_ref ?? "").toLowerCase().includes(qLower) ||
        String(r.enforcement_body ?? "").toLowerCase().includes(qLower) ||
        String(r.category ?? "").toLowerCase().includes(qLower),
    );
    return {
      data: regs.slice(0, limit).map((r, i) => ({
        id: `${String(r.jurisdiction_code).toLowerCase()}_${slug(String(r.regulation_name))}`,
        title: r.regulation_name,
        ref: r.regulation_ref,
        type: type || "legislation",
        country: r.jurisdiction_code,
        lang: country === "FR" ? "fr" : "en",
        url: r.url || null,
        score: Math.round((1 - i * 0.04) * 100) / 100,
      })),
      query: q,
      total: regs.length,
      coverage_status: "covered",
    };
  }

  if (id === "search_bulk") {
    const queries = (params.queries || "GDPR data subject rights|cookie consent banner ruling").split("|").map((s) => s.trim()).filter(Boolean);
    const product = await loadProduct();
    const regs = product.regulations as AnyRow[];
    return {
      data: queries.map((q) => {
        const qLower = q.toLowerCase();
        const hits = regs.filter(
          (r) =>
            String(r.regulation_name).toLowerCase().includes(qLower) ||
            String(r.regulation_ref ?? "").toLowerCase().includes(qLower),
        );
        return {
          query: q,
          hits: hits.slice(0, 3).map((r) => ({
            id: `${String(r.jurisdiction_code).toLowerCase()}_${slug(String(r.regulation_name))}`,
            title: r.regulation_name,
            country: r.jurisdiction_code,
            score: 0.84,
          })),
          total: hits.length,
        };
      }),
    };
  }

  if (id === "documents") {
    const manifest = await loadManifest();
    const country = params.country ? params.country.toUpperCase() : undefined;
    const source = params.source ? params.source.toLowerCase() : undefined;
    const limit = Math.max(1, Math.min(50, parseInt(params.limit) || 10));
    const all: AnyRow[] = [];
    for (const c of manifest.countries) {
      if (country && c.code !== country) continue;
      for (const s of c.sources ?? []) {
        if (source && !String(s.id).toLowerCase().includes(source) && !String(s.name).toLowerCase().includes(source)) continue;
        all.push({
          id: `${String(c.code).toLowerCase()}_${slug(String(s.name))}_${all.length}`,
          source_id: s.id,
          source_name: s.name,
          country: c.code,
          url: s.url,
          data_types: s.data_types,
        });
        if (all.length >= limit * 5) break;
      }
      if (all.length >= limit * 5) break;
    }
    return {
      data: all.slice(0, limit),
      pagination: { limit, returned: Math.min(limit, all.length) },
      total: all.length,
    };
  }

  if (id === "documents_by_id") {
    const id = params.id || "fr_legifrance_R5131-1";
    return {
      id,
      title: "Article R5131-1 du Code de la santé publique",
      type: "legislation",
      country: "FR",
      lang: "fr",
      source: "Légifrance",
      url: "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072665/LEGISCTA000006171151/",
      last_modified: "2026-04-22T00:00:00Z",
      text_excerpt:
        "Pour l'application de l'article L5131-2, on entend par produit cosmétique toute substance ou tout mélange destiné à être mis en contact avec les parties superficielles du corps humain…",
      metadata: { article_count: 13, citing_documents: 47 },
    };
  }

  if (id === "documents_bulk") {
    const ids = (params.ids || "fr_legifrance_R5131-1,fr_legifrance_R5131-2").split(",").map((s) => s.trim()).filter(Boolean);
    return {
      data: ids.map((id) => ({
        id,
        title: `Document ${id}`,
        type: "legislation",
        country: id.split("_")[0]?.toUpperCase() || "FR",
        url: `https://www.legifrance.gouv.fr/.../${id}`,
        last_modified: "2026-04-22T00:00:00Z",
      })),
      total: ids.length,
    };
  }

  if (id === "changes") {
    const since = params.since || "2026-05-01T00:00:00Z";
    const country = params.country ? params.country.toUpperCase() : undefined;
    const limit = Math.max(1, Math.min(50, parseInt(params.limit) || 10));
    const product = await loadProduct();
    let regs = product.regulations as AnyRow[];
    if (country) regs = regs.filter((r) => ci(String(r.jurisdiction_code), country));
    return {
      since,
      country: country ?? null,
      data: regs.slice(0, limit).map((r, i) => ({
        id: `${String(r.jurisdiction_code).toLowerCase()}_${slug(String(r.regulation_name))}`,
        change_type: i % 3 === 0 ? "created" : i % 3 === 1 ? "modified" : "deleted",
        title: r.regulation_name,
        country: r.jurisdiction_code,
        timestamp: new Date(Date.now() - i * 3600_000).toISOString(),
      })),
      window_days: 90,
    };
  }

  if (id === "translate") {
    const text = params.text || "L'article 5 du RGPD impose...";
    const targetLang = params.target_lang || "en";
    const sourceLang = params.source_lang || "auto";
    return {
      source_lang: sourceLang,
      target_lang: targetLang,
      input: text,
      output: mockTranslate(text, sourceLang, targetLang),
      glossary_applied: ["RGPD → GDPR", "Article → Article"],
    };
  }

  if (id === "coverage") {
    const manifest = await loadManifest();
    const product = await loadProduct();
    return {
      legal_atlas: {
        total_countries: manifest.countries.length,
        total_sources: (manifest.stats as { totalSources: number }).totalSources,
        estimated_documents: (manifest.stats as { estimatedTotalVolume: number }).estimatedTotalVolume,
        by_status: (manifest.stats as { byStatus: AnyRow }).byStatus,
        last_refresh: (manifest.stats as { generatedAt: string }).generatedAt,
      },
      product_atlas: {
        regulations_audited: (product.totals as { product_regs_audited: number }).product_regs_audited,
        regulations_in_api: (product.totals as { product_regs_in_api: number }).product_regs_in_api,
        coverage_pct: (product.totals as { product_coverage_pct: number }).product_coverage_pct,
        categories: (product.totals as { product_categories: number }).product_categories,
        jurisdictions: (product.totals as { jurisdictions_audited: number }).jurisdictions_audited,
      },
    };
  }

  if (id === "countries") {
    const manifest = await loadManifest();
    return {
      data: manifest.countries.map((c) => ({
        code: c.code,
        name: c.name,
        flag: c.flag,
        sources: c.total,
        completion: c.completion,
      })),
      total: manifest.countries.length,
    };
  }

  if (id === "authorities") {
    const product = await loadProduct();
    const country = params.country ? params.country.toUpperCase() : undefined;
    const limit = Math.max(1, Math.min(50, parseInt(params.limit) || 10));
    let regs = product.regulations as AnyRow[];
    if (country) regs = regs.filter((r) => ci(String(r.jurisdiction_code), country));
    const counts = new Map<string, { name: string; country: string; count: number }>();
    for (const r of regs) {
      const name = String(r.enforcement_body || "").trim();
      if (!name) continue;
      const k = `${name}|${r.jurisdiction_code}`;
      const cur = counts.get(k);
      if (cur) cur.count++;
      else counts.set(k, { name, country: String(r.jurisdiction_code), count: 1 });
    }
    const sorted = Array.from(counts.values()).sort((a, b) => b.count - a.count);
    return {
      data: sorted.slice(0, limit).map((a) => ({
        name: a.name,
        country: a.country,
        regulations_count: a.count,
      })),
      total: sorted.length,
    };
  }

  if (id === "webhooks") {
    return {
      data: [
        {
          id: "wh_eu_legal_changes",
          endpoint: "https://your-app.example.com/cleo/webhook",
          events: ["regulation.created", "regulation.modified"],
          status: "active",
          last_delivery: "2026-06-02T08:14:00Z",
          delivery_success_rate_30d: 0.998,
        },
        {
          id: "wh_product_recalls",
          endpoint: "https://your-app.example.com/cleo/recalls",
          events: ["recall.created"],
          status: "active",
          last_delivery: "2026-06-01T23:42:00Z",
          delivery_success_rate_30d: 1.0,
        },
      ],
      total: 2,
    };
  }

  throw new Error(`Unknown endpoint: ${id}`);
}

/* ─── helpers ─── */

function in30Days(): string {
  return new Date(Date.now() + 30 * 86400_000).toISOString();
}

function guessCategoryFromDesc(desc: string): string | null {
  const d = desc.toLowerCase();
  if (/sunscreen|spf|cream|cosmetic|shampoo|skin|hair|lipstick/.test(d)) return "cosmetics";
  if (/battery|lithium|ion/.test(d)) return "Electronics";
  if (/phone|smartphone|mobile/.test(d)) return "Smartphones";
  if (/toy|stuffed|plush/.test(d)) return "Toys";
  if (/bandage|adhesive|medical/.test(d)) return "Adhesive";
  if (/vape|cigarette|tobacco/.test(d)) return "Vaping";
  if (/detergent|pod|laundry|cleaning/.test(d)) return "Detergent";
  if (/supplement|vitamin|nutraceutical/.test(d)) return "Dietary";
  if (/textile|fabric|apparel|legging|clothing/.test(d)) return "Apparel";
  if (/helmet|bicycle|ppe/.test(d)) return "Helmets";
  if (/wine|spirit|alcohol|beer/.test(d)) return "Wine";
  if (/meat|beef|pork|chicken|poultry/.test(d)) return "Meat";
  if (/pharma|drug|medicine|otc/.test(d)) return "Pharma";
  if (/tyre|tire|wheel/.test(d)) return "Tyre";
  if (/insecticide|pesticide|biocide/.test(d)) return "Insecticide";
  if (/drone|uav|uas/.test(d)) return "Drone";
  if (/vacuum|appliance|iot/.test(d)) return "Smart";
  if (/implant|dental/.test(d)) return "Implant";
  if (/paint|coating/.test(d)) return "Paint";
  if (/pet food|dog food|cat food|croquette/.test(d)) return "Pet";
  return null;
}

function guessCategoryFromHs(code: string): string | null {
  const prefix = code.slice(0, 4);
  const map: Record<string, string> = {
    "3304": "cosmetics",
    "8504": "Electronics",
    "8517": "Smartphones",
    "8507": "Battery",
    "9503": "Toys",
    "3005": "Adhesive Bandages",
    "2402": "Vaping",
    "3402": "Detergent",
    "2106": "Dietary Supplements",
    "6109": "Apparel",
    "6506": "Helmets",
    "2204": "Wine",
    "2202": "Beverages",
    "0201": "Meat",
    "3004": "Pharma",
    "4011": "Tyres",
    "3808": "Insecticide",
    "8806": "Drones",
    "8508": "Vacuum",
    "9021": "Implants",
    "3209": "Paints",
    "2309": "Pet Food",
  };
  return map[prefix] ?? null;
}

function guessHsFromDesc(desc: string): {
  code: string;
  description: string;
  duties: { duty_pct: number; vat_pct: number; excise: number | null };
  alternatives: { code: string; match: number }[];
} {
  const d = desc.toLowerCase();
  if (/sunscreen|spf|cosmetic|cream|shampoo/.test(d))
    return {
      code: "330420",
      description: "Eye make-up preparations or skin-care including SPF",
      duties: { duty_pct: 0, vat_pct: 20, excise: null },
      alternatives: [{ code: "330499", match: 0.78 }, { code: "330491", match: 0.72 }],
    };
  if (/battery|lithium/.test(d))
    return {
      code: "850760",
      description: "Lithium-ion batteries",
      duties: { duty_pct: 2.7, vat_pct: 20, excise: null },
      alternatives: [{ code: "850780", match: 0.81 }, { code: "853710", match: 0.6 }],
    };
  if (/phone|smartphone/.test(d))
    return {
      code: "851712",
      description: "Mobile telephones",
      duties: { duty_pct: 0, vat_pct: 20, excise: null },
      alternatives: [{ code: "851762", match: 0.7 }],
    };
  return {
    code: "999999",
    description: "Unclassified — needs manual review",
    duties: { duty_pct: 5, vat_pct: 20, excise: null },
    alternatives: [],
  };
}

function hsCodeSuggestions(
  desc: string,
): { code: string; description: string; confidence: number }[] {
  const d = desc.toLowerCase();
  if (/battery|lithium|ion/.test(d))
    return [
      { code: "850760", description: "Lithium-ion accumulators", confidence: 0.93 },
      { code: "850780", description: "Other electric accumulators", confidence: 0.71 },
      { code: "854130", description: "Thyristors, diacs, triacs", confidence: 0.22 },
    ];
  if (/cosmetic|sunscreen|cream/.test(d))
    return [
      { code: "330420", description: "Skin-care preparations", confidence: 0.92 },
      { code: "330499", description: "Other beauty preparations", confidence: 0.78 },
    ];
  if (/phone|smartphone/.test(d))
    return [
      { code: "851712", description: "Mobile telephones", confidence: 0.96 },
      { code: "851762", description: "Reception apparatus", confidence: 0.62 },
    ];
  return [
    { code: "999999", description: "Unclassified", confidence: 0.1 },
  ];
}

function mockDuties(code: string, country: string): unknown {
  const base = code.slice(0, 4);
  const byCountry: Record<string, { duty: number; vat: number }> = {
    FR: { duty: dutyByPrefix(base), vat: 20 },
    DE: { duty: dutyByPrefix(base), vat: 19 },
    IT: { duty: dutyByPrefix(base), vat: 22 },
    ES: { duty: dutyByPrefix(base), vat: 21 },
    GB: { duty: dutyByPrefix(base), vat: 20 },
    US: { duty: dutyByPrefix(base) / 2, vat: 0 },
    CA: { duty: dutyByPrefix(base) / 2, vat: 5 },
    JP: { duty: dutyByPrefix(base), vat: 10 },
    CN: { duty: dutyByPrefix(base) * 1.5, vat: 13 },
    AU: { duty: dutyByPrefix(base), vat: 10 },
    BR: { duty: dutyByPrefix(base) * 2, vat: 17 },
  };
  const c = byCountry[country] || { duty: 5, vat: 0 };
  return {
    code,
    country,
    duty_pct: c.duty,
    vat_pct: c.vat,
    excise: null,
    free_trade_agreements: country === "FR" || country === "DE" ? ["EU-Internal Market"] : [],
  };
}

function dutyByPrefix(prefix: string): number {
  const map: Record<string, number> = {
    "3304": 0,
    "8504": 2.5,
    "8507": 2.7,
    "8517": 0,
    "9503": 4.7,
    "2204": 6.4,
    "0201": 12.8,
    "4011": 4.5,
    "8806": 0,
  };
  return map[prefix] ?? 3.5;
}

function mockTranslate(text: string, source: string, target: string): string {
  if (target === "en" && /RGPD/i.test(text)) {
    return text
      .replace(/RGPD/g, "GDPR")
      .replace(/L'article (\d+)/g, "Article $1")
      .replace(/impose/g, "requires");
  }
  return `[${source}→${target}] ${text}`;
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

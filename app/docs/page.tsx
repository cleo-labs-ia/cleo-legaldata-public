"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { STRINGS } from "@/lib/i18n";

const MEET_URL = "https://www.cleolabs.co/en/meet";
const API_BASE = "https://api.legaldata.cleolabs.co";

/* ────────────────────────────────────────────────────────────────────
   i18n strings local to the docs page
   ──────────────────────────────────────────────────────────────────── */
const T = {
  navHome: { fr: "Atlas", en: "Atlas" },
  navProducts: { fr: "Atlas Produit", en: "Product Atlas" },
  navDocs: { fr: "Docs", en: "Docs" },
  navGetKey: { fr: "Obtenir une clé", en: "Get API key" },
  heroEyebrow: { fr: "Documentation", en: "Documentation" },
  heroTitle: { fr: "Documentation API", en: "API Documentation" },
  heroSubtitle: {
    fr: "Deux APIs. Une plateforme. Une seule authentification.",
    en: "Two APIs. One platform. One authentication.",
  },
  baseUrlLabel: { fr: "URL de base", en: "Base URL" },
  versionLabel: { fr: "Version", en: "Version" },
  formatLabel: { fr: "Format", en: "Format" },
  // Quick start
  quickStart: { fr: "Démarrage rapide", en: "Quick start" },
  qsStep1Title: { fr: "1. Obtenez votre clé", en: "1. Get your API key" },
  qsStep1Body: {
    fr: "Réservez 20 minutes avec l'équipe pour activer votre compte. Vous recevez une clé de la forme ld_live_… utilisable immédiatement.",
    en: "Book 20 minutes with the team to activate your account. You receive a key of the form ld_live_… ready to use.",
  },
  qsStep2Title: { fr: "2. Faites votre premier appel", en: "2. Make your first call" },
  qsStep2Body: {
    fr: "Tous les endpoints utilisent un header Authorization: Bearer. Aucun SDK requis pour commencer.",
    en: "All endpoints use an Authorization: Bearer header. No SDK required to get started.",
  },
  qsStep3Title: { fr: "3. Construisez votre cas d'usage", en: "3. Build something" },
  qsStep3Body: {
    fr: "Conformité produit, veille réglementaire, recherche sémantique : tout est exposé sur la même base d'URL.",
    en: "Product compliance, regulatory monitoring, semantic search: everything is exposed under the same base URL.",
  },
  // Auth
  authTitle: { fr: "Authentification", en: "Authentication" },
  authBody: {
    fr: "Toutes les requêtes doivent inclure un header Authorization avec votre clé d'API. Les clés sont rotables à tout moment depuis votre dashboard, et révocables instantanément.",
    en: "Every request must include an Authorization header with your API key. Keys are rotatable from your dashboard at any time, and revocable instantly.",
  },
  authGetKey: {
    fr: "Vous n'avez pas encore de clé ? Demandez un accès en 20 minutes.",
    en: "Don't have a key yet? Request access in 20 minutes.",
  },
  // Sections
  productApiTitle: { fr: "Product Compliance API", en: "Product Compliance API" },
  productApiIntro: {
    fr: "Vérifiez si un produit (cosmétique, électronique, jouet, alimentaire, etc.) est conforme dans n'importe quel pays. Classification HS, droits de douane, obligations réglementaires, contrôle dual-use et calcul de coût rendu — dans une plateforme unique.",
    en: "Check whether a product (cosmetics, electronics, toys, food, etc.) is compliant in any country. HS classification, customs duties, regulatory obligations, dual-use screening and landed-cost computation — in a single platform.",
  },
  legalApiTitle: { fr: "Legal Data API", en: "Legal Data API" },
  legalApiIntro: {
    fr: "Accédez à la donnée juridique mondiale : législation, jurisprudence, recommandations, sanctions, alertes produit. Recherche hybride (sémantique + lexicale), bulk fetch, suivi des changements, traduction.",
    en: "Access global legal data: legislation, case law, guidelines, sanctions, product recalls. Hybrid search (semantic + lexical), bulk fetch, change tracking, translation.",
  },
  // Generic labels
  description: { fr: "Description", en: "Description" },
  request: { fr: "Requête", en: "Request" },
  response: { fr: "Réponse", en: "Response" },
  parameters: { fr: "Paramètres", en: "Parameters" },
  body: { fr: "Corps", en: "Body" },
  example: { fr: "Exemple", en: "Example" },
  required: { fr: "requis", en: "required" },
  optional: { fr: "optionnel", en: "optional" },
  // Errors
  errorsTitle: { fr: "Codes d'erreur", en: "Error codes" },
  errorsBody: {
    fr: "L'API renvoie des codes HTTP standards. Toutes les réponses d'erreur partagent la même enveloppe JSON.",
    en: "The API returns standard HTTP codes. All error responses share the same JSON envelope.",
  },
  // Rate limits
  rateLimitsTitle: { fr: "Limites de débit", en: "Rate limits" },
  rateLimitsBody: {
    fr: "Le plan Pro autorise 300 requêtes par minute. Le plan Enterprise autorise 600 req/min avec volumes négociables. Au-delà, un code 429 est retourné — réessayez après le délai indiqué dans le header Retry-After.",
    en: "The Pro plan allows 300 requests per minute. The Enterprise plan allows 600 req/min with negotiable volumes. Beyond that, a 429 is returned — retry after the delay shown in the Retry-After header.",
  },
  // SDKs
  sdksTitle: { fr: "SDK et exemples", en: "SDKs & examples" },
  sdksBody: {
    fr: "Aucun SDK propriétaire requis : l'API est HTTP/REST standard. Voici des exemples dans les langages les plus courants.",
    en: "No proprietary SDK required: the API is standard HTTP/REST. Below are examples in the most common languages.",
  },
  // Webhooks
  webhooksTitle: { fr: "Webhooks", en: "Webhooks" },
  webhooksBody: {
    fr: "Recevez des notifications signées (HMAC-SHA256) lors d'événements clés : nouvelle réglementation, modification d'un document, changement de tarif douanier. Les livraisons sont retentées 5 fois avec backoff exponentiel.",
    en: "Receive signed notifications (HMAC-SHA256) on key events: new regulation, document change, customs duty update. Deliveries are retried 5 times with exponential backoff.",
  },
  webhookSignature: { fr: "Signature de payload", en: "Payload signature" },
  webhookSignatureBody: {
    fr: "Chaque livraison inclut un header X-Cleo-Signature au format sha256=<hex>. Calculez le HMAC-SHA256 du corps brut avec votre secret webhook et comparez en temps constant.",
    en: "Each delivery includes a header X-Cleo-Signature in the form sha256=<hex>. Compute the HMAC-SHA256 of the raw body with your webhook secret and compare in constant time.",
  },
  tocTitle: { fr: "Sur cette page", en: "On this page" },
  footerCta: { fr: "Une question ? Parlons-en.", en: "Have a question? Let's talk." },
} as const;

/* ────────────────────────────────────────────────────────────────────
   Endpoint catalog
   ──────────────────────────────────────────────────────────────────── */
type Method = "GET" | "POST";

type EndpointSpec = {
  id: string;
  method: Method;
  path: string;
  title: { fr: string; en: string };
  description: { fr: string; en: string };
  params?: Array<{
    name: string;
    where: "query" | "path" | "body";
    type: string;
    required?: boolean;
    note?: { fr: string; en: string };
  }>;
  curl: string;
  python: string;
  node: string;
  response?: string;
};

const PRODUCT_ENDPOINTS: EndpointSpec[] = [
  {
    id: "compliance-check",
    method: "POST",
    path: "/v2/compliance/check",
    title: {
      fr: "Vérification de conformité composite",
      en: "Composite compliance check",
    },
    description: {
      fr: "L'endpoint le plus complet : à partir d'une description produit et d'un pays de destination, retourne la classification HS, les droits/TVA/accises, les obligations réglementaires, le contrôle dual-use, les alternatives suggérées et le coût rendu estimé. Coûte 5 unités de quota.",
      en: "The most comprehensive endpoint: from a product description and destination country, returns HS classification, duties/VAT/excise, regulatory obligations, dual-use screening, suggested alternatives and estimated landed cost. Costs 5 quota units.",
    },
    params: [
      { name: "product.description", where: "body", type: "string", required: true, note: { fr: "Description libre, 2 à 2 000 caractères.", en: "Free-text description, 2 to 2,000 characters." } },
      { name: "product.lang", where: "body", type: "string", note: { fr: "Code ISO 639-1, ex: \"en\", \"fr\".", en: "ISO 639-1 code, e.g. \"en\", \"fr\"." } },
      { name: "product.intended_use", where: "body", type: "string", note: { fr: "Contexte d'usage (consommateur, industriel, médical…).", en: "Use context (consumer, industrial, medical…)." } },
      { name: "destination_country", where: "body", type: "string", required: true, note: { fr: "Code ISO-2 du pays destinataire.", en: "ISO-2 code of destination country." } },
      { name: "origin_country", where: "body", type: "string", note: { fr: "Code ISO-2 du pays d'origine.", en: "ISO-2 code of origin country." } },
      { name: "client_type", where: "body", type: "string", note: { fr: "Un parmi : government, private, defense, oil_gas, mining, aviation, retail, healthcare, unknown.", en: "One of: government, private, defense, oil_gas, mining, aviation, retail, healthcare, unknown." } },
      { name: "options.include_alternatives", where: "body", type: "boolean", note: { fr: "Inclut les codes HS alternatifs.", en: "Include alternative HS codes." } },
      { name: "options.include_dual_use_check", where: "body", type: "boolean", note: { fr: "Inclut le screening dual-use.", en: "Include dual-use screening." } },
      { name: "options.include_parallel_import", where: "body", type: "boolean", note: { fr: "Inclut les règles EAEU d'importation parallèle.", en: "Include EAEU parallel-import rules." } },
    ],
    curl: `curl -X POST ${API_BASE}/v2/compliance/check \\
  -H "Authorization: Bearer ld_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "product": {"description": "sunscreen SPF50"},
    "destination_country": "FR",
    "client_type": "retail"
  }'`,
    python: `import httpx

r = httpx.post(
    "${API_BASE}/v2/compliance/check",
    headers={"Authorization": "Bearer ld_live_..."},
    json={
        "product": {"description": "sunscreen SPF50"},
        "destination_country": "FR",
        "client_type": "retail",
    },
    timeout=30,
)
r.raise_for_status()
print(r.json())`,
    node: `const res = await fetch("${API_BASE}/v2/compliance/check", {
  method: "POST",
  headers: {
    Authorization: "Bearer ld_live_...",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    product: { description: "sunscreen SPF50" },
    destination_country: "FR",
    client_type: "retail",
  }),
});
const data = await res.json();`,
    response: `{
  "data": {
    "hs_code": "330420",
    "duties": { "duty_pct": 0, "vat_pct": 20, "excise": null },
    "obligations": [
      { "code": "EU-COSMETICS-1223-2009", "title": "Cosmetic Products Regulation" }
    ],
    "dual_use": { "controlled": false },
    "alternatives": [{ "code": "330499", "match": 0.78 }]
  },
  "coverage_status": "covered",
  "next_check_at": "2026-06-26T00:00:00Z",
  "advisory_disclaimer": "Cleo provides advisory data; final compliance is the importer's responsibility."
}`,
  },
  {
    id: "customs-duties",
    method: "GET",
    path: "/v2/customs/duties",
    title: { fr: "Droits, TVA et accises", en: "Tariff, VAT and excise lookup" },
    description: {
      fr: "Retourne les taux de droits de douane, TVA et accises applicables à un code HS pour un pays donné.",
      en: "Returns customs duty, VAT and excise rates applicable to a given HS code for a country.",
    },
    params: [
      { name: "code", where: "query", type: "string", required: true, note: { fr: "Code HS (4, 6 ou 8 chiffres).", en: "HS code (4, 6 or 8 digits)." } },
      { name: "country", where: "query", type: "string", required: true, note: { fr: "Code ISO-2 du pays.", en: "Country ISO-2 code." } },
      { name: "system", where: "query", type: "string", note: { fr: "Un parmi : hs6, hs8, cn8, tn_ved, hts.", en: "One of: hs6, hs8, cn8, tn_ved, hts." } },
    ],
    curl: `curl "${API_BASE}/v2/customs/duties?code=330420&country=FR" \\
  -H "Authorization: Bearer ld_live_..."`,
    python: `import httpx
r = httpx.get(
    "${API_BASE}/v2/customs/duties",
    params={"code": "330420", "country": "FR"},
    headers={"Authorization": "Bearer ld_live_..."},
)
print(r.json())`,
    node: `const url = new URL("${API_BASE}/v2/customs/duties");
url.searchParams.set("code", "330420");
url.searchParams.set("country", "FR");
const res = await fetch(url, {
  headers: { Authorization: "Bearer ld_live_..." },
});`,
  },
  {
    id: "customs-obligations",
    method: "GET",
    path: "/v2/customs/obligations",
    title: { fr: "Obligations douanières", en: "Customs obligations" },
    description: {
      fr: "Liste les obligations réglementaires associées à un code HS dans un pays : licences, certifications, marquages obligatoires.",
      en: "Lists regulatory obligations attached to an HS code in a country: licenses, certifications, mandatory markings.",
    },
    params: [
      { name: "hs", where: "query", type: "string", required: true },
      { name: "country", where: "query", type: "string", required: true },
    ],
    curl: `curl "${API_BASE}/v2/customs/obligations?hs=850440&country=DE" \\
  -H "Authorization: Bearer ld_live_..."`,
    python: `import httpx
r = httpx.get(
    "${API_BASE}/v2/customs/obligations",
    params={"hs": "850440", "country": "DE"},
    headers={"Authorization": "Bearer ld_live_..."},
)`,
    node: `const url = new URL("${API_BASE}/v2/customs/obligations");
url.searchParams.set("hs", "850440");
url.searchParams.set("country", "DE");
const res = await fetch(url, {
  headers: { Authorization: "Bearer ld_live_..." },
});`,
  },
  {
    id: "customs-lookup",
    method: "GET",
    path: "/v2/customs/lookup",
    title: { fr: "Classification HS depuis description", en: "HS classification from description" },
    description: {
      fr: "Suggère un ou plusieurs codes HS à partir d'une description produit en langage naturel.",
      en: "Suggests one or more HS codes from a natural-language product description.",
    },
    params: [
      { name: "description", where: "query", type: "string", required: true },
      { name: "country", where: "query", type: "string" },
      { name: "limit", where: "query", type: "integer" },
    ],
    curl: `curl "${API_BASE}/v2/customs/lookup?description=lithium+ion+battery&country=US&limit=5" \\
  -H "Authorization: Bearer ld_live_..."`,
    python: `r = httpx.get(
    "${API_BASE}/v2/customs/lookup",
    params={"description": "lithium ion battery", "country": "US", "limit": 5},
    headers={"Authorization": "Bearer ld_live_..."},
)`,
    node: `const u = new URL("${API_BASE}/v2/customs/lookup");
u.searchParams.set("description", "lithium ion battery");
u.searchParams.set("country", "US");
const res = await fetch(u, { headers: { Authorization: "Bearer ld_live_..." } });`,
  },
  {
    id: "customs-alternatives",
    method: "GET",
    path: "/v2/customs/alternatives",
    title: { fr: "Codes HS alternatifs", en: "Alternative HS codes" },
    description: {
      fr: "Propose des classifications alternatives plausibles pour un code HS donné.",
      en: "Suggests plausible alternative classifications for a given HS code.",
    },
    params: [{ name: "code", where: "query", type: "string", required: true }],
    curl: `curl "${API_BASE}/v2/customs/alternatives?code=330420" \\
  -H "Authorization: Bearer ld_live_..."`,
    python: `r = httpx.get(
    "${API_BASE}/v2/customs/alternatives",
    params={"code": "330420"},
    headers={"Authorization": "Bearer ld_live_..."},
)`,
    node: `const res = await fetch("${API_BASE}/v2/customs/alternatives?code=330420", {
  headers: { Authorization: "Bearer ld_live_..." },
});`,
  },
  {
    id: "customs-dual-use",
    method: "GET",
    path: "/v2/customs/dual-use",
    title: { fr: "Contrôle dual-use", en: "Dual-use export-control screening" },
    description: {
      fr: "Indique si un produit (par description ou code) tombe sous un régime de contrôle d'exportation pour une destination donnée (EU Reg. 2021/821, US EAR, etc.).",
      en: "Indicates whether a product (by description or code) falls under an export-control regime for a given destination (EU Reg. 2021/821, US EAR, etc.).",
    },
    params: [
      { name: "description", where: "query", type: "string" },
      { name: "code", where: "query", type: "string" },
      { name: "destination", where: "query", type: "string", required: true },
    ],
    curl: `curl "${API_BASE}/v2/customs/dual-use?description=encryption+module&destination=CN" \\
  -H "Authorization: Bearer ld_live_..."`,
    python: `r = httpx.get(
    "${API_BASE}/v2/customs/dual-use",
    params={"description": "encryption module", "destination": "CN"},
    headers={"Authorization": "Bearer ld_live_..."},
)`,
    node: `const u = new URL("${API_BASE}/v2/customs/dual-use");
u.searchParams.set("description", "encryption module");
u.searchParams.set("destination", "CN");
const res = await fetch(u, { headers: { Authorization: "Bearer ld_live_..." } });`,
  },
  {
    id: "customs-landed-cost",
    method: "POST",
    path: "/v2/customs/landed-cost",
    title: { fr: "Calcul de coût rendu", en: "Landed-cost calculator" },
    description: {
      fr: "Calcule le coût rendu (CIF + droits + TVA + frais) à partir d'un code HS, d'un pays d'origine, d'un pays de destination et d'un prix FOB en USD.",
      en: "Computes the landed cost (CIF + duties + VAT + fees) from an HS code, origin country, destination country and FOB price in USD.",
    },
    params: [
      { name: "code", where: "body", type: "string", required: true },
      { name: "origin", where: "body", type: "string", required: true, note: { fr: "ISO-2.", en: "ISO-2." } },
      { name: "destination", where: "body", type: "string", required: true, note: { fr: "ISO-2.", en: "ISO-2." } },
      { name: "fob_usd", where: "body", type: "number", required: true },
    ],
    curl: `curl -X POST ${API_BASE}/v2/customs/landed-cost \\
  -H "Authorization: Bearer ld_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "code": "850440",
    "origin": "CN",
    "destination": "FR",
    "fob_usd": 12500
  }'`,
    python: `r = httpx.post(
    "${API_BASE}/v2/customs/landed-cost",
    headers={"Authorization": "Bearer ld_live_..."},
    json={"code": "850440", "origin": "CN", "destination": "FR", "fob_usd": 12500},
)`,
    node: `const res = await fetch("${API_BASE}/v2/customs/landed-cost", {
  method: "POST",
  headers: {
    Authorization: "Bearer ld_live_...",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    code: "850440",
    origin: "CN",
    destination: "FR",
    fob_usd: 12500,
  }),
});`,
  },
  {
    id: "customs-reverse-classify",
    method: "POST",
    path: "/v2/customs/reverse-classify",
    title: { fr: "Code HS vers description produit", en: "HS code to product description" },
    description: {
      fr: "Génère une description produit défendable à partir d'un code HS — utile pour rédiger une déclaration en douane cohérente.",
      en: "Generates a defensible product description from an HS code — useful to draft a consistent customs declaration.",
    },
    params: [
      { name: "code", where: "body", type: "string", required: true, note: { fr: "Code HS (4, 6 ou 8 chiffres).", en: "HS code (4, 6 or 8 digits)." } },
    ],
    curl: `curl -X POST ${API_BASE}/v2/customs/reverse-classify \\
  -H "Authorization: Bearer ld_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"code": "330420"}'`,
    python: `r = httpx.post(
    "${API_BASE}/v2/customs/reverse-classify",
    headers={"Authorization": "Bearer ld_live_..."},
    json={"code": "330420"},
)`,
    node: `const res = await fetch("${API_BASE}/v2/customs/reverse-classify", {
  method: "POST",
  headers: {
    Authorization: "Bearer ld_live_...",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ code: "330420" }),
});`,
  },
  {
    id: "standards-gost",
    method: "GET",
    path: "/v2/standards/gost",
    title: { fr: "Standards GOST / EAEU", en: "GOST / EAEU standards" },
    description: {
      fr: "Recherche les standards GOST / TR EAEU applicables à un code HS dans un pays de l'Union économique eurasiatique.",
      en: "Looks up GOST / TR EAEU standards applicable to an HS code in a Eurasian Economic Union country.",
    },
    params: [
      { name: "hs", where: "query", type: "string" },
      { name: "country", where: "query", type: "string" },
      { name: "limit", where: "query", type: "integer" },
    ],
    curl: `curl "${API_BASE}/v2/standards/gost?hs=850440&country=RU" \\
  -H "Authorization: Bearer ld_live_..."`,
    python: `r = httpx.get(
    "${API_BASE}/v2/standards/gost",
    params={"hs": "850440", "country": "RU"},
    headers={"Authorization": "Bearer ld_live_..."},
)`,
    node: `const u = new URL("${API_BASE}/v2/standards/gost");
u.searchParams.set("hs", "850440");
u.searchParams.set("country", "RU");
const res = await fetch(u, { headers: { Authorization: "Bearer ld_live_..." } });`,
  },
  {
    id: "eaeu-parallel-import",
    method: "GET",
    path: "/v2/eaeu/parallel-import",
    title: { fr: "Importation parallèle EAEU", en: "EAEU parallel-import rules" },
    description: {
      fr: "Indique si un certificat (ex. déclaration de conformité) émis par un pays EAEU est reconnu pour un produit donné dans les autres états membres.",
      en: "Indicates whether a certificate (e.g. conformity declaration) issued by an EAEU country is recognised for a given product in other member states.",
    },
    params: [
      { name: "cert_country", where: "query", type: "string", required: true },
      { name: "cert_type", where: "query", type: "string", required: true },
      { name: "product_code", where: "query", type: "string" },
    ],
    curl: `curl "${API_BASE}/v2/eaeu/parallel-import?cert_country=KZ&cert_type=tr_cu&product_code=850440" \\
  -H "Authorization: Bearer ld_live_..."`,
    python: `r = httpx.get(
    "${API_BASE}/v2/eaeu/parallel-import",
    params={"cert_country": "KZ", "cert_type": "tr_cu", "product_code": "850440"},
    headers={"Authorization": "Bearer ld_live_..."},
)`,
    node: `const u = new URL("${API_BASE}/v2/eaeu/parallel-import");
u.searchParams.set("cert_country", "KZ");
u.searchParams.set("cert_type", "tr_cu");
const res = await fetch(u, { headers: { Authorization: "Bearer ld_live_..." } });`,
  },
];

const LEGAL_ENDPOINTS: EndpointSpec[] = [
  {
    id: "search",
    method: "GET",
    path: "/v2/search",
    title: { fr: "Recherche hybride", en: "Hybrid search" },
    description: {
      fr: "Recherche dans le corpus juridique, combinant sémantique (embeddings) et lexical (BM25). Filtres par pays, type de document et langue.",
      en: "Search across the legal corpus, combining semantic (embeddings) and lexical (BM25). Filter by country, document type and language.",
    },
    params: [
      { name: "q", where: "query", type: "string", required: true },
      { name: "country", where: "query", type: "string" },
      { name: "type", where: "query", type: "string", note: { fr: "Un parmi : legislation, case_law, guideline, sanction, recall, enforcement, treaty, advisory.", en: "One of: legislation, case_law, guideline, sanction, recall, enforcement, treaty, advisory." } },
      { name: "lang", where: "query", type: "string" },
      { name: "limit", where: "query", type: "integer" },
    ],
    curl: `curl "${API_BASE}/v2/search?q=cosmetic+labeling+requirements&country=FR&type=legislation&limit=10" \\
  -H "Authorization: Bearer ld_live_..."`,
    python: `r = httpx.get(
    "${API_BASE}/v2/search",
    params={
        "q": "cosmetic labeling requirements",
        "country": "FR",
        "type": "legislation",
        "limit": 10,
    },
    headers={"Authorization": "Bearer ld_live_..."},
)`,
    node: `const u = new URL("${API_BASE}/v2/search");
u.searchParams.set("q", "cosmetic labeling requirements");
u.searchParams.set("country", "FR");
u.searchParams.set("type", "legislation");
const res = await fetch(u, { headers: { Authorization: "Bearer ld_live_..." } });`,
    response: `{
  "data": [
    {
      "id": "fr_legifrance_R5131-1",
      "title": "Article R5131-1 du Code de la santé publique",
      "type": "legislation",
      "country": "FR",
      "lang": "fr",
      "url": "https://www.legifrance.gouv.fr/...",
      "score": 0.91
    }
  ],
  "coverage_status": "covered",
  "next_check_at": "2026-06-26T00:00:00Z"
}`,
  },
  {
    id: "search-bulk",
    method: "POST",
    path: "/v2/search/bulk",
    title: { fr: "Recherche groupée", en: "Bulk search" },
    description: {
      fr: "Exécute jusqu'à 25 recherches sémantiques en un seul appel. Pratique pour évaluer des règles d'un coup ou alimenter un agent IA.",
      en: "Runs up to 25 semantic searches in a single call. Useful to evaluate a set of rules at once or feed an AI agent.",
    },
    params: [
      { name: "queries", where: "body", type: "array", required: true, note: { fr: "Tableau de 1 à 25 objets avec les mêmes filtres que /v2/search (q, country, type, lang, limit).", en: "Array of 1-25 objects with the same filters as /v2/search (q, country, type, lang, limit)." } },
    ],
    curl: `curl -X POST ${API_BASE}/v2/search/bulk \\
  -H "Authorization: Bearer ld_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "queries": [
      {"q": "GDPR data subject rights", "country": "FR"},
      {"q": "cookie consent banner ruling", "type": "case_law"}
    ]
  }'`,
    python: `r = httpx.post(
    "${API_BASE}/v2/search/bulk",
    headers={"Authorization": "Bearer ld_live_..."},
    json={"queries": [
        {"q": "GDPR data subject rights", "country": "FR"},
        {"q": "cookie consent banner ruling", "type": "case_law"},
    ]},
)`,
    node: `const res = await fetch("${API_BASE}/v2/search/bulk", {
  method: "POST",
  headers: {
    Authorization: "Bearer ld_live_...",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    queries: [
      { q: "GDPR data subject rights", country: "FR" },
      { q: "cookie consent banner ruling", type: "case_law" },
    ],
  }),
});`,
  },
  {
    id: "documents",
    method: "GET",
    path: "/v2/documents",
    title: { fr: "Liste de documents", en: "List documents" },
    description: {
      fr: "Liste paginée des documents juridiques. Filtres par source et pays.",
      en: "Paginated list of legal documents. Filter by source and country.",
    },
    params: [
      { name: "source", where: "query", type: "string" },
      { name: "country", where: "query", type: "string" },
      { name: "limit", where: "query", type: "integer" },
      { name: "offset", where: "query", type: "integer" },
    ],
    curl: `curl "${API_BASE}/v2/documents?country=FR&source=legifrance&limit=50" \\
  -H "Authorization: Bearer ld_live_..."`,
    python: `r = httpx.get(
    "${API_BASE}/v2/documents",
    params={"country": "FR", "source": "legifrance", "limit": 50},
    headers={"Authorization": "Bearer ld_live_..."},
)`,
    node: `const u = new URL("${API_BASE}/v2/documents");
u.searchParams.set("country", "FR");
u.searchParams.set("source", "legifrance");
u.searchParams.set("limit", "50");
const res = await fetch(u, { headers: { Authorization: "Bearer ld_live_..." } });`,
  },
  {
    id: "documents-by-id",
    method: "GET",
    path: "/v2/documents/{id}",
    title: { fr: "Document par identifiant", en: "Document by ID" },
    description: {
      fr: "Récupère un document complet à partir de son identifiant unique. Inclut le texte intégral, les métadonnées et l'URL d'origine.",
      en: "Fetches a full document from its unique ID. Includes full text, metadata and source URL.",
    },
    params: [{ name: "id", where: "path", type: "string", required: true }],
    curl: `curl "${API_BASE}/v2/documents/fr_legifrance_R5131-1" \\
  -H "Authorization: Bearer ld_live_..."`,
    python: `r = httpx.get(
    "${API_BASE}/v2/documents/fr_legifrance_R5131-1",
    headers={"Authorization": "Bearer ld_live_..."},
)`,
    node: `const res = await fetch(
  "${API_BASE}/v2/documents/fr_legifrance_R5131-1",
  { headers: { Authorization: "Bearer ld_live_..." } },
);`,
  },
  {
    id: "documents-bulk",
    method: "POST",
    path: "/v2/documents/bulk",
    title: { fr: "Récupération groupée", en: "Bulk fetch" },
    description: {
      fr: "Récupère jusqu'à 50 documents en un seul appel via un tableau d'identifiants.",
      en: "Fetches up to 50 documents in a single call via an array of IDs.",
    },
    params: [
      { name: "ids", where: "body", type: "array", required: true, note: { fr: "Tableau de 1 à 50 identifiants de documents.", en: "Array of 1 to 50 document IDs." } },
    ],
    curl: `curl -X POST ${API_BASE}/v2/documents/bulk \\
  -H "Authorization: Bearer ld_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{"ids": ["fr_legifrance_R5131-1", "fr_legifrance_R5131-2"]}'`,
    python: `r = httpx.post(
    "${API_BASE}/v2/documents/bulk",
    headers={"Authorization": "Bearer ld_live_..."},
    json={"ids": ["fr_legifrance_R5131-1", "fr_legifrance_R5131-2"]},
)`,
    node: `const res = await fetch("${API_BASE}/v2/documents/bulk", {
  method: "POST",
  headers: {
    Authorization: "Bearer ld_live_...",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    ids: ["fr_legifrance_R5131-1", "fr_legifrance_R5131-2"],
  }),
});`,
  },
  {
    id: "changes",
    method: "GET",
    path: "/v2/changes",
    title: { fr: "Changements depuis une date", en: "Changes since timestamp" },
    description: {
      fr: "Retourne les documents créés, modifiés ou supprimés depuis un timestamp donné. Fenêtre maximum de 90 jours. Idéal pour synchroniser un cache local ou déclencher une veille.",
      en: "Returns documents created, modified or deleted since a given timestamp. Maximum 90-day window. Ideal for syncing a local cache or triggering monitoring.",
    },
    params: [
      { name: "since", where: "query", type: "string", required: true, note: { fr: "Date ISO-8601, max 90 jours en arrière.", en: "ISO-8601 date, max 90 days back." } },
      { name: "country", where: "query", type: "string" },
      { name: "limit", where: "query", type: "integer" },
    ],
    curl: `curl "${API_BASE}/v2/changes?since=2026-05-01T00:00:00Z&country=FR" \\
  -H "Authorization: Bearer ld_live_..."`,
    python: `r = httpx.get(
    "${API_BASE}/v2/changes",
    params={"since": "2026-05-01T00:00:00Z", "country": "FR"},
    headers={"Authorization": "Bearer ld_live_..."},
)`,
    node: `const u = new URL("${API_BASE}/v2/changes");
u.searchParams.set("since", "2026-05-01T00:00:00Z");
u.searchParams.set("country", "FR");
const res = await fetch(u, { headers: { Authorization: "Bearer ld_live_..." } });`,
  },
  {
    id: "translate",
    method: "POST",
    path: "/v2/translate",
    title: { fr: "Traduction juridique", en: "Legal translation" },
    description: {
      fr: "Traduit un fragment de texte juridique entre langues. Optimisé pour préserver la terminologie technique et les références d'articles.",
      en: "Translates a legal text fragment between languages. Tuned to preserve technical terminology and article references.",
    },
    params: [
      { name: "text", where: "body", type: "string", required: true, note: { fr: "Texte à traduire.", en: "Text to translate." } },
      { name: "target_lang", where: "body", type: "string", required: true, note: { fr: "Code ISO 639-1 cible (en, fr, de, …).", en: "Target ISO 639-1 code (en, fr, de, …)." } },
      { name: "source_lang", where: "body", type: "string", note: { fr: "Détecté automatiquement si omis.", en: "Auto-detected if omitted." } },
    ],
    curl: `curl -X POST ${API_BASE}/v2/translate \\
  -H "Authorization: Bearer ld_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "L\\'\\''article 5 du RGPD impose...",
    "source_lang": "fr",
    "target_lang": "en"
  }'`,
    python: `r = httpx.post(
    "${API_BASE}/v2/translate",
    headers={"Authorization": "Bearer ld_live_..."},
    json={
        "text": "L'article 5 du RGPD impose...",
        "source_lang": "fr",
        "target_lang": "en",
    },
)`,
    node: `const res = await fetch("${API_BASE}/v2/translate", {
  method: "POST",
  headers: {
    Authorization: "Bearer ld_live_...",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    text: "L'article 5 du RGPD impose...",
    source_lang: "fr",
    target_lang: "en",
  }),
});`,
  },
  {
    id: "coverage",
    method: "GET",
    path: "/v2/coverage",
    title: { fr: "Couverture par source", en: "Coverage snapshot" },
    description: {
      fr: "Snapshot de couverture par pays et par source : volumes documents, dernière collecte réussie, statut.",
      en: "Coverage snapshot by country and source: document volumes, last successful crawl, status.",
    },
    curl: `curl "${API_BASE}/v2/coverage" \\
  -H "Authorization: Bearer ld_live_..."`,
    python: `r = httpx.get(
    "${API_BASE}/v2/coverage",
    headers={"Authorization": "Bearer ld_live_..."},
)`,
    node: `const res = await fetch("${API_BASE}/v2/coverage", {
  headers: { Authorization: "Bearer ld_live_..." },
});`,
  },
  {
    id: "countries",
    method: "GET",
    path: "/v2/countries",
    title: { fr: "Liste des pays", en: "Supported countries" },
    description: {
      fr: "Liste les pays couverts par Cleo Legal Data, avec code ISO-2, nom localisé et nombre de sources actives.",
      en: "Lists countries covered by Cleo Legal Data, with ISO-2 code, localised name and number of active sources.",
    },
    curl: `curl "${API_BASE}/v2/countries" \\
  -H "Authorization: Bearer ld_live_..."`,
    python: `r = httpx.get(
    "${API_BASE}/v2/countries",
    headers={"Authorization": "Bearer ld_live_..."},
)`,
    node: `const res = await fetch("${API_BASE}/v2/countries", {
  headers: { Authorization: "Bearer ld_live_..." },
});`,
  },
  {
    id: "authorities",
    method: "GET",
    path: "/v2/authorities",
    title: { fr: "Liste des autorités", en: "Regulatory authorities" },
    description: {
      fr: "Liste les autorités réglementaires suivies (ANSM, CNIL, FDA, EMA, etc.), avec pays et domaines de compétence.",
      en: "Lists the regulatory authorities tracked (ANSM, CNIL, FDA, EMA, etc.), with country and area of competence.",
    },
    curl: `curl "${API_BASE}/v2/authorities" \\
  -H "Authorization: Bearer ld_live_..."`,
    python: `r = httpx.get(
    "${API_BASE}/v2/authorities",
    headers={"Authorization": "Bearer ld_live_..."},
)`,
    node: `const res = await fetch("${API_BASE}/v2/authorities", {
  headers: { Authorization: "Bearer ld_live_..." },
});`,
  },
  {
    id: "webhooks",
    method: "GET",
    path: "/v2/webhooks",
    title: { fr: "Souscriptions webhooks", en: "Webhook subscriptions" },
    description: {
      fr: "Liste les souscriptions webhooks actives sur votre compte, avec endpoint, événements et statut de livraison.",
      en: "Lists active webhook subscriptions on your account, with endpoint, events and delivery status.",
    },
    curl: `curl "${API_BASE}/v2/webhooks" \\
  -H "Authorization: Bearer ld_live_..."`,
    python: `r = httpx.get(
    "${API_BASE}/v2/webhooks",
    headers={"Authorization": "Bearer ld_live_..."},
)`,
    node: `const res = await fetch("${API_BASE}/v2/webhooks", {
  headers: { Authorization: "Bearer ld_live_..." },
});`,
  },
];

/* ────────────────────────────────────────────────────────────────────
   Error codes table
   ──────────────────────────────────────────────────────────────────── */
const ERROR_CODES: Array<{
  code: string;
  title: { fr: string; en: string };
  body: { fr: string; en: string };
}> = [
  {
    code: "400",
    title: { fr: "Bad request", en: "Bad request" },
    body: {
      fr: "Paramètre invalide ou manquant. L'enveloppe d'erreur inclut un champ did_you_mean pour aider au debug.",
      en: "Invalid or missing parameter. The error envelope includes a did_you_mean field to help debugging.",
    },
  },
  {
    code: "401",
    title: { fr: "Unauthorized", en: "Unauthorized" },
    body: {
      fr: "Clé API absente, invalide ou révoquée. Vérifiez votre header Authorization.",
      en: "API key missing, invalid or revoked. Check your Authorization header.",
    },
  },
  {
    code: "403",
    title: { fr: "Forbidden", en: "Forbidden" },
    body: {
      fr: "Endpoint non inclus dans votre plan, ou pays non couvert pour votre quota.",
      en: "Endpoint not included in your plan, or country not covered by your quota.",
    },
  },
  {
    code: "404",
    title: { fr: "Not found", en: "Not found" },
    body: {
      fr: "Document ou ressource introuvable. Pour /v2/documents/{id}, l'identifiant peut être obsolète.",
      en: "Document or resource not found. For /v2/documents/{id}, the ID may be stale.",
    },
  },
  {
    code: "429",
    title: { fr: "Rate limited", en: "Rate limited" },
    body: {
      fr: "Quota par minute dépassé. Le header Retry-After indique le délai (en secondes) avant nouvelle tentative.",
      en: "Per-minute quota exceeded. The Retry-After header gives the delay (in seconds) before retrying.",
    },
  },
  {
    code: "5xx",
    title: { fr: "Server error", en: "Server error" },
    body: {
      fr: "Une erreur côté Cleo. Réessayez après un backoff exponentiel — nous monitorons et nos SLA Enterprise garantissent une remédiation rapide.",
      en: "Error on Cleo's side. Retry with exponential backoff — we monitor and our Enterprise SLA guarantees fast remediation.",
    },
  },
];

const ERROR_ENVELOPE_EXAMPLE = `{
  "error": {
    "code": "invalid_country",
    "message": "Unknown country code 'XX'.",
    "suggestion": "Use a 2-letter ISO-3166 alpha-2 code.",
    "docs": "https://api.legaldata.cleolabs.co/docs#errors",
    "did_you_mean": ["FR", "FI", "FJ"]
  }
}`;

/* ────────────────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────────────────── */
export default function DocsPage() {
  const [lang, setLang] = useState<Lang>("fr");
  const [activeId, setActiveId] = useState<string>("");

  // Track scrolled section for the sidebar
  useEffect(() => {
    const ids = [
      "quick-start",
      "auth",
      "product-api",
      ...PRODUCT_ENDPOINTS.map((e) => e.id),
      "legal-api",
      ...LEGAL_ENDPOINTS.map((e) => e.id),
      "errors",
      "rate-limits",
      "sdks",
      "webhooks",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-c-bg text-c-text" style={{ scrollBehavior: "smooth" }}>
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-c-border bg-c-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
          <Link href="/" className="flex items-center gap-3 text-c-text hover:text-c-brand">
            <img src="/cleo-icon.svg" alt="Cleo" width={36} height={36} className="h-9 w-9 rounded-md" />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">{STRINGS.brand[lang]}</div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-c-text-subtle">
                {T.heroEyebrow[lang]}
              </div>
            </div>
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className="rounded-md px-2.5 py-1 text-[11px] font-medium text-c-text-muted hover:text-c-brand"
            >
              {T.navHome[lang]}
            </Link>
            <Link
              href="/products"
              className="rounded-md px-2.5 py-1 text-[11px] font-medium text-c-text-muted hover:text-c-brand"
            >
              {T.navProducts[lang]}
            </Link>
            <span className="rounded-md bg-c-brand-soft px-2.5 py-1 text-[11px] font-semibold text-c-brand-ink">
              {T.navDocs[lang]}
            </span>
            <Link
              href="/pricing"
              className="ml-2 rounded-md bg-c-brand px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-c-brand-ink"
            >
              {T.navGetKey[lang]} →
            </Link>
            <div className="ml-2 flex rounded-md border border-c-border bg-c-surface p-0.5 text-[11px] font-medium">
              {(["fr", "en"] as Lang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`rounded px-2 py-0.5 transition-colors ${
                    lang === l ? "bg-c-brand text-white" : "text-c-text-muted hover:text-c-text"
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-c-border bg-c-surface">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-c-border bg-c-bg px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-c-text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-c-brand" />
            {T.heroEyebrow[lang]}
          </div>
          <h1 className="font-display text-4xl font-light leading-tight tracking-tight md:text-5xl">
            {T.heroTitle[lang]}
          </h1>
          <p className="mt-3 max-w-2xl text-base text-c-text-muted md:text-lg">
            {T.heroSubtitle[lang]}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <KvCard label={T.baseUrlLabel[lang]} value={API_BASE} mono />
            <KvCard label={T.versionLabel[lang]} value="v2 (OpenAPI 3.1)" />
            <KvCard label={T.formatLabel[lang]} value="JSON · UTF-8" />
          </div>
        </div>
      </section>

      {/* Main with sticky sidebar */}
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-12">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pb-12 pt-12 scrollbar-thin">
              <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-c-text-subtle">
                {T.tocTitle[lang]}
              </div>
              <nav className="space-y-1 text-sm">
                <TocLink id="quick-start" active={activeId}>
                  {T.quickStart[lang]}
                </TocLink>
                <TocLink id="auth" active={activeId}>
                  {T.authTitle[lang]}
                </TocLink>

                <TocSection label={T.productApiTitle[lang]} />
                <TocLink id="product-api" active={activeId}>
                  Overview
                </TocLink>
                {PRODUCT_ENDPOINTS.map((e) => (
                  <TocLink key={e.id} id={e.id} active={activeId} nested>
                    <span className="inline-flex items-center gap-1.5">
                      <MethodDot method={e.method} />
                      <span className="font-mono text-[10.5px]">{e.path}</span>
                    </span>
                  </TocLink>
                ))}

                <TocSection label={T.legalApiTitle[lang]} />
                <TocLink id="legal-api" active={activeId}>
                  Overview
                </TocLink>
                {LEGAL_ENDPOINTS.map((e) => (
                  <TocLink key={e.id} id={e.id} active={activeId} nested>
                    <span className="inline-flex items-center gap-1.5">
                      <MethodDot method={e.method} />
                      <span className="font-mono text-[10.5px]">{e.path}</span>
                    </span>
                  </TocLink>
                ))}

                <TocSection label="Reference" />
                <TocLink id="errors" active={activeId}>
                  {T.errorsTitle[lang]}
                </TocLink>
                <TocLink id="rate-limits" active={activeId}>
                  {T.rateLimitsTitle[lang]}
                </TocLink>
                <TocLink id="sdks" active={activeId}>
                  {T.sdksTitle[lang]}
                </TocLink>
                <TocLink id="webhooks" active={activeId}>
                  {T.webhooksTitle[lang]}
                </TocLink>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main className="pb-24 pt-12">
            {/* Quick start */}
            <Section id="quick-start" title={T.quickStart[lang]}>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { title: T.qsStep1Title[lang], body: T.qsStep1Body[lang] },
                  { title: T.qsStep2Title[lang], body: T.qsStep2Body[lang] },
                  { title: T.qsStep3Title[lang], body: T.qsStep3Body[lang] },
                ].map((s) => (
                  <div key={s.title} className="rounded-xl border border-c-border bg-c-surface p-5">
                    <h3 className="text-sm font-semibold tracking-tight">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-c-text-muted">{s.body}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Auth */}
            <Section id="auth" title={T.authTitle[lang]}>
              <p className="max-w-3xl text-sm leading-relaxed text-c-text-muted">{T.authBody[lang]}</p>
              <div className="mt-5">
                <CodeBlock
                  label="curl"
                  code={`curl ${API_BASE}/v2/coverage \\
  -H "Authorization: Bearer ld_live_..."`}
                />
              </div>
              <p className="mt-4 text-sm text-c-text-muted">
                {T.authGetKey[lang]}{" "}
                <Link
                  href="/pricing"
                  className="font-medium text-c-brand underline-offset-2 hover:underline"
                >
                  {T.navGetKey[lang]} →
                </Link>
              </p>
            </Section>

            {/* Product Compliance API */}
            <ApiSection
              id="product-api"
              title={T.productApiTitle[lang]}
              intro={T.productApiIntro[lang]}
              endpoints={PRODUCT_ENDPOINTS}
              lang={lang}
            />

            {/* Legal Data API */}
            <ApiSection
              id="legal-api"
              title={T.legalApiTitle[lang]}
              intro={T.legalApiIntro[lang]}
              endpoints={LEGAL_ENDPOINTS}
              lang={lang}
            />

            {/* Errors */}
            <Section id="errors" title={T.errorsTitle[lang]}>
              <p className="max-w-3xl text-sm leading-relaxed text-c-text-muted">{T.errorsBody[lang]}</p>
              <div className="mt-6 overflow-hidden rounded-xl border border-c-border bg-c-surface">
                <table className="w-full text-sm">
                  <thead className="bg-c-surface-2">
                    <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-c-text-subtle">
                      <th className="px-4 py-2.5 w-24">Code</th>
                      <th className="px-4 py-2.5">{T.description[lang]}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-c-border">
                    {ERROR_CODES.map((e) => (
                      <tr key={e.code} className="align-top">
                        <td className="px-4 py-3">
                          <span className="font-mono text-sm font-semibold text-c-text">{e.code}</span>
                          <div className="mt-0.5 text-[11px] text-c-text-subtle">{e.title[lang]}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-c-text-muted">{e.body[lang]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-c-text-subtle">
                  {T.example[lang]}
                </div>
                <CodeBlock label="JSON" code={ERROR_ENVELOPE_EXAMPLE} />
              </div>
            </Section>

            {/* Rate limits */}
            <Section id="rate-limits" title={T.rateLimitsTitle[lang]}>
              <p className="max-w-3xl text-sm leading-relaxed text-c-text-muted">{T.rateLimitsBody[lang]}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-c-border bg-c-surface p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-c-text-subtle">
                    Pro
                  </div>
                  <div className="mt-1 font-display text-3xl font-light tracking-tight">
                    300 <span className="text-base text-c-text-muted">req/min</span>
                  </div>
                  <p className="mt-2 text-xs text-c-text-muted">
                    {lang === "fr"
                      ? "Burst tolérant, quota par minute glissante."
                      : "Burst-friendly, sliding minute window."}
                  </p>
                </div>
                <div className="rounded-xl border-2 border-c-brand bg-c-surface p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-c-brand">
                    Enterprise
                  </div>
                  <div className="mt-1 font-display text-3xl font-light tracking-tight">
                    600 <span className="text-base text-c-text-muted">req/min</span>
                  </div>
                  <p className="mt-2 text-xs text-c-text-muted">
                    {lang === "fr"
                      ? "Volumes négociables, SLA contractuel."
                      : "Custom volumes negotiable, contractual SLA."}
                  </p>
                </div>
              </div>
            </Section>

            {/* SDKs */}
            <Section id="sdks" title={T.sdksTitle[lang]}>
              <p className="max-w-3xl text-sm leading-relaxed text-c-text-muted">{T.sdksBody[lang]}</p>
              <div className="mt-5">
                <CodeTabs
                  tabs={[
                    {
                      label: "curl",
                      code: `curl ${API_BASE}/v2/search?q=cosmetic+labeling \\
  -H "Authorization: Bearer ld_live_..."`,
                    },
                    {
                      label: "Python (httpx)",
                      code: `import httpx

with httpx.Client(
    base_url="${API_BASE}",
    headers={"Authorization": "Bearer ld_live_..."},
    timeout=30,
) as client:
    r = client.get("/v2/search", params={"q": "cosmetic labeling"})
    r.raise_for_status()
    print(r.json())`,
                    },
                    {
                      label: "Node.js (fetch)",
                      code: `const baseUrl = "${API_BASE}";
const headers = { Authorization: "Bearer ld_live_..." };

const u = new URL("/v2/search", baseUrl);
u.searchParams.set("q", "cosmetic labeling");
const res = await fetch(u, { headers });
if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
const data = await res.json();`,
                    },
                  ]}
                />
              </div>
            </Section>

            {/* Webhooks */}
            <Section id="webhooks" title={T.webhooksTitle[lang]}>
              <p className="max-w-3xl text-sm leading-relaxed text-c-text-muted">{T.webhooksBody[lang]}</p>
              <h3 className="mt-6 text-sm font-semibold">{T.webhookSignature[lang]}</h3>
              <p className="mt-1 max-w-3xl text-sm text-c-text-muted">{T.webhookSignatureBody[lang]}</p>
              <div className="mt-4">
                <CodeBlock
                  label="Node.js"
                  code={`import crypto from "node:crypto";

function verify(rawBody, header, secret) {
  const expected = "sha256=" + crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(header),
  );
}`}
                />
              </div>
            </Section>

            {/* Footer CTA */}
            <section className="mt-20 rounded-2xl border border-c-border bg-c-surface p-8 text-center">
              <h2 className="font-display text-2xl font-light tracking-tight">{T.footerCta[lang]}</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-c-text-muted">
                {lang === "fr"
                  ? "Notre équipe vous aide à valider votre cas d'usage en 20 minutes."
                  : "Our team helps you validate your use case in 20 minutes."}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 rounded-lg bg-c-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-c-brand-ink"
                >
                  {T.navGetKey[lang]} →
                </Link>
                <a
                  href={MEET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-c-border bg-c-surface px-5 py-2.5 text-sm font-medium text-c-text-muted hover:border-c-brand hover:text-c-brand"
                >
                  {lang === "fr" ? "Prendre un call" : "Book a call"} →
                </a>
              </div>
            </section>

            <footer className="mt-12 border-t border-c-border pt-6 text-xs text-c-text-subtle">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span>{lang === "fr" ? "© Cleo Labs · Documentation API v2" : "© Cleo Labs · API documentation v2"}</span>
                <span className="flex flex-wrap items-center gap-x-2">
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
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Subcomponents
   ──────────────────────────────────────────────────────────────────── */

function KvCard({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-xl border border-c-border bg-c-bg p-4">
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-c-text-subtle">{label}</div>
      <div className={`mt-1 text-sm ${mono ? "font-mono" : "font-medium"}`}>{value}</div>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 border-b border-c-border pb-16 pt-2 [&:first-child]:pt-0 [&:last-of-type]:border-b-0">
      <h2 className="mb-5 font-display text-3xl font-light tracking-tight md:text-4xl">{title}</h2>
      {children}
    </section>
  );
}

function ApiSection({
  id,
  title,
  intro,
  endpoints,
  lang,
}: {
  id: string;
  title: string;
  intro: string;
  endpoints: EndpointSpec[];
  lang: Lang;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-b border-c-border pb-16 pt-2">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-c-brand">
        {lang === "fr" ? "API" : "API"}
      </div>
      <h2 className="font-display text-3xl font-light tracking-tight md:text-4xl">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-c-text-muted md:text-[15px]">{intro}</p>
      <div className="mt-10 space-y-12">
        {endpoints.map((e) => (
          <EndpointBlock key={e.id} endpoint={e} lang={lang} />
        ))}
      </div>
    </section>
  );
}

function EndpointBlock({ endpoint, lang }: { endpoint: EndpointSpec; lang: Lang }) {
  const T_LOCAL = {
    description: { fr: "Description", en: "Description" },
    request: { fr: "Requête", en: "Request" },
    response: { fr: "Réponse", en: "Response" },
    parameters: { fr: "Paramètres", en: "Parameters" },
    required: { fr: "requis", en: "required" },
    optional: { fr: "optionnel", en: "optional" },
    example: { fr: "Exemple", en: "Example" },
    in: { fr: "in", en: "in" },
  };

  return (
    <article id={endpoint.id} className="scroll-mt-20 border-t border-c-border pt-10 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-center gap-3">
        <MethodBadge method={endpoint.method} />
        <code className="font-mono text-base text-c-text">{endpoint.path}</code>
      </div>
      <h3 className="mt-3 text-xl font-semibold tracking-tight">{endpoint.title[lang]}</h3>

      <div className="mt-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-c-text-subtle">
          {T_LOCAL.description[lang]}
        </div>
        <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-c-text-muted">{endpoint.description[lang]}</p>
      </div>

      {endpoint.params && endpoint.params.length > 0 && (
        <div className="mt-6">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-c-text-subtle">
            {T_LOCAL.parameters[lang]}
          </div>
          <div className="mt-2 overflow-hidden rounded-xl border border-c-border bg-c-surface">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-c-border">
                {endpoint.params.map((p) => (
                  <tr key={p.name} className="align-top">
                    <td className="w-1/3 px-4 py-3">
                      <code className="font-mono text-[13px] font-medium text-c-text">{p.name}</code>
                      <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10.5px] text-c-text-subtle">
                        <span className="rounded bg-c-surface-2 px-1.5 py-0.5 font-mono">{p.type}</span>
                        <span className="text-c-text-subtle">{T_LOCAL.in[lang]}: {p.where}</span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                            p.required
                              ? "bg-c-danger-soft text-c-danger"
                              : "bg-c-surface-2 text-c-text-subtle"
                          }`}
                        >
                          {p.required ? T_LOCAL.required[lang] : T_LOCAL.optional[lang]}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-c-text-muted">
                      {p.note ? p.note[lang] : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-c-text-subtle">
          {T_LOCAL.request[lang]}
        </div>
        <div className="mt-2">
          <CodeTabs
            tabs={[
              { label: "curl", code: endpoint.curl },
              { label: "Python", code: endpoint.python },
              { label: "Node.js", code: endpoint.node },
            ]}
          />
        </div>
      </div>

      {endpoint.response && (
        <div className="mt-6">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-c-text-subtle">
            {T_LOCAL.response[lang]}{" "}
            <span className="ml-1 text-c-text-subtle">— {T_LOCAL.example[lang]}</span>
          </div>
          <div className="mt-2">
            <CodeBlock label="JSON" code={endpoint.response} />
          </div>
        </div>
      )}
    </article>
  );
}

function MethodBadge({ method }: { method: Method }) {
  const cls =
    method === "GET"
      ? "bg-c-success-soft text-c-success border-c-success/30"
      : "bg-c-info-soft text-c-info border-c-info/30";
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[11px] font-semibold ${cls}`}
    >
      {method}
    </span>
  );
}

function MethodDot({ method }: { method: Method }) {
  const cls = method === "GET" ? "bg-c-success" : "bg-c-info";
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${cls}`} />;
}

function TocLink({
  id,
  active,
  nested,
  children,
}: {
  id: string;
  active: string;
  nested?: boolean;
  children: React.ReactNode;
}) {
  const isActive = active === id;
  return (
    <a
      href={`#${id}`}
      className={`block rounded-md px-2 py-1 text-[12.5px] transition-colors ${
        nested ? "ml-3 text-c-text-muted" : "font-medium text-c-text"
      } ${isActive ? "bg-c-brand-soft text-c-brand-ink" : "hover:bg-c-surface-2 hover:text-c-text"}`}
    >
      {children}
    </a>
  );
}

function TocSection({ label }: { label: string }) {
  return (
    <div className="mt-4 mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-c-text-subtle">
      {label}
    </div>
  );
}

function CodeBlock({ label, code }: { label?: string; code: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  }

  return (
    <div className="overflow-hidden rounded-lg border border-c-border bg-c-surface-2">
      {label && (
        <div className="flex items-center justify-between border-b border-c-border bg-c-surface px-3 py-1.5">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-c-text-subtle">
            {label}
          </span>
          <button
            type="button"
            onClick={copy}
            className="text-[10.5px] font-medium text-c-text-muted hover:text-c-brand"
          >
            {copied ? "✓" : "Copy"}
          </button>
        </div>
      )}
      <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-c-text scrollbar-thin">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function CodeTabs({ tabs }: { tabs: Array<{ label: string; code: string }> }) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const current = tabs[active];

  function copy() {
    navigator.clipboard.writeText(current.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  }

  return (
    <div className="overflow-hidden rounded-lg border border-c-border bg-c-surface-2">
      <div className="flex items-center justify-between border-b border-c-border bg-c-surface px-2 py-1">
        <div className="flex gap-0.5">
          {tabs.map((t, i) => (
            <button
              key={t.label}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded px-2.5 py-1 text-[11.5px] font-medium transition-colors ${
                i === active
                  ? "bg-c-surface-2 text-c-text"
                  : "text-c-text-muted hover:text-c-text"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={copy}
          className="px-2 text-[10.5px] font-medium text-c-text-muted hover:text-c-brand"
        >
          {copied ? "✓" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-c-text scrollbar-thin">
        <code>{current.code}</code>
      </pre>
    </div>
  );
}

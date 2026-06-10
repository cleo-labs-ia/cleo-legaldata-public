import type { Metadata } from "next";
import Dashboard from "../components/Dashboard";
import { loadDashboardData } from "@/lib/data";
import { NUMBERS, fmt, fmtCompact } from "@/lib/numbers";

export const dynamic = "force-static";

const URL = "https://legaldata-public.cleolabs.co/general";
const TITLE = `Legal Atlas — ${fmt(NUMBERS.legalSources, "en")} official legal sources across ${NUMBERS.legalJurisdictions} jurisdictions | Cleo Legal Data`;
const DESC = `Machine-readable atlas of every open legal data source tracked by Cleo: ${fmt(NUMBERS.legalSources, "en")} portals catalogued, ${NUMBERS.sourcesActive} sources actively serving the API across ${NUMBERS.jurisdictionsDocumented} documented jurisdictions — ${fmt(NUMBERS.legalRegulations, "en")} regulations (${fmt(NUMBERS.legalRegulationsCanonical, "en")} canonical) and ${fmtCompact(NUMBERS.legalDocuments, "en")} documents indexed. From Légifrance to the Indian Supreme Court, verified at source.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "legal data API",
    "regulatory data API",
    "global law API",
    "legislation API",
    "case law API",
    "EUR-Lex API",
    "Légifrance API",
    "legal AI",
    "RegTech",
    "machine-readable law",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    url: URL,
    title: TITLE,
    description: DESC,
    siteName: "Cleo Legal Data",
    images: [{ url: "/cleo-icon.svg", alt: "Cleo Legal Atlas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/cleo-icon.svg"],
  },
};

const FAQ = [
  {
    q: "Which jurisdictions are covered by the Legal Atlas?",
    a: `${NUMBERS.legalJurisdictions} jurisdictions worldwide — every EU member state, the UK, US federal + 13 states, Canada, China, Japan, India, Brazil, Mexico, Australia and 150+ more. ${NUMBERS.sourcesComplete} sources are fully indexed, ${NUMBERS.sourcesBlocked} are in progress, ${NUMBERS.sourcesPlanned} are planned. The map on this page is the single source of truth — click any country for live status.`,
  },
  {
    q: "What is the difference between 'sources declared' and 'documents indexed'?",
    a: "1,494 sources are the official legal portals we track (Légifrance, EUR-Lex, FDA, BOE, etc.). 1.94M is the number of legal documents we have actually scraped, parsed and indexed in our database — verified live from production. The 234M+ figure you may see elsewhere is the volume those portals publicly declare, not what is in our database yet.",
  },
  {
    q: "How fresh is the data?",
    a: "Most regulations are refreshed every 6 hours. Sanctions and recall lists are refreshed hourly. Each document carries a last-verified timestamp, and you can subscribe to changes via webhooks on the Pro plan and above.",
  },
  {
    q: "Is this a legal-advice service?",
    a: "No. Cleo Legal Data returns official regulatory data — the same text published by EUR-Lex, Légifrance, the BOE and 60+ other sources. Every endpoint carries an explicit disclaimer. It is data, not legal advice.",
  },
  {
    q: "Can I use it with AI agents (Claude, GPT, open-source)?",
    a: "Yes. The Legal Atlas ships a REST API, a TypeScript SDK, and an MCP connector compatible with Claude, Cursor and any MCP-aware client. The 19 dedicated endpoints (search, documents, citations, articles, treaties, case-law, etc.) are available in our Playground without an API key.",
  },
  {
    q: "How does pricing work?",
    a: "Same five-tier pricing across all three atlases (Legal, Product Physical, HS Code): Light €100/mo, Pro €349/mo, Business €999/mo, Enterprise custom, plus the free Playground. Pay-as-you-go via Stripe, no commitment.",
  },
];

const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      name: "Cleo Legal Atlas API",
      description: DESC,
      brand: { "@type": "Brand", name: "Cleo Labs" },
      category: "Legal Data API",
      url: URL,
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "EUR",
        lowPrice: "100",
        highPrice: "999",
        offerCount: 4,
        url: "https://legaldata-public.cleolabs.co/pricing",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://legaldata-public.cleolabs.co/" },
        { "@type": "ListItem", position: 2, name: "Legal Atlas", item: URL },
      ],
    },
  ],
};

export default function GeneralPage() {
  const data = loadDashboardData();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />
      <Dashboard data={data} />
    </>
  );
}

import type { Metadata } from "next";
import CoverageAtlas from "./CoverageAtlas";
import { loadCoverageData } from "@/lib/coverage-load";
import { NUMBERS, fmt } from "@/lib/numbers";

export const dynamic = "force-static";

const URL = "https://legaldata-public.cleolabs.co/coverage";
const TITLE = `Monitoring Coverage Atlas — ${fmt(NUMBERS.complyAuthorities, "en")} authorities across ${NUMBERS.complyMarkets} markets | Cleo`;
const DESC = `Live map of the product → HS code → regulation → authority chain: ${fmt(NUMBERS.complyHs6, "en")} HS6 product codes, ${fmt(NUMBERS.complyRegs, "en")} regulations and ${fmt(NUMBERS.complyAuthorities, "en")} enforcement authorities across ${NUMBERS.complyMarkets} markets, with ${NUMBERS.complyCapturePct}% under live monitoring. See exactly what Cleo captures — and where the blind spots are.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "regulatory monitoring coverage",
    "product compliance authorities",
    "HS code regulations map",
    "enforcement authority database",
    "regulatory intelligence",
    "compliance monitoring feed",
    "product to HS to regulation",
    "global market compliance map",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    url: URL,
    title: TITLE,
    description: DESC,
    siteName: "Cleo Legal Data",
    images: [{ url: "/cleo-icon.svg", alt: "Cleo Monitoring Coverage Atlas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: ["/cleo-icon.svg"],
  },
};

const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Dataset",
      name: "Cleo Comply — Product Monitoring Coverage",
      description: DESC,
      creator: { "@type": "Organization", name: "Cleo Labs" },
      url: URL,
      variableMeasured: [
        "HS6 product codes",
        "regulations",
        "enforcement authorities",
        "markets",
        "live monitoring coverage",
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://legaldata-public.cleolabs.co/" },
        { "@type": "ListItem", position: 2, name: "Monitoring Coverage Atlas", item: URL },
      ],
    },
  ],
};

export default function CoveragePage() {
  const data = loadCoverageData();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />
      <CoverageAtlas data={data} />
    </>
  );
}

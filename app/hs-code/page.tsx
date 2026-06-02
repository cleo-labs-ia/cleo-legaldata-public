import type { Metadata } from "next";
import HsCodeProduct from "./HsCodeProduct";

export const dynamic = "force-static";

const URL = "https://legaldata-public.cleolabs.co/hs-code";
const TITLE = "HS Code API — Customs classification, duties, dual-use & sanctions in one call | Cleo Legal Data";
const DESC = "Classify any product to its HS code, compute duties / VAT / landed cost, screen dual-use & sanctions across 177 jurisdictions — one API call. Pay-as-you-go from €100/mo, instant API key, no commitment.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "HS code API",
    "HS code classification API",
    "customs duties API",
    "tariff API",
    "landed cost calculator API",
    "dual-use export control API",
    "Wassenaar API",
    "sanctions screening API",
    "OFAC API",
    "trade compliance API",
    "TARIC API",
    "EAEU GOST",
    "customs broker API",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    url: URL,
    title: TITLE,
    description: DESC,
    siteName: "Cleo Legal Data",
    images: [{ url: "/cleo-icon.svg", alt: "Cleo HS Code API" }],
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
    q: "What problem does the HS Code API solve?",
    a: "Customs classification is the single hardest step in cross-border trade: a wrong HS code means seized shipments, retroactive duty payments, or up to 10x penalties. Cleo's API takes a free-text product description and returns the most likely HS6 → HS10 code with a confidence score, the applicable duty / VAT / excise rates, and a defensible product description suitable for a customs declaration — in one call.",
  },
  {
    q: "Which jurisdictions are covered for tariffs and duties?",
    a: "177 jurisdictions, with full WCO HS, EU TARIC, US HTSUS, UK Global Tariff, China MFN, Japan, Korea, ASEAN, GCC, Brazil NCM, Mexico TIGIE, India ITC-HS, Russia / EAEU TN VED, EFTA. Free Trade Agreement preferential rates (CETA, EU-UK TCA, USMCA, RCEP, AfCFTA…) are returned alongside the MFN rate.",
  },
  {
    q: "How accurate is the HS classification?",
    a: "Every result carries a confidence score (0-1). Above 0.85, you can use it directly in a customs declaration with no human review. Below 0.85, the API returns top-5 alternatives with reasoning, and recommends a Binding Tariff Information (BTI) request — the only way to get certainty under EU law. We never claim 100% accuracy because nobody can — but we are transparent about uncertainty.",
  },
  {
    q: "What is dual-use screening?",
    a: "GET /v2/customs/dual-use checks whether a product is controlled under EU Regulation 2021/821, the US Export Administration Regulations (EAR / CCL), the Wassenaar Arrangement, the Nuclear Suppliers Group, the Missile Technology Control Regime, the Australia Group, and the Chemical Weapons Convention. For each destination, the API returns the relevant control list entry and whether a licence is required.",
  },
  {
    q: "Which sanction lists are screened?",
    a: "POST /v2/sanctions/screen checks 8 authorities: EU Consolidated, US OFAC SDN + SSI, UK HMT, UN Security Council, Switzerland SECO, Canada SEMA, Australia DFAT and Japan METI. Each match returns the list, the listing date, the sanctions applied (asset freeze, travel ban, sector-specific) and the original notice URL.",
  },
  {
    q: "How is the landed cost calculated?",
    a: "POST /v2/customs/landed-cost takes HS code + origin + destination + FOB price (USD) and returns: CIF (FOB + freight + insurance estimate), customs duty applied to CIF at the right preferential rate if any FTA applies, VAT applied on CIF + duty, customs broker fees, and the final landed cost. Each component is itemised so you can plug it into Shopify / WooCommerce / your ERP as a line item.",
  },
  {
    q: "Is this a binding customs ruling?",
    a: "No. Cleo's HS Code API returns advisory data: classifications carry a confidence score, not certainty. For binding rulings, request a BTI in the EU, a CROSS ruling in the US, or the equivalent in your destination country. We provide the data and the reasoning — the binding decision remains the customs authority's.",
  },
];

const USE_CASES = [
  {
    title: "E-commerce checkout",
    desc: "Show the all-in landed cost to international customers before they pay. Reduce cart abandonment caused by surprise duty bills at delivery.",
  },
  {
    title: "AI agent",
    desc: "Plug Cleo's MCP connector into Claude or Cursor. Your agent classifies products, quotes duties and screens sanctions in one tool call.",
  },
  {
    title: "Customs broker / freight forwarder",
    desc: "Pre-classify shipments before the broker desk. Cut declaration time by 60% and reduce reclassification disputes.",
  },
  {
    title: "Marketplace seller onboarding",
    desc: "When a seller lists a product, auto-suggest the HS code, flag dual-use issues and tell them which markets they can ship to.",
  },
];

const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      name: "Cleo HS Code API",
      description: DESC,
      brand: { "@type": "Brand", name: "Cleo Labs" },
      category: "Customs & Trade API",
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
        { "@type": "ListItem", position: 2, name: "HS Code", item: URL },
      ],
    },
  ],
};

export default function HsCodePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />
      <HsCodeProduct faq={FAQ} useCases={USE_CASES} />
    </>
  );
}

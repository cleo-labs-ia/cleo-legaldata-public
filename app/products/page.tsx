import type { Metadata } from "next";
import ProductDashboard from "./ProductDashboard";
import { loadProductComplianceData } from "@/lib/product-data";
import { NUMBERS, fmt } from "@/lib/numbers";

export const dynamic = "force-static";

const URL = "https://legaldata-public.cleolabs.co/products";
const TITLE = `Legal Product Physical Atlas — ${fmt(NUMBERS.productRegsPlatform, "en")} product regulations across ${NUMBERS.productCategories} categories | Cleo Legal Data`;
const DESC = `The world's largest physical-product compliance database: ${fmt(NUMBERS.productRegsPlatform, "en")} regulations across ${NUMBERS.productCategories} categories and ${NUMBERS.productJurisdictions} jurisdictions. Cosmetics, electronics, toys, medical devices, food, textile, pharma, automotive, drones, tobacco — one API call per product.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "product compliance API",
    "physical product regulations",
    "REACH compliance API",
    "cosmetics compliance",
    "CE marking API",
    "FDA compliance",
    "RoHS API",
    "MDR medical device",
    "GPSR compliance",
    "product safety API",
    "regulatory compliance for retailers",
    "e-commerce compliance",
  ],
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    url: URL,
    title: TITLE,
    description: DESC,
    siteName: "Cleo Legal Data",
    images: [{ url: "/cleo-icon.svg", alt: "Cleo Legal Product Physical Atlas" }],
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
    q: "Which product categories are covered?",
    a: "20 physical-product categories: Cosmetics, Electronics & Mobile, Toys (0-3y), Medical Devices Class I/III, E-cigarettes & Vaping, Laundry Detergent Pods, Dietary Supplements, Athletic Apparel & Textile, Bicycle Helmets (PPE), Wine & Spirits, Fresh Meat, OTC Pharmaceuticals, Tyres & Automotive, Household Insecticides, Consumer Drones, Smart Connected Appliances, Dental Implants, Interior Paints, Pet Food, and more.",
  },
  {
    q: "How many jurisdictions does each product cover?",
    a: `Each product is mapped against up to ${NUMBERS.productJurisdictions} jurisdictions worldwide. The map on this page shows live coverage per country, with criticality flags (REACH, CE, FDA, GB, ANVISA, NMPA, etc.). Click any country to see every regulation that applies.`,
  },
  {
    q: "What does 'one API call per product' mean?",
    a: "POST /v2/compliance/check with a product description and a destination country returns: applicable regulations, criticality scores, enforcement bodies, mandatory marks (CE, UKCA, CCC, EAC, RCM, NOM, INMETRO), banned substances, labelling requirements and direct links to the official text. One call, ready to plug into your product page, ERP, or AI agent.",
  },
  {
    q: "How is this different from REACH-only or FDA-only databases?",
    a: "Most existing tools cover one regime (REACH for chemicals, FDA for cosmetics in the US, GB standards for China). Cleo unifies all the regimes per product. A single 'shampoo for FR' query returns EU 1223/2009 + Article L5131 + Cosmétovigilance ANSM + REACH SVHC + packaging EPR — not just one of them.",
  },
  {
    q: "Can I subscribe to product recalls?",
    a: "Yes. POST /v2/recalls/subscribe creates a webhook that pushes every new recall matching your category + country filter, from EU Safety Gate, US CPSC, RASFF, ACCC Australia, etc. Real-time alerts, available from the Pro plan.",
  },
  {
    q: "How accurate is the ingredient screening?",
    a: "POST /v2/ingredients/screen detects substances on the ECHA SVHC Candidate List, REACH Annex XIV/XVII, EU Cosmetics Annex II/III/V/VI, the 26 EU fragrance allergens, and country-specific bans (Hawaii reef-safe SPF, Quintana Roo, California Prop 65). Each hit returns the exact reference and max concentration.",
  },
];

const JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      name: "Cleo Legal Product Physical Atlas API",
      description: DESC,
      brand: { "@type": "Brand", name: "Cleo Labs" },
      category: "Product Compliance API",
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
        { "@type": "ListItem", position: 2, name: "Legal Product Physical Atlas", item: URL },
      ],
    },
  ],
};

export default function ProductsPage() {
  const data = loadProductComplianceData();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />
      <ProductDashboard data={data} />
    </>
  );
}

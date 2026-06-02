"use client";

import Link from "next/link";
import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import { STRINGS } from "@/lib/i18n";

const MEET_URL = "https://www.cleolabs.co/en/meet";
const CHECKOUT_BASE = "/api/checkout";
const checkout = (plan: string) => `${CHECKOUT_BASE}?plan=${plan}`;

/* ================================================================
   Types
   ================================================================ */
type Billing = "monthly" | "yearly";
type Product = "compliance" | "legal";

type Price =
  | { kind: "free" }
  | { kind: "fixed"; monthly: number; yearly: number; currency: "EUR" }
  | { kind: "custom" };

type Plan = {
  id: string;
  name: { fr: string; en: string };
  tagline: { fr: string; en: string };
  price: Price;
  features: { fr: string; en: string }[];
  cta: { fr: string; en: string };
  ctaHref: string;
  featured?: boolean;
};

/* ================================================================
   Plans
   ================================================================ */
const COMPLIANCE_PLANS: Plan[] = [
  {
    id: "starter",
    name: STRINGS.pricingProductStarterName,
    tagline: STRINGS.pricingProductStarterTagline,
    price: { kind: "free" },
    features: [
      {
        fr: "100 vérifications de conformité / mois",
        en: "100 compliance checks / month",
      },
      { fr: "1 catégorie produit", en: "1 product category" },
      {
        fr: "Documentation publique + atlas complet",
        en: "Public docs + full atlas access",
      },
      { fr: "Support communautaire", en: "Community support" },
    ],
    cta: STRINGS.pricingProductStarterCta,
    ctaHref: "https://cleo-legal-public.vercel.app/signup",
  },
  {
    id: "light",
    name: STRINGS.pricingProductLightName,
    tagline: STRINGS.pricingProductLightTagline,
    price: { kind: "fixed", monthly: 100, yearly: 80, currency: "EUR" },
    features: [
      { fr: "1 000 vérifications / mois", en: "1,000 compliance checks / month" },
      { fr: "5 catégories produit", en: "5 product categories" },
      { fr: "20 juridictions clés", en: "20 key jurisdictions" },
      { fr: "Connecteur MCP pour Claude / Cursor", en: "MCP connector for Claude / Cursor" },
      { fr: "Support email", en: "Email support" },
    ],
    cta: STRINGS.pricingProductLightCta,
    ctaHref: checkout("product-light"),
  },
  {
    id: "pro",
    name: STRINGS.pricingProductProName,
    tagline: STRINGS.pricingProductProTagline,
    price: { kind: "fixed", monthly: 349, yearly: 279, currency: "EUR" },
    features: [
      {
        fr: "10 000 vérifications / mois",
        en: "10,000 compliance checks / month",
      },
      {
        fr: "Les 15 catégories produit",
        en: "All 15 product categories",
      },
      { fr: "Les 50 juridictions couvertes", en: "All 50 jurisdictions" },
      { fr: "Webhooks événements produits", en: "Product event webhooks" },
      {
        fr: "Support email sous 1 jour ouvré",
        en: "Email support within 1 business day",
      },
      {
        fr: "Connecteur MCP pour Claude / Cursor",
        en: "MCP connector for Claude / Cursor",
      },
    ],
    cta: STRINGS.pricingProductProCta,
    ctaHref: checkout("product-pro"),
  },
  {
    id: "business",
    name: STRINGS.pricingProductBusinessName,
    tagline: STRINGS.pricingProductBusinessTagline,
    price: { kind: "fixed", monthly: 999, yearly: 799, currency: "EUR" },
    featured: true,
    features: [
      { fr: "50 000 vérifications / mois", en: "50,000 checks / month" },
      { fr: "Tous les endpoints API", en: "All API endpoints" },
      {
        fr: "Rate-limits sur mesure",
        en: "Custom rate limits",
      },
      {
        fr: "Support prioritaire (SLA 24h)",
        en: "Priority support (24h SLA)",
      },
      { fr: "Dashboard analytics", en: "Dashboard analytics" },
      { fr: "DPA signé inclus", en: "Signed DPA included" },
    ],
    cta: STRINGS.pricingProductBusinessCta,
    ctaHref: checkout("product-business"),
  },
  {
    id: "enterprise",
    name: STRINGS.pricingProductEnterpriseName,
    tagline: STRINGS.pricingProductEnterpriseTagline,
    price: { kind: "custom" },
    features: [
      { fr: "Volume illimité", en: "Unlimited volume" },
      { fr: "SLA d'uptime contractuel", en: "Contractual uptime SLA" },
      { fr: "Customer Success Manager dédié", en: "Dedicated CSM" },
      {
        fr: "Option on-premise / VPC",
        en: "On-premise / VPC option",
      },
      { fr: "Slack partagé + onboarding équipe", en: "Shared Slack + team onboarding" },
    ],
    cta: STRINGS.pricingProductEnterpriseCta,
    ctaHref: MEET_URL,
  },
];

const LEGAL_PLANS: Plan[] = [
  {
    id: "free",
    name: STRINGS.pricingLegalFreeName,
    tagline: STRINGS.pricingLegalFreeTagline,
    price: { kind: "free" },
    features: [
      { fr: "100 requêtes / mois", en: "100 requests / month" },
      { fr: "Lecture seule (catalog read-only)", en: "Read-only (catalog read-only)" },
      { fr: "Atlas public complet", en: "Full public atlas" },
      { fr: "Support communautaire", en: "Community support" },
    ],
    cta: STRINGS.pricingLegalFreeCta,
    ctaHref: "https://cleo-legal-public.vercel.app/signup",
  },
  {
    id: "light",
    name: STRINGS.pricingLegalLightName,
    tagline: STRINGS.pricingLegalLightTagline,
    price: { kind: "fixed", monthly: 100, yearly: 80, currency: "EUR" },
    features: [
      { fr: "100 000 requêtes / mois", en: "100,000 requests / month" },
      { fr: "60 requêtes / minute", en: "60 requests / minute" },
      { fr: "Endpoints sources + juridictions", en: "Sources + jurisdictions endpoints" },
      { fr: "Connecteur MCP pour Claude / Cursor", en: "MCP connector for Claude / Cursor" },
      { fr: "Support email", en: "Email support" },
    ],
    cta: STRINGS.pricingLegalLightCta,
    ctaHref: checkout("legal-light"),
  },
  {
    id: "pro",
    name: STRINGS.pricingLegalProName,
    tagline: STRINGS.pricingLegalProTagline,
    price: { kind: "fixed", monthly: 349, yearly: 279, currency: "EUR" },
    features: [
      { fr: "1 million de requêtes / mois", en: "1M requests / month" },
      { fr: "300 requêtes / minute", en: "300 requests / minute" },
      {
        fr: "Tous les endpoints (sources, juridictions, catégories)",
        en: "All endpoints (sources, jurisdictions, categories)",
      },
      { fr: "Webhooks (nouvelles sources, fraîcheur)", en: "Webhooks (new sources, freshness)" },
      {
        fr: "Connecteur MCP pour Claude / Cursor",
        en: "MCP connector for Claude / Cursor",
      },
      {
        fr: "Support email sous 1 jour ouvré",
        en: "Email support within 1 business day",
      },
    ],
    cta: STRINGS.pricingLegalProCta,
    ctaHref: checkout("legal-pro"),
  },
  {
    id: "business",
    name: STRINGS.pricingLegalBusinessName,
    tagline: STRINGS.pricingLegalBusinessTagline,
    price: { kind: "fixed", monthly: 999, yearly: 799, currency: "EUR" },
    featured: true,
    features: [
      { fr: "5 millions de requêtes / mois", en: "5M requests / month" },
      { fr: "Tous les endpoints API", en: "All API endpoints" },
      { fr: "Rate-limits sur mesure", en: "Custom rate limits" },
      { fr: "Support prioritaire (SLA 24h)", en: "Priority support (24h SLA)" },
      { fr: "Dashboard analytics", en: "Dashboard analytics" },
      { fr: "DPA signé inclus", en: "Signed DPA included" },
    ],
    cta: STRINGS.pricingLegalBusinessCta,
    ctaHref: checkout("legal-business"),
  },
  {
    id: "enterprise",
    name: STRINGS.pricingLegalEnterpriseName,
    tagline: STRINGS.pricingLegalEnterpriseTagline,
    price: { kind: "custom" },
    features: [
      { fr: "Volume illimité", en: "Unlimited volume" },
      { fr: "SLA d'uptime contractuel", en: "Contractual uptime SLA" },
      { fr: "Export en bulk / dumps quotidiens", en: "Bulk export / daily dumps" },
      { fr: "DPA signé, hébergement custom", en: "Signed DPA, custom hosting" },
      { fr: "Onboarding accompagné + Slack partagé", en: "Hands-on onboarding + shared Slack" },
    ],
    cta: STRINGS.pricingLegalEnterpriseCta,
    ctaHref: MEET_URL,
  },
];

/* ================================================================
   Compare matrix
   ================================================================ */
type CompareValue = string | boolean;

type CompareRow = {
  label: { fr: string; en: string };
  values: CompareValue[]; // length = number of plans in product
};

const COMPLIANCE_COMPARE: CompareRow[] = [
  {
    label: { fr: "Vérifications / mois", en: "Checks / month" },
    values: ["100", "1 000", "10 000", "50 000", { fr: "Illimité", en: "Unlimited" } as unknown as string],
  },
  {
    label: { fr: "Catégories produit", en: "Product categories" },
    values: ["1", "5", "15", "15", "15"],
  },
  {
    label: { fr: "Juridictions couvertes", en: "Jurisdictions covered" },
    values: ["5", "20", "50", "50", "50"],
  },
  {
    label: { fr: "Endpoints API", en: "API endpoints" },
    values: ["Catalog", "Standard", "Full", "Full", "Full"],
  },
  {
    label: { fr: "Webhooks", en: "Webhooks" },
    values: [false, false, true, true, true],
  },
  {
    label: { fr: "Dashboard analytics", en: "Dashboard analytics" },
    values: [false, false, false, true, true],
  },
  {
    label: { fr: "SLA contractuel", en: "Contractual SLA" },
    values: [false, false, false, "24h", "99,9%"],
  },
  {
    label: { fr: "Support", en: "Support" },
    values: [
      { fr: "Communauté", en: "Community" } as unknown as string,
      { fr: "Email", en: "Email" } as unknown as string,
      { fr: "Email (1j ouvré)", en: "Email (1 BD)" } as unknown as string,
      { fr: "Prioritaire", en: "Priority" } as unknown as string,
      { fr: "CSM dédié", en: "Dedicated CSM" } as unknown as string,
    ],
  },
  {
    label: { fr: "DPA signé", en: "Signed DPA" },
    values: [false, false, false, true, true],
  },
  {
    label: { fr: "On-premise / VPC", en: "On-premise / VPC" },
    values: [false, false, false, false, true],
  },
];

const LEGAL_COMPARE: CompareRow[] = [
  {
    label: { fr: "Requêtes / mois", en: "Requests / month" },
    values: ["100", "100 000", "1M", "5M", { fr: "Illimité", en: "Unlimited" } as unknown as string],
  },
  {
    label: { fr: "Requêtes / minute", en: "Requests / minute" },
    values: ["10", "60", "300", { fr: "Sur mesure", en: "Custom" } as unknown as string, { fr: "Sur mesure", en: "Custom" } as unknown as string],
  },
  {
    label: { fr: "Endpoints", en: "Endpoints" },
    values: [
      { fr: "Lecture seule", en: "Read-only" } as unknown as string,
      "Standard",
      "Full",
      "Full + bulk",
      "Full + bulk",
    ],
  },
  {
    label: { fr: "Webhooks", en: "Webhooks" },
    values: [false, false, true, true, true],
  },
  {
    label: { fr: "Export bulk / dumps", en: "Bulk export / dumps" },
    values: [false, false, false, true, true],
  },
  {
    label: { fr: "Connecteur MCP", en: "MCP connector" },
    values: [false, true, true, true, true],
  },
  {
    label: { fr: "SLA contractuel", en: "Contractual SLA" },
    values: [false, false, false, "24h", "99,9%"],
  },
  {
    label: { fr: "Support", en: "Support" },
    values: [
      { fr: "Communauté", en: "Community" } as unknown as string,
      { fr: "Email", en: "Email" } as unknown as string,
      { fr: "Email (1j ouvré)", en: "Email (1 BD)" } as unknown as string,
      { fr: "Prioritaire", en: "Priority" } as unknown as string,
      { fr: "CSM dédié", en: "Dedicated CSM" } as unknown as string,
    ],
  },
  {
    label: { fr: "DPA signé", en: "Signed DPA" },
    values: [false, false, false, true, true],
  },
];

/* ================================================================
   FAQ
   ================================================================ */
const FAQ = [
  {
    q: { fr: "Comment fonctionne la facturation ?", en: "How does billing work?" },
    a: {
      fr: "Vous êtes facturé chaque mois à la date d'activation du plan, en EUR, sur la base de la consommation déclarée par le plan choisi. Au-delà du quota inclus, les requêtes supplémentaires sont facturées au prorata — vous êtes prévenu·e par email avant tout dépassement.",
      en: "You are billed monthly on the day your plan went live, in EUR, against the included quota of the plan. Beyond that quota, additional requests are billed pro rata — we always notify you by email before any overage.",
    },
  },
  {
    q: {
      fr: "Qu'est-ce qui compte comme une vérification de conformité ?",
      en: "What counts as a compliance check?",
    },
    a: {
      fr: "Un appel à l'endpoint /v1/compliance/check qui retourne la liste des réglementations applicables à un couple produit + pays. Les appels aux endpoints catalog (sources, juridictions, catégories) ne sont pas comptés comme des vérifications.",
      en: "A call to /v1/compliance/check that returns the regulations applicable to a product + country pair. Calls to catalog endpoints (sources, jurisdictions, categories) are not counted as checks.",
    },
  },
  {
    q: { fr: "Puis-je changer de plan en cours de route ?", en: "Can I switch plans?" },
    a: {
      fr: "Oui, à tout moment, depuis votre tableau de bord. Les upgrades sont effectifs immédiatement avec un prorata sur le mois en cours. Les downgrades prennent effet au prochain cycle de facturation.",
      en: "Yes, at any time, from your dashboard. Upgrades apply immediately with a prorated charge for the current month. Downgrades take effect at the next billing cycle.",
    },
  },
  {
    q: {
      fr: "Vous faites des remises pour les startups ?",
      en: "Do you offer discounts for startups?",
    },
    a: {
      fr: "Oui. Les startups early-stage (moins de 2 ans, moins de 2M€ levés) peuvent demander 50% de remise sur les plans Pro et Business pendant 12 mois. Écrivez-nous depuis votre adresse pro pour candidater.",
      en: "Yes. Early-stage startups (under 2 years old, less than €2M raised) can request 50% off Pro and Business plans for 12 months. Email us from your work address to apply.",
    },
  },
  {
    q: { fr: "Quel est le SLA ?", en: "What's the SLA?" },
    a: {
      fr: "99,9% de disponibilité mensuelle contractuelle sur le plan Enterprise (avec crédit automatique en cas de non-respect). Les plans Pro et Business bénéficient du même niveau d'infrastructure mais sans engagement contractuel.",
      en: "99.9% monthly uptime contractually guaranteed on Enterprise (with automatic credits if missed). Pro and Business plans run on the same infrastructure but without contractual commitment.",
    },
  },
  {
    q: {
      fr: "Comment fonctionne l'essai gratuit ?",
      en: "How does the free trial work?",
    },
    a: {
      fr: "Le plan Starter (Compliance) et le plan Free (Legal Data) sont gratuits à vie, sans carte bancaire requise. Vous pouvez passer en plan payant quand vos volumes l'exigent — sans interruption de service ni rotation de clé.",
      en: "The Starter plan (Compliance) and the Free plan (Legal Data) are free forever, no credit card required. You can move to a paid plan whenever your volumes require it — with no service interruption and no key rotation.",
    },
  },
  {
    q: {
      fr: "Quels moyens de paiement acceptez-vous ?",
      en: "What payment methods do you accept?",
    },
    a: {
      fr: "Carte bancaire (Visa, MasterCard, Amex) et prélèvement SEPA pour les plans Pro et Business. Virement bancaire annuel et émission de facture sur les plans Enterprise — devis en EUR ou USD.",
      en: "Credit card (Visa, MasterCard, Amex) and SEPA debit for Pro and Business. Annual bank transfer with invoicing on Enterprise — quotes available in EUR or USD.",
    },
  },
];

/* ================================================================
   Helpers
   ================================================================ */
function formatPrice(value: number, lang: Lang): string {
  return value.toLocaleString(lang === "fr" ? "fr-FR" : "en-US");
}

function PriceDisplay({
  price,
  billing,
  lang,
}: {
  price: Price;
  billing: Billing;
  lang: Lang;
}) {
  if (price.kind === "free") {
    return (
      <div className="flex items-baseline gap-1.5">
        <span className="font-display text-5xl font-light tracking-tight text-c-text">
          {STRINGS.pricingFree[lang]}
        </span>
      </div>
    );
  }
  if (price.kind === "custom") {
    return (
      <div className="flex items-baseline gap-1.5">
        <span className="font-display text-5xl font-light tracking-tight text-c-text">
          {STRINGS.pricingCustomPrice[lang]}
        </span>
      </div>
    );
  }
  const monthlyEquivalent = billing === "yearly" ? price.yearly : price.monthly;
  return (
    <div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-display text-5xl font-light tracking-tight text-c-text">
          €{formatPrice(monthlyEquivalent, lang)}
        </span>
        <span className="text-sm text-c-text-subtle">
          {STRINGS.pricingPerMonth[lang]}
        </span>
      </div>
      {billing === "yearly" ? (
        <div className="mt-1 text-[11px] text-c-text-subtle">
          {STRINGS.pricingBilledYearly[lang]} · €
          {formatPrice(price.yearly * 12, lang)}/y
        </div>
      ) : null}
    </div>
  );
}

function CompareCell({
  value,
  lang,
}: {
  value: CompareValue | { fr: string; en: string };
  lang: Lang;
}) {
  if (typeof value === "boolean") {
    return value ? (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-c-brand-soft text-[11px] font-bold text-c-brand-ink">
        ✓
      </span>
    ) : (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-c-surface-2 text-[11px] text-c-text-subtle">
        —
      </span>
    );
  }
  if (typeof value === "object" && value !== null && "fr" in value) {
    return <span className="text-sm text-c-text">{value[lang]}</span>;
  }
  return <span className="text-sm text-c-text">{value as string}</span>;
}

/* ================================================================
   PAGE
   ================================================================ */
export default function PricingPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [billing, setBilling] = useState<Billing>("monthly");
  const [product, setProduct] = useState<Product>("compliance");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const plans = product === "compliance" ? COMPLIANCE_PLANS : LEGAL_PLANS;
  const compareRows =
    product === "compliance" ? COMPLIANCE_COMPARE : LEGAL_COMPARE;
  const planGridCols =
    product === "compliance"
      ? "md:grid-cols-2 xl:grid-cols-4"
      : "md:grid-cols-3";

  return (
    <div className="min-h-screen bg-c-bg pb-20">
      {/* ── Header ── */}
      <header className="border-b border-c-border bg-c-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
          <Link
            href="/"
            className="flex items-center gap-3 text-c-text hover:text-c-brand"
          >
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
                {STRINGS.heroEyebrow[lang]}
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className="rounded-md px-2.5 py-1 text-[11px] font-medium text-c-text-muted hover:text-c-brand"
            >
              {STRINGS.pricingPageNavHome[lang]}
            </Link>
            <Link
              href="/"
              className="rounded-md px-2.5 py-1 text-[11px] font-medium text-c-text-muted hover:text-c-brand"
            >
              {STRINGS.pricingPageNavAtlas[lang]}
            </Link>
            <Link
              href="/api"
              className="rounded-md px-2.5 py-1 text-[11px] font-medium text-c-text-muted hover:text-c-brand"
            >
              {STRINGS.pricingPageNavDocs[lang]}
            </Link>
            <Link
              href="/pricing"
              aria-current="page"
              className="rounded-md border border-c-brand bg-c-brand-soft px-2.5 py-1 text-[11px] font-medium text-c-brand-ink"
            >
              {STRINGS.pricingPageNavPricing[lang]}
            </Link>
            <a
              href={MEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 rounded-md bg-c-text px-2.5 py-1 text-[11px] font-medium text-white hover:bg-c-ink-deep"
            >
              {STRINGS.pricingPageNavGetKey[lang]} →
            </a>
            <div className="ml-2 flex rounded-md border border-c-border bg-c-surface p-0.5 text-[11px] font-medium">
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
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pt-16">
        {/* ── Hero ── */}
        <section className="text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-c-border bg-c-surface px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-c-text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-c-brand" />
            {STRINGS.pricingHeader[lang]}
          </div>
          <h1 className="font-display text-4xl font-light leading-[1.05] tracking-tight text-c-text md:text-6xl">
            {STRINGS.pricingHeroTitle[lang]}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-c-text-muted md:text-lg">
            {STRINGS.pricingHeroSubtitle[lang]}
          </p>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-c-border bg-c-surface p-1">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                billing === "monthly"
                  ? "bg-c-text text-white"
                  : "text-c-text-muted hover:text-c-text"
              }`}
            >
              {STRINGS.pricingBillingMonthly[lang]}
            </button>
            <button
              type="button"
              onClick={() => setBilling("yearly")}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                billing === "yearly"
                  ? "bg-c-text text-white"
                  : "text-c-text-muted hover:text-c-text"
              }`}
            >
              {STRINGS.pricingBillingYearly[lang]}
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                  billing === "yearly"
                    ? "bg-c-brand-soft text-c-brand-ink"
                    : "bg-c-brand-soft text-c-brand-ink"
                }`}
              >
                {STRINGS.pricingYearlySaveBadge[lang]}
              </span>
            </button>
          </div>
        </section>

        {/* ── Product tabs ── */}
        <section className="mt-12">
          <div className="mx-auto flex w-fit items-center gap-1 rounded-xl border border-c-border bg-c-surface p-1">
            <button
              type="button"
              onClick={() => setProduct("compliance")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                product === "compliance"
                  ? "bg-c-brand text-white"
                  : "text-c-text-muted hover:text-c-text"
              }`}
            >
              {STRINGS.pricingTabProduct[lang]}
            </button>
            <button
              type="button"
              onClick={() => setProduct("legal")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                product === "legal"
                  ? "bg-c-brand text-white"
                  : "text-c-text-muted hover:text-c-text"
              }`}
            >
              {STRINGS.pricingTabLegal[lang]}
            </button>
          </div>
        </section>

        {/* ── Plans grid ── */}
        <section className={`mt-10 grid gap-4 ${planGridCols}`}>
          {plans.map((plan) => (
            <PlanCard
              key={`${product}-${plan.id}`}
              plan={plan}
              billing={billing}
              lang={lang}
            />
          ))}
        </section>

        {/* ── Compare section ── */}
        <section className="mt-24">
          <div className="text-center">
            <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-c-brand">
              {STRINGS.pricingCompareHeader[lang]}
            </div>
            <h2 className="mt-1 font-display text-3xl font-light tracking-tight md:text-4xl">
              {STRINGS.pricingCompareSubtitle[lang]}
            </h2>
          </div>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-c-border bg-c-surface">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-c-border bg-c-surface-2">
                  <th className="sticky left-0 z-10 bg-c-surface-2 px-4 py-4 text-left text-[11px] font-medium uppercase tracking-wider text-c-text-subtle">
                    {STRINGS.pricingCompareFeature[lang]}
                  </th>
                  {plans.map((p) => (
                    <th
                      key={p.id}
                      className={`px-4 py-4 text-left text-sm font-semibold ${
                        p.featured ? "text-c-brand-ink" : "text-c-text"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {p.name[lang]}
                        {p.featured && (
                          <span className="rounded-full bg-c-brand-soft px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-c-brand-ink">
                            {STRINGS.pricingPopular[lang]}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row, i) => (
                  <tr
                    key={row.label.en}
                    className={`border-b border-c-border last:border-b-0 ${
                      i % 2 === 1 ? "bg-c-surface-2/30" : ""
                    }`}
                  >
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-c-surface px-4 py-3 text-left text-sm font-medium text-c-text-muted"
                    >
                      {row.label[lang]}
                    </th>
                    {row.values.map((v, idx) => (
                      <td key={idx} className="px-4 py-3">
                        <CompareCell
                          value={v as CompareValue | { fr: string; en: string }}
                          lang={lang}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="mt-24">
          <div className="text-center">
            <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-c-brand">
              FAQ
            </div>
            <h2 className="mt-1 font-display text-3xl font-light tracking-tight md:text-4xl">
              {STRINGS.pricingFaqHeader[lang]}
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-c-text-muted">
              {STRINGS.pricingFaqSubtitle[lang]}
            </p>
          </div>

          <ul className="mx-auto mt-10 max-w-3xl divide-y divide-c-border overflow-hidden rounded-2xl border border-c-border bg-c-surface">
            {FAQ.map((item, i) => {
              const open = openFaq === i;
              return (
                <li key={item.q.en}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-c-surface-2/40"
                  >
                    <span className="text-base font-medium tracking-tight text-c-text">
                      {item.q[lang]}
                    </span>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-c-border bg-c-surface text-c-text-muted transition-transform ${
                        open ? "rotate-45" : ""
                      }`}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>
                  {open ? (
                    <div className="px-6 pb-6 text-sm leading-relaxed text-c-text-muted">
                      {item.a[lang]}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ── Final CTA ── */}
        <section className="mt-24 rounded-2xl border border-c-border bg-c-surface p-8 text-center md:p-12">
          <h2 className="font-display text-3xl font-light tracking-tight md:text-4xl">
            {STRINGS.apiCalloutTitle[lang]}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-c-text-muted md:text-base">
            {STRINGS.apiCalloutBody[lang]}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={MEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-c-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-c-brand-ink"
            >
              {STRINGS.apiCtaPrimary[lang]} →
            </a>
            <Link
              href="/api"
              className="inline-flex items-center gap-2 rounded-lg border border-c-border bg-c-surface px-5 py-2.5 text-sm font-medium text-c-text-muted hover:border-c-brand hover:text-c-brand"
            >
              {STRINGS.apiCtaSecondary[lang]} →
            </Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="mt-16 border-t border-c-border pt-6 text-xs text-c-text-subtle">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>{STRINGS.pricingFooterTagline[lang]}</span>
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
              <Link
                href="/privacy"
                className="text-c-text-muted hover:text-c-brand"
              >
                {STRINGS.privacyLink[lang]}
              </Link>
              <span>·</span>
              <Link href="/api" className="text-c-text-muted hover:text-c-brand">
                {STRINGS.pricingPageNavDocs[lang]}
              </Link>
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}

/* ================================================================
   Plan card
   ================================================================ */
function PlanCard({
  plan,
  billing,
  lang,
}: {
  plan: Plan;
  billing: Billing;
  lang: Lang;
}) {
  const isExternal = plan.ctaHref.startsWith("http");
  const ctaProps = isExternal
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 transition-shadow ${
        plan.featured
          ? "border-c-brand bg-c-brand-soft/30 shadow-sm"
          : "border-c-border bg-c-surface"
      }`}
    >
      {plan.featured && (
        <div className="absolute -top-3 left-6 rounded-full bg-c-brand px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
          {STRINGS.pricingPopular[lang]}
        </div>
      )}

      <h3 className="font-display text-2xl font-normal tracking-tight text-c-text">
        {plan.name[lang]}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-c-text-muted">
        {plan.tagline[lang]}
      </p>

      <div className="mt-6">
        <PriceDisplay price={plan.price} billing={billing} lang={lang} />
      </div>

      <ul className="mt-6 flex-1 space-y-2.5 text-sm">
        {plan.features.map((f) => (
          <li key={f.en} className="flex items-start gap-2.5">
            <span
              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                plan.featured
                  ? "bg-c-brand text-white"
                  : "bg-c-brand-soft text-c-brand-ink"
              }`}
              aria-hidden="true"
            >
              ✓
            </span>
            <span className="text-c-text">{f[lang]}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        {isExternal ? (
          <a
            href={plan.ctaHref}
            {...ctaProps}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
              plan.featured
                ? "bg-c-text text-white hover:bg-c-ink-deep"
                : "bg-c-text text-white hover:bg-c-ink-deep"
            }`}
          >
            {plan.cta[lang]} →
          </a>
        ) : (
          <Link
            href={plan.ctaHref}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-c-text px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-c-ink-deep"
          >
            {plan.cta[lang]} →
          </Link>
        )}
      </div>
    </div>
  );
}

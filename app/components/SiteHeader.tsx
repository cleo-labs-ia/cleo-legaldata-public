"use client";

import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { STRINGS } from "@/lib/i18n";
import { checkoutUrl } from "@/lib/urls";

const SIGNUP_URL = checkoutUrl("pro");

interface Props {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Which atlas the current page belongs to (highlights the toggle). */
  active?: "atlas" | "atlas-product" | "atlas-hs" | "legal-api" | null;
}

/**
 * Shared site header used on /, /general, /products, /docs, /pricing.
 *
 * Layout (left → right):
 *   1. Logo cleo  →  /
 *   2. Atlas toggle (Atlas | Atlas Produit) — visually grouped, distinct from utilities
 *   3. Shared utilities (Docs · Tarifs) — separated from atlas toggle
 *   4. Lang switcher  +  Get API key CTA
 */
export default function SiteHeader({ lang, setLang, active = null }: Props) {
  return (
    <header className="border-b border-c-border bg-c-surface">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <img
            src="/cleo-icon.svg"
            alt="Cleo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-md"
          />
          <span className="hidden font-display text-lg font-medium tracking-tight text-c-text sm:inline">
            cleo
          </span>
        </Link>

        {/* Products dropdown — clarifies that the 3 atlases are 3 products */}
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          <details className="group relative">
            <summary
              className={`flex cursor-pointer list-none items-center gap-1 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                active === "atlas" || active === "atlas-product" || active === "atlas-hs"
                  ? "text-c-text"
                  : "text-c-text-muted hover:text-c-text"
              }`}
            >
              {lang === "fr" ? "Produits" : "Products"}
              <span className="text-[9px] transition-transform group-open:rotate-180">▼</span>
            </summary>
            <div
              className="absolute left-0 top-full z-40 mt-2 w-[420px] overflow-hidden rounded-2xl border border-c-border bg-c-surface shadow-lg"
            >
              <ProductMenuItem
                href="/general"
                icon="📚"
                title={STRINGS.navGeneral[lang]}
                desc={lang === "fr" ? "Données juridiques transverses · 1 494 sources · 177 juridictions" : "Cross-topic legal data · 1,494 sources · 177 jurisdictions"}
                active={active === "atlas"}
              />
              <ProductMenuItem
                href="/products"
                icon="📦"
                title={STRINGS.navProducts[lang]}
                desc={lang === "fr" ? "Conformité produit physique · 46 031 régs · 20 catégories" : "Physical-product compliance · 46,031 regs · 20 categories"}
                active={active === "atlas-product"}
              />
              <ProductMenuItem
                href="/hs-code"
                icon="🛃"
                title={STRINGS.navHsCode[lang]}
                desc={lang === "fr" ? "Douane · classification HS, droits, dual-use & sanctions" : "Customs · HS classification, duties, dual-use & sanctions"}
                active={active === "atlas-hs"}
              />
            </div>
          </details>

          <Link
            href="/playground"
            className="rounded-md px-3 py-1.5 text-[13px] font-medium text-c-text-muted transition-colors hover:text-c-text"
          >
            {STRINGS.navPlayground[lang]}
          </Link>
          <Link
            href="/docs"
            className="rounded-md px-3 py-1.5 text-[13px] font-medium text-c-text-muted transition-colors hover:text-c-text"
          >
            {STRINGS.navDocs[lang]}
          </Link>
          <Link
            href="/pricing"
            className="rounded-md px-3 py-1.5 text-[13px] font-medium text-c-text-muted transition-colors hover:text-c-text"
          >
            {STRINGS.navPricing[lang]}
          </Link>
        </nav>

        {/* Push right: lang switcher + CTA */}
        <div className="ml-auto flex items-center gap-2">
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
          <a
            href={SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-c-brand px-3.5 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-c-brand-ink"
          >
            Get API key →
          </a>
        </div>
      </div>
    </header>
  );
}

function ProductMenuItem({
  href,
  icon,
  title,
  desc,
  active,
}: {
  href: string;
  icon: string;
  title: string;
  desc: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-start gap-3 px-4 py-3 transition-colors ${
        active ? "bg-c-surface-2" : "hover:bg-c-surface-2"
      }`}
    >
      <span className="text-xl leading-none">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold text-c-text">{title}</div>
        <div className="mt-0.5 text-[11.5px] leading-snug text-c-text-muted">{desc}</div>
      </div>
      <span className={`text-c-text-subtle transition-opacity ${active ? "opacity-100" : "opacity-0 group-hover/item:opacity-100"}`}>
        →
      </span>
    </Link>
  );
}

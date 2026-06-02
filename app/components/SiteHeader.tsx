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

        {/* Atlas toggle — Legal Atlas | Product Compliance Atlas */}
        <nav
          aria-label="Atlas"
          className="hidden items-center gap-0.5 rounded-full border border-c-border bg-c-surface-2 p-0.5 text-[12px] font-semibold md:flex"
        >
          <Link
            href="/general"
            className={`rounded-full px-3 py-1.5 transition-colors ${
              active === "atlas"
                ? "bg-c-text text-white shadow-sm"
                : "text-c-text-muted hover:text-c-text"
            }`}
          >
            {STRINGS.navGeneral[lang]}
          </Link>
          <Link
            href="/products"
            className={`rounded-full px-3 py-1.5 transition-colors ${
              active === "atlas-product"
                ? "bg-c-text text-white shadow-sm"
                : "text-c-text-muted hover:text-c-text"
            }`}
          >
            {STRINGS.navProducts[lang]}
          </Link>
          <Link
            href="/hs-code"
            className={`rounded-full px-3 py-1.5 transition-colors ${
              active === "atlas-hs"
                ? "bg-c-text text-white shadow-sm"
                : "text-c-text-muted hover:text-c-text"
            }`}
          >
            {STRINGS.navHsCode[lang]}
          </Link>
        </nav>

        {/* Shared utilities (Docs / Tarifs) */}
        <nav aria-label="Tools" className="hidden items-center gap-1 md:flex">
          <Link
            href="/docs"
            className="rounded-md px-3 py-1.5 text-[13px] font-medium text-c-text-muted transition-colors hover:text-c-text"
          >
            {STRINGS.navDocs[lang]}
          </Link>
          <Link
            href="/playground"
            className="rounded-md px-3 py-1.5 text-[13px] font-medium text-c-text-muted transition-colors hover:text-c-text"
          >
            {STRINGS.navPlayground[lang]}
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

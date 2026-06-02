"use client";

import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { STRINGS } from "@/lib/i18n";
import { checkoutUrl } from "@/lib/urls";

const SIGNUP_URL = checkoutUrl("pro");

interface Props {
  lang: Lang;
  setLang: (lang: Lang) => void;
  active?: "atlas" | "atlas-product" | "atlas-hs" | "legal-api" | null;
}

/**
 * Translucent fixed header inspired by cleolabs.co/en/blog:
 *   – glass / blurred white background, hairline border bottom
 *   – compact 44 px row (touch target), 13 px nav links
 *   – inline underline indicates the active page
 *   – Products ▾ dropdown groups the three atlases
 *   – right CTA pill in Cleo blue
 */
export default function SiteHeader({ lang, setLang, active = null }: Props) {
  const productActive =
    active === "atlas" || active === "atlas-product" || active === "atlas-hs";

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 border-b border-c-border/60"
        style={{
          background: "rgba(255, 255, 255, 0.6)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
        }}
      >
        <div className="mx-auto flex h-11 max-w-[1280px] items-center justify-between px-5 lg:px-12">
          {/* Logo */}
          <Link href="/" className="mr-10 shrink-0">
            <img
              src="/cleo-icon.svg"
              alt="Cleo"
              width={28}
              height={28}
              className="h-5 w-auto"
            />
          </Link>

          {/* Left nav */}
          <div className="hidden flex-1 items-center gap-7 md:flex">
            <ProductsDropdown lang={lang} active={productActive} activeKey={active} />
            <NavLink href="/playground" label={STRINGS.navPlayground[lang]} />
            <NavLink href="/docs" label={STRINGS.navDocs[lang]} />
            <NavLink href="/pricing" label={STRINGS.navPricing[lang]} />
          </div>

          {/* Right side */}
          <div className="hidden items-center gap-4 md:flex">
            <button
              type="button"
              onClick={() => setLang(lang === "fr" ? "en" : "fr")}
              className="text-[12px] font-normal text-c-text-subtle transition-colors hover:text-c-text"
              title={lang === "fr" ? "Switch to English" : "Passer en français"}
            >
              {lang === "fr" ? "EN" : "FR"}
            </button>
            <a
              href={SIGNUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 min-w-[140px] items-center justify-center rounded-full text-[13px] font-semibold text-white transition-colors"
              style={{ background: "#0008CF", letterSpacing: "-0.02em" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#0006A8")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#0008CF")}
            >
              {lang === "fr" ? "Obtenir une clé" : "Get API key"}
            </a>
          </div>

          {/* Mobile: simplified — just CTA */}
          <a
            href={SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center rounded-full px-4 text-[12px] font-semibold text-white md:hidden"
            style={{ background: "#0008CF" }}
          >
            {lang === "fr" ? "Obtenir une clé" : "Get API key"}
          </a>
        </div>
      </header>
      {/* Spacer to offset the fixed header — same height (44px) */}
      <div aria-hidden className="h-11" />
    </>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`relative py-1 text-[13px] font-normal transition-colors ${
        active ? "text-c-text" : "text-c-text-subtle hover:text-c-text"
      }`}
    >
      <span className="relative">
        {label}
        <span
          className={`absolute -bottom-0.5 left-0 right-0 h-px bg-c-text transition-opacity ${
            active ? "opacity-100" : "opacity-0"
          }`}
        />
      </span>
    </Link>
  );
}

function ProductsDropdown({
  lang,
  active,
  activeKey,
}: {
  lang: Lang;
  active: boolean;
  activeKey: Props["active"];
}) {
  return (
    <details className="group relative">
      <summary
        className={`flex cursor-pointer list-none items-center gap-1 py-1 text-[13px] font-normal transition-colors ${
          active ? "text-c-text" : "text-c-text-subtle hover:text-c-text"
        }`}
      >
        <span className="relative">
          {lang === "fr" ? "Produits" : "Products"}
          <span
            className={`absolute -bottom-0.5 left-0 right-0 h-px bg-c-text transition-opacity ${
              active ? "opacity-100" : "opacity-0"
            }`}
          />
        </span>
        <span className="text-[9px] transition-transform group-open:rotate-180">▼</span>
      </summary>
      <div
        className="absolute left-0 top-full z-40 mt-3 w-[440px] overflow-hidden rounded-2xl border border-c-border bg-c-surface"
        style={{ boxShadow: "0 16px 48px rgba(0,0,0,0.08)" }}
      >
        <ProductMenuItem
          href="/general"
          icon="📚"
          title={STRINGS.navGeneral[lang]}
          desc={
            lang === "fr"
              ? "Données juridiques transverses · 1 494 sources · 177 juridictions"
              : "Cross-topic legal data · 1,494 sources · 177 jurisdictions"
          }
          active={activeKey === "atlas"}
        />
        <ProductMenuItem
          href="/products"
          icon="📦"
          title={STRINGS.navProducts[lang]}
          desc={
            lang === "fr"
              ? "Conformité produit physique · 46 031 régs · 20 catégories"
              : "Physical-product compliance · 46,031 regs · 20 categories"
          }
          active={activeKey === "atlas-product"}
        />
        <ProductMenuItem
          href="/hs-code"
          icon="🛃"
          title={STRINGS.navHsCode[lang]}
          desc={
            lang === "fr"
              ? "Douane · classification HS, droits, dual-use & sanctions"
              : "Customs · HS classification, duties, dual-use & sanctions"
          }
          active={activeKey === "atlas-hs"}
        />
      </div>
    </details>
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
        <div className="text-[13.5px] font-semibold text-c-text">{title}</div>
        <div className="mt-0.5 text-[12px] leading-snug text-c-text-muted">{desc}</div>
      </div>
      <span
        className={`text-c-text-subtle ${active ? "opacity-100" : "opacity-60"}`}
        aria-hidden
      >
        →
      </span>
    </Link>
  );
}

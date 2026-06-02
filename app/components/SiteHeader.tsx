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
        className="absolute left-0 top-full z-40 mt-3 w-[460px] overflow-hidden rounded-xl border border-c-border bg-c-surface"
        style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.06)" }}
      >
        <ProductMenuItem
          href="/general"
          icon={<IconScale />}
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
          icon={<IconBox />}
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
          icon={<IconCustoms />}
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
  icon: React.ReactNode;
  title: string;
  desc: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group/item flex items-start gap-4 px-5 py-4 transition-colors ${
        active ? "bg-c-surface-2" : "hover:bg-c-surface-2"
      }`}
    >
      <span
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${
          active
            ? "border-c-text/10 bg-c-surface text-c-text"
            : "border-c-border bg-c-surface text-c-text-subtle group-hover/item:border-c-text/15 group-hover/item:text-c-text"
        }`}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[13.5px] font-semibold tracking-tight text-c-text">
          {title}
        </div>
        <div className="mt-1 text-[12px] leading-relaxed text-c-text-muted">{desc}</div>
      </div>
      <span
        aria-hidden
        className={`mt-1 shrink-0 text-c-text-subtle transition-all ${
          active
            ? "translate-x-0 opacity-100"
            : "-translate-x-1 opacity-0 group-hover/item:translate-x-0 group-hover/item:opacity-100"
        }`}
      >
        →
      </span>
    </Link>
  );
}

/* ─── Icons (Lucide-style, 18 px, stroke-1.5) ─── */
function IconScale() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 16.5h4l-2-5-2 5Z" />
      <path d="M4 16.5h4l-2-5-2 5Z" />
      <path d="M6 11.5V6" />
      <path d="M18 11.5V6" />
      <path d="M6 6c2 0 4-1 6-1s4 1 6 1" />
      <path d="M12 5v15" />
      <path d="M9 20h6" />
    </svg>
  );
}

function IconBox() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.27 6.96 8.73 5.05 8.73-5.05" />
      <path d="M12 22.08V12" />
    </svg>
  );
}

function IconCustoms() {
  // Globe with arrows = cross-border / customs
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18" />
      <path d="M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

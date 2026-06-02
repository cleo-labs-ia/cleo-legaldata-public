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
 * Pixel-aligned with the cleolabs.co/en/blog navbar
 * (src/components/Navbar.tsx + NavbarDesktop.tsx in cleo-academy/cleo-landing).
 *
 * Spec:
 *  - Fixed translucent bar, white/60 background, backdrop blur
 *  - 44 px row, max-width 1280, px-5 lg:px-12
 *  - Logo 20 px tall (h-5), 40 px right margin
 *  - Nav items: text-[13px] font-normal slate-500, underline -bottom-0.5
 *    appears (opacity 0→100) when active or on hover, gap-7 between items
 *  - Products ▾ opens a 540-wide white card with rounded-3xl shadow,
 *    rows are pill-rounded with 36 px icon badge that turns blue on hover
 *  - Right side: small WhatsApp/Globe icons + lang switch + blue pill CTA
 *    (h-10, min-w-160, rounded-full, #0008CF → #0006A8 on hover)
 */
export default function SiteHeader({ lang, setLang, active = null }: Props) {
  const productActive =
    active === "atlas" || active === "atlas-product" || active === "atlas-hs";

  return (
    <>
      <nav
        aria-label="Main"
        className="fixed inset-x-0 top-0 z-50 transition-all duration-300 border-b border-c-border/60"
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

          {/* Center nav */}
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
              className="flex items-center gap-1 text-[12px] font-normal text-c-text-subtle transition-all hover:text-c-text"
              title={lang === "fr" ? "Switch to English" : "Passer en français"}
            >
              <IconGlobe />
              {lang === "fr" ? "EN" : "FR"}
            </button>
            <a
              href={SIGNUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex h-10 min-w-[160px] items-center justify-center overflow-hidden rounded-full text-[13px] font-semibold text-white"
              style={{
                background: "#0008CF",
                letterSpacing: "-0.02em",
                transition: "background 0.2s cubic-bezier(.77,0,.18,1)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#0006A8")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#0008CF")}
            >
              {lang === "fr" ? "Obtenir une clé" : "Get API key"}
            </a>
          </div>

          {/* Mobile */}
          <a
            href={SIGNUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center justify-center rounded-full px-4 text-[12px] font-semibold text-white md:hidden"
            style={{ background: "#0008CF" }}
          >
            {lang === "fr" ? "Clé API" : "API key"}
          </a>
        </div>
      </nav>
      {/* 44 px spacer to offset the fixed header */}
      <div aria-hidden className="h-11" />
    </>
  );
}

/* ───────── Nav primitives ───────── */

function NavLink({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`relative py-1 text-[13px] font-normal transition-colors duration-150 ${
        active ? "text-c-text" : "text-c-text-subtle hover:text-c-text"
      }`}
    >
      <span className="relative">
        {label}
        <span
          className={`absolute -bottom-0.5 left-0 right-0 h-px bg-c-text transition-opacity duration-200 ${
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
        className={`flex cursor-pointer list-none items-center gap-1 py-1 text-[13px] font-normal transition-colors duration-150 ${
          active ? "text-c-text" : "text-c-text-subtle hover:text-c-text"
        }`}
      >
        <span className="relative">
          {lang === "fr" ? "Produits" : "Products"}
          <span
            className={`absolute -bottom-0.5 left-0 right-0 h-px bg-c-text transition-opacity duration-200 ${
              active ? "opacity-100" : "opacity-0"
            }`}
          />
        </span>
        <IconCaretDown />
      </summary>

      <div
        className="absolute left-0 top-full z-40 mt-3 w-[540px] max-w-[calc(100vw-2rem)] rounded-3xl bg-white p-3"
        style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)" }}
      >
        <div className="px-3 pb-2 pt-1">
          <span className="text-[10.5px] font-medium uppercase tracking-[0.1em] text-c-text-subtle">
            {lang === "fr" ? "Coverages" : "Coverages"}
          </span>
        </div>
        <DropdownItem
          href="/general"
          icon={<IconScale />}
          label={STRINGS.navGeneral[lang]}
          desc={
            lang === "fr"
              ? "1 494 sources · 177 juridictions · toute thématique"
              : "1,494 sources · 177 jurisdictions · all topics"
          }
          active={activeKey === "atlas"}
        />
        <DropdownItem
          href="/products"
          icon={<IconBox />}
          label={STRINGS.navProducts[lang]}
          desc={
            lang === "fr"
              ? "46 031 régulations · 20 catégories · produits physiques"
              : "46,031 regulations · 20 categories · physical products"
          }
          active={activeKey === "atlas-product"}
        />
        <DropdownItem
          href="/hs-code"
          icon={<IconCustoms />}
          label={STRINGS.navHsCode[lang]}
          desc={
            lang === "fr"
              ? "Classification HS · droits · dual-use · sanctions"
              : "HS classification · duties · dual-use · sanctions"
          }
          active={activeKey === "atlas-hs"}
        />
      </div>
    </details>
  );
}

function DropdownItem({
  href,
  icon,
  label,
  desc,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  desc: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group/item flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors ${
        active ? "bg-c-surface-2" : "hover:bg-c-surface-2/60"
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
          active
            ? "bg-c-brand-soft text-c-brand"
            : "bg-c-surface-2 text-c-text-subtle group-hover/item:bg-c-brand-soft group-hover/item:text-c-brand"
        }`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <span className="block text-[13.5px] font-semibold leading-tight text-c-text">
          {label}
        </span>
        <span className="mt-0.5 block text-[12px] leading-snug text-c-text-muted">
          {desc}
        </span>
      </div>
    </Link>
  );
}

/* ───────── Inline icons (Lucide / Phosphor inspired, monoline) ───────── */

function IconCaretDown() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-c-text-subtle transition-transform duration-200 group-open:rotate-180"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15 15 0 0 1 0 20" />
      <path d="M12 2a15 15 0 0 0 0 20" />
    </svg>
  );
}

function IconScale() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 16h5l-2.5-6L16 16Z" />
      <path d="M3 16h5l-2.5-6L3 16Z" />
      <path d="M5.5 10V7" />
      <path d="M18.5 10V7" />
      <path d="M5.5 7c2.5 0 4.5-1 6.5-1s4 1 6.5 1" />
      <path d="M12 6v15" />
      <path d="M8.5 21h7" />
    </svg>
  );
}

function IconBox() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function IconCustoms() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18" />
      <path d="M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

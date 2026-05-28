"use client";

import { useState } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { STRINGS } from "@/lib/i18n";

const MEET_URL = "https://www.cleolabs.co/en/meet";

const PRODUCT_CATEGORY_IMAGES = [
  "/images/categories/cosmetics.png",
  "/images/categories/electronics.png",
  "/images/categories/toys.png",
  "/images/categories/medical-devices.png",
  "/images/categories/food.png",
  "/images/categories/textile.png",
  "/images/categories/pharma.png",
  "/images/categories/chemicals.png",
];

export default function HomeChooser() {
  const [lang, setLang] = useState<Lang>("fr");

  return (
    <div className="min-h-screen bg-c-bg">
      {/* ── Header (light, Stripe-style) ── */}
      <header className="border-b border-c-border bg-c-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <img
              src="/cleo-icon.svg"
              alt="Cleo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-md"
            />
            <span className="font-display text-lg font-medium tracking-tight text-c-text">
              cleo
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/general"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-c-text-muted transition-colors hover:text-c-text"
            >
              {STRINGS.navGeneral[lang]}
            </Link>
            <Link
              href="/products"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-c-text-muted transition-colors hover:text-c-text"
            >
              {STRINGS.navProducts[lang]}
            </Link>
            <Link
              href="/docs"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-c-text-muted transition-colors hover:text-c-text"
            >
              {STRINGS.homeNavDocs[lang]}
            </Link>
            <Link
              href="/pricing"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-c-text-muted transition-colors hover:text-c-text"
            >
              {STRINGS.homeNavPricing[lang]}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-c-border bg-c-surface p-0.5 text-[11px] font-medium">
              {(["fr", "en"] as Lang[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`rounded px-2 py-0.5 transition-colors ${
                    lang === l
                      ? "bg-c-text text-white"
                      : "text-c-text-muted hover:text-c-text"
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <a
              href={MEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-c-text-muted hover:text-c-text sm:inline-flex"
            >
              {STRINGS.homeNavLogin[lang]}
            </a>
            <a
              href={MEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-c-text px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-c-ink-deep"
            >
              {STRINGS.homeNavApiKey[lang]} →
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-20">
        {/* ── Hero ── */}
        <section className="mx-auto max-w-3xl pt-20 pb-12 text-center md:pt-28 md:pb-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-c-border bg-c-surface px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-c-text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-c-brand" />
            Cleo Legal Data Platform
          </div>
          <h1 className="font-display text-4xl font-light leading-[1.05] tracking-tight text-c-text md:text-6xl">
            {STRINGS.homeHeroTitleA[lang]}{" "}
            <span className="italic text-c-brand">
              {STRINGS.homeHeroTitleB[lang]}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-c-text-muted md:text-lg">
            {STRINGS.homeHeroSubtitle[lang]}
          </p>
        </section>

        {/* ── Two cards, 50/50 ── */}
        <section className="grid gap-5 lg:grid-cols-2">
          {/* Card 1 — Product Compliance */}
          <Link
            href="/products"
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-c-border bg-c-surface p-8 transition-all hover:border-c-brand hover:shadow-lg"
          >
            {/* Visual header: stacked product category images */}
            <div className="mb-7 flex flex-wrap items-center gap-2">
              {PRODUCT_CATEGORY_IMAGES.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="h-11 w-11 rounded-xl object-cover ring-1 ring-c-border transition-transform group-hover:scale-105"
                />
              ))}
            </div>

            <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full bg-c-brand-soft px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-c-brand-ink">
              Product
            </div>
            <h2 className="font-display text-3xl font-light leading-tight tracking-tight text-c-text md:text-4xl">
              {STRINGS.homeProductCardTitle[lang]}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-c-text-muted">
              {STRINGS.homeProductCardDesc[lang]}
            </p>

            <div className="mt-6 rounded-xl border border-c-border bg-c-surface-2 px-4 py-3 text-[13px] font-medium tabular-nums text-c-text-muted">
              {STRINGS.homeProductCardStats[lang]}
            </div>

            <div className="mt-auto pt-7">
              <span className="inline-flex items-center rounded-full bg-c-text px-5 py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-c-brand">
                {STRINGS.homeProductCardCta[lang]} →
              </span>
            </div>
          </Link>

          {/* Card 2 — Legal Data General */}
          <Link
            href="/general"
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-c-border bg-c-surface p-8 transition-all hover:border-c-brand hover:shadow-lg"
          >
            {/* Visual header: dark hero-style block with KPIs */}
            <div className="mb-7 overflow-hidden rounded-xl">
              <div
                className="relative flex h-[156px] items-center justify-center overflow-hidden"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 60% at 25% 10%, rgba(107, 116, 255, 0.35), transparent 60%), radial-gradient(ellipse 60% 50% at 90% 95%, rgba(0, 8, 207, 0.55), transparent 70%), linear-gradient(180deg, #02021a 0%, #06061a 100%)",
                }}
              >
                {/* Subtle grid overlay */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-50"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                    maskImage:
                      "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 80%)",
                  }}
                />
                <div className="relative grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur">
                    <div className="font-display text-xl font-light tabular-nums text-white">
                      1 479
                    </div>
                    <div className="text-[9px] font-medium uppercase tracking-wider text-white/60">
                      sources
                    </div>
                  </div>
                  <div className="rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur">
                    <div className="font-display text-xl font-light tabular-nums text-white">
                      177
                    </div>
                    <div className="text-[9px] font-medium uppercase tracking-wider text-white/60">
                      {lang === "fr" ? "juridictions" : "jurisdictions"}
                    </div>
                  </div>
                  <div className="rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur">
                    <div className="font-display text-xl font-light tabular-nums text-white">
                      234M+
                    </div>
                    <div className="text-[9px] font-medium uppercase tracking-wider text-white/60">
                      docs
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full bg-c-surface-2 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-c-text-muted">
              General
            </div>
            <h2 className="font-display text-3xl font-light leading-tight tracking-tight text-c-text md:text-4xl">
              {STRINGS.homeGeneralCardTitle[lang]}
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-c-text-muted">
              {STRINGS.homeGeneralCardDesc[lang]}
            </p>

            <div className="mt-6 rounded-xl border border-c-border bg-c-surface-2 px-4 py-3 text-[13px] font-medium tabular-nums text-c-text-muted">
              {STRINGS.homeGeneralCardStats[lang]}
            </div>

            <div className="mt-auto pt-7">
              <span className="inline-flex items-center rounded-full bg-c-text px-5 py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-c-brand">
                {STRINGS.homeGeneralCardCta[lang]} →
              </span>
            </div>
          </Link>
        </section>

        {/* ── Shared API section ── */}
        <section className="mt-16 rounded-2xl border border-c-border bg-c-surface p-8 md:p-10">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-c-border bg-c-surface-2 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-c-text-muted">
                API
              </div>
              <h2 className="font-display text-2xl font-light leading-tight tracking-tight text-c-text md:text-3xl">
                {STRINGS.homeSharedTitle[lang]}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-c-text-muted md:text-[15px]">
                {STRINGS.homeSharedBody[lang]}
              </p>
            </div>
            <Link
              href="/docs"
              className="inline-flex shrink-0 items-center rounded-full bg-c-text px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-c-brand"
            >
              {STRINGS.homeSharedCta[lang]} →
            </Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="mt-16 border-t border-c-border pt-6 text-xs text-c-text-subtle">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span>{STRINGS.homeFooterTagline[lang]}</span>
            <span className="flex flex-wrap items-center gap-x-3">
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
                href="/general"
                className="text-c-text-muted hover:text-c-brand"
              >
                {STRINGS.navGeneral[lang]}
              </Link>
              <span>·</span>
              <Link
                href="/products"
                className="text-c-text-muted hover:text-c-brand"
              >
                {STRINGS.navProducts[lang]}
              </Link>
              <span>·</span>
              <Link
                href="/docs"
                className="text-c-text-muted hover:text-c-brand"
              >
                {STRINGS.homeNavDocs[lang]}
              </Link>
              <span>·</span>
              <Link
                href="/privacy"
                className="text-c-text-muted hover:text-c-brand"
              >
                {STRINGS.privacyLink[lang]}
              </Link>
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import { STRINGS } from "@/lib/i18n";

const LAST_UPDATED = "2026-04-30";

export default function PrivacyPage() {
  const [lang, setLang] = useState<Lang>("fr");

  return (
    <div className="min-h-screen bg-c-bg pb-20">
      <header className="border-b border-c-border bg-c-surface">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-3">
          <Link href="/" className="flex items-center gap-3 text-c-text hover:text-c-brand">
            <img src="/cleo-icon.svg" alt="Cleo" width={36} height={36} className="h-9 w-9 rounded-md" />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">{STRINGS.brand[lang]}</div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-c-text-subtle">
                ← {STRINGS.apiBackToAtlas[lang]}
              </div>
            </div>
          </Link>
          <div className="flex rounded-md border border-c-border bg-c-surface p-0.5 text-[11px] font-medium">
            {(["fr", "en"] as Lang[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`rounded px-2 py-0.5 transition-colors ${
                  lang === l ? "bg-c-brand text-white" : "text-c-text-muted hover:text-c-text"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pt-12">
        <h1 className="font-display text-4xl font-light tracking-tight md:text-5xl">
          {lang === "fr" ? "Politique de confidentialité" : "Privacy policy"}
        </h1>
        <p className="mt-2 text-sm text-c-text-subtle">
          {lang === "fr" ? `Dernière mise à jour : ${new Date(LAST_UPDATED).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}` : `Last updated: ${new Date(LAST_UPDATED).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`}
        </p>

        <div className="prose prose-sm mt-10 max-w-none text-c-text">
          {lang === "fr" ? <PrivacyFR /> : <PrivacyEN />}
        </div>

        <div className="mt-16 border-t border-c-border pt-6 text-center text-xs text-c-text-subtle">
          <Link href="/" className="text-c-text-muted hover:text-c-brand">
            ← {STRINGS.apiBackToAtlas[lang]}
          </Link>
        </div>
      </main>
    </div>
  );
}

function PrivacyFR() {
  return (
    <>
      <h2 className="font-display text-xl font-normal tracking-tight">1. Qui sommes-nous</h2>
      <p className="text-sm leading-relaxed text-c-text-muted">
        Le site <code>legaldata-public.cleolabs.co</code> est édité par <strong>Cleo Labs</strong>, exploité commercialement
        sous l&apos;entité <strong>Cleo Academy</strong> (<a href="mailto:contact@cleo.academy" className="text-c-brand hover:underline">contact@cleo.academy</a>),
        France. Le site présente le catalogue ouvert des sources de données juridiques que nous suivons et propose un accès
        programmatique payant via l&apos;API Cleo Insight.
      </p>

      <h2 className="mt-8 font-display text-xl font-normal tracking-tight">2. Données que nous traitons</h2>
      <p className="text-sm leading-relaxed text-c-text-muted">
        Le site est statique et ne demande aucune information pour être consulté. Aucune inscription n&apos;est requise pour
        naviguer. Nous traitons les catégories suivantes :
      </p>
      <ul className="mt-2 space-y-2 text-sm leading-relaxed text-c-text-muted">
        <li>
          <strong>Logs serveur techniques</strong> (Vercel) : adresse IP, user-agent, URL demandée, code HTTP, timestamp.
          Conservés ≤ 30 jours pour la sécurité et le débogage. Aucune utilisation marketing.
        </li>
        <li>
          <strong>E-mail si vous nous contactez</strong> via le bouton &laquo;&nbsp;Prendre un call&nbsp;&raquo; (qui redirige vers <code>cleolabs.co/en/meet</code>) :
          adresse e-mail, société, cas d&apos;usage que vous renseignez. Utilisés exclusivement pour répondre à votre demande
          d&apos;accès à l&apos;API et conservés tant que la relation commerciale est active.
        </li>
      </ul>
      <p className="mt-2 text-sm leading-relaxed text-c-text-muted">
        <strong>Pas de cookies de tracking</strong>, pas d&apos;analytics tiers (Google Analytics, Mixpanel, etc.), pas de
        ré-identification. Aucun pixel publicitaire.
      </p>

      <h2 className="mt-8 font-display text-xl font-normal tracking-tight">3. Données exposées par l&apos;API</h2>
      <p className="text-sm leading-relaxed text-c-text-muted">
        Le catalogue exposé via l&apos;API <code>/api/v1/catalog/*</code> contient exclusivement des métadonnées <em>publiques</em>
        sur des portails juridiques officiels (nom du portail, URL publique, juridiction, type de documents, statut technique).
        <strong> Aucune donnée personnelle, aucun document client, aucune information sensible.</strong>
      </p>

      <h2 className="mt-8 font-display text-xl font-normal tracking-tight">4. Hébergement et traitements</h2>
      <ul className="space-y-2 text-sm leading-relaxed text-c-text-muted">
        <li><strong>Site public</strong> : Vercel (région Europe, Frankfurt fra1).</li>
        <li><strong>API</strong> : Vercel + Supabase (région Europe, eu-west-1).</li>
        <li><strong>E-mails entrants</strong> : Google Workspace (contact@cleo.academy).</li>
        <li>
          Aucun transfert vers un pays hors UE/EEE n&apos;est réalisé pour les opérations courantes. Les sous-traitants
          (Vercel, Supabase, Google) appliquent les Clauses Contractuelles Types européennes pour leurs propres flux.
        </li>
      </ul>

      <h2 className="mt-8 font-display text-xl font-normal tracking-tight">5. Vos droits (RGPD)</h2>
      <p className="text-sm leading-relaxed text-c-text-muted">
        Conformément au Règlement (UE) 2016/679, vous disposez des droits d&apos;accès, de rectification, d&apos;effacement,
        de limitation, d&apos;opposition et de portabilité sur les données vous concernant. Pour les exercer :{" "}
        <a href="mailto:contact@cleo.academy" className="text-c-brand hover:underline">contact@cleo.academy</a>.
        Vous pouvez également introduire une réclamation auprès de la <strong>CNIL</strong> (
        <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer" className="text-c-brand hover:underline">cnil.fr/plaintes</a>).
      </p>

      <h2 className="mt-8 font-display text-xl font-normal tracking-tight">6. Clients API : DPA disponible</h2>
      <p className="text-sm leading-relaxed text-c-text-muted">
        Si vous intégrez notre API dans votre produit, un Data Processing Agreement (DPA) est disponible sur simple demande
        avant la signature contractuelle. Nous agissons en tant que <em>sous-traitant</em> au sens du RGPD pour les requêtes
        que votre application nous envoie.
      </p>

      <h2 className="mt-8 font-display text-xl font-normal tracking-tight">7. Mises à jour</h2>
      <p className="text-sm leading-relaxed text-c-text-muted">
        Cette politique peut évoluer. Toute modification substantielle sera signalée par mise à jour de la date ci-dessus
        et, pour les clients API actifs, par e-mail.
      </p>

      <h2 className="mt-8 font-display text-xl font-normal tracking-tight">Contact</h2>
      <p className="text-sm leading-relaxed text-c-text-muted">
        Pour toute question relative à cette politique :{" "}
        <a href="mailto:contact@cleo.academy" className="text-c-brand hover:underline">contact@cleo.academy</a>
      </p>
    </>
  );
}

function PrivacyEN() {
  return (
    <>
      <h2 className="font-display text-xl font-normal tracking-tight">1. Who we are</h2>
      <p className="text-sm leading-relaxed text-c-text-muted">
        <code>legaldata-public.cleolabs.co</code> is operated by <strong>Cleo Labs</strong>, commercially run by{" "}
        <strong>Cleo Academy</strong> (<a href="mailto:contact@cleo.academy" className="text-c-brand hover:underline">contact@cleo.academy</a>),
        France. The site showcases our open catalog of legal data sources and offers paid programmatic access through the
        Cleo Insight API.
      </p>

      <h2 className="mt-8 font-display text-xl font-normal tracking-tight">2. Data we process</h2>
      <p className="text-sm leading-relaxed text-c-text-muted">
        The site is static and requires no information to browse. No signup is required. We process the following:
      </p>
      <ul className="mt-2 space-y-2 text-sm leading-relaxed text-c-text-muted">
        <li>
          <strong>Server technical logs</strong> (Vercel): IP address, user-agent, requested URL, HTTP code, timestamp.
          Retained ≤ 30 days for security and debugging. No marketing use.
        </li>
        <li>
          <strong>E-mail if you contact us</strong> via the &ldquo;Book a call&rdquo; button (which redirects to{" "}
          <code>cleolabs.co/en/meet</code>): e-mail address, company, use case you provide. Used solely to handle your API
          access request and kept while the commercial relationship is active.
        </li>
      </ul>
      <p className="mt-2 text-sm leading-relaxed text-c-text-muted">
        <strong>No tracking cookies</strong>, no third-party analytics (Google Analytics, Mixpanel, etc.), no
        re-identification. No advertising pixels.
      </p>

      <h2 className="mt-8 font-display text-xl font-normal tracking-tight">3. Data exposed by the API</h2>
      <p className="text-sm leading-relaxed text-c-text-muted">
        The catalog exposed by <code>/api/v1/catalog/*</code> contains <em>public</em> metadata about official legal portals
        only (portal name, public URL, jurisdiction, document type, technical status).
        <strong> No personal data, no customer document, no sensitive information.</strong>
      </p>

      <h2 className="mt-8 font-display text-xl font-normal tracking-tight">4. Hosting and processing</h2>
      <ul className="space-y-2 text-sm leading-relaxed text-c-text-muted">
        <li><strong>Public site</strong>: Vercel (EU region, Frankfurt fra1).</li>
        <li><strong>API</strong>: Vercel + Supabase (EU region, eu-west-1).</li>
        <li><strong>Inbound e-mails</strong>: Google Workspace (contact@cleo.academy).</li>
        <li>
          No transfers outside the EU/EEA for routine operations. Sub-processors (Vercel, Supabase, Google) rely on EU
          Standard Contractual Clauses for their own flows.
        </li>
      </ul>

      <h2 className="mt-8 font-display text-xl font-normal tracking-tight">5. Your rights (GDPR)</h2>
      <p className="text-sm leading-relaxed text-c-text-muted">
        Under Regulation (EU) 2016/679 you have the rights of access, rectification, erasure, restriction, objection and
        portability over your data. To exercise them:{" "}
        <a href="mailto:contact@cleo.academy" className="text-c-brand hover:underline">contact@cleo.academy</a>.
        You may also lodge a complaint with the <strong>French DPA (CNIL)</strong> (
        <a href="https://www.cnil.fr/en/home" target="_blank" rel="noopener noreferrer" className="text-c-brand hover:underline">cnil.fr/en</a>).
      </p>

      <h2 className="mt-8 font-display text-xl font-normal tracking-tight">6. API customers: DPA available</h2>
      <p className="text-sm leading-relaxed text-c-text-muted">
        If you integrate our API into your product, a Data Processing Agreement (DPA) is available on request before
        contract signature. We act as <em>processor</em> within the meaning of the GDPR for requests your application
        sends us.
      </p>

      <h2 className="mt-8 font-display text-xl font-normal tracking-tight">7. Updates</h2>
      <p className="text-sm leading-relaxed text-c-text-muted">
        This policy may evolve. Any material change will be reflected by updating the date above and, for active API
        customers, by e-mail.
      </p>

      <h2 className="mt-8 font-display text-xl font-normal tracking-tight">Contact</h2>
      <p className="text-sm leading-relaxed text-c-text-muted">
        Any question about this policy:{" "}
        <a href="mailto:contact@cleo.academy" className="text-c-brand hover:underline">contact@cleo.academy</a>
      </p>
    </>
  );
}

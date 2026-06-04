export type Lang = "fr" | "en";

import { NUMBERS, fmt } from "./numbers";

const N = {
  legalRegs: { fr: fmt(NUMBERS.legalRegulations, "fr"), en: fmt(NUMBERS.legalRegulations, "en") },
  legalDocs: { fr: "1,94M", en: "1.94M" },
  legalSources: { fr: fmt(NUMBERS.legalSources, "fr"), en: fmt(NUMBERS.legalSources, "en") },
  legalJurs: { fr: fmt(NUMBERS.legalJurisdictions, "fr"), en: fmt(NUMBERS.legalJurisdictions, "en") },
  productRegs: { fr: fmt(NUMBERS.productRegsPlatform, "fr"), en: fmt(NUMBERS.productRegsPlatform, "en") },
  productCats: { fr: fmt(NUMBERS.productCategories, "fr"), en: fmt(NUMBERS.productCategories, "en") },
  productJurs: { fr: fmt(NUMBERS.productJurisdictions, "fr"), en: fmt(NUMBERS.productJurisdictions, "en") },
  docsCompact: "1.9M+",
};

export const STRINGS = {
  brand: { fr: "Cleo Legal Data Atlas", en: "Cleo Legal Data Atlas" },
  tagline: {
    fr: "Cartographie publique des sources de données juridiques ouvertes suivies par Cleo Comply.",
    en: "Public map of open legal data sources tracked by Cleo Comply.",
  },
  heroEyebrow: {
    fr: "Atlas public · Cleo Comply",
    en: "Public atlas · Cleo Comply",
  },
  heroTitleA: { fr: "Le droit du monde,", en: "The world's law," },
  heroTitleB: { fr: "lisible par machine.", en: "machine-readable." },
  heroSubtitleClean: {
    fr: `${N.legalSources.fr} sources officielles suivies dans ${N.legalJurs.fr} juridictions — ${NUMBERS.sourcesComplete} entièrement indexées, ${NUMBERS.sourcesBlocked} en cours, ${NUMBERS.sourcesPlanned} planifiées. De Légifrance à la Cour Suprême indienne, vérifié à la source.`,
    en: `${N.legalSources.en} official sources tracked across ${N.legalJurs.en} jurisdictions — ${NUMBERS.sourcesComplete} fully indexed, ${NUMBERS.sourcesBlocked} in progress, ${NUMBERS.sourcesPlanned} planned. From Légifrance to the Indian Supreme Court, verified at source.`,
  },
  heroKpiSources: { fr: "portails officiels", en: "official portals" },
  heroKpiCountries: { fr: "juridictions", en: "jurisdictions" },
  heroKpiDocuments: { fr: "documents recensés", en: "documents recensed" },
  heroScrollHint: { fr: "Explorer", en: "Explore" },
  heroVolumeNote: {
    fr: "volumes déclarés par les portails sources",
    en: "volumes declared by source portals",
  },
  totalSources: { fr: "Sources", en: "Sources" },
  totalCountries: { fr: "Juridictions", en: "Jurisdictions" },
  status: {
    complete: { fr: "Opérationnel", en: "Complete" },
    blocked: { fr: "Bloqué", en: "Blocked" },
    planned: { fr: "Planifié", en: "Planned" },
    needs_research: { fr: "À étudier", en: "Needs research" },
    new: { fr: "Nouveau", en: "New" },
  },
  dataType: {
    legislation: { fr: "Législation", en: "Legislation" },
    case_law: { fr: "Jurisprudence", en: "Case law" },
    doctrine: { fr: "Doctrine", en: "Doctrine" },
    parliamentary_proceedings: { fr: "Travaux parlementaires", en: "Parliamentary proceedings" },
  },
  domain: {
    ai: { fr: "IA", en: "AI" },
    data_protection: { fr: "Données perso.", en: "Data protection" },
    cyber: { fr: "Cybersécurité", en: "Cybersecurity" },
    health: { fr: "Santé", en: "Health" },
    safety: { fr: "Sécurité", en: "Safety" },
    labor: { fr: "Travail", en: "Labor" },
    finance: { fr: "Finance", en: "Finance" },
    environment: { fr: "Environnement", en: "Environment" },
    competition: { fr: "Concurrence", en: "Competition" },
    tax: { fr: "Fiscal", en: "Tax" },
    consumer: { fr: "Consommation", en: "Consumer" },
    ip: { fr: "Propriété intel.", en: "IP" },
    telecom: { fr: "Télécoms / médias", en: "Telecom / media" },
    generalist: { fr: "Généraliste", en: "Generalist" },
  },
  domainShort: {
    ai: { fr: "IA", en: "AI" },
    data_protection: { fr: "Données", en: "Data" },
    cyber: { fr: "Cyber", en: "Cyber" },
    health: { fr: "Santé", en: "Health" },
    safety: { fr: "Sécu.", en: "Safety" },
    labor: { fr: "Travail", en: "Labor" },
    finance: { fr: "Finance", en: "Finance" },
    environment: { fr: "Env.", en: "Env." },
    competition: { fr: "Concur.", en: "Comp." },
    tax: { fr: "Fiscal", en: "Tax" },
    consumer: { fr: "Conso.", en: "Cons." },
    ip: { fr: "PI", en: "IP" },
    telecom: { fr: "Telco", en: "Telco" },
    generalist: { fr: "Général", en: "General" },
  },
  group: {
    ai_data: { fr: "IA & Données", en: "AI & Data" },
    health_safety: { fr: "Santé & Sécurité", en: "Health & Safety" },
    finance_markets: { fr: "Finance & Marchés", en: "Finance & Markets" },
    labor_tax: { fr: "Travail & Fiscal", en: "Labor & Tax" },
    environment: { fr: "Environnement", en: "Environment" },
    ip_media: { fr: "PI & Médias", en: "IP & Media" },
    generalist: { fr: "Généraliste", en: "Generalist" },
  },
  groupShort: {
    ai_data: { fr: "IA & Données", en: "AI & Data" },
    health_safety: { fr: "Santé & Sécu.", en: "Health & Safety" },
    finance_markets: { fr: "Finance", en: "Finance" },
    labor_tax: { fr: "Travail & Fiscal", en: "Labor & Tax" },
    environment: { fr: "Env.", en: "Env." },
    ip_media: { fr: "PI & Médias", en: "IP & Media" },
    generalist: { fr: "Généraliste", en: "Generalist" },
  },
  groupSubtitle: {
    ai_data: { fr: "IA · Données perso · Cyber", en: "AI · Privacy · Cyber" },
    health_safety: { fr: "Santé · Sécurité", en: "Health · Safety" },
    finance_markets: { fr: "Finance · Concurrence · Conso", en: "Finance · Competition · Consumer" },
    labor_tax: { fr: "Travail · Fiscalité", en: "Labor · Tax" },
    environment: { fr: "Climat · Pollution · REACH", en: "Climate · Pollution · REACH" },
    ip_media: { fr: "PI · Télécoms · Médias", en: "IP · Telecom · Media" },
    generalist: { fr: "Portails · JO · Codes", en: "Portals · Gazettes · Codes" },
  },
  searchPlaceholder: { fr: "Rechercher une source, un pays…", en: "Search a source, a country…" },
  filterStatus: { fr: "Statut", en: "Status" },
  filterDataType: { fr: "Type de donnée", en: "Data type" },
  filterCountry: { fr: "Pays", en: "Country" },
  filterDomain: { fr: "Catégorie", en: "Category" },
  allStatuses: { fr: "Tous statuts", en: "All statuses" },
  allDataTypes: { fr: "Tous types", en: "All types" },
  allCountries: { fr: "Tous pays", en: "All countries" },
  allDomains: { fr: "Toutes catégories", en: "All categories" },
  matrixHeader: { fr: "Couverture par catégorie × juridiction", en: "Coverage by category × jurisdiction" },
  matrixHelp: {
    fr: "Classification heuristique selon le nom de l'autorité émettrice. Cliquez une cellule pour filtrer.",
    en: "Heuristic classification from the issuing authority's name. Click a cell to filter.",
  },
  classifierBadge: {
    fr: "Tags inférés du nom de la source",
    en: "Tags inferred from source name",
  },
  apiCalloutEyebrow: { fr: "Accès programmatique", en: "Programmatic access" },
  apiCalloutTitle: {
    fr: "Cette donnée existe aussi en API",
    en: "This data is also available as an API",
  },
  apiCalloutBody: {
    fr: "Toutes les sources, juridictions et catégories de cette page sont accessibles via une API REST authentifiée — pour brancher Cleo dans vos pipelines de veille, votre produit ou vos agents IA.",
    en: "All sources, jurisdictions and categories on this page are available through an authenticated REST API — to plug Cleo into your monitoring pipelines, product, or AI agents.",
  },
  apiCtaPrimary: { fr: "Demander un accès", en: "Request access" },
  apiCtaSecondary: { fr: "Voir la doc", en: "View docs" },
  apiPlansHeader: { fr: "Plans disponibles", en: "Available plans" },
  apiPlanPro: { fr: "Pro", en: "Pro" },
  apiPlanEnterprise: { fr: "Enterprise", en: "Enterprise" },
  apiPlanProDesc: {
    fr: "120 requêtes/min · idéal pour SaaS legal-tech, cabinets, recherche",
    en: "120 requests/min · suited for legal-tech SaaS, law firms, research",
  },
  apiPlanEntDesc: {
    fr: "600 requêtes/min · SLA, support dédié, volumes custom",
    en: "600 requests/min · SLA, dedicated support, custom volumes",
  },
  apiDocsTitle: {
    fr: "API Cleo Legal Data — documentation",
    en: "Cleo Legal Data API — documentation",
  },
  apiDocsIntro: {
    fr: `Une API REST pour accéder par programmation à l'intégralité du catalogue Cleo : ${N.legalSources.fr} portails officiels, ${N.legalJurs.fr} juridictions, ${N.docsCompact} documents juridiques recensés, classés en 7 catégories réglementaires.`,
    en: `A REST API for programmatic access to the entire Cleo catalog: ${N.legalSources.en} official portals, ${N.legalJurs.en} jurisdictions, ${N.docsCompact} legal documents recensed, classified into 7 regulatory categories.`,
  },
  apiAuthHeader: { fr: "Comment ça marche", en: "How it works" },
  apiAuthBody: {
    fr: "Une fois votre plan actif, votre équipe reçoit une clé d'accès et peut interroger le catalogue Cleo depuis votre produit, vos pipelines de veille ou vos agents IA. On gère l'infra et la fraîcheur de la donnée — vous restez concentrés sur votre cas d'usage.",
    en: "Once your plan is live, your team gets an access key and can query the Cleo catalog from your product, monitoring pipelines, or AI agents. We handle the infrastructure and data freshness — you stay focused on your use case.",
  },
  apiStepAccessTitle: { fr: "Accès", en: "Access" },
  apiStepAccessBody: {
    fr: "On ouvre votre compte et on vous remet une clé sécurisée, rotable à tout moment.",
    en: "We open your account and hand over a secure key, rotatable at any time.",
  },
  apiStepCallTitle: { fr: "Appel", en: "Call" },
  apiStepCallBody: {
    fr: "Votre application interroge le catalogue avec des requêtes simples, depuis n'importe quel langage.",
    en: "Your application queries the catalog with simple requests, from any language.",
  },
  apiStepDataTitle: { fr: "Donnée", en: "Data" },
  apiStepDataBody: {
    fr: "Vous recevez sources, juridictions et catégories rafraîchies en continu, prêtes à brancher.",
    en: "You receive sources, jurisdictions and categories refreshed continuously, ready to plug in.",
  },
  apiEndpointsHeader: { fr: "Ce que vous pouvez faire", en: "What you can do" },
  apiRateHeader: { fr: "Performances et fiabilité", en: "Performance & reliability" },
  apiRateBody: {
    fr: "Vos volumes d'appels sont dimensionnés selon votre plan. On absorbe les pics de charge, on vous prévient si vous approchez vos limites, et on tient un SLA d'uptime contractuel sur le plan Enterprise.",
    en: "Call volumes are sized to your plan. We absorb load spikes, alert you when you approach your limits, and back the Enterprise plan with a contractual uptime SLA.",
  },
  apiPaginationHeader: { fr: "Conçu pour les gros volumes", en: "Built for scale" },
  apiPaginationBody: {
    fr: "Les réponses sont paginées pour parcourir l'intégralité du catalogue sans timeout ni surprise, même sur les juridictions les plus denses.",
    en: "Responses are paginated to walk the entire catalog without timeouts or surprises, even on the densest jurisdictions.",
  },
  apiBackToAtlas: { fr: "Retour à l'atlas", en: "Back to atlas" },
  navApi: { fr: "API", en: "API" },
  pricingHeader: { fr: "Tarification", en: "Pricing" },
  pricingTitle: { fr: "Deux plans, pas de surprise", en: "Two plans, no surprises" },
  pricingSubtitle: {
    fr: "Tarification sur mesure selon le volume et les besoins. On en discute en 20 minutes.",
    en: "Custom pricing based on volume and use case. Let's chat for 20 minutes.",
  },
  pricingCustom: { fr: "Sur devis", en: "Custom" },
  bookACall: { fr: "Prendre un call", en: "Book a call" },
  pricingPlanPro: { fr: "Pro", en: "Pro" },
  pricingPlanProTagline: {
    fr: "Pour SaaS legal-tech, cabinets, vendors RegTech",
    en: "For legal-tech SaaS, law firms, RegTech vendors",
  },
  pricingPlanEnt: { fr: "Enterprise", en: "Enterprise" },
  pricingPlanEntTagline: {
    fr: "Pour banques, big4, agences, AI labs",
    en: "For banks, Big 4, agencies, AI labs",
  },
  trustHeader: { fr: "Garanties", en: "Guarantees" },
  trustGdpr: { fr: "Conforme RGPD", en: "GDPR-compliant" },
  trustGdprDesc: {
    fr: "Données traitées dans le respect du RGPD, DPA disponible sur demande",
    en: "Data handled per GDPR, DPA available on request",
  },
  trustEu: { fr: "Hébergé en Europe", en: "EU-hosted" },
  trustEuDesc: {
    fr: "Infrastructure Vercel + Supabase région Europe",
    en: "Vercel + Supabase infrastructure, EU region",
  },
  trustDaily: { fr: "Mises à jour continues", en: "Continuous updates" },
  trustDailyDesc: {
    fr: "Catalogue rafraîchi en continu depuis nos collecteurs",
    en: "Catalog refreshed continuously from our collectors",
  },
  trustSla: { fr: "SLA disponible", en: "SLA available" },
  trustSlaDesc: {
    fr: "Engagement de disponibilité et support dédié sur le plan Enterprise",
    en: "Uptime guarantee and dedicated support on Enterprise plan",
  },
  trustSupport: { fr: "Support inclus", en: "Support included" },
  trustSupportDesc: {
    fr: "Réponse sous 1 jour ouvré, intégration accompagnée",
    en: "Reply within 1 business day, integration support",
  },
  privacyLink: { fr: "Confidentialité", en: "Privacy" },
  navProducts: { fr: "Product Compliance Atlas", en: "Product Compliance Atlas" },
  navLegalApi: {
    fr: "Légal API produit physique",
    en: "Physical Product Legal API",
  },
  navLegalApiShort: { fr: "Produit physique", en: "Physical product" },
  navHome: { fr: "Accueil", en: "Home" },
  navDocs: { fr: "Docs", en: "Docs" },
  navPlayground: { fr: "Playground", en: "Playground" },
  navPricing: { fr: "Tarifs", en: "Pricing" },
  navGeneral: { fr: "Legal Atlas", en: "Legal Atlas" },
  navHsCode: { fr: "HS Code", en: "HS Code" },
  navTalkTeam: { fr: "Parler à l'équipe", en: "Talk to the team" },
  /* ── Home chooser (landing) ── */
  homeNavAtlas: { fr: "Atlas", en: "Atlas" },
  homeNavDocs: { fr: "Documentation", en: "API Docs" },
  homeNavPricing: { fr: "Tarifs", en: "Pricing" },
  homeNavLogin: { fr: "Connexion", en: "Login" },
  homeNavApiKey: { fr: "Obtenir une clé", en: "Get API key" },
  homeHeroTitleA: { fr: "Deux atlas.", en: "Two atlases." },
  homeHeroTitleB: { fr: "Une seule plateforme.", en: "One platform." },
  homeHeroSubtitle: {
    fr: "Choisissez l'atlas Cleo qui correspond à votre besoin — conformité produit ou cartographie mondiale du droit. Même API, même qualité de donnée.",
    en: "Pick the Cleo atlas that fits your need — product compliance or worldwide legal mapping. One API, one data quality bar.",
  },
  homeProductCardTitle: {
    fr: "Product Compliance Atlas",
    en: "Product Compliance Atlas",
  },
  homeProductCardDesc: {
    fr: `Spécialisé conformité produit physique : ${N.productRegs.fr} réglementations dédiées dans ${N.productCats.fr} catégories — cosmétiques, électronique, jouets, dispositifs médicaux, alimentaire, textile, pharma, automobile, drones, tabac…`,
    en: `Specialized for physical-product compliance: ${N.productRegs.en} dedicated regulations across ${N.productCats.en} categories — cosmetics, electronics, toys, medical devices, food, textile, pharma, automotive, drones, tobacco…`,
  },
  homeProductCardStats: {
    fr: `${N.productRegs.fr} régs produit · ${N.productCats.fr} catégories · ${N.productJurs.fr} juridictions`,
    en: `${N.productRegs.en} product regs · ${N.productCats.en} categories · ${N.productJurs.en} jurisdictions`,
  },
  homeProductCardCta: {
    fr: "Ouvrir l'atlas produit physique",
    en: "Open the Product Compliance Atlas",
  },
  homeGeneralCardTitle: {
    fr: "Legal Atlas",
    en: "Legal Atlas",
  },
  homeGeneralCardDesc: {
    fr: `Cartographie publique du droit mondial, machine-readable. ${N.legalRegs.fr} régulations recensées dans ${N.legalJurs.fr} juridictions — santé, finance, environnement, IA, données personnelles, travail, fiscal, toutes thématiques. Législation, jurisprudence, doctrine.`,
    en: `Public map of worldwide law, machine-readable. ${N.legalRegs.en} regulations indexed across ${N.legalJurs.en} jurisdictions — health, finance, environment, AI, data privacy, labor, tax, all topics. Legislation, case law, doctrine.`,
  },
  homeGeneralCardStats: {
    fr: `${N.legalRegs.fr} régs · ${N.legalDocs.fr} docs · ${N.legalSources.fr} sources · ${N.legalJurs.fr} juridictions`,
    en: `${N.legalRegs.en} regs · ${N.legalDocs.en} docs · ${N.legalSources.en} sources · ${N.legalJurs.en} jurisdictions`,
  },
  homeGeneralCardCta: {
    fr: "Ouvrir l'Atlas",
    en: "Open Atlas",
  },
  homeSharedTitle: {
    fr: "Les trois atlas partagent la même API",
    en: "All three atlases share the same API",
  },
  homeSharedBody: {
    fr: "Une seule clé, une seule documentation, un seul SLA. Les endpoints couvrent le catalogue général, la conformité produit et la douane / HS code, accessibles depuis votre produit, vos pipelines de veille ou vos agents IA.",
    en: "One key, one documentation, one SLA. Endpoints cover the general catalog, product compliance and customs / HS code, accessible from your product, monitoring pipelines or AI agents.",
  },
  homeSharedCta: { fr: "Voir la doc API", en: "Read the API docs" },
  homeFooterTagline: {
    fr: "Cartographie publique des sources de données juridiques — Cleo Comply",
    en: "Public map of legal data sources — Cleo Comply",
  },
  noResults: { fr: "Aucune source ne correspond aux filtres.", en: "No source matches the filters." },
  resultCount: {
    fr: (n: number) => `${n.toLocaleString("fr-FR")} source${n > 1 ? "s" : ""}`,
    en: (n: number) => `${n.toLocaleString("en-US")} source${n !== 1 ? "s" : ""}`,
  },
  sourceColumn: { fr: "Source", en: "Source" },
  countryColumn: { fr: "Juridiction", en: "Jurisdiction" },
  statusColumn: { fr: "Statut", en: "Status" },
  typesColumn: { fr: "Types", en: "Types" },
  visit: { fr: "Voir le portail", en: "Visit portal" },
  inThisJurisdiction: { fr: "Sources dans cette juridiction", en: "Sources in this jurisdiction" },
  closeDrawer: { fr: "Fermer", en: "Close" },
  completion: { fr: "Couverture", en: "Coverage" },
  legend: { fr: "Légende", en: "Legend" },
  exhaustiveList: { fr: "Liste exhaustive", en: "Exhaustive list" },
  jurisdictionsHeader: { fr: "Toutes les juridictions", en: "All jurisdictions" },
  github: { fr: "Code des collecteurs", en: "Collector source code" },
  sourcesIn: {
    fr: (n: number) => `${n} source${n > 1 ? "s" : ""}`,
    en: (n: number) => `${n} source${n !== 1 ? "s" : ""}`,
  },
  notesHeading: { fr: "Notes du collecteur", en: "Collector notes" },
  blockedReason: { fr: "Raison du blocage", en: "Blocked reason" },
  authLabel: { fr: "Authentification", en: "Authentication" },
  priorityLabel: { fr: "Priorité", en: "Priority" },
  generatedAt: { fr: "Données du", en: "Data as of" },
  filtersHeader: { fr: "Filtres", en: "Filters" },
  resetFilters: { fr: "Réinitialiser", en: "Reset" },

  /* ── Pricing page ── */
  pricingPageNavHome: { fr: "Accueil", en: "Home" },
  pricingPageNavAtlas: { fr: "Atlas", en: "Atlas" },
  pricingPageNavDocs: { fr: "Docs", en: "Docs" },
  pricingPageNavPricing: { fr: "Tarifs", en: "Pricing" },
  pricingPageNavGetKey: { fr: "Obtenir une clé", en: "Get API key" },

  pricingHeroTitle: {
    fr: "Tarification simple et transparente.",
    en: "Simple, transparent pricing.",
  },
  pricingHeroSubtitle: {
    fr: "Vous ne payez que ce que vous consommez. Aucun frais caché. Résiliation à tout moment.",
    en: "Pay only for what you use. No hidden fees. Cancel anytime.",
  },
  pricingBillingMonthly: { fr: "Mensuel", en: "Monthly" },
  pricingBillingYearly: { fr: "Annuel", en: "Yearly" },
  pricingYearlySaveBadge: { fr: "−20%", en: "−20%" },
  pricingPerMonth: { fr: "/mois", en: "/month" },
  pricingBilledYearly: {
    fr: "facturé annuellement",
    en: "billed yearly",
  },

  pricingTabProduct: {
    fr: "Product Compliance API",
    en: "Product Compliance API",
  },
  pricingTabLegal: { fr: "Legal Data API", en: "Legal Data API" },

  pricingPopular: { fr: "Le plus populaire", en: "Most popular" },
  pricingFree: { fr: "Gratuit", en: "Free" },
  pricingCustomPrice: { fr: "Sur devis", en: "Custom" },

  /* Product Compliance plans (Free/Starter tier replaced by /playground) */
  pricingProductLightName: { fr: "Light", en: "Light" },
  pricingProductLightTagline: {
    fr: "Pour PME, agents IA, MVP en production.",
    en: "For SMEs, AI agents, early-stage production.",
  },
  pricingProductLightCta: { fr: "Choisir Light", en: "Get Light" },

  pricingProductProName: { fr: "Pro", en: "Pro" },
  pricingProductProTagline: {
    fr: "Pour scale-ups e-commerce, marketplaces, vendors RegTech.",
    en: "For e-commerce scale-ups, marketplaces, RegTech vendors.",
  },
  pricingProductProCta: { fr: "Choisir Pro", en: "Get Pro" },

  pricingProductBusinessName: { fr: "Business", en: "Business" },
  pricingProductBusinessTagline: {
    fr: "Pour retailers multi-pays, ERP, équipes conformité.",
    en: "For multi-country retailers, ERP, compliance teams.",
  },
  pricingProductBusinessCta: { fr: "Choisir Business", en: "Get Business" },

  pricingProductEnterpriseName: { fr: "Enterprise", en: "Enterprise" },
  pricingProductEnterpriseTagline: {
    fr: "Pour groupes industriels, big retail, agences globales.",
    en: "For industrial groups, big retail, global agencies.",
  },
  pricingProductEnterpriseCta: { fr: "Contacter le commercial", en: "Contact sales" },

  /* Legal Data plans (Free tier replaced by /playground) */
  pricingLegalLightName: { fr: "Light", en: "Light" },
  pricingLegalLightTagline: {
    fr: "Pour PME, agents IA, MVP en production.",
    en: "For SMEs, AI agents, early-stage production.",
  },
  pricingLegalLightCta: { fr: "Choisir Light", en: "Get Light" },

  pricingLegalProName: { fr: "Pro", en: "Pro" },
  pricingLegalProTagline: {
    fr: "Pour SaaS legal-tech, cabinets, agents IA.",
    en: "For legal-tech SaaS, law firms, AI agents.",
  },
  pricingLegalProCta: { fr: "Choisir Pro", en: "Get Pro" },

  pricingLegalBusinessName: { fr: "Business", en: "Business" },
  pricingLegalBusinessTagline: {
    fr: "Pour grands cabinets, RegTech, plateformes IA.",
    en: "For large law firms, RegTech, AI platforms.",
  },
  pricingLegalBusinessCta: { fr: "Choisir Business", en: "Get Business" },

  pricingLegalEnterpriseName: { fr: "Enterprise", en: "Enterprise" },
  pricingLegalEnterpriseTagline: {
    fr: "Pour banques, Big 4, AI labs, agences réglementaires.",
    en: "For banks, Big 4, AI labs, regulatory agencies.",
  },
  pricingLegalEnterpriseCta: { fr: "Contacter le commercial", en: "Contact sales" },

  /* Compare section */
  pricingCompareHeader: {
    fr: "Comparer les plans en détail",
    en: "Compare plans in detail",
  },
  pricingCompareSubtitle: {
    fr: "Toutes les fonctionnalités, sans surprise.",
    en: "Every feature, side by side. No surprises.",
  },
  pricingCompareFeature: { fr: "Fonctionnalité", en: "Feature" },
  pricingCompareIncluded: { fr: "Inclus", en: "Included" },
  pricingCompareExcluded: { fr: "Non inclus", en: "Not included" },

  /* FAQ */
  pricingFaqHeader: { fr: "Questions fréquentes", en: "Frequently asked questions" },
  pricingFaqSubtitle: {
    fr: "Tout ce que vous voulez savoir avant de signer.",
    en: "Everything you want to know before signing.",
  },

  /* Footer text */
  pricingFooterTagline: {
    fr: "Tarification claire pour Product Compliance API et Legal Data API — Cleo Comply.",
    en: "Clear pricing for Product Compliance API and Legal Data API — Cleo Comply.",
  },
} as const;

export function t(lang: Lang, key: keyof typeof STRINGS): string {
  const v = STRINGS[key];
  if (typeof v === "object" && "fr" in v && typeof v.fr === "string") {
    return v[lang];
  }
  return String(key);
}

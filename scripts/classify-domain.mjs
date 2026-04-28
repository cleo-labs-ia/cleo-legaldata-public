// Heuristic domain classification — tags a source from its id, name and notes.
// Returns an array of domain codes; empty array means uncategorised generalist.

const MATCHERS = [
  {
    code: "ai",
    // Case-insensitive for full phrases, case-sensitive for bare TLAs to avoid
    // matching "ai" inside words (italaw, …).
    re: [
      /\b(ai office|ai act|ai safety institute|ai authority|ai regulation|ai governance|artificial intelligence|machine learning|automated decision|generative ai|foundation model|algorithmic accountability)\b/i,
      /\bAI\b/,
    ],
  },
  {
    code: "data_protection",
    re: /\b(data protection|datenschutz|privacy|cnil|gdpr|rgpd|aepd|garante|personal data|données? personn|protection des données|tietosuoja|datatilsyn|dpa\b|edpb|ico\b)/i,
  },
  {
    code: "cyber",
    re: /\b(cyber|enisa|anssi|cybersecurity|nis2?|cisa|ncsc|computer emergency)/i,
  },
  {
    code: "health",
    re: /\b(health|medical|medicines?|drugs?|pharmac\w*|hospital|clinical|medicine|biotech|anvisa|santé|gesundheit|salud|saúde|gezondheid|sanità|sundhed)\b|\b(EMA|FDA|MHRA|ANSM|HHS|HSE|BfArM)\b/i,
  },
  {
    code: "safety",
    re: /\b(safety|occupational|workplace health|product safety|food safety|aviation safety|maritime safety|nuclear safety|inrs|sécurité au travail|arbeitsschutz|sicurezza sul lavoro)\b|\b(OSHA|HSE|EFSA|EASA|EMSA|ENSREG)\b/i,
  },
  {
    code: "labor",
    re: /\b(labor|labour|employment|travail|emploi|trade union|arbeitsrecht|industrial relation|workforce)/i,
  },
  {
    code: "finance",
    re: /\b(financial|banking|central bank|securit(y|ies) (commission|exchange)|sec\b|fca\b|amf\b|esma|eba\b|eiopa|finma|bafin|consob|cnmv|aml|anti.money|fintech|insurance|pension|capital markets|bourse)/i,
  },
  {
    code: "environment",
    re: /\b(environment|environmental|climate|epa\b|umwelt|écolog|naturschutz|sustainab|emission|chemical|reach)/i,
  },
  {
    code: "competition",
    re: /\b(competition|antitrust|konkurrans|konkurren|wettbewerb|autorité de la concurrence|cma\b|ftc\b|cade\b|cofece)/i,
  },
  {
    code: "tax",
    re: /\b(tax|skatte|impôt|impot|fiscal|revenue|customs|hmrc|irs\b|douane)/i,
  },
  {
    code: "consumer",
    re: /\b(consumer|consommateur|verbraucher|trading standards|product safety)/i,
  },
  {
    code: "ip",
    re: /\b(intellectual property|patent|trademark|copyright|propriété intellectuelle|inpi|epo\b|wipo|uspto|ohim|euipo)/i,
  },
  {
    code: "telecom",
    re: /\b(telecom|telecommunication|broadcasting|media authority|arcep|ofcom|fcc\b|bnetza|ofcom)/i,
  },
];

const GENERALIST_RE =
  /\b(official gazette|gazette|moniteur|bulletin officiel|consolidated|code (civil|pénal|du travail|de commerce)|legislation portal|legifrance|bundesgesetzblatt|gesetze im internet|normattiva|boe\b|staatsblad|riigi teataja|monitorul oficial|gazzetta|diário|journal officiel|federal register|congress|parlement|parliament|senado|bundestag|bundesrat|assemblee|asamblea|riksdag|cour de cassation|supreme court|cour constitutionnelle|cour suprême|conseil constitutionnel|conseil d'état|conseil detat|conseil d'etat|verfassungsgericht|tribunal constituc|hudoc|curia|cjeu|tribunal supremo|hoge raad|kassationshof)/i;

function matches(re, hay) {
  if (Array.isArray(re)) return re.some((r) => r.test(hay));
  return re.test(hay);
}

export function classifyDomains(source) {
  // Match only against id + name. Notes often describe access restrictions
  // ("robots.txt blocks AI crawlers", "anti-AI ToU") which are not the domain
  // of the source itself and would inject false positives.
  const haystack = [source.id, source.name].filter(Boolean).join(" — ");
  const tags = new Set();
  for (const { code, re } of MATCHERS) {
    if (matches(re, haystack)) tags.add(code);
  }
  if (tags.size === 0 && GENERALIST_RE.test(haystack)) tags.add("generalist");
  return [...tags];
}

export const DOMAIN_CODES = [
  "ai",
  "data_protection",
  "cyber",
  "health",
  "safety",
  "labor",
  "finance",
  "environment",
  "competition",
  "tax",
  "consumer",
  "ip",
  "telecom",
  "generalist",
];

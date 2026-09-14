import { expandTokens, normalizeText, tokenize } from "./synonyms.ts";

export type RankableFaq = {
  id?: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
};

export type RankedFaq<T extends RankableFaq> = {
  faq: T;
  score: number;
};

/** Below this, we treat the knowledge base as missing an answer. */
export const MATCH_THRESHOLD = 0.28;

const GENERIC_TOKENS = new Set([
  "hotel",
  "guest",
  "guests",
  "property",
  "meridian",
  "casino",
  "resort",
  "help",
  "need",
  "want",
  "looking",
  "available",
  "offer",
  "offers",
  "room",
  "rooms",
  "weekend",
  "today",
  "tonight",
  "tomorrow",
]);

export function scoreFaq(query: string, faq: RankableFaq, idf?: Map<string, number>, docCount = 1): number {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return 0;
  }

  const expandedQuery = expandTokens(queryTokens);
  const originalQuery = new Set(queryTokens);
  const questionTokens = new Set(tokenize(faq.question));
  const answerTokens = new Set(tokenize(faq.answer));
  const tagTokens = new Set(faq.tags.flatMap((tag) => tokenize(tag)));
  const haystack = new Set([...questionTokens, ...answerTokens, ...tagTokens]);

  let matchedWeight = 0;
  let totalWeight = 0;
  for (const token of expandedQuery) {
    const weight = tokenWeight(token, idf, docCount);
    totalWeight += weight;
    if (haystack.has(token)) {
      matchedWeight += weight;
    }
  }

  const coverage = totalWeight === 0 ? 0 : matchedWeight / totalWeight;
  const distinctive = [...originalQuery].filter((token) => !GENERIC_TOKENS.has(token));
  const distinctiveCoverage =
    distinctive.length === 0
      ? 0
      : distinctive.filter((token) => tokenMatches(token, haystack)).length / distinctive.length;

  const rarest = distinctive
    .slice()
    .sort((a, b) => tokenWeight(b, idf, docCount) - tokenWeight(a, idf, docCount))[0];
  if (rarest && !tokenMatches(rarest, haystack)) {
    return 0;
  }

  if (distinctive.length > 0 && distinctiveCoverage === 0) {
    return 0;
  }

  const questionCoverage = weightedOverlap(expandedQuery, questionTokens, idf, docCount);
  const tagCoverage = weightedOverlap(expandedQuery, tagTokens, idf, docCount);
  const phraseBonus = distinctivePhraseBonus(normalizeText(query), normalizeText(faq.question));
  const categoryHint = categoryBoost(expandedQuery, faq.category);

  return (
    coverage * 0.5 + distinctiveCoverage * 0.25 + questionCoverage * 0.12 + tagCoverage * 0.08 + phraseBonus + categoryHint
  );
}

export function rankFaqs<T extends RankableFaq>(query: string, faqs: T[]): RankedFaq<T>[] {
  const idf = buildIdf(faqs);
  return faqs
    .map((faq) => ({ faq, score: scoreFaq(query, faq, idf, faqs.length) }))
    .sort((a, b) => b.score - a.score);
}

export function bestMatch<T extends RankableFaq>(
  query: string,
  faqs: T[],
  threshold = MATCH_THRESHOLD,
): { matched: boolean; match: RankedFaq<T> | null; alternatives: RankedFaq<T>[] } {
  const ranked = rankFaqs(query, faqs);
  const top = ranked[0];
  const alternatives = ranked.slice(1, 4).filter((item) => item.score >= threshold * 0.75);

  if (!top || top.score < threshold) {
    return { matched: false, match: null, alternatives };
  }

  return { matched: true, match: top, alternatives };
}

function buildIdf(faqs: RankableFaq[]): Map<string, number> {
  const df = new Map<string, number>();
  for (const faq of faqs) {
    const tokens = new Set([
      ...tokenize(faq.question),
      ...tokenize(faq.answer),
      ...faq.tags.flatMap((tag) => tokenize(tag)),
    ]);
    for (const token of tokens) {
      df.set(token, (df.get(token) ?? 0) + 1);
    }
  }

  const idf = new Map<string, number>();
  const n = faqs.length || 1;
  for (const [token, count] of df) {
    idf.set(token, Math.log((n + 1) / (count + 1)) + 0.6);
  }
  return idf;
}

function tokenWeight(token: string, idf: Map<string, number> | undefined, docCount: number): number {
  if (GENERIC_TOKENS.has(token)) {
    return 0.12;
  }
  if (!idf) {
    return 1;
  }
  return idf.get(token) ?? Math.log((docCount + 1) / 1) + 0.6;
}

function weightedOverlap(
  query: Set<string>,
  doc: Set<string>,
  idf: Map<string, number> | undefined,
  docCount: number,
): number {
  if (query.size === 0 || doc.size === 0) {
    return 0;
  }
  let matched = 0;
  let total = 0;
  for (const token of query) {
    const weight = tokenWeight(token, idf, docCount);
    total += weight;
    if (doc.has(token)) {
      matched += weight;
    }
  }
  return total === 0 ? 0 : matched / total;
}

function tokenMatches(token: string, haystack: Set<string>): boolean {
  if (haystack.has(token)) {
    return true;
  }
  for (const extra of expandTokens([token])) {
    if (haystack.has(extra)) {
      return true;
    }
  }
  return false;
}

function distinctivePhraseBonus(query: string, question: string): number {
  if (question.includes(query) || query.includes(question)) {
    return 0.3;
  }
  const parts = query.split(" ").filter((part) => part.length > 4 && !GENERIC_TOKENS.has(part));
  return parts.some((part) => question.includes(part)) ? 0.12 : 0;
}

function categoryBoost(queryTokens: Set<string>, category: string): number {
  const hints: Record<string, string[]> = {
    dining: ["restaurant", "dinner", "eat", "food", "cuisine", "michelin", "aurelia"],
    gaming: ["poker", "blackjack", "slots", "casino", "roulette", "craps", "baccarat"],
    partners: ["nearby", "partner", "outside", "close", "discount", "roomkey"],
    events: ["propose", "wedding", "birthday", "anniversary", "celebrate", "bachelor"],
    accommodations: ["suite", "checkin", "checkout", "villa"],
    amenities: ["spa", "pool", "fitness", "gym", "theater"],
    bars: ["bar", "lounge", "whiskey", "cocktail", "eclipse"],
    general: ["hours", "parking", "wifi", "dress", "checkin", "valet"],
  };

  const needles = hints[category] ?? [];
  return needles.some((needle) => queryTokens.has(needle)) ? 0.05 : 0;
}

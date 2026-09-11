export const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "at",
  "be",
  "can",
  "do",
  "does",
  "for",
  "from",
  "have",
  "how",
  "i",
  "in",
  "is",
  "it",
  "me",
  "my",
  "of",
  "on",
  "or",
  "our",
  "the",
  "this",
  "to",
  "we",
  "what",
  "whats",
  "when",
  "where",
  "which",
  "who",
  "will",
  "with",
  "you",
  "your",
  "there",
  "any",
  "some",
  "please",
  "good",
  "great",
  "nice",
  "really",
  "just",
  "also",
]);

/** Guest phrasing → knowledge-base language. */
export const SYNONYMS: Record<string, string[]> = {
  open: ["hours", "opening", "operating", "available", "now", "late", "tonight"],
  hours: ["open", "opening", "operating", "schedule"],
  poker: ["hold'em", "holdem", "omaha", "stud", "cards", "tournament"],
  restaurant: ["dining", "dinner", "eat", "food", "cuisine"],
  best: ["finest", "signature", "top", "nicest", "michelin", "recommend"],
  nearby: ["close", "around", "partner", "outside", "offsite", "walking"],
  recommend: ["suggestion", "best", "nearby", "partner"],
  parking: ["valet", "car", "garage", "selfpark"],
  wifi: ["internet", "wireless", "wi-fi"],
  room: ["suite", "stay", "accommodation", "hotel"],
  checkin: ["arrival", "arrive"],
  checkout: ["depart", "leave", "departure"],
  spa: ["massage", "facial", "treatment"],
  pool: ["swim", "cabanas", "infinity"],
  nightclub: ["club", "nova", "nightlife", "party"],
  wedding: ["marry", "ceremony", "chapel"],
  propose: ["proposal", "engagement", "romantic", "girlfriend", "boyfriend", "celebrate", "anniversary"],
  girlfriend: ["propose", "proposal", "romantic", "celebration", "engagement"],
  boyfriend: ["propose", "proposal", "romantic", "celebration", "engagement"],
  celebration: ["birthday", "anniversary", "propose", "package"],
  discount: ["deal", "offer", "perk", "roomkey", "partner"],
  blackjack: ["21", "tables"],
  slots: ["machines", "jackpot", "reels"],
  sports: ["betting", "book", "odds"],
  dress: ["attire", "code", "formal", "casual"],
  age: ["21", "minors", "kids", "children", "family"],
  pet: ["dog", "cat", "animal"],
  dogs: ["pet", "animal"],
};

export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(value: string): string[] {
  return normalizeText(value)
    .split(" ")
    .map((token) => (token === "whats" ? "what" : token))
    .filter((token) => token.length > 1 && !STOPWORDS.has(token));
}

export function expandTokens(tokens: string[]): Set<string> {
  const expanded = new Set(tokens);
  for (const token of tokens) {
    const extras = SYNONYMS[token];
    if (extras) {
      for (const extra of extras) {
        expanded.add(normalizeText(extra).replace(/\s+/g, ""));
        for (const piece of tokenize(extra)) {
          expanded.add(piece);
        }
      }
    }
  }
  return expanded;
}

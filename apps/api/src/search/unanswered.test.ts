import { describe, expect, it } from "vitest";
import { SEED_FAQS } from "../db/seed-data.ts";
import { bestMatch } from "./rank.ts";
import { normalizeText } from "./synonyms.ts";

describe("unanswered capture heuristics", () => {
  it("normalizes equivalent guest questions to the same key", () => {
    expect(normalizeText("Can I bring my dog to the hotel?")).toBe(
      normalizeText("can i bring my dog to the hotel"),
    );
  });

  it("leaves unknown topics unmatched so they can be recorded", () => {
    const unknown = ["Are you pet friendly?", "Do you have a kids club?", "Can I smoke in the room?"];
    for (const query of unknown) {
      expect(bestMatch(query, SEED_FAQS).matched).toBe(false);
    }
  });
});

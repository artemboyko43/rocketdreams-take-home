import { describe, expect, it } from "vitest";
import { FaqCategorySchema } from "@meridian/shared";
import { SEED_FAQS } from "./seed-data.ts";

describe("Meridian seed corpus", () => {
  it("covers every FAQ category from the shared contract", () => {
    const categories = new Set(SEED_FAQS.map((faq) => faq.category));
    expect([...FaqCategorySchema.options].every((category) => categories.has(category))).toBe(true);
  });

  it("includes answers for the five PRD example conversations", () => {
    const blob = SEED_FAQS.map((faq) => `${faq.question} ${faq.answer} ${faq.tags.join(" ")}`).join("\n");
    expect(blob).toMatch(/poker room is open 24 hours/i);
    expect(blob).toMatch(/Aurelia/);
    expect(blob).toMatch(/Carbone/);
    expect(blob).toMatch(/Celebration packages start at \$500/);
    expect(blob.toLowerCase()).not.toMatch(/pet policy|pet-friendly|dogs welcome/);
  });

  it("keeps each FAQ tagged for later natural-language matching", () => {
    expect(SEED_FAQS.every((faq) => faq.tags.length > 0)).toBe(true);
    expect(SEED_FAQS.length).toBeGreaterThanOrEqual(50);
  });
});

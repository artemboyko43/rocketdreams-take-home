import { describe, expect, it } from "vitest";
import { SEED_FAQS } from "../db/seed-data.ts";
import { bestMatch, scoreFaq } from "./rank.ts";

describe("FAQ ranking", () => {
  it("answers whether the poker room is open", () => {
    const result = bestMatch("Is the poker room open right now?", SEED_FAQS);
    expect(result.matched).toBe(true);
    expect(result.match?.faq.question.toLowerCase()).toMatch(/poker/);
    expect(result.match?.faq.answer.toLowerCase()).toMatch(/24/);
  });

  it("recommends Aurelia as the signature restaurant", () => {
    const result = bestMatch("What's your best restaurant?", SEED_FAQS);
    expect(result.matched).toBe(true);
    expect(result.match?.faq.answer).toMatch(/Aurelia/);
  });

  it("does not invent a pet policy", () => {
    const result = bestMatch("Can I bring my dog to the hotel?", SEED_FAQS);
    expect(result.matched).toBe(false);
  });

  it("surfaces the Carbone partner discount for nearby dining", () => {
    const result = bestMatch("Are there any good restaurants nearby you'd recommend?", SEED_FAQS);
    expect(result.matched).toBe(true);
    expect(result.match?.faq.answer).toMatch(/Carbone/);
  });

  it("helps with a weekend proposal using celebration packages", () => {
    const result = bestMatch("I want to propose to my girlfriend this weekend. Can you help?", SEED_FAQS);
    expect(result.matched).toBe(true);
    expect(result.match?.faq.answer.toLowerCase()).toMatch(/celebration|eclipse|propose/);
  });

  it("scores a close paraphrase above an unrelated FAQ", () => {
    const poker = SEED_FAQS.find((faq) => faq.question.includes("poker room open"));
    const wifi = SEED_FAQS.find((faq) => faq.question.toLowerCase().includes("wi-fi"));
    expect(poker && wifi).toBeTruthy();
    if (!poker || !wifi) {
      return;
    }
    expect(scoreFaq("is poker running overnight", poker)).toBeGreaterThan(
      scoreFaq("is poker running overnight", wifi),
    );
  });
});

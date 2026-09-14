import { describe, expect, it } from "vitest";
import { shouldCaptureGuestQuestion } from "./capture.ts";

describe("shouldCaptureGuestQuestion", () => {
  it("captures unknown policy questions", () => {
    expect(shouldCaptureGuestQuestion("Can I smoke in the room?")).toBe(true);
    expect(shouldCaptureGuestQuestion("Are you pet friendly?")).toBe(true);
    expect(shouldCaptureGuestQuestion("Do you have a kids club?")).toBe(true);
  });

  it("skips greetings and tiny utterances", () => {
    expect(shouldCaptureGuestQuestion("Hello")).toBe(false);
    expect(shouldCaptureGuestQuestion("Thank you")).toBe(false);
    expect(shouldCaptureGuestQuestion("Good morning")).toBe(false);
  });
});

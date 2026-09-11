import { describe, expect, it } from "vitest";
import { VoiceIdSchema } from "./schemas.ts";
import { VOICE_IDS, VOICES, getVoice } from "./voices.ts";

describe("voice catalog", () => {
  it("exposes four branded concierge voices", () => {
    expect(VOICE_IDS).toEqual(["james", "sofia", "marcus", "elena"]);
    expect(VOICES.map((voice) => voice.id)).toEqual([...VOICE_IDS]);
  });

  it("maps each voice to a distinct OpenAI TTS id and an Inference voice", () => {
    expect(new Set(VOICES.map((voice) => voice.ttsVoice))).toEqual(
      new Set(["ash", "coral", "echo", "sage"]),
    );
    expect(new Set(VOICES.map((voice) => voice.inferenceVoice)).size).toBe(4);
  });

  it("falls back to James for an unknown id", () => {
    expect(getVoice("unknown").id).toBe("james");
    expect(VoiceIdSchema.parse("sofia")).toBe("sofia");
  });
});

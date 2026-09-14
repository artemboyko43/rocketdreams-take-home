import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { SelectVoiceSchema, VOICES, getVoice } from "@meridian/shared";
import OpenAI from "openai";
import { db } from "../db/client.ts";
import { settings } from "../db/schema.ts";

async function getActiveVoiceId() {
  const [row] = await db.select().from(settings).where(eq(settings.id, 1));
  return row?.activeVoiceId ?? "james";
}

export async function registerVoiceRoutes(app: FastifyInstance) {
  app.get("/api/voices", async () => {
    const activeVoiceId = await getActiveVoiceId();
    return {
      activeVoiceId,
      items: VOICES.map((voice) => ({
        ...voice,
        active: voice.id === activeVoiceId,
      })),
    };
  });

  app.put("/api/voices/active", async (request, reply) => {
    const { voiceId } = SelectVoiceSchema.parse(request.body);
    const [row] = await db
      .update(settings)
      .set({ activeVoiceId: voiceId, updatedAt: new Date() })
      .where(eq(settings.id, 1))
      .returning();
    if (!row) {
      return reply.code(500).send({ error: "Voice setting is missing" });
    }
    return { voiceId: row.activeVoiceId, updatedAt: row.updatedAt.toISOString() };
  });

  app.post("/api/voices/:id/preview", async (request, reply) => {
    const { id } = request.params as { id: string };
    const voice = getVoice(id);
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return reply.code(503).send({ error: "OPENAI_API_KEY is not configured" });
    }

    const client = new OpenAI({
      apiKey,
      baseURL: process.env.OPENAI_BASE_URL,
    });
    const speech = await client.audio.speech.create({
      model: process.env.OPENAI_TTS_MODEL ?? "gpt-4o-mini-tts",
      voice: voice.ttsVoice as "ash",
      instructions: voice.instructions,
      input: voice.previewLine,
    });
    const buffer = Buffer.from(await speech.arrayBuffer());
    return reply
      .header("Content-Type", "audio/mpeg")
      .header("Cache-Control", "no-store")
      .send(buffer);
  });
}

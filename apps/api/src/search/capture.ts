import { eq } from "drizzle-orm";
import { db } from "../db/client.ts";
import { unansweredQuestions } from "../db/schema.ts";
import { normalizeText } from "./synonyms.ts";

const RECENT_MS = 20_000;

export async function upsertUnanswered(question: string) {
  const normalizedQuestion = normalizeText(question);
  if (!normalizedQuestion) {
    return null;
  }

  const [existing] = await db
    .select()
    .from(unansweredQuestions)
    .where(eq(unansweredQuestions.normalizedQuestion, normalizedQuestion))
    .limit(1);

  if (existing) {
    const recent = Date.now() - existing.lastAskedAt.getTime() < RECENT_MS;
    if (recent && existing.status === "open") {
      return existing;
    }

    const [updated] = await db
      .update(unansweredQuestions)
      .set({
        frequency: recent ? existing.frequency : existing.frequency + 1,
        lastAskedAt: new Date(),
        status: existing.status === "converted" ? existing.status : "open",
      })
      .where(eq(unansweredQuestions.id, existing.id))
      .returning();
    return updated ?? null;
  }

  const [created] = await db
    .insert(unansweredQuestions)
    .values({ question, normalizedQuestion })
    .returning();
  return created ?? null;
}

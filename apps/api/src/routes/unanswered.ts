import { desc, eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { ConvertUnansweredSchema, RecordUnansweredSchema } from "@meridian/shared";
import { db } from "../db/client.ts";
import { faqs, unansweredQuestions } from "../db/schema.ts";
import { serializeFaq } from "../db/serialize.ts";
import { normalizeText } from "../search/synonyms.ts";

function serializeUnanswered(row: typeof unansweredQuestions.$inferSelect) {
  return {
    id: row.id,
    question: row.question,
    normalizedQuestion: row.normalizedQuestion,
    frequency: row.frequency,
    status: row.status,
    convertedFaqId: row.convertedFaqId,
    firstAskedAt: row.firstAskedAt.toISOString(),
    lastAskedAt: row.lastAskedAt.toISOString(),
  };
}

export async function registerUnansweredRoutes(app: FastifyInstance) {
  app.get("/api/unanswered", async (request) => {
    const { status } = (request.query as { status?: string }) ?? {};
    const rows = status
      ? await db
          .select()
          .from(unansweredQuestions)
          .where(eq(unansweredQuestions.status, status))
          .orderBy(desc(unansweredQuestions.frequency), desc(unansweredQuestions.lastAskedAt))
      : await db
          .select()
          .from(unansweredQuestions)
          .orderBy(desc(unansweredQuestions.frequency), desc(unansweredQuestions.lastAskedAt));
    return { items: rows.map(serializeUnanswered) };
  });

  app.post("/api/unanswered", async (request, reply) => {
    const { question } = RecordUnansweredSchema.parse(request.body);
    const normalizedQuestion = normalizeText(question);
    if (!normalizedQuestion) {
      return reply.code(400).send({ error: "Question is empty after normalization" });
    }

    const [existing] = await db
      .select()
      .from(unansweredQuestions)
      .where(eq(unansweredQuestions.normalizedQuestion, normalizedQuestion))
      .limit(1);

    if (existing) {
      const [updated] = await db
        .update(unansweredQuestions)
        .set({
          frequency: existing.frequency + 1,
          lastAskedAt: new Date(),
          status: existing.status === "dismissed" ? "open" : existing.status,
        })
        .where(eq(unansweredQuestions.id, existing.id))
        .returning();
      if (!updated) {
        return reply.code(500).send({ error: "Failed to update unanswered question" });
      }
      return serializeUnanswered(updated);
    }

    const [created] = await db
      .insert(unansweredQuestions)
      .values({ question, normalizedQuestion })
      .returning();
    if (!created) {
      return reply.code(500).send({ error: "Failed to record unanswered question" });
    }
    return reply.code(201).send(serializeUnanswered(created));
  });

  app.post("/api/unanswered/:id/convert", async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = ConvertUnansweredSchema.parse(request.body);
    const [item] = await db.select().from(unansweredQuestions).where(eq(unansweredQuestions.id, id));
    if (!item) {
      return reply.code(404).send({ error: "Unanswered question not found" });
    }

    const [faq] = await db
      .insert(faqs)
      .values({
        category: body.category,
        question: item.question,
        answer: body.answer,
        tags: body.tags,
      })
      .returning();
    if (!faq) {
      return reply.code(500).send({ error: "Failed to create FAQ" });
    }

    const [updated] = await db
      .update(unansweredQuestions)
      .set({ status: "converted", convertedFaqId: faq.id })
      .where(eq(unansweredQuestions.id, id))
      .returning();
    if (!updated) {
      return reply.code(500).send({ error: "Failed to convert unanswered question" });
    }

    return { unanswered: serializeUnanswered(updated), faq: serializeFaq(faq) };
  });

  app.post("/api/unanswered/:id/dismiss", async (request, reply) => {
    const { id } = request.params as { id: string };
    const [updated] = await db
      .update(unansweredQuestions)
      .set({ status: "dismissed" })
      .where(eq(unansweredQuestions.id, id))
      .returning();
    if (!updated) {
      return reply.code(404).send({ error: "Unanswered question not found" });
    }
    return serializeUnanswered(updated);
  });
}

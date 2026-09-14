import { desc, eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { FaqInputSchema, FaqUpdateSchema, SearchRequestSchema, shouldCaptureGuestQuestion } from "@meridian/shared";
import { db } from "../db/client.ts";
import { faqs } from "../db/schema.ts";
import { serializeFaq } from "../db/serialize.ts";
import { upsertUnanswered } from "../search/capture.ts";
import { bestMatch } from "../search/rank.ts";

export async function registerFaqRoutes(app: FastifyInstance) {
  app.get("/api/faqs", async () => {
    const rows = await db.select().from(faqs).orderBy(faqs.category, faqs.question);
    return { items: rows.map(serializeFaq) };
  });

  app.post("/api/faqs", async (request, reply) => {
    const body = FaqInputSchema.parse(request.body);
    const [row] = await db.insert(faqs).values(body).returning();
    if (!row) {
      return reply.code(500).send({ error: "Failed to create FAQ" });
    }
    return reply.code(201).send(serializeFaq(row));
  });

  app.patch("/api/faqs/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = FaqUpdateSchema.parse(request.body);
    const [row] = await db
      .update(faqs)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(faqs.id, id))
      .returning();
    if (!row) {
      return reply.code(404).send({ error: "FAQ not found" });
    }
    return serializeFaq(row);
  });

  app.delete("/api/faqs/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const deleted = await db.delete(faqs).where(eq(faqs.id, id)).returning({ id: faqs.id });
    if (deleted.length === 0) {
      return reply.code(404).send({ error: "FAQ not found" });
    }
    return reply.code(204).send();
  });

  app.post("/api/faqs/search", async (request) => {
    const { query, captureUnanswered } = SearchRequestSchema.parse(request.body);
    const rows = await db.select().from(faqs);
    const result = bestMatch(query, rows.map(serializeFaq));
    if (!result.matched && captureUnanswered && shouldCaptureGuestQuestion(query)) {
      await upsertUnanswered(query);
      request.log.info({ query }, "Captured unanswered question");
    }
    return {
      matched: result.matched,
      query,
      match: result.match,
      alternatives: result.alternatives,
    };
  });

  app.get("/api/faqs/recent", async () => {
    const rows = await db.select().from(faqs).orderBy(desc(faqs.updatedAt)).limit(8);
    return { items: rows.map(serializeFaq) };
  });
}

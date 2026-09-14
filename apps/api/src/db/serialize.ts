import type { Faq } from "@meridian/shared";
import type { FaqRow } from "./schema.ts";

export function serializeFaq(row: FaqRow): Faq {
  return {
    id: row.id,
    category: row.category as Faq["category"],
    question: row.question,
    answer: row.answer,
    tags: row.tags ?? [],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

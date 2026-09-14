import { count } from "drizzle-orm";
import { db } from "./client.ts";
import { faqs } from "./schema.ts";
import { SEED_FAQS } from "./seed-data.ts";

export async function seed() {
  const rows = await db.select({ value: count() }).from(faqs);
  const value = rows[0]?.value ?? 0;
  if (Number(value) > 0) {
    return { inserted: 0, skipped: true };
  }

  await db.insert(faqs).values(SEED_FAQS);
  return { inserted: SEED_FAQS.length, skipped: false };
}

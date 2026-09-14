import { sql } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const faqs = pgTable("faqs", {
  id: uuid("id").primaryKey().defaultRandom(),
  category: text("category").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  tags: text("tags")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const unansweredQuestions = pgTable("unanswered_questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  question: text("question").notNull(),
  normalizedQuestion: text("normalized_question").notNull().unique(),
  frequency: integer("frequency").notNull().default(1),
  status: text("status").notNull().default("open"),
  convertedFaqId: uuid("converted_faq_id"),
  firstAskedAt: timestamp("first_asked_at", { withTimezone: true }).defaultNow().notNull(),
  lastAskedAt: timestamp("last_asked_at", { withTimezone: true }).defaultNow().notNull(),
});

export const settings = pgTable("settings", {
  id: integer("id").primaryKey().default(1),
  activeVoiceId: text("active_voice_id").notNull().default("james"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type FaqRow = typeof faqs.$inferSelect;
export type UnansweredRow = typeof unansweredQuestions.$inferSelect;

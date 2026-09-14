import { z } from "zod";
import { VOICE_IDS } from "./voices.ts";

export const VoiceIdSchema = z.enum(VOICE_IDS);

export const FaqCategorySchema = z.enum([
  "general",
  "gaming",
  "accommodations",
  "dining",
  "bars",
  "amenities",
  "events",
  "partners",
]);

export const FaqSchema = z.object({
  id: z.string().uuid(),
  category: FaqCategorySchema,
  question: z.string().min(4),
  answer: z.string().min(8),
  tags: z.array(z.string()).default([]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const FaqInputSchema = z.object({
  category: FaqCategorySchema,
  question: z.string().min(4).max(400),
  answer: z.string().min(8).max(4000),
  tags: z.array(z.string().min(1).max(40)).max(16).default([]),
});

export const FaqUpdateSchema = FaqInputSchema.partial();

export const SearchRequestSchema = z.object({
  query: z.string().min(2).max(500),
  captureUnanswered: z.boolean().optional(),
});

export const SearchMatchSchema = z.object({
  faq: FaqSchema,
  score: z.number(),
});

export const SearchResponseSchema = z.object({
  matched: z.boolean(),
  query: z.string(),
  match: SearchMatchSchema.nullable(),
  alternatives: z.array(SearchMatchSchema),
});

export const UnansweredStatusSchema = z.enum(["open", "converted", "dismissed"]);

export const UnansweredQuestionSchema = z.object({
  id: z.string().uuid(),
  question: z.string(),
  normalizedQuestion: z.string(),
  frequency: z.number().int().positive(),
  status: UnansweredStatusSchema,
  convertedFaqId: z.string().uuid().nullable(),
  firstAskedAt: z.string().datetime(),
  lastAskedAt: z.string().datetime(),
});

export const RecordUnansweredSchema = z.object({
  question: z.string().min(2).max(500),
});

export const ConvertUnansweredSchema = z.object({
  answer: z.string().min(8).max(4000),
  category: FaqCategorySchema,
  tags: z.array(z.string()).max(16).default([]),
});

export const ActiveVoiceSchema = z.object({
  voiceId: VoiceIdSchema,
  updatedAt: z.string().datetime(),
});

export const SelectVoiceSchema = z.object({
  voiceId: VoiceIdSchema,
});

export const LivekitTokenRequestSchema = z.object({
  roomName: z.string().min(1).max(128).optional(),
  participantName: z.string().min(1).max(64).optional(),
});

export const LivekitTokenResponseSchema = z.object({
  serverUrl: z.string(),
  participantToken: z.string(),
  roomName: z.string(),
  participantName: z.string(),
});

export type Faq = z.infer<typeof FaqSchema>;
export type FaqInput = z.infer<typeof FaqInputSchema>;
export type SearchRequest = z.infer<typeof SearchRequestSchema>;
export type SearchResponse = z.infer<typeof SearchResponseSchema>;
export type UnansweredQuestion = z.infer<typeof UnansweredQuestionSchema>;
export type FaqCategory = z.infer<typeof FaqCategorySchema>;

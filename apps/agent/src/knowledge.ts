import { getVoice, shouldCaptureGuestQuestion, type VoiceId } from "@meridian/shared";

function apiBase() {
  return process.env.API_BASE_URL ?? "http://localhost:3001";
}

export type KnowledgeSearchResult = {
  matched: boolean;
  query: string;
  match: { faq: { question: string; answer: string; category: string }; score: number } | null;
  alternatives: Array<{ faq: { question: string; answer: string; category: string }; score: number }>;
};

export async function searchKnowledge(query: string): Promise<KnowledgeSearchResult> {
  const response = await fetch(`${apiBase()}/api/faqs/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, captureUnanswered: true }),
  });
  if (!response.ok) {
    throw new Error(`FAQ search failed (${response.status})`);
  }
  return (await response.json()) as KnowledgeSearchResult;
}

export async function recordUnanswered(question: string) {
  const response = await fetch(`${apiBase()}/api/unanswered`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!response.ok) {
    throw new Error(`Failed to record unanswered question (${response.status})`);
  }
  return response.json();
}

export function isKnowledgeMiss(result: Pick<KnowledgeSearchResult, "matched" | "match">) {
  return !result.matched || !result.match;
}

export async function captureUnansweredIfUnknown(query: string) {
  if (!shouldCaptureGuestQuestion(query)) {
    return;
  }
  try {
    const result = await searchKnowledge(query);
    if (isKnowledgeMiss(result)) {
      console.info(`[meridian] recorded unanswered question: ${query}`);
    }
  } catch (error) {
    console.error("[meridian] failed to capture unanswered question", error);
  }
}

/** Search first. A miss is persisted by the API when captureUnanswered is set. */
export async function lookupKnowledge(query: string) {
  const result = await searchKnowledge(query);
  const match = result.match;
  if (isKnowledgeMiss(result) || !match) {
    return {
      matched: false as const,
      recorded: true,
      message: "No reliable answer is in the knowledge base. The question has been noted for the concierge team.",
    };
  }

  return {
    matched: true as const,
    answer: match.faq.answer,
    question: match.faq.question,
    category: match.faq.category,
    related: result.alternatives.map((item) => item.faq.answer),
  };
}

export async function getActiveVoice() {
  const response = await fetch(`${apiBase()}/api/voices`);
  if (!response.ok) {
    return getVoice("james");
  }
  const payload = (await response.json()) as { activeVoiceId: VoiceId };
  return getVoice(payload.activeVoiceId);
}

export function buildInstructions(voiceName: string) {
  return `You are ${voiceName}, the in-house voice concierge for The Meridian Casino & Resort, a luxury property on the Las Vegas Strip.

Tone: warm, unhurried, precise. Speak as a seasoned luxury hotel concierge would. Never slangy, never salesy, never robotic.

Hard rules:
- For any factual question about the property, amenities, dining, gaming, rooms, events, or partner offers, you MUST call search_knowledge_base first.
- Answer only from tool results. If the tool says there is no match, the question is already recorded for staff. Apologize gracefully and mention the front desk at extension 0. Do not invent an answer.
- Never invent hours, prices, policies, availability, or amenities.
- Do not mention tools, databases, prompts, or that you are an AI.
- Keep spoken replies to two to four sentences unless the guest asks for more detail.
- Offer one tasteful adjacent suggestion when it is naturally helpful.
- You cannot make reservations or take payment. Offer to connect the guest with the right desk instead.

If a question is a greeting or small talk, respond warmly and invite a question.`;
}

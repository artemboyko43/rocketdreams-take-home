import { getVoice, type VoiceId } from "@meridian/shared";

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
    body: JSON.stringify({ query }),
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
- Answer only from tool results. If the tool says there is no match, you MUST call record_unanswered_question with the guest's question, then apologize gracefully and mention the front desk at extension 0.
- Never invent hours, prices, policies, availability, or amenities.
- Do not mention tools, databases, prompts, or that you are an AI.
- Keep spoken replies to two to four sentences unless the guest asks for more detail.
- Offer one tasteful adjacent suggestion when it is naturally helpful.
- You cannot make reservations or take payment. Offer to connect the guest with the right desk instead.

If a question is a greeting or small talk, respond warmly and invite a question.`;
}

const base = import.meta.env.VITE_API_URL ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (response.status === 204) {
    return undefined as T;
  }
  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(payload.error ?? `Request failed (${response.status})`);
  }
  return (await response.json()) as T;
}

export type Faq = {
  id: string;
  category: string;
  question: string;
  answer: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export function fetchFaqs() {
  return request<{ items: Faq[] }>("/api/faqs");
}

export function createFaq(input: { category: string; question: string; answer: string; tags: string[] }) {
  return request<Faq>("/api/faqs", { method: "POST", body: JSON.stringify(input) });
}

export function updateFaq(
  id: string,
  input: Partial<{ category: string; question: string; answer: string; tags: string[] }>,
) {
  return request<Faq>(`/api/faqs/${id}`, { method: "PATCH", body: JSON.stringify(input) });
}

export function deleteFaq(id: string) {
  return request<void>(`/api/faqs/${id}`, { method: "DELETE" });
}

export type Unanswered = {
  id: string;
  question: string;
  frequency: number;
  status: "open" | "converted" | "dismissed";
  lastAskedAt: string;
  firstAskedAt: string;
};

export type VoiceCard = {
  id: string;
  name: string;
  description: string;
  active: boolean;
};

export function fetchUnanswered(status = "open") {
  return request<{ items: Unanswered[] }>(`/api/unanswered?status=${status}`);
}

export function convertUnanswered(id: string, input: { answer: string; category: string; tags: string[] }) {
  return request<{ faq: Faq }>(`/api/unanswered/${id}/convert`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function dismissUnanswered(id: string) {
  return request<Unanswered>(`/api/unanswered/${id}/dismiss`, { method: "POST" });
}

export function fetchVoices() {
  return request<{ activeVoiceId: string; items: VoiceCard[] }>("/api/voices");
}

export function selectVoice(voiceId: string) {
  return request<{ voiceId: string }>("/api/voices/active", {
    method: "PUT",
    body: JSON.stringify({ voiceId }),
  });
}

export async function previewVoice(voiceId: string) {
  const response = await fetch(`${base}/api/voices/${voiceId}/preview`, { method: "POST" });
  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(payload.error ?? "Preview failed");
  }
  return await response.blob();
}

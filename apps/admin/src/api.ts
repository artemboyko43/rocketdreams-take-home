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

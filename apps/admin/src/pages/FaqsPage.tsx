import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { createFaq, deleteFaq, fetchFaqs, updateFaq, type Faq } from "../api";
import styles from "./FaqsPage.module.css";

const categories = ["general", "gaming", "accommodations", "dining", "bars", "amenities", "events", "partners"];

const emptyForm = {
  category: "general",
  question: "",
  answer: "",
  tags: "",
};

export function FaqsPage() {
  const queryClient = useQueryClient();
  const faqs = useQuery({ queryKey: ["faqs"], queryFn: fetchFaqs });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [editing, setEditing] = useState<(typeof emptyForm & { id?: string }) | null>(null);

  const save = useMutation({
    mutationFn: async () => {
      if (!editing) {
        return;
      }
      const payload = {
        category: editing.category,
        question: editing.question,
        answer: editing.answer,
        tags: editing.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };
      if (editing.id) {
        return updateFaq(editing.id, payload);
      }
      return createFaq(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["faqs"] });
      setEditing(null);
    },
  });

  const remove = useMutation({
    mutationFn: deleteFaq,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["faqs"] }),
  });

  const items = useMemo(() => {
    return (faqs.data?.items ?? []).filter((faq) => {
      const matchesCategory = category === "all" || faq.category === category;
      const haystack = `${faq.question} ${faq.answer} ${faq.tags.join(" ")}`.toLowerCase();
      return matchesCategory && haystack.includes(search.toLowerCase());
    });
  }, [faqs.data, search, category]);

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h2>Knowledge base</h2>
          <p className={styles.muted}>{faqs.data?.items.length ?? 0} FAQ items the concierge can speak from.</p>
        </div>
        <button className={styles.primary} onClick={() => setEditing(emptyForm)}>
          Add FAQ
        </button>
      </header>

      <div className={styles.toolbar}>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search questions" />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {faqs.error ? <p className={styles.muted}>{(faqs.error as Error).message}</p> : null}

      <div className={styles.grid}>
        {items.map((faq) => (
          <article className={styles.card} key={faq.id}>
            <header>
              <span>{faq.category}</span>
              <div className={styles.actions}>
                <button className={styles.ghost} onClick={() => openEdit(faq, setEditing)}>
                  Edit
                </button>
                <button className={styles.danger} onClick={() => remove.mutate(faq.id)}>
                  Delete
                </button>
              </div>
            </header>
            <strong>{faq.question}</strong>
            <p>{faq.answer}</p>
          </article>
        ))}
      </div>

      {editing ? (
        <form
          className={styles.drawer}
          onSubmit={(event) => {
            event.preventDefault();
            save.mutate();
          }}
        >
          <h3>{editing.id ? "Edit FAQ" : "New FAQ"}</h3>
          <label className={styles.field}>
            Category
            <select
              value={editing.category}
              onChange={(event) => setEditing({ ...editing, category: event.target.value })}
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            Question
            <input
              value={editing.question}
              onChange={(event) => setEditing({ ...editing, question: event.target.value })}
              required
            />
          </label>
          <label className={styles.field}>
            Answer
            <textarea
              value={editing.answer}
              onChange={(event) => setEditing({ ...editing, answer: event.target.value })}
              required
            />
          </label>
          <label className={styles.field}>
            Tags
            <input
              value={editing.tags}
              onChange={(event) => setEditing({ ...editing, tags: event.target.value })}
              placeholder="poker, hours"
            />
          </label>
          <div className={styles.drawerActions}>
            <button className={styles.primary} type="submit" disabled={save.isPending}>
              Save
            </button>
            <button className={styles.ghost} type="button" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}
    </section>
  );
}

function openEdit(faq: Faq, setEditing: (value: typeof emptyForm & { id?: string }) => void) {
  setEditing({
    id: faq.id,
    category: faq.category,
    question: faq.question,
    answer: faq.answer,
    tags: faq.tags.join(", "),
  });
}

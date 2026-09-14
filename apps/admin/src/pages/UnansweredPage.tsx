import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { convertUnanswered, dismissUnanswered, fetchUnanswered } from "../api";
import styles from "./FaqsPage.module.css";

export function UnansweredPage() {
  const queryClient = useQueryClient();
  const queue = useQuery({
    queryKey: ["unanswered"],
    queryFn: () => fetchUnanswered("open"),
    refetchInterval: 4000,
  });
  const [converting, setConverting] = useState<{
    id: string;
    question: string;
    answer: string;
    category: string;
  } | null>(null);

  const convert = useMutation({
    mutationFn: async () => {
      if (!converting) {
        return;
      }
      return convertUnanswered(converting.id, {
        answer: converting.answer,
        category: converting.category,
        tags: [],
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["unanswered"] });
      await queryClient.invalidateQueries({ queryKey: ["faqs"] });
      setConverting(null);
    },
  });

  const dismiss = useMutation({
    mutationFn: dismissUnanswered,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["unanswered"] }),
  });

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h2>Unanswered questions</h2>
          <p className={styles.muted}>
            Guest questions the concierge could not answer. Convert the useful ones into FAQs.
          </p>
        </div>
        <button className={styles.ghost} type="button" onClick={() => queue.refetch()}>
          Refresh
        </button>
      </header>

      {queue.error ? <p className={styles.muted}>{(queue.error as Error).message}</p> : null}

      <div className={styles.grid}>
        {(queue.data?.items ?? []).length === 0 ? (
          <article className={styles.card}>
            <p className={styles.muted}>
              The queue is empty. Unknown guest questions will appear here with a frequency count.
            </p>
          </article>
        ) : (
          queue.data?.items.map((item) => (
            <article className={styles.card} key={item.id}>
              <header>
                <span>Asked {item.frequency}×</span>
                <span>{new Date(item.lastAskedAt).toLocaleString()}</span>
              </header>
              <strong>{item.question}</strong>
              <div className={styles.actions}>
                <button
                  className={styles.primary}
                  onClick={() =>
                    setConverting({ id: item.id, question: item.question, answer: "", category: "general" })
                  }
                >
                  Convert to FAQ
                </button>
                <button className={styles.ghost} onClick={() => dismiss.mutate(item.id)}>
                  Dismiss
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {converting ? (
        <form
          className={styles.drawer}
          onSubmit={(event) => {
            event.preventDefault();
            convert.mutate();
          }}
        >
          <h3>Convert to FAQ</h3>
          <p>{converting.question}</p>
          <label className={styles.field}>
            Category
            <select
              value={converting.category}
              onChange={(event) => setConverting({ ...converting, category: event.target.value })}
            >
              {["general", "gaming", "accommodations", "dining", "bars", "amenities", "events", "partners"].map(
                (item) => (
                  <option key={item}>{item}</option>
                ),
              )}
            </select>
          </label>
          <label className={styles.field}>
            Answer
            <textarea
              value={converting.answer}
              onChange={(event) => setConverting({ ...converting, answer: event.target.value })}
              required
            />
          </label>
          <div className={styles.drawerActions}>
            <button className={styles.primary} type="submit" disabled={convert.isPending}>
              Save FAQ
            </button>
            <button className={styles.ghost} type="button" onClick={() => setConverting(null)}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}
    </section>
  );
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { fetchVoices, previewVoice, selectVoice } from "../api";
import styles from "./VoicesPage.module.css";

export function VoicesPage() {
  const queryClient = useQueryClient();
  const audioRef = useRef<HTMLAudioElement>(null);
  const voices = useQuery({ queryKey: ["voices"], queryFn: fetchVoices });

  const activate = useMutation({
    mutationFn: selectVoice,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["voices"] }),
  });

  const preview = useMutation({
    mutationFn: previewVoice,
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.src = url;
        void audioRef.current.play();
      }
    },
  });

  return (
    <section className={styles.page}>
      <header>
        <h2>Voice personality</h2>
        <p>The selected voice applies immediately to new playground conversations. No restart required.</p>
      </header>
      <audio ref={audioRef} hidden />
      {voices.error ? <p className={styles.error}>{(voices.error as Error).message}</p> : null}
      <div className={styles.grid}>
        {voices.data?.items.map((voice) => (
          <article key={voice.id} className={styles.card} data-active={voice.active}>
            {voice.active ? <span className={styles.live}>Currently active</span> : <span className={styles.idle}>Available</span>}
            <h3>{voice.name}</h3>
            <p>{voice.description}</p>
            <div className={styles.actions}>
              <button className={styles.ghost} onClick={() => preview.mutate(voice.id)} disabled={preview.isPending}>
                Preview
              </button>
              <button className={styles.primary} disabled={voice.active} onClick={() => activate.mutate(voice.id)}>
                {voice.active ? "Selected" : "Use this voice"}
              </button>
            </div>
          </article>
        ))}
      </div>
      {preview.error ? <p className={styles.error}>{(preview.error as Error).message}</p> : null}
    </section>
  );
}

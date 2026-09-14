import { BarVisualizer, LiveKitRoom, RoomAudioRenderer, useVoiceAssistant } from "@livekit/components-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { createLivekitToken, fetchVoices } from "../api";
import { useConversationSession } from "../session/ConversationSession";
import styles from "./PlaygroundPage.module.css";

const statusCopy: Record<string, string> = {
  disconnected: "Idle",
  connecting: "Connecting",
  initializing: "Preparing concierge",
  listening: "Listening",
  thinking: "Consulting the desk",
  speaking: "Speaking",
};

export function PlaygroundPage() {
  const [connection, setConnection] = useState<{ serverUrl: string; participantToken: string } | null>(null);
  const { setActive, registerEnd } = useConversationSession();
  const voices = useQuery({ queryKey: ["voices"], queryFn: fetchVoices });
  const start = useMutation({
    mutationFn: createLivekitToken,
    onSuccess: (token) => setConnection({ serverUrl: token.serverUrl, participantToken: token.participantToken }),
  });
  const active = voices.data?.items.find((voice) => voice.active);

  useEffect(() => {
    setActive(Boolean(connection));
    return () => setActive(false);
  }, [connection, setActive]);

  useEffect(() => {
    registerEnd(() => setConnection(null));
    return () => registerEnd(null);
  }, [registerEnd]);

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <span className={styles.badge}>Test mode · Playground</span>
          <h2>Speak with the concierge</h2>
          <p>
            Full voice conversation using the currently selected voice
            {active ? ` — ${active.name}` : ""} — and live FAQ content.
          </p>
        </div>
      </header>

      {connection ? (
        <LiveKitRoom
          serverUrl={connection.serverUrl}
          token={connection.participantToken}
          connect
          audio
          video={false}
          onDisconnected={() => setConnection(null)}
        >
          <RoomAudioRenderer />
          <SessionPanel onEnd={() => setConnection(null)} />
        </LiveKitRoom>
      ) : (
        <div className={styles.stage}>
          <div className={styles.orbWrap}>
            <div className={styles.orb} />
            <div className={styles.status}>Ready when you are</div>
            {start.error ? <p className={styles.error}>{(start.error as Error).message}</p> : null}
            <button className={styles.primary} onClick={() => start.mutate()} disabled={start.isPending}>
              {start.isPending ? "Connecting…" : "Start conversation"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function SessionPanel({ onEnd }: { onEnd: () => void }) {
  const { state, audioTrack } = useVoiceAssistant();

  return (
    <div className={styles.stage}>
      <div className={styles.orbWrap}>
        <div className={styles.orb} data-state={state}>
          <BarVisualizer state={state} barCount={5} trackRef={audioTrack} className={styles.visualizer} />
        </div>
        <div className={styles.status}>{statusCopy[state] ?? state}</div>
        <div className={styles.actions}>
          <button className={styles.ghost} onClick={onEnd}>
            End conversation
          </button>
        </div>
      </div>
    </div>
  );
}

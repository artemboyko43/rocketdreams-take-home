import {
  BarVisualizer,
  LiveKitRoom,
  RoomAudioRenderer,
  useRoomContext,
  useVoiceAssistant,
} from "@livekit/components-react";
import { shouldCaptureGuestQuestion } from "@meridian/shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RoomEvent, type Participant, type TranscriptionSegment } from "livekit-client";
import { useEffect, useState } from "react";
import { captureGuestQuestion, createLivekitToken, fetchVoices } from "../api";
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
  const room = useRoomContext();
  const queryClient = useQueryClient();
  const { state, audioTrack } = useVoiceAssistant();
  const [heard, setHeard] = useState("");

  useEffect(() => {
    const onTranscription = (segments: TranscriptionSegment[], participant?: Participant) => {
      if (participant && !participant.isLocal) {
        return;
      }
      const text = segments
        .filter((segment) => segment.final)
        .map((segment) => segment.text)
        .join(" ")
        .trim();
      if (!text || !shouldCaptureGuestQuestion(text)) {
        return;
      }
      setHeard(text);
      void captureGuestQuestion(text).then(() =>
        queryClient.invalidateQueries({ queryKey: ["unanswered"] }),
      );
    };

    room.on(RoomEvent.TranscriptionReceived, onTranscription);
    return () => {
      room.off(RoomEvent.TranscriptionReceived, onTranscription);
    };
  }, [queryClient, room]);

  return (
    <div className={styles.stage}>
      <div className={styles.orbWrap}>
        <div className={styles.orb} data-state={state}>
          <BarVisualizer state={state} barCount={5} trackRef={audioTrack} className={styles.visualizer} />
        </div>
        <div className={styles.status}>{statusCopy[state] ?? state}</div>
        {heard ? <p className={styles.heard}>Heard: {heard}</p> : null}
        <div className={styles.actions}>
          <button className={styles.ghost} onClick={onEnd}>
            End conversation
          </button>
        </div>
      </div>
    </div>
  );
}

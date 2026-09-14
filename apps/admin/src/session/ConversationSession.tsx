import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useBlocker } from "react-router-dom";
import styles from "./ConversationSession.module.css";

type LeaveReason = "navigate" | "reload" | "tab" | null;

type ConversationSessionValue = {
  setActive: (active: boolean) => void;
  registerEnd: (end: (() => void) | null) => void;
};

const ConversationSessionContext = createContext<ConversationSessionValue | null>(null);

export function useConversationSession() {
  const context = useContext(ConversationSessionContext);
  if (!context) {
    throw new Error("useConversationSession must be used within ConversationSessionProvider");
  }
  return context;
}

export function ConversationSessionProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [leaveReason, setLeaveReason] = useState<LeaveReason>(null);
  const endRef = useRef<(() => void) | null>(null);
  const registerEnd = useCallback((end: (() => void) | null) => {
    endRef.current = end;
  }, []);
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      active && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      setLeaveReason("navigate");
    }
  }, [blocker.state]);

  useEffect(() => {
    if (!active) {
      return;
    }

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const refresh =
        event.key === "F5" || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "r");
      if (!refresh) {
        return;
      }
      event.preventDefault();
      setLeaveReason("reload");
    };

    const onVisibility = () => {
      if (document.hidden) {
        setLeaveReason("tab");
      }
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [active]);

  const stay = () => {
    setLeaveReason(null);
    if (blocker.state === "blocked") {
      blocker.reset();
    }
  };

  const endConversation = () => {
    const reason = leaveReason;
    const canProceed = blocker.state === "blocked";
    setLeaveReason(null);
    endRef.current?.();
    if (reason === "navigate" && canProceed) {
      blocker.proceed();
    }
    setActive(false);
    if (reason === "reload") {
      window.location.reload();
    }
  };

  const open = leaveReason !== null;

  return (
    <ConversationSessionContext.Provider value={{ setActive, registerEnd }}>
      {children}
      {open ? (
        <div className={styles.backdrop} role="presentation" onClick={stay}>
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="leave-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="leave-title">Close the conversation first</h3>
            <p>
              A playground session is still live. End the conversation before refreshing, switching
              tabs, or opening another page.
            </p>
            <div className={styles.actions}>
              <button className={styles.primary} type="button" onClick={stay} autoFocus>
                Stay
              </button>
              <button className={styles.ghost} type="button" onClick={endConversation}>
                End conversation
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </ConversationSessionContext.Provider>
  );
}

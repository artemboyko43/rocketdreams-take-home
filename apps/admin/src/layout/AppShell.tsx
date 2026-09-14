import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useConversationSession } from "../session/ConversationSession";
import styles from "./AppShell.module.css";

const links = [
  { to: "/", label: "Playground" },
  { to: "/faqs", label: "Knowledge base" },
  { to: "/unanswered", label: "Unanswered" },
  { to: "/voices", label: "Voices" },
];

export function AppShell() {
  const location = useLocation();
  const { isLive, requestLeave } = useConversationSession();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.eyebrow}>Staff console</span>
          <h1>The Meridian</h1>
          <p>Voice concierge operations</p>
        </div>
        <nav className={styles.nav}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) => (isActive ? styles.active : undefined)}
              onClick={(event) => {
                if (!isLive || location.pathname === link.to) {
                  return;
                }
                event.preventDefault();
                requestLeave(link.to);
              }}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}

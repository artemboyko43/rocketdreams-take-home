import { NavLink, Outlet } from "react-router-dom";
import styles from "./AppShell.module.css";

const links = [
  { to: "/", label: "Playground" },
  { to: "/faqs", label: "Knowledge base" },
  { to: "/unanswered", label: "Unanswered" },
  { to: "/voices", label: "Voices" },
];

export function AppShell() {
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

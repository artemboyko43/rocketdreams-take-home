import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./layout/AppShell";
import { FaqsPage } from "./pages/FaqsPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { UnansweredPage } from "./pages/UnansweredPage";
import { VoicesPage } from "./pages/VoicesPage";

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route
          index
          element={
            <PlaceholderPage
              title="Playground"
              copy="The live voice test console lands in the next slice. FAQ, unanswered, and voice settings are live now."
            />
          }
        />
        <Route path="faqs" element={<FaqsPage />} />
        <Route path="unanswered" element={<UnansweredPage />} />
        <Route path="voices" element={<VoicesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

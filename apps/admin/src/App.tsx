import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./layout/AppShell";
import { FaqsPage } from "./pages/FaqsPage";
import { PlaygroundPage } from "./pages/PlaygroundPage";
import { UnansweredPage } from "./pages/UnansweredPage";
import { VoicesPage } from "./pages/VoicesPage";
import { ConversationSessionProvider } from "./session/ConversationSession";

export function App() {
  return (
    <ConversationSessionProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<PlaygroundPage />} />
          <Route path="faqs" element={<FaqsPage />} />
          <Route path="unanswered" element={<UnansweredPage />} />
          <Route path="voices" element={<VoicesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </ConversationSessionProvider>
  );
}

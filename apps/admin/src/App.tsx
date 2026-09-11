import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./layout/AppShell";
import { FaqsPage } from "./pages/FaqsPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route
          index
          element={
            <PlaceholderPage
              title="Playground"
              copy="The live voice test console lands in a later slice. Use Knowledge base to manage FAQ content now."
            />
          }
        />
        <Route path="faqs" element={<FaqsPage />} />
        <Route
          path="unanswered"
          element={
            <PlaceholderPage
              title="Unanswered questions"
              copy="The review queue will appear here once guest misses are wired into this console."
            />
          }
        />
        <Route
          path="voices"
          element={
            <PlaceholderPage
              title="Voice personality"
              copy="James, Sofia, Marcus, and Elena will be selectable here in the next operations slice."
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

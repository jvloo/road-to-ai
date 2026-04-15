import { HomePage } from "./pages/HomePage";
import { LevelPage } from "./pages/LevelPage";
import { useStore } from "./store/useStore";

export default function App() {
  const selectedId = useStore((s) => s.selectedId);
  return (
    <>
      <HomePage />
      {selectedId && <LevelPage />}
    </>
  );
}

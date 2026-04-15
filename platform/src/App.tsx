import { useEffect, useState } from "react";
import { HomePage } from "./pages/HomePage";
import { LevelPage } from "./pages/LevelPage";
import { LuminariesIndex } from "./components/LuminariesIndex";
import { useStore } from "./store/useStore";

export default function App() {
  const selectedId = useStore((s) => s.selectedId);
  const levels = useStore((s) => s.levels);
  const load = useStore((s) => s.load);
  const [hash, setHash] = useState(typeof window !== "undefined" ? window.location.hash : "");

  useEffect(() => {
    void load();
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [load]);

  if (hash === "#/luminaries") return <LuminariesIndex levels={levels} />;

  return (
    <>
      <HomePage />
      {selectedId && <LevelPage />}
    </>
  );
}

import { useEffect, useState } from "react";
import { HomePage } from "./pages/HomePage";
import { LevelPage } from "./pages/LevelPage";
import { LuminariesIndex } from "./components/LuminariesIndex";
import { Glossary } from "./components/Glossary";
import { RecallChallenge } from "./components/RecallChallenge";
import { useStore } from "./store/useStore";

export default function App() {
  const selectedId = useStore((s) => s.selectedId);
  const levels = useStore((s) => s.levels);
  const load = useStore((s) => s.load);
  const challengeOpen = useStore((s) => s.challengeOpen);
  const progress = useStore((s) => s.progress);
  const dismissChallenge = useStore((s) => s.dismissChallenge);
  const [hash, setHash] = useState(typeof window !== "undefined" ? window.location.hash : "");

  useEffect(() => {
    void load();
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [load]);

  if (hash === "#/glossary") return <Glossary />;
  if (hash === "#/luminaries") return <LuminariesIndex levels={levels} />;

  const recentDone = levels
    .filter((l) => progress.levels[l.id]?.status === "done")
    .sort((a, b) => {
      const ca = progress.levels[a.id]?.completed_at ?? "";
      const cb = progress.levels[b.id]?.completed_at ?? "";
      return ca.localeCompare(cb);
    })
    .slice(-5);

  return (
    <>
      <HomePage />
      {selectedId && <LevelPage />}
      {challengeOpen && <RecallChallenge recentDone={recentDone} onClose={dismissChallenge} />}
    </>
  );
}

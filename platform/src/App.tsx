import { useEffect, useState } from "react";
import { HomePage } from "./pages/HomePage";
import { LevelView } from "./pages/LevelView";
import { LuminariesIndex } from "./components/LuminariesIndex";
import { Glossary } from "./components/Glossary";
import { RecallChallenge } from "./components/RecallChallenge";
import { Settings } from "./components/Settings";
import { SelectionPopover } from "./components/SelectionPopover";
import { useStore } from "./store/useStore";

function getHash(): string {
  return typeof window !== "undefined" ? window.location.hash : "";
}

function parseLevelId(hash: string): string | null {
  const m = hash.match(/^#\/level\/([A-Za-z0-9_-]+)/);
  return m ? (m[1] as string) : null;
}

export default function App() {
  const levels = useStore((s) => s.levels);
  const load = useStore((s) => s.load);
  const challengeOpen = useStore((s) => s.challengeOpen);
  const progress = useStore((s) => s.progress);
  const dismissChallenge = useStore((s) => s.dismissChallenge);
  const [hash, setHash] = useState(getHash());

  useEffect(() => {
    void load();
    const onHash = () => setHash(getHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [load]);

  const recentDone = levels
    .filter((l) => progress.levels[l.id]?.status === "done")
    .sort((a, b) => {
      const ca = progress.levels[a.id]?.completed_at ?? "";
      const cb = progress.levels[b.id]?.completed_at ?? "";
      return ca.localeCompare(cb);
    })
    .slice(-5);

  const levelId = parseLevelId(hash);

  let content;
  if (levelId) {
    content = <LevelView levelId={levelId} />;
  } else if (hash === "#/glossary") {
    content = <Glossary />;
  } else if (hash === "#/luminaries") {
    content = <LuminariesIndex levels={levels} />;
  } else if (hash === "#/settings") {
    content = <Settings />;
  } else {
    content = <HomePage />;
  }

  return (
    <>
      {content}
      {challengeOpen && <RecallChallenge recentDone={recentDone} onClose={dismissChallenge} />}
      <SelectionPopover />
    </>
  );
}

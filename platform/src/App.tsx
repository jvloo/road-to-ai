import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { HomePage } from "./pages/HomePage";
import { LevelView } from "./pages/LevelView";
import { LibraryPage } from "./pages/LibraryPage";
import { RecallChallenge } from "./components/RecallChallenge";
import { SelectionPopover } from "./components/SelectionPopover";
import { AchievementToast } from "./components/AchievementToast";
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
  const toasts = useStore((s) => s.toasts);
  const dismissToast = useStore((s) => s.dismissToast);
  const [hash, setHash] = useState(getHash());
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    void load();
    const onHash = () => setHash(getHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [load]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "Escape") {
        if (getHash().startsWith("#/level/")) {
          window.location.hash = "#/";
          e.preventDefault();
        }
      } else if (e.key === "g") {
        window.location.hash = "#/";
      } else if (e.key === "l") {
        window.location.hash = "#/library";
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const recentDone = levels
    .filter((l) => progress.levels[l.id]?.status === "done")
    .sort((a, b) => {
      const ca = progress.levels[a.id]?.completed_at ?? "";
      const cb = progress.levels[b.id]?.completed_at ?? "";
      return ca.localeCompare(cb);
    })
    .slice(-5);

  const levelId = parseLevelId(hash);

  let routeKey: string;
  let content;
  if (levelId) {
    routeKey = `level:${levelId}`;
    content = <LevelView levelId={levelId} />;
  } else if (hash.startsWith("#/library")) {
    routeKey = "library";
    content = <LibraryPage />;
  } else {
    routeKey = "home";
    content = <HomePage />;
  }

  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.22, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={routeKey}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
          transition={transition}
        >
          {content}
        </motion.div>
      </AnimatePresence>
      {challengeOpen && <RecallChallenge recentDone={recentDone} onClose={dismissChallenge} />}
      <AchievementToast queue={toasts} onDismiss={dismissToast} />
      <SelectionPopover />
    </>
  );
}

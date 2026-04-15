import { useEffect, useMemo } from "react";
import { useStore } from "@/store/useStore";
import { AppShell } from "@/components/AppShell";
import { Landing } from "@/components/Landing";
import { ContinueCard } from "@/components/ContinueCard";
import { ProgressStrip } from "@/components/ProgressStrip";
import { Trail } from "@/components/trail/Trail";
import { Divider } from "@/components/Divider";

export function HomePage() {
  const levels = useStore((s) => s.levels);
  const progress = useStore((s) => s.progress);
  const load = useStore((s) => s.load);
  const select = useStore((s) => s.select);

  useEffect(() => {
    void load();
  }, [load]);

  const tierName = useMemo(() => {
    const xp = progress.xp_total;
    if (xp >= 3500) return "Researcher";
    if (xp >= 2000) return "Specialist";
    if (xp >= 1000) return "Practitioner";
    if (xp >= 400) return "Journeyman";
    if (xp >= 100) return "Apprentice";
    return "Novice";
  }, [progress.xp_total]);

  const luminariesMet = useMemo(() => {
    const set = new Set<string>();
    for (const l of levels) {
      if (progress.levels[l.id]?.status === "done" && l.luminary) set.add(l.luminary);
    }
    return set.size;
  }, [levels, progress.levels]);

  const nextLevel = useMemo(() => {
    // Prefer an in-progress level; else the next pending whose prereqs are all done.
    const doneIds = new Set(
      Object.entries(progress.levels)
        .filter(([, p]) => p.status === "done")
        .map(([id]) => id),
    );
    const inProgress = levels.find((l) => progress.levels[l.id]?.status === "in-progress");
    if (inProgress) return inProgress;
    return levels.find(
      (l) => !doneIds.has(l.id) && l.prereqs.every((p) => doneIds.has(p)),
    );
  }, [levels, progress.levels]);

  const isFirstVisit = progress.xp_total === 0;

  return (
    <AppShell xp={progress.xp_total} tier={tierName}>
      {isFirstVisit ? (
        <Landing onStart={() => select("F00")} />
      ) : nextLevel ? (
        <ContinueCard level={nextLevel} onOpen={() => select(nextLevel.id)} />
      ) : null}

      {!isFirstVisit && (
        <ProgressStrip
          progress={progress}
          totalLevels={levels.length}
          luminariesMet={luminariesMet}
        />
      )}

      <Divider>the road ahead</Divider>
      <Trail levels={levels} onSelect={select} />

      <footer className="mt-16 font-mono text-xs text-[var(--color-fg-faint)]">
        // fork me:{" "}
        <a
          className="underline hover:text-[var(--color-muted)]"
          href="https://github.com/jvloo/road-to-ai"
        >
          github.com/jvloo/road-to-ai
        </a>{" "}
        · MIT + CC-BY-SA 4.0
      </footer>
    </AppShell>
  );
}

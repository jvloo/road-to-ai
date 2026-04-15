import type { Level } from "./types";
import type { Progress } from "./progress";

export function pickRecallLevels(current: Level, allLevels: Level[], progress: Progress, count = 3): Level[] {
  if (current.recall_of?.length) {
    const ids = current.recall_of;
    return allLevels.filter((l) => ids.includes(l.id)).slice(0, count);
  }
  const done = allLevels.filter((l) =>
    progress.levels[l.id]?.status === "done" &&
    l.track === current.track &&
    l.id !== current.id,
  );
  return done.slice(-count);
}

export function shouldShowChallenge(progress: Progress): boolean {
  const donePerTrack = Object.values(progress.levels).filter((v) => v.status === "done").length;
  return donePerTrack > 0 && donePerTrack % 5 === 0;
}

import type { Progress, AchievementEntry } from "./progress";
import type { Level } from "./types";

type Rule = (p: Progress, levels: Level[]) => boolean;

const RULES: Record<string, Rule> = {
  "first-step": (p) => p.stats.levels_done >= 1,
  "met-10-luminaries": (p, levels) => countLuminariesMet(p, levels) >= 10,
  "met-25-luminaries": (p, levels) => countLuminariesMet(p, levels) >= 25,
  "glossary-trailblazer": () => false, // wired in Task 20 when chip encounters are tracked
};

function countLuminariesMet(p: Progress, levels: Level[]): number {
  const done = new Set(
    Object.entries(p.levels)
      .filter(([, v]) => v.status === "done")
      .map(([k]) => k),
  );
  const set = new Set<string>();
  for (const l of levels) {
    if (l.luminary && done.has(l.id)) set.add(l.luminary);
  }
  return set.size;
}

export function checkAchievements(p: Progress, levels: Level[]): AchievementEntry[] {
  const earnedIds = new Set(p.achievements.map((a) => a.id));
  const today = new Date().toISOString().slice(0, 10);
  const newAwards: AchievementEntry[] = [];
  for (const [id, rule] of Object.entries(RULES)) {
    if (!earnedIds.has(id) && rule(p, levels)) {
      newAwards.push({ id, earned_at: today });
    }
  }
  return newAwards;
}

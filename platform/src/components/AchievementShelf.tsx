import type { AchievementEntry } from "@/lib/progress";

const TITLES: Record<string, string> = {
  "first-step": "First Step",
  "met-10-luminaries": "Met 10 Luminaries",
  "met-25-luminaries": "Met 25 Luminaries",
  "turing-award-trio": "Met the Turing Trio",
  "backprop-by-hand": "Derived Backprop by Hand",
  "first-paper-reproduced": "First Paper Reproduced",
  "glossary-trailblazer": "Glossary Trailblazer",
  "recall-champion": "Recall Champion",
};

export function AchievementShelf({ achievements }: { achievements: AchievementEntry[] }) {
  if (!achievements.length) {
    return (
      <p className="font-mono text-xs text-[var(--color-muted)]">
        // no achievements yet — complete a level
      </p>
    );
  }
  return (
    <ul className="flex flex-wrap gap-2">
      {achievements.map((a) => (
        <li
          key={a.id}
          className="rounded border border-[var(--color-accent)] px-2 py-1 font-mono text-xs text-[var(--color-accent)]"
          title={`Earned ${a.earned_at}`}
        >
          ◆ {TITLES[a.id] ?? a.id}
        </li>
      ))}
    </ul>
  );
}

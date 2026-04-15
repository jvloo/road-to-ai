import { XpBar } from "./XpBar";
import { AchievementShelf } from "./AchievementShelf";
import { Divider } from "./Divider";
import type { Progress } from "@/lib/progress";

export function ProgressDashboard({ progress }: { progress: Progress }) {
  return (
    <section>
      <XpBar xp={progress.xp_total} />
      <Divider>achievements</Divider>
      <AchievementShelf achievements={progress.achievements} />
      <Divider>stats</Divider>
      <dl className="grid grid-cols-1 gap-4 font-mono text-xs md:grid-cols-3">
        <div>
          <dt className="text-[var(--color-muted)]">levels done</dt>
          <dd className="text-2xl">{progress.stats.levels_done}</dd>
        </div>
        <div>
          <dt className="text-[var(--color-muted)]">current tier</dt>
          <dd className="text-2xl">{progress.tier}</dd>
        </div>
        <div>
          <dt className="text-[var(--color-muted)]">last session</dt>
          <dd className="text-sm">{progress.last_session_at ?? "—"}</dd>
        </div>
      </dl>
    </section>
  );
}

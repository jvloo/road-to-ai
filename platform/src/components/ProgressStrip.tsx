import type { Progress } from "@/lib/progress";

export interface ProgressStripProps {
  progress: Progress;
  totalLevels: number;
  luminariesMet: number;
}

interface Band {
  name: string;
  min: number;
}

const TIER_BANDS: Band[] = [
  { name: "Novice", min: 0 },
  { name: "Apprentice", min: 100 },
  { name: "Journeyman", min: 400 },
  { name: "Practitioner", min: 1000 },
  { name: "Specialist", min: 2000 },
  { name: "Researcher", min: 3500 },
];

function currentBand(xp: number): { curr: Band; next: Band | null } {
  let curr: Band = TIER_BANDS[0] as Band;
  let next: Band | null = TIER_BANDS[1] ?? null;
  for (let i = 0; i < TIER_BANDS.length; i++) {
    const band = TIER_BANDS[i] as Band;
    if (xp >= band.min) {
      curr = band;
      next = TIER_BANDS[i + 1] ?? null;
    }
  }
  return { curr, next };
}

export function ProgressStrip({ progress, totalLevels, luminariesMet }: ProgressStripProps) {
  const xp = progress.xp_total;
  const { curr, next } = currentBand(xp);
  const ratio = next ? Math.min(1, (xp - curr.min) / (next.min - curr.min)) : 1;
  const done = progress.stats.levels_done;
  const achievements = progress.achievements.length;

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 font-mono text-xs">
        <span className="text-[var(--color-muted)]">
          <span className="text-[var(--color-fg-strong)]">{xp}</span> XP
        </span>
        <span className="text-[var(--color-fg-faint)]">·</span>
        <span className="text-[var(--color-muted)]">
          <span className="text-[var(--color-fg-strong)]">{done}</span>
          {" / "}
          {totalLevels} levels
        </span>
        <span className="text-[var(--color-fg-faint)]">·</span>
        <span className="text-[var(--color-muted)]">
          <span className="text-[var(--color-fg-strong)]">{luminariesMet}</span> luminaries met
        </span>
        <span className="text-[var(--color-fg-faint)]">·</span>
        <span className="text-[var(--color-muted)]">
          <span className="text-[var(--color-fg-strong)]">{achievements}</span> achievements
        </span>
        <span className="ml-auto text-[var(--color-fg-faint)]">
          {curr.name}
          {next ? ` → ${next.name}` : ""}
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-1)]">
        <div
          className="h-full rounded-full bg-[var(--color-accent)] transition-all"
          style={{
            width: `${(ratio * 100).toFixed(1)}%`,
            boxShadow: "0 0 12px var(--color-accent-glow-strong)",
          }}
        />
      </div>
    </section>
  );
}

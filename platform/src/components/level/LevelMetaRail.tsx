import type { Level } from "@/lib/types";

export interface LevelMetaRailProps {
  level: Level;
  onMarkDone: () => void;
}

export function LevelMetaRail({ level, onMarkDone }: LevelMetaRailProps) {
  const done = level.status === "done";
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)] p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-fg-faint)]">
          // level info
        </p>
        <dl className="mt-4 space-y-3 font-mono text-xs">
          <div>
            <dt className="text-[var(--color-fg-faint)]">xp</dt>
            <dd className="text-[var(--color-fg-strong)]">+{level.xp}</dd>
          </div>
          <div>
            <dt className="text-[var(--color-fg-faint)]">track</dt>
            <dd className="text-[var(--color-fg-strong)]">
              {level.track === "A" ? "Foundations" : "Frontier"}
            </dd>
          </div>
          <div>
            <dt className="text-[var(--color-fg-faint)]">tier</dt>
            <dd className="text-[var(--color-fg-strong)]">{level.tier}</dd>
          </div>
          {level.prereqs.length > 0 && (
            <div>
              <dt className="text-[var(--color-fg-faint)]">prereqs</dt>
              <dd className="text-[var(--color-fg-strong)]">{level.prereqs.join(" · ")}</dd>
            </div>
          )}
          {level.luminary && (
            <div>
              <dt className="text-[var(--color-fg-faint)]">luminary</dt>
              <dd className="text-[var(--color-fg-strong)]">{level.luminary}</dd>
            </div>
          )}
          {level.tags && level.tags.length > 0 && (
            <div>
              <dt className="text-[var(--color-fg-faint)]">tags</dt>
              <dd className="text-[var(--color-muted)]">{level.tags.join(" · ")}</dd>
            </div>
          )}
        </dl>

        <button
          onClick={onMarkDone}
          disabled={done}
          className={`mt-6 w-full rounded-md border px-4 py-2.5 font-mono text-sm font-semibold transition-opacity ${
            done
              ? "cursor-default border-[var(--color-border)] bg-transparent text-[var(--color-fg-faint)]"
              : "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-accent-fg)] hover:opacity-90"
          }`}
        >
          {done ? "✓ Done" : `Mark done · +${level.xp} XP`}
        </button>
      </div>
    </aside>
  );
}

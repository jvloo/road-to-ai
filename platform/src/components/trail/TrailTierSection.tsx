import type { Level } from "@/lib/types";
import type { TierMeta } from "@/lib/meta";
import { LevelRow } from "./LevelRow";

export interface TrailTierSectionProps {
  tier: TierMeta;
  levels: Level[];
  doneIds: Set<string>;
  currentId: string | null;
  onSelect: (id: string) => void;
}

function isUnlocked(level: Level, doneIds: Set<string>): boolean {
  if (level.prereqs.length === 0) return true;
  return level.prereqs.every((p) => doneIds.has(p));
}

export function TrailTierSection({
  tier,
  levels,
  doneIds,
  currentId,
  onSelect,
}: TrailTierSectionProps) {
  const xpSum = levels.reduce((s, l) => s + l.xp, 0);
  const doneInTier = levels.filter((l) => doneIds.has(l.id)).length;
  const luminaries = Array.from(
    new Set(levels.map((l) => l.luminary).filter((l): l is string => !!l)),
  );
  const hasLevels = levels.length > 0;

  return (
    <section className="grid grid-cols-1 gap-8 lg:grid-cols-[18rem_1fr] lg:gap-10">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)] p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
            // tier {tier.id}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--color-fg-strong)]">
            {tier.name}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">{tier.blurb}</p>

          <dl className="mt-6 grid grid-cols-2 gap-3 font-mono text-[11px]">
            <div>
              <dt className="text-[var(--color-fg-faint)]">levels</dt>
              <dd className="text-[var(--color-fg-strong)]">
                {doneInTier} / {levels.length}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--color-fg-faint)]">xp on offer</dt>
              <dd className="text-[var(--color-fg-strong)]">{xpSum}</dd>
            </div>
          </dl>

          {luminaries.length > 0 && (
            <div className="mt-6">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-faint)]">
                you'll meet
              </p>
              <ul className="mt-2 space-y-1 text-xs text-[var(--color-muted)]">
                {luminaries.slice(0, 6).map((name) => (
                  <li key={name}>· {name}</li>
                ))}
                {luminaries.length > 6 && (
                  <li className="text-[var(--color-fg-faint)]">
                    + {luminaries.length - 6} more
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </aside>

      <div className="min-w-0">
        {hasLevels ? (
          <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)]">
            {levels.map((l) => (
              <LevelRow
                key={l.id}
                level={l}
                unlocked={isUnlocked(l, doneIds)}
                isCurrent={l.id === currentId}
                onSelect={onSelect}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface-1)] p-8">
            <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-faint)]">
              // coming soon
            </p>
            <p className="mt-3 text-sm text-[var(--color-muted)]">
              This tier's levels haven't been authored yet. The road continues here — check back
              as new levels are published.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

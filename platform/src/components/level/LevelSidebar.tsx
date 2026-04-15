import type { Level } from "@/lib/types";
import type { TierMeta } from "@/lib/meta";

export interface LevelSidebarProps {
  tier: TierMeta;
  levels: Level[];
  currentId: string;
  onNavigate: (id: string) => void;
  onBackToTrail: () => void;
}

function StatusGlyph({ status, current }: { status: Level["status"]; current: boolean }) {
  if (current) return <span className="text-[var(--color-accent)]">▸</span>;
  if (status === "done") return <span className="text-[var(--color-accent)]">✓</span>;
  return <span className="text-[var(--color-fg-faint)]">○</span>;
}

export function LevelSidebar({
  tier,
  levels,
  currentId,
  onNavigate,
  onBackToTrail,
}: LevelSidebarProps) {
  return (
    <aside className="hidden border-r border-[var(--color-border)] bg-[var(--color-surface-1)]/40 lg:block">
      <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto px-6 py-8">
        <button
          onClick={onBackToTrail}
          className="mb-6 font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)] hover:text-[var(--color-accent)]"
        >
          ← back to trail
        </button>

        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
          // tier {tier.id}
        </p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight text-[var(--color-fg-strong)]">
          {tier.name}
        </h2>

        <ul className="mt-6 space-y-1">
          {levels.map((l) => {
            const isCurrent = l.id === currentId;
            return (
              <li key={l.id}>
                <button
                  onClick={() => onNavigate(l.id)}
                  aria-current={isCurrent ? "step" : undefined}
                  className={`flex w-full items-start gap-3 rounded px-2 py-2 text-left transition-colors ${
                    isCurrent
                      ? "bg-[var(--color-surface-2)]"
                      : "hover:bg-[var(--color-surface-2)]"
                  }`}
                >
                  <span className="mt-0.5 shrink-0 font-mono text-sm leading-5">
                    <StatusGlyph status={l.status} current={isCurrent} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-faint)]">
                        {l.id}
                      </span>
                    </div>
                    <p
                      className={`truncate text-sm ${
                        isCurrent
                          ? "text-[var(--color-fg-strong)]"
                          : "text-[var(--color-muted)]"
                      }`}
                    >
                      {l.title}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

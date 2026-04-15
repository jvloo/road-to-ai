import type { Level } from "@/lib/types";

export interface LevelRowProps {
  level: Level;
  unlocked: boolean;
  isCurrent: boolean;
  onSelect: (id: string) => void;
}

function StatusDot({ status, current }: { status: Level["status"]; current: boolean }) {
  if (status === "done") {
    return (
      <span
        aria-hidden
        className="mt-[7px] inline-block h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent)]"
        style={{ boxShadow: "0 0 8px var(--color-accent-glow-strong)" }}
      />
    );
  }
  if (current) {
    return (
      <span
        aria-hidden
        className="mt-[5px] inline-block h-3 w-3 shrink-0 animate-pulse rounded-full border-2 border-[var(--color-accent)]"
      />
    );
  }
  return (
    <span
      aria-hidden
      className="mt-[7px] inline-block h-2 w-2 shrink-0 rounded-full border border-[var(--color-fg-faint)]"
    />
  );
}

export function LevelRow({ level, unlocked, isCurrent, onSelect }: LevelRowProps) {
  const disabled = !unlocked;
  return (
    <button
      type="button"
      onClick={() => !disabled && onSelect(level.id)}
      disabled={disabled}
      aria-current={isCurrent ? "step" : undefined}
      className={`group flex w-full items-start gap-4 border-b border-[var(--color-border)] px-4 py-4 text-left transition-colors last:border-b-0 ${
        disabled
          ? "cursor-not-allowed opacity-40"
          : "hover:bg-[var(--color-surface-2)]"
      } ${isCurrent ? "bg-[var(--color-surface-2)]" : ""}`}
    >
      <StatusDot status={level.status} current={isCurrent} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-faint)]">
            {level.id}
          </span>
          <h3 className="truncate text-base font-semibold text-[var(--color-fg-strong)] group-hover:text-[var(--color-accent)]">
            {level.title}
          </h3>
        </div>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-[var(--color-muted)]">
          <span>{level.xp} XP</span>
          {level.luminary && (
            <>
              <span className="text-[var(--color-fg-faint)]">·</span>
              <span>featuring {level.luminary}</span>
            </>
          )}
          {level.tags && level.tags.length > 0 && (
            <>
              <span className="text-[var(--color-fg-faint)]">·</span>
              <span className="text-[var(--color-fg-faint)]">
                {level.tags.slice(0, 2).join(" · ")}
              </span>
            </>
          )}
        </p>
      </div>
      <span
        aria-hidden
        className="mt-1 shrink-0 font-mono text-xs text-[var(--color-fg-faint)] group-hover:text-[var(--color-accent)]"
      >
        →
      </span>
    </button>
  );
}

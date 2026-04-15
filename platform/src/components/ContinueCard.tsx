import type { Level } from "@/lib/types";

export interface ContinueCardProps {
  level: Level;
  onOpen: () => void;
}

export function ContinueCard({ level, onOpen }: ContinueCardProps) {
  const trackName = level.track === "A" ? "Foundations" : "Frontier";
  return (
    <section className="pt-4">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
        // welcome back
      </p>
      <h1
        className="mt-3 font-semibold tracking-tight text-[var(--color-fg-strong)]"
        style={{ fontSize: "var(--text-title)", lineHeight: 1.1 }}
      >
        Road to AI
      </h1>

      <div
        className="mt-8 rounded-xl border border-[var(--color-accent)]/40 bg-[var(--color-surface-1)] p-8"
        style={{ boxShadow: "var(--shadow-accent), var(--shadow-card)" }}
      >
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
          ▸ continue
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-fg-strong)]">
          {level.id} · {level.title}
        </h2>
        <p className="mt-2 font-mono text-xs text-[var(--color-muted)]">
          {trackName} · Tier {level.tier} · {level.xp} XP
          {level.luminary ? ` · featuring ${level.luminary}` : ""}
        </p>
        <button
          onClick={onOpen}
          className="mt-6 rounded-md border border-[var(--color-accent)] bg-[var(--color-accent)] px-5 py-2.5 font-mono text-sm font-semibold text-[var(--color-accent-fg)] transition-opacity hover:opacity-90"
        >
          Open {level.id} →
        </button>
      </div>
    </section>
  );
}

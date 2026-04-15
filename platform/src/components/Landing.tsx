export interface LandingProps {
  onStart: () => void;
}

export function Landing({ onStart }: LandingProps) {
  return (
    <section className="pt-8">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
        // a journey from Euclid to GPT
      </p>
      <h1
        className="mt-4 font-semibold tracking-tight text-[var(--color-fg-strong)]"
        style={{ fontSize: "var(--text-display)", lineHeight: 1.02 }}
      >
        Road to AI
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-muted)]">
        Classical math to frontier models, self-paced. No streaks, no shortcuts,
        no pretending to understand. Every classical idea names its modern
        descendant; every modern idea traces its classical root.
      </p>

      <div
        className="mt-10 rounded-xl border border-[var(--color-accent)]/40 bg-[var(--color-surface-1)] p-8"
        style={{ boxShadow: "var(--shadow-accent), var(--shadow-card)" }}
      >
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-accent)]">
          ▸ begin here
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-fg-strong)]">
          F00 · Welcome to Road to AI
        </h2>
        <p className="mt-2 font-mono text-xs text-[var(--color-muted)]">
          1 XP · 10 minutes · meta tier
        </p>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-muted)]">
          A one-level introduction to how this curriculum works — the two-track
          structure, XP, luminaries, and the mindset. You'll be ready for the
          real material in 10 minutes.
        </p>
        <button
          onClick={onStart}
          className="mt-6 rounded-md border border-[var(--color-accent)] bg-[var(--color-accent)] px-5 py-2.5 font-mono text-sm font-semibold text-[var(--color-accent-fg)] transition-opacity hover:opacity-90"
        >
          Start F00 →
        </button>
      </div>
    </section>
  );
}

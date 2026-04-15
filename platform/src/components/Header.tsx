export interface HeaderProps {
  xp: number;
  tier: string;
}

export function Header({ xp, tier }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-[var(--color-bg)]/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a
          href="#/"
          className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] hover:text-[var(--color-fg)]"
        >
          // road-to-ai
        </a>
        <nav className="flex items-center gap-6 font-mono text-xs uppercase tracking-wide">
          <a href="#/" className="text-[var(--color-fg)] hover:text-[var(--color-accent)]">
            trail
          </a>
          <a
            href="#/library"
            className="text-[var(--color-muted)] hover:text-[var(--color-accent)]"
          >
            library
          </a>
        </nav>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-[var(--color-muted)]">{xp} XP</span>
          <span className="text-[var(--color-fg-faint)]">·</span>
          <span className="uppercase tracking-wide text-[var(--color-accent)]">{tier}</span>
        </div>
      </div>
    </header>
  );
}

export function LuminarySpotlight({ name }: { name: string }) {
  const initials = name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <aside className="mt-6 flex items-center gap-3 rounded border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-accent)] font-mono text-sm text-[var(--color-accent)]">
        {initials}
      </div>
      <div>
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--color-muted)]">// luminary</p>
        <p className="text-lg font-medium">{name}</p>
      </div>
    </aside>
  );
}

export function TierBadge({ tier }: { tier: string }) {
  return (
    <span className="inline-block rounded border border-[var(--color-border)] px-2 py-0.5 font-mono text-xs uppercase tracking-wide text-[var(--color-muted)]">
      {tier}
    </span>
  );
}

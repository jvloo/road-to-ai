const BANDS = [
  { name: "Novice", min: 0 },
  { name: "Apprentice", min: 100 },
  { name: "Journeyman", min: 400 },
  { name: "Practitioner", min: 1000 },
  { name: "Specialist", min: 2000 },
  { name: "Researcher", min: 3500 },
];

export function XpBar({ xp }: { xp: number }) {
  let currentIdx = 0;
  for (let i = 0; i < BANDS.length; i++) {
    if (xp >= (BANDS[i]?.min ?? 0)) currentIdx = i;
  }
  const current = BANDS[currentIdx]!;
  const next = BANDS[currentIdx + 1];
  const pct = next ? Math.min(100, ((xp - current.min) / (next.min - current.min)) * 100) : 100;

  return (
    <div className="w-full">
      <div className="flex justify-between font-mono text-xs uppercase tracking-wide text-[var(--color-muted)]">
        <span>{current.name}</span>
        <span>{xp} XP</span>
        {next && <span>{next.name}</span>}
      </div>
      <div className="mt-2 h-1 w-full rounded bg-[var(--color-border)] overflow-hidden">
        <div
          className="h-full bg-[var(--color-accent)] transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

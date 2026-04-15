import type { Level } from "@/lib/types";
import { Divider } from "./Divider";

export function RecallHeader({ levels }: { levels: Level[] }) {
  if (!levels.length) return null;
  return (
    <section>
      <Divider>previously on your path</Divider>
      <ul className="space-y-1 font-mono text-xs text-[var(--color-muted)]">
        {levels.map((l) => (
          <li key={l.id}>
            <span className="mr-2 text-[var(--color-accent)]">✓</span>
            {l.id} — {l.title}
          </li>
        ))}
      </ul>
    </section>
  );
}

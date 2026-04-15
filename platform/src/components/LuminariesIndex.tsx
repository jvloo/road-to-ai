import { useMemo } from "react";
import type { Level } from "@/lib/types";
import { Divider } from "./Divider";

export function LuminariesIndex({ levels }: { levels: Level[] }) {
  const byName = useMemo(() => {
    const map = new Map<string, Level[]>();
    for (const l of levels) {
      if (!l.luminary) continue;
      const list = map.get(l.luminary) ?? [];
      list.push(l);
      map.set(l.luminary, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [levels]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <p className="font-mono text-xs uppercase tracking-wide text-[var(--color-muted)]">// luminaries</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">People you'll meet on the road</h1>
      <Divider>index</Divider>
      <ul className="divide-y divide-[var(--color-border)]">
        {byName.map(([name, entries]) => (
          <li key={name} className="flex items-baseline justify-between py-2">
            <span>{name}</span>
            <span className="font-mono text-xs text-[var(--color-muted)]">
              {entries.map((e) => e.id).join(" · ")}
            </span>
          </li>
        ))}
      </ul>
      {byName.length === 0 && (
        <p className="font-mono text-xs text-[var(--color-muted)]">// no luminaries yet — add a `luminary:` frontmatter field</p>
      )}
    </main>
  );
}

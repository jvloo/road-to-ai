import { useEffect, useState } from "react";
import { loadGlossary, type GlossaryEntry } from "@/lib/glossary";
import { Divider } from "./Divider";

export function Glossary() {
  const [entries, setEntries] = useState<GlossaryEntry[]>([]);
  useEffect(() => {
    void loadGlossary().then((e) => setEntries(e.sort((a, b) => a.term.localeCompare(b.term))));
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <p className="font-mono text-xs uppercase tracking-wide text-[var(--color-muted)]">// glossary</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Glossary</h1>
      <Divider>terms</Divider>
      <dl className="divide-y divide-[var(--color-border)]">
        {entries.map((e) => (
          <div key={e.term} className="py-3">
            <dt className="font-mono text-sm">{e.term}</dt>
            <dd className="mt-1 text-[var(--color-muted)]" dangerouslySetInnerHTML={{ __html: e.body }} />
          </div>
        ))}
      </dl>
    </main>
  );
}

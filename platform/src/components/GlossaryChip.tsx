import { useState } from "react";
import type { GlossaryEntry } from "@/lib/glossary";

export function GlossaryChip({ entry, children }: { entry: GlossaryEntry; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline">
      <button
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
        className="border-b border-dotted border-[var(--color-accent)] font-mono text-[0.95em]"
      >
        {children}
      </button>
      {open && (
        <span className="absolute bottom-full left-0 z-10 mb-1 w-64 rounded border border-[var(--color-border)] bg-[var(--color-surface)] p-2 text-sm shadow-md">
          <strong className="font-mono text-xs">{entry.term}</strong>
          <span className="mt-1 block" dangerouslySetInnerHTML={{ __html: entry.body }} />
        </span>
      )}
    </span>
  );
}

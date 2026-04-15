import { useMemo } from "react";
import type { Level } from "@/lib/types";
import { Divider } from "./Divider";

interface Props {
  recentDone: Level[];
  onClose: () => void;
}

export function RecallChallenge({ recentDone, onClose }: Props) {
  const questions = useMemo(
    () =>
      recentDone.slice(-5).flatMap((l) =>
        l.quiz?.slice(0, 1) ?? [{ q: `Can you still explain "${l.title}" without looking?`, type: "self-attest" as const }],
      ),
    [recentDone],
  );
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/80 p-6">
      <div className="w-full max-w-xl rounded-lg border border-[var(--color-accent)] bg-[var(--color-bg)] p-6">
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--color-accent)]">// recall challenge</p>
        <Divider>checkpoint</Divider>
        <ol className="space-y-3 text-sm">
          {questions.map((q, i) => (
            <li key={i}>{q.q}</li>
          ))}
        </ol>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-fg)]">
            skip
          </button>
          <button
            onClick={onClose}
            className="rounded border border-[var(--color-accent)] bg-[var(--color-accent)] px-3 py-1 font-mono text-xs text-[var(--color-accent-fg)]"
          >
            done reflecting
          </button>
        </div>
      </div>
    </div>
  );
}

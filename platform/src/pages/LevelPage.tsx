import { useStore } from "@/store/useStore";
import { LevelPane } from "@/components/LevelPane";

export function LevelPage() {
  const selectedId = useStore((s) => s.selectedId);
  const levels = useStore((s) => s.levels);
  const select = useStore((s) => s.select);
  const markDone = useStore((s) => s.markDone);

  const level = levels.find((l) => l.id === selectedId);
  if (!level) return null;

  return (
    <div className="fixed inset-0 z-10 flex bg-[var(--color-bg)]/95 backdrop-blur">
      <div className="mx-auto my-2 md:my-8 w-full max-w-3xl overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]">
        <div className="flex justify-end p-4">
          <button
            onClick={() => select(null)}
            className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-fg)]"
            aria-label="Close level"
          >
            [close]
          </button>
        </div>
        <LevelPane level={level} onMarkDone={markDone} />
      </div>
    </div>
  );
}

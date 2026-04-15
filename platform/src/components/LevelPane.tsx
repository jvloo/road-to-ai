import { useEffect, useState } from "react";
import type { Level } from "@/lib/types";
import { renderMarkdown } from "@/lib/markdown";
import { Divider } from "./Divider";
import { LuminarySpotlight } from "./LuminarySpotlight";
import { RecallHeader } from "./RecallHeader";
import { LevelQuiz } from "./LevelQuiz";
import { useStore } from "@/store/useStore";
import { pickRecallLevels } from "@/lib/recall";

export interface LevelPaneProps {
  level: Level;
  onMarkDone: (id: string) => void;
}

export function LevelPane({ level, onMarkDone }: LevelPaneProps) {
  const [html, setHtml] = useState<string>("");
  const allLevels = useStore((s) => s.levels);
  const progress = useStore((s) => s.progress);
  const recall = pickRecallLevels(level, allLevels, progress);

  useEffect(() => {
    let cancelled = false;
    renderMarkdown(level.body).then((h) => { if (!cancelled) setHtml(h); });
    return () => { cancelled = true; };
  }, [level.body]);

  return (
    <article className="mx-auto max-w-prose px-6 py-10">
      <p className="font-mono text-xs uppercase tracking-wide text-[var(--color-muted)]">
        {`// ${level.track === "A" ? "foundations" : "frontier"} · tier ${level.tier}`}
      </p>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="font-mono text-sm text-[var(--color-muted)]">{level.id}</span>
        <h1 className="text-3xl font-semibold tracking-tight">{level.title}</h1>
      </div>
      <p className="mt-2 font-mono text-xs text-[var(--color-muted)]">
        {level.xp} XP · {level.status}
      </p>

      {level.luminary && <LuminarySpotlight name={level.luminary} />}
      <RecallHeader levels={recall} />

      <Divider>content</Divider>
      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {level.quiz && level.quiz.length > 0 && <LevelQuiz questions={level.quiz} />}

      {level.status !== "done" && (
        <>
          <Divider>action</Divider>
          <button
            onClick={() => onMarkDone(level.id)}
            className="rounded border border-[var(--color-accent)] bg-[var(--color-accent)] px-4 py-2 font-mono text-sm text-[var(--color-accent-fg)] hover:opacity-90"
          >
            Mark done · +{level.xp} XP
          </button>
        </>
      )}
    </article>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/store/useStore";
import { Header } from "@/components/Header";
import { LevelSidebar } from "@/components/level/LevelSidebar";
import { LevelMetaRail } from "@/components/level/LevelMetaRail";
import { LuminarySpotlight } from "@/components/LuminarySpotlight";
import { RecallHeader } from "@/components/RecallHeader";
import { LevelQuiz } from "@/components/LevelQuiz";
import { renderMarkdown } from "@/lib/markdown";
import { tierById, bandForXp } from "@/lib/meta";
import { pickRecallLevels } from "@/lib/recall";

export interface LevelViewProps {
  levelId: string;
}

export function LevelView({ levelId }: LevelViewProps) {
  const levels = useStore((s) => s.levels);
  const progress = useStore((s) => s.progress);
  const load = useStore((s) => s.load);
  const markDone = useStore((s) => s.markDone);
  const [html, setHtml] = useState("");

  useEffect(() => {
    void load();
  }, [load]);

  const level = useMemo(() => levels.find((l) => l.id === levelId), [levels, levelId]);

  useEffect(() => {
    if (!level) return;
    let cancelled = false;
    renderMarkdown(level.body).then((h) => {
      if (!cancelled) setHtml(h);
    });
    return () => {
      cancelled = true;
    };
  }, [level]);

  const tier = level ? tierById(level.tier) : undefined;
  const tierLevels = useMemo(
    () =>
      level
        ? levels.filter((l) => l.tier === level.tier).sort((a, b) => a.id.localeCompare(b.id))
        : [],
    [levels, level],
  );
  const recall = useMemo(
    () => (level ? pickRecallLevels(level, levels, progress) : []),
    [level, levels, progress],
  );

  const currentIndex = level ? tierLevels.findIndex((l) => l.id === level.id) : -1;
  const prev = currentIndex > 0 ? tierLevels[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < tierLevels.length - 1
    ? tierLevels[currentIndex + 1]
    : null;

  const xp = progress.xp_total;
  const { curr: band } = bandForXp(xp);

  const navigate = (id: string) => {
    window.location.hash = `#/level/${id}`;
  };
  const backToTrail = () => {
    window.location.hash = "#/";
  };

  if (!level || !tier) {
    return (
      <div className="min-h-screen">
        <Header xp={xp} tier={band.name} />
        <main className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="font-mono text-sm text-[var(--color-muted)]">
            Level not found. <button onClick={backToTrail} className="text-[var(--color-accent)] underline">Back to trail</button>
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header xp={xp} tier={band.name} />

      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-[16rem_1fr] xl:grid-cols-[16rem_1fr_18rem]">
        <LevelSidebar
          tier={tier}
          levels={tierLevels}
          currentId={level.id}
          onNavigate={navigate}
          onBackToTrail={backToTrail}
        />

        <main className="min-w-0 px-6 py-10 lg:px-10">
          <nav className="flex items-center justify-between font-mono text-xs">
            <button
              onClick={prev ? () => navigate((prev as { id: string }).id) : undefined}
              disabled={!prev}
              className={`${
                prev
                  ? "text-[var(--color-muted)] hover:text-[var(--color-accent)]"
                  : "cursor-default text-[var(--color-fg-faint)]"
              }`}
            >
              {prev ? `← ${prev.id} ${prev.title}` : "← start of tier"}
            </button>
            <button
              onClick={next ? () => navigate((next as { id: string }).id) : undefined}
              disabled={!next}
              className={`${
                next
                  ? "text-[var(--color-muted)] hover:text-[var(--color-accent)]"
                  : "cursor-default text-[var(--color-fg-faint)]"
              }`}
            >
              {next ? `${next.id} ${next.title} →` : "end of tier →"}
            </button>
          </nav>

          <header className="mt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
              // {level.track === "A" ? "foundations" : "frontier"} · tier {tier.id} · {tier.name}
            </p>
            <div className="mt-3 flex items-baseline gap-4">
              <span className="font-mono text-sm text-[var(--color-fg-faint)]">{level.id}</span>
              <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-fg-strong)]">
                {level.title}
              </h1>
            </div>
            <p className="mt-3 font-mono text-xs text-[var(--color-muted)]">
              {level.xp} XP · {level.status}
              {level.luminary ? ` · featuring ${level.luminary}` : ""}
            </p>
          </header>

          {level.luminary && <LuminarySpotlight name={level.luminary} />}
          <RecallHeader levels={recall} />

          <div
            className="prose prose-invert mt-10 max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {level.quiz && level.quiz.length > 0 && <LevelQuiz questions={level.quiz} />}

          <div className="mt-12 flex flex-col items-start gap-4 border-t border-[var(--color-border)] pt-8 sm:flex-row sm:items-center sm:justify-between">
            {level.status !== "done" ? (
              <button
                onClick={() => markDone(level.id)}
                className="rounded-md border border-[var(--color-accent)] bg-[var(--color-accent)] px-5 py-2.5 font-mono text-sm font-semibold text-[var(--color-accent-fg)] hover:opacity-90"
              >
                Mark done · +{level.xp} XP
              </button>
            ) : (
              <span className="font-mono text-xs text-[var(--color-fg-faint)]">
                ✓ completed{level.completed_at ? ` on ${level.completed_at}` : ""}
              </span>
            )}
            {next && (
              <button
                onClick={() => navigate((next as { id: string }).id)}
                className="font-mono text-xs text-[var(--color-muted)] hover:text-[var(--color-accent)]"
              >
                up next → {next.id} {next.title}
              </button>
            )}
          </div>
        </main>

        <LevelMetaRail level={level} onMarkDone={() => markDone(level.id)} />
      </div>
    </div>
  );
}

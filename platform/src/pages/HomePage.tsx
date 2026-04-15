import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { SkillTree } from "@/components/SkillTree";
import { ProgressDashboard } from "@/components/ProgressDashboard";
import { Divider } from "@/components/Divider";

export function HomePage() {
  const levels = useStore((s) => s.levels);
  const progress = useStore((s) => s.progress);
  const load = useStore((s) => s.load);
  const select = useStore((s) => s.select);

  useEffect(() => { void load(); }, [load]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <nav className="mb-8 flex gap-4 font-mono text-xs uppercase tracking-wide">
        <a href="#/" className="text-[var(--color-accent)]">home</a>
        <a href="#/luminaries" className="text-[var(--color-muted)] hover:text-[var(--color-fg)]">luminaries</a>
        <a href="#/glossary" className="text-[var(--color-muted)] hover:text-[var(--color-fg)]">glossary</a>
        <a href="#/settings" className="text-[var(--color-muted)] hover:text-[var(--color-fg)]">settings</a>
      </nav>
      <p className="font-mono text-xs uppercase tracking-wide text-[var(--color-muted)]">// road-to-ai</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Road to AI</h1>
      <p className="mt-4 text-[var(--color-muted)]">
        A gamified, open-source path from math to world models. Click any unlocked node to begin.
      </p>
      <Divider>progress</Divider>
      <ProgressDashboard progress={progress} />
      <Divider>skill tree</Divider>
      <SkillTree levels={levels} onSelect={select} />
    </main>
  );
}

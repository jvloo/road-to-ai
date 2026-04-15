import { create } from "zustand";
import type { Level } from "@/lib/types";
import { loadCurriculum } from "@/lib/curriculum";
import { loadProgress, markLevelDone, saveProgress, type Progress } from "@/lib/progress";
import { checkAchievements } from "@/lib/achievements";
import { shouldShowChallenge } from "@/lib/recall";

export interface ToastItem {
  id: string;
  title: string;
  subtitle?: string;
}

interface StoreState {
  levels: Level[];
  loaded: boolean;
  selectedId: string | null;
  progress: Progress;
  challengeOpen: boolean;
  toasts: ToastItem[];
  load: () => Promise<void>;
  select: (id: string | null) => void;
  markDone: (id: string) => void;
  dismissChallenge: () => void;
  dismissToast: (id: string) => void;
}

const ACHIEVEMENT_TITLES: Record<string, { title: string; subtitle: string }> = {
  "first-step": { title: "First Step", subtitle: "you completed your first level" },
  "met-10-luminaries": { title: "Council of Ten", subtitle: "you've met 10 luminaries" },
  "met-25-luminaries": { title: "Pantheon", subtitle: "you've met 25 luminaries" },
  "glossary-trailblazer": { title: "Glossary Trailblazer", subtitle: "terms explored across levels" },
};

export const useStore = create<StoreState>((set, get) => ({
  levels: [],
  loaded: false,
  selectedId: null,
  progress: loadProgress(),
  challengeOpen: false,
  toasts: [],
  async load() {
    if (get().loaded) return;
    const rawLevels = await loadCurriculum();
    const prog = get().progress;
    const levels = rawLevels.map((l) => {
      const saved = prog.levels[l.id];
      return saved ? { ...l, status: saved.status, completed_at: saved.completed_at ?? null } : l;
    });
    set({ levels, loaded: true });
  },
  select(id) {
    set({ selectedId: id });
    if (typeof window !== "undefined") {
      window.location.hash = id ? `#/level/${id}` : "#/";
    }
  },
  markDone(id) {
    const s = get();
    const level = s.levels.find((l) => l.id === id);
    if (!level) return;
    let progress = markLevelDone(s.progress, id, level.xp);
    const levels = s.levels.map((l) =>
      l.id === id ? { ...l, status: "done" as const, completed_at: new Date().toISOString().slice(0, 10) } : l,
    );
    const newAwards = checkAchievements(progress, levels);
    let toasts = s.toasts;
    if (newAwards.length) {
      progress = { ...progress, achievements: [...progress.achievements, ...newAwards] };
      const newToasts: ToastItem[] = newAwards.map((a) => {
        const meta = ACHIEVEMENT_TITLES[a.id];
        return {
          id: `${a.id}-${a.earned_at}`,
          title: meta?.title ?? a.id,
          subtitle: meta?.subtitle,
        };
      });
      toasts = [...toasts, ...newToasts];
    }
    saveProgress(progress);
    const challengeOpen = shouldShowChallenge(progress);
    set({ progress, levels, challengeOpen, toasts });
  },
  dismissChallenge() { set({ challengeOpen: false }); },
  dismissToast(id) {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },
}));

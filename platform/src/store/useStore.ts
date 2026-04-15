import { create } from "zustand";
import type { Level } from "@/lib/types";
import { loadCurriculum } from "@/lib/curriculum";
import { loadProgress, markLevelDone, saveProgress, type Progress } from "@/lib/progress";
import { checkAchievements } from "@/lib/achievements";
import { shouldShowChallenge } from "@/lib/recall";

interface StoreState {
  levels: Level[];
  loaded: boolean;
  selectedId: string | null;
  progress: Progress;
  challengeOpen: boolean;
  load: () => Promise<void>;
  select: (id: string | null) => void;
  markDone: (id: string) => void;
  dismissChallenge: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
  levels: [],
  loaded: false,
  selectedId: null,
  progress: loadProgress(),
  challengeOpen: false,
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
  select(id) { set({ selectedId: id }); },
  markDone(id) {
    const s = get();
    const level = s.levels.find((l) => l.id === id);
    if (!level) return;
    let progress = markLevelDone(s.progress, id, level.xp);
    const levels = s.levels.map((l) =>
      l.id === id ? { ...l, status: "done" as const, completed_at: new Date().toISOString().slice(0, 10) } : l,
    );
    const newAwards = checkAchievements(progress, levels);
    if (newAwards.length) {
      progress = { ...progress, achievements: [...progress.achievements, ...newAwards] };
    }
    saveProgress(progress);
    const challengeOpen = shouldShowChallenge(progress);
    set({ progress, levels, challengeOpen });
  },
  dismissChallenge() { set({ challengeOpen: false }); },
}));

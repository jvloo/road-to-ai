import { create } from "zustand";
import type { Level } from "@/lib/types";
import { loadCurriculum } from "@/lib/curriculum";

interface StoreState {
  levels: Level[];
  loaded: boolean;
  selectedId: string | null;
  load: () => Promise<void>;
  select: (id: string | null) => void;
  markDone: (id: string) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  levels: [],
  loaded: false,
  selectedId: null,
  async load() {
    if (get().loaded) return;
    const levels = await loadCurriculum();
    set({ levels, loaded: true });
  },
  select(id) {
    set({ selectedId: id });
  },
  markDone(id) {
    set((s) => ({
      levels: s.levels.map((l) =>
        l.id === id
          ? { ...l, status: "done" as const, completed_at: new Date().toISOString().slice(0, 10) }
          : l,
      ),
    }));
    // Persistence to progress.json comes in Task 15.
  },
}));

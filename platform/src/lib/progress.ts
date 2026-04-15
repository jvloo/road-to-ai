export interface LevelProgress {
  status: "pending" | "in-progress" | "done";
  completed_at?: string;
  started_at?: string;
}

export interface AchievementEntry {
  id: string;
  earned_at: string;
}

export interface Progress {
  version: number;
  user: string;
  xp_total: number;
  tier: string;
  started_at: string | null;
  last_session_at: string | null;
  levels: Record<string, LevelProgress>;
  achievements: AchievementEntry[];
  stats: {
    sessions: number;
    hours_logged: number;
    levels_done: number;
  };
}

const STORAGE_KEY = "road-to-ai:progress:v1";

function defaultProgress(): Progress {
  return {
    version: 1,
    user: "local",
    xp_total: 0,
    tier: "Novice",
    started_at: null,
    last_session_at: null,
    levels: {},
    achievements: [],
    stats: { sessions: 0, hours_logged: 0, levels_done: 0 },
  };
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw) as Progress;
    return { ...defaultProgress(), ...parsed };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(p: Progress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

const TIERS: Array<{ name: string; min: number }> = [
  { name: "Novice", min: 0 },
  { name: "Apprentice", min: 100 },
  { name: "Journeyman", min: 400 },
  { name: "Practitioner", min: 1000 },
  { name: "Specialist", min: 2000 },
  { name: "Researcher", min: 3500 },
];

export function computeTier(xp: number): string {
  let tier = TIERS[0]!.name;
  for (const t of TIERS) if (xp >= t.min) tier = t.name;
  return tier;
}

export function markLevelDone(p: Progress, id: string, xp: number): Progress {
  const today = new Date().toISOString().slice(0, 10);
  const wasDone = p.levels[id]?.status === "done";
  const xpDelta = wasDone ? 0 : xp;
  const xp_total = p.xp_total + xpDelta;
  return {
    ...p,
    xp_total,
    tier: computeTier(xp_total),
    last_session_at: today,
    started_at: p.started_at ?? today,
    levels: { ...p.levels, [id]: { status: "done", completed_at: today } },
    stats: {
      ...p.stats,
      levels_done: p.stats.levels_done + (wasDone ? 0 : 1),
    },
  };
}

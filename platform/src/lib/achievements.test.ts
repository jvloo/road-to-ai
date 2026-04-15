import { describe, it, expect } from "vitest";
import { checkAchievements } from "./achievements";
import type { Progress } from "./progress";
import type { Level } from "./types";

const mkLevel = (o: Partial<Level>): Level => ({
  id: "F00", title: "", track: "A", tier: 0, xp: 1, prereqs: [], unlocks: [],
  status: "pending", completed_at: null, body: "", slug: "", sourcePath: "", ...o,
});

const mkProgress = (overrides: Partial<Progress> = {}): Progress => ({
  version: 1, user: "local", xp_total: 0, tier: "Novice", started_at: null, last_session_at: null,
  levels: {}, achievements: [], stats: { sessions: 0, hours_logged: 0, levels_done: 0 }, ...overrides,
});

describe("checkAchievements", () => {
  it("awards first-step on first level completion", () => {
    const p = mkProgress({ stats: { sessions: 0, hours_logged: 0, levels_done: 1 } });
    const newAwards = checkAchievements(p, [mkLevel({})]);
    expect(newAwards.map((a) => a.id)).toContain("first-step");
  });

  it("does not re-award previously earned achievements", () => {
    const p = mkProgress({
      stats: { sessions: 0, hours_logged: 0, levels_done: 1 },
      achievements: [{ id: "first-step", earned_at: "2026-04-15" }],
    });
    const newAwards = checkAchievements(p, [mkLevel({})]);
    expect(newAwards.map((a) => a.id)).not.toContain("first-step");
  });

  it("awards met-10-luminaries when 10 distinct luminaries have been encountered in done levels", () => {
    const levels = Array.from({ length: 10 }, (_, i) =>
      mkLevel({ id: `F${i}`, luminary: `Person ${i}`, status: "done" }),
    );
    const p = mkProgress({
      levels: Object.fromEntries(levels.map((l) => [l.id, { status: "done" as const }])),
    });
    const newAwards = checkAchievements(p, levels);
    expect(newAwards.map((a) => a.id)).toContain("met-10-luminaries");
  });
});

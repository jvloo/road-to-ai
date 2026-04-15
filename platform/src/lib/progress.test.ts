import { describe, it, expect, beforeEach } from "vitest";
import { loadProgress, saveProgress, markLevelDone } from "./progress";

beforeEach(() => { localStorage.clear(); });

describe("progress", () => {
  it("returns a default progress shape when none is saved", () => {
    const p = loadProgress();
    expect(p.version).toBe(1);
    expect(p.xp_total).toBe(0);
    expect(p.tier).toBe("Novice");
    expect(Object.keys(p.levels)).toHaveLength(0);
  });

  it("round-trips saved progress", () => {
    const p = loadProgress();
    p.xp_total = 50;
    p.levels["F00"] = { status: "done", completed_at: "2026-04-15" };
    saveProgress(p);
    const p2 = loadProgress();
    expect(p2.xp_total).toBe(50);
    expect(p2.levels["F00"]?.status).toBe("done");
  });

  it("markLevelDone updates status, timestamp, and xp", () => {
    const p = markLevelDone(loadProgress(), "F00", 3);
    expect(p.levels["F00"]?.status).toBe("done");
    expect(p.levels["F00"]?.completed_at).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(p.xp_total).toBe(3);
  });

  it("markLevelDone does not double-award xp", () => {
    let p = markLevelDone(loadProgress(), "F00", 3);
    p = markLevelDone(p, "F00", 3);
    expect(p.xp_total).toBe(3);
  });

  it("computes tier from xp_total", () => {
    const p = markLevelDone(loadProgress(), "F00", 150);
    expect(p.tier).toBe("Apprentice");
  });
});

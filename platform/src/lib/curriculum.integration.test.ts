import { describe, it, expect } from "vitest";
import { loadCurriculum } from "./curriculum";

describe("loadCurriculum (integration)", () => {
  it("loads all three starter levels", async () => {
    const levels = await loadCurriculum();
    expect(levels.length).toBeGreaterThanOrEqual(3);
    const ids = levels.map((l) => l.id);
    expect(ids).toContain("F00");
    expect(ids).toContain("F01");
    expect(ids).toContain("F02");
  });

  it("orders levels by id", async () => {
    const levels = await loadCurriculum();
    const ids = levels.map((l) => l.id);
    const sorted = [...ids].sort();
    expect(ids).toEqual(sorted);
  });

  it("parses the F02 luminary frontmatter", async () => {
    const levels = await loadCurriculum();
    const f02 = levels.find((l) => l.id === "F02");
    expect(f02).toBeDefined();
    expect(f02?.luminary).toBe("S. Keshav");
  });
});

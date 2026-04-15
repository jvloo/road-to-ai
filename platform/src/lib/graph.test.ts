import { describe, it, expect } from "vitest";
import { buildGraphElements } from "./graph";
import type { Level } from "./types";

const mkLevel = (overrides: Partial<Level>): Level => ({
  id: "F00",
  title: "T",
  track: "A",
  tier: 0,
  xp: 1,
  prereqs: [],
  unlocks: [],
  status: "pending",
  completed_at: null,
  body: "",
  slug: "f00",
  sourcePath: "",
  ...overrides,
});

describe("buildGraphElements", () => {
  it("creates one node per level", () => {
    const levels = [
      mkLevel({ id: "F00", unlocks: ["F01"] }),
      mkLevel({ id: "F01", prereqs: ["F00"] }),
    ];
    const els = buildGraphElements(levels);
    const nodes = els.filter((e) => e.group === "nodes");
    expect(nodes).toHaveLength(2);
    expect(nodes.map((n) => n.data.id).sort()).toEqual(["F00", "F01"]);
  });

  it("creates an edge for each prereq relationship", () => {
    const levels = [
      mkLevel({ id: "F00" }),
      mkLevel({ id: "F01", prereqs: ["F00"] }),
    ];
    const els = buildGraphElements(levels);
    const edges = els.filter((e) => e.group === "edges");
    expect(edges).toHaveLength(1);
    expect(edges[0]!.data.source).toBe("F00");
    expect(edges[0]!.data.target).toBe("F01");
  });

  it("marks unlocked levels whose prereqs are done", () => {
    const levels = [
      mkLevel({ id: "F00", status: "done" }),
      mkLevel({ id: "F01", prereqs: ["F00"], status: "pending" }),
      mkLevel({ id: "F02", prereqs: ["F00", "F01"], status: "pending" }),
    ];
    const els = buildGraphElements(levels);
    const byId = Object.fromEntries(
      els.filter((e) => e.group === "nodes").map((n) => [n.data.id, n.data]),
    );
    expect(byId["F01"]!.unlocked).toBe(true);
    expect(byId["F02"]!.unlocked).toBe(false);
  });
});

import { describe, it, expect } from "vitest";
import { parseLevel } from "./curriculum";

const sample = `---
id: F00
title: Welcome
track: A
tier: 0
xp: 1
prereqs: []
unlocks: [F01]
status: pending
completed_at: null
---

## Intro

Hello, **world**.
`;

describe("parseLevel", () => {
  it("parses frontmatter and body from a level markdown string", () => {
    const level = parseLevel(sample, "curriculum/levels/track-a/F00_welcome.md");
    expect(level.id).toBe("F00");
    expect(level.title).toBe("Welcome");
    expect(level.track).toBe("A");
    expect(level.tier).toBe(0);
    expect(level.xp).toBe(1);
    expect(level.prereqs).toEqual([]);
    expect(level.unlocks).toEqual(["F01"]);
    expect(level.body.trim().startsWith("## Intro")).toBe(true);
    expect(level.slug).toBe("F00_welcome");
  });

  it("throws on missing required frontmatter", () => {
    const bad = "---\ntitle: Missing ID\n---\n";
    expect(() => parseLevel(bad, "x.md")).toThrow(/missing.*id/i);
  });
});

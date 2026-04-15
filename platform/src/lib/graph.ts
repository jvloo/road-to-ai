import type { Level } from "./types";

export interface GraphNode {
  group: "nodes";
  data: {
    id: string;
    label: string;
    track: "A" | "B";
    tier: number;
    status: "pending" | "in-progress" | "done";
    unlocked: boolean;
    xp: number;
  };
}

export interface GraphEdge {
  group: "edges";
  data: {
    id: string;
    source: string;
    target: string;
  };
}

export type GraphElement = GraphNode | GraphEdge;

export function buildGraphElements(levels: Level[]): GraphElement[] {
  const byId = new Map(levels.map((l) => [l.id, l]));
  const elements: GraphElement[] = [];

  for (const level of levels) {
    const allPrereqsDone = level.prereqs.every((p) => byId.get(p)?.status === "done");
    const unlocked = level.prereqs.length === 0 || allPrereqsDone;

    elements.push({
      group: "nodes",
      data: {
        id: level.id,
        label: level.title,
        track: level.track,
        tier: level.tier,
        status: level.status,
        unlocked,
        xp: level.xp,
      },
    });

    for (const prereq of level.prereqs) {
      if (!byId.has(prereq)) continue;
      elements.push({
        group: "edges",
        data: {
          id: `${prereq}->${level.id}`,
          source: prereq,
          target: level.id,
        },
      });
    }
  }

  return elements;
}

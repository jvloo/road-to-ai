import cytoscape from "cytoscape";
import type { Core } from "cytoscape";
import { useEffect, useRef } from "react";
import type { Level } from "@/lib/types";
import { buildGraphElements } from "@/lib/graph";

export interface SkillTreeProps {
  levels: Level[];
  onSelect: (levelId: string) => void;
}

const STYLE: cytoscape.StylesheetStyle[] = [
  {
    selector: "node",
    style: {
      "background-color": "var(--color-surface)",
      "border-width": 1,
      "border-color": "var(--color-border)",
      label: "data(label)",
      "font-family": "var(--font-mono)",
      "font-size": 10,
      color: "var(--color-fg)",
      "text-valign": "bottom",
      "text-margin-y": 6,
      width: 32,
      height: 32,
    },
  },
  {
    selector: 'node[status = "done"]',
    style: { "background-color": "var(--color-accent)", "border-color": "var(--color-accent)" },
  },
  {
    selector: 'node[status = "in-progress"]',
    style: { "border-color": "var(--color-accent)", "border-width": 3 },
  },
  {
    selector: 'node[unlocked = "false"]',
    style: { opacity: 0.35 },
  },
  {
    selector: "edge",
    style: {
      width: 1,
      "line-color": "var(--color-border)",
      "target-arrow-color": "var(--color-border)",
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
    },
  },
];

export function SkillTree({ levels, onSelect }: SkillTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // Stringify `unlocked` so Cytoscape's `[attr = "value"]` selectors work
    const rawElements = buildGraphElements(levels);
    const elements = rawElements.map((e) => {
      if (e.group === "nodes") {
        return { ...e, data: { ...e.data, unlocked: String(e.data.unlocked) } };
      }
      return e;
    });
    cyRef.current = cytoscape({
      container: containerRef.current,
      elements: elements as cytoscape.ElementDefinition[],
      style: STYLE,
      layout: { name: "breadthfirst", directed: true, padding: 24, spacingFactor: 1.2 },
      wheelSensitivity: 0.2,
    });
    cyRef.current.on("tap", "node", (evt) => {
      const id = evt.target.data("id") as string | undefined;
      if (id) onSelect(id);
    });
    return () => {
      cyRef.current?.destroy();
      cyRef.current = null;
    };
  }, [levels, onSelect]);

  return (
    <>
      <div
        ref={containerRef}
        data-testid="skill-tree"
        className="h-[70vh] w-full rounded border border-[var(--color-border)]"
        role="img"
        aria-label="Skill tree graph"
      />
      <ul className="sr-only" aria-label="Skill tree list view">
        {levels.map((l) => (
          <li key={l.id}>
            <button onClick={() => onSelect(l.id)}>
              {l.id} — {l.title} ({l.status})
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

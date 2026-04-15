import cytoscape from "cytoscape";
import type { Core } from "cytoscape";
import { useEffect, useRef } from "react";
import type { Level } from "@/lib/types";
import { buildGraphElements } from "@/lib/graph";

export interface SkillTreeProps {
  levels: Level[];
  onSelect: (levelId: string) => void;
}

function readToken(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function buildStylesheet(): cytoscape.StylesheetStyle[] {
  const surface = readToken("--color-surface", "#0c0c1a");
  const border = readToken("--color-border", "#18182a");
  const fg = readToken("--color-fg", "#e4e4f0");
  const accent = readToken("--color-accent", "#22d3ee");
  const mono = readToken("--font-mono", "monospace");
  return [
    {
      selector: "node",
      style: {
        shape: "round-rectangle",
        "background-color": surface,
        "border-width": 1,
        "border-color": border,
        label: "data(id)",
        "font-family": mono,
        "font-size": 11,
        "font-weight": 600,
        color: fg,
        "text-valign": "center",
        "text-halign": "center",
        width: 56,
        height: 36,
      },
    },
    {
      selector: 'node[status = "done"]',
      style: {
        "background-color": accent,
        "border-color": accent,
        color: "#060610",
      },
    },
    {
      selector: 'node[status = "in-progress"]',
      style: { "border-color": accent, "border-width": 2 },
    },
    {
      selector: 'node[unlocked = "false"]',
      style: { opacity: 0.4 },
    },
    {
      selector: "node:selected",
      style: { "border-color": accent, "border-width": 2 },
    },
    {
      selector: "edge",
      style: {
        width: 1,
        "line-color": border,
        "target-arrow-color": border,
        "target-arrow-shape": "triangle",
        "arrow-scale": 0.8,
        "curve-style": "bezier",
      },
    },
  ];
}

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
      style: buildStylesheet(),
      layout: {
        name: "breadthfirst",
        directed: true,
        padding: 48,
        spacingFactor: 1.6,
        grid: true,
      },
      minZoom: 0.4,
      maxZoom: 2,
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
        className="h-[50vh] md:h-[70vh] w-full rounded border border-[var(--color-border)]"
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

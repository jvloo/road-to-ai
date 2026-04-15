import yaml from "js-yaml";
import type { Level, LevelFrontmatter } from "./types";

function basename(p: string): string {
  const m = p.match(/([^/\\]+)\.md$/);
  return m ? (m[1] as string) : p;
}

function splitFrontmatter(source: string): { data: unknown; content: string } {
  const normalized = source.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) return { data: {}, content: normalized };
  const end = normalized.indexOf("\n---", 4);
  if (end === -1) return { data: {}, content: normalized };
  const yamlBlock = normalized.slice(4, end);
  const rest = normalized.slice(end + 4).replace(/^\n/, "");
  return { data: yaml.load(yamlBlock) ?? {}, content: rest };
}

export function parseLevel(source: string, sourcePath: string): Level {
  const { data, content } = splitFrontmatter(source);
  const fm = data as Partial<LevelFrontmatter>;

  if (!fm.id) throw new Error(`Level at ${sourcePath} is missing required frontmatter: id`);
  if (!fm.title) throw new Error(`Level at ${sourcePath} is missing required frontmatter: title`);
  if (!fm.track) throw new Error(`Level at ${sourcePath} is missing required frontmatter: track`);
  if (fm.tier === undefined) throw new Error(`Level at ${sourcePath} is missing required frontmatter: tier`);
  if (fm.xp === undefined) throw new Error(`Level at ${sourcePath} is missing required frontmatter: xp`);

  const level: Level = {
    id: fm.id,
    title: fm.title,
    track: fm.track,
    tier: fm.tier,
    xp: fm.xp,
    prereqs: fm.prereqs ?? [],
    unlocks: fm.unlocks ?? [],
    status: fm.status ?? "pending",
    completed_at: fm.completed_at ?? null,
    tags: fm.tags,
    achievements: fm.achievements,
    luminary: fm.luminary ?? null,
    glossary_terms: fm.glossary_terms,
    recall_of: fm.recall_of,
    quiz: fm.quiz,
    body: content,
    slug: basename(sourcePath),
    sourcePath,
  };
  return level;
}

export async function loadCurriculum(): Promise<Level[]> {
  const modules = import.meta.glob("../../../curriculum/levels/**/*.md", {
    eager: true,
    query: "?raw",
    import: "default",
  }) as Record<string, string>;

  const levels: Level[] = [];
  for (const [path, source] of Object.entries(modules)) {
    levels.push(parseLevel(source, path));
  }
  return levels.sort((a, b) => a.id.localeCompare(b.id));
}

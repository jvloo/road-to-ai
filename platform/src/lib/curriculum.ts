import matter from "gray-matter";
import type { Level, LevelFrontmatter } from "./types";

function basename(p: string): string {
  const m = p.match(/([^/\\]+)\.md$/);
  return m ? (m[1] as string) : p;
}

export function parseLevel(source: string, sourcePath: string): Level {
  const { data, content } = matter(source);
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

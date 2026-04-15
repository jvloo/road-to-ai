import { renderMarkdown } from "./markdown";

export interface GlossaryEntry {
  term: string;
  body: string; // rendered HTML (after renderMarkdown)
}

export interface RawGlossaryEntry {
  term: string;
  body: string; // raw markdown
}

export function parseGlossary(source: string): RawGlossaryEntry[] {
  const lines = source.split("\n");
  const entries: RawGlossaryEntry[] = [];
  let current: { term: string; buf: string[] } | null = null;
  for (const line of lines) {
    const m = /^## (.+)$/.exec(line);
    if (m) {
      if (current) entries.push({ term: current.term, body: current.buf.join("\n").trim() });
      current = { term: (m[1] as string).trim(), buf: [] };
      continue;
    }
    if (current) current.buf.push(line);
  }
  if (current) entries.push({ term: current.term, body: current.buf.join("\n").trim() });
  return entries;
}

export async function loadGlossary(): Promise<GlossaryEntry[]> {
  const modules = import.meta.glob("../../../curriculum/glossary.md", {
    eager: true,
    query: "?raw",
    import: "default",
  }) as Record<string, string>;
  const src = Object.values(modules)[0] ?? "";
  const raw = parseGlossary(src);
  const rendered = await Promise.all(
    raw.map(async (e) => ({ term: e.term, body: await renderMarkdown(e.body) })),
  );
  return rendered;
}

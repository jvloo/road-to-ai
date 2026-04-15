import { getHighlighter, type Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

export function getShikiHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = getHighlighter({
      themes: ["github-dark", "github-light"],
      langs: ["python", "typescript", "javascript", "bash", "yaml", "json", "tsx", "jsx", "html", "css"],
    });
  }
  return highlighterPromise;
}

/**
 * Replace <pre><code class="language-xxx">…</code></pre> blocks from rehype
 * with Shiki-highlighted HTML. Non-matching (unknown-lang or mermaid) blocks
 * pass through untouched for other post-processors to handle.
 */
export async function highlightHtml(html: string): Promise<string> {
  const highlighter = await getShikiHighlighter();
  return html.replace(
    /<pre><code class="language-([\w-]+)">([\s\S]*?)<\/code><\/pre>/g,
    (full, lang: string, raw: string) => {
      if (lang === "mermaid") return full; // leave for mermaid post-processor
      const code = raw
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"');
      try {
        return highlighter.codeToHtml(code, { lang, themes: { dark: "github-dark", light: "github-light" } });
      } catch {
        return full; // unknown lang — leave unchanged
      }
    },
  );
}

import mermaid from "mermaid";

let initialized = false;
function init() {
  if (initialized) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    fontFamily: "JetBrains Mono, ui-monospace, monospace",
    securityLevel: "strict",
  });
  initialized = true;
}

export async function renderMermaid(html: string): Promise<string> {
  init();
  const matches = [...html.matchAll(/<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g)];
  let result = html;
  let i = 0;
  for (const match of matches) {
    const raw = match[1] as string;
    const code = raw
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"');
    try {
      const { svg } = await mermaid.render(`mermaid-${i++}-${Date.now()}`, code);
      result = result.replace(match[0], svg);
    } catch (err) {
      result = result.replace(
        match[0],
        `<pre class="text-xs text-red-500">Mermaid render error: ${(err as Error).message}</pre>`,
      );
    }
  }
  return result;
}

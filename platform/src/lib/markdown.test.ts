import { describe, it, expect } from "vitest";
import { renderMarkdown } from "./markdown";

describe("renderMarkdown", () => {
  it("renders headings and paragraphs as HTML", async () => {
    const html = await renderMarkdown("# Hello\n\nWorld.");
    expect(html).toContain("<h1>Hello</h1>");
    expect(html).toContain("<p>World.</p>");
  });

  it("renders inline math with KaTeX", async () => {
    const html = await renderMarkdown("The equation $E=mc^2$ is famous.");
    expect(html).toMatch(/katex/);
  });

  it("passes through fenced code unchanged for Shiki later", async () => {
    const html = await renderMarkdown("```python\nprint('hi')\n```");
    expect(html).toMatch(/<pre><code class="language-python">/);
  });
});

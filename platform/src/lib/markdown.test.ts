import { describe, it, expect, vi } from "vitest";
import { renderMarkdown } from "./markdown";

vi.mock("mermaid", () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn().mockResolvedValue({ svg: '<svg aria-label="diagram"></svg>' }),
  },
}));

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

  it("passes fenced code through the pipeline so Shiki can highlight it", async () => {
    const html = await renderMarkdown("```python\nprint('hi')\n```");
    // After Task 12 the rehype output is post-processed by Shiki; the
    // original language-python class is replaced with Shiki's own wrapper.
    expect(html).toMatch(/shiki/);
    expect(html).toContain("print");
  });

  it("highlights code blocks with Shiki after rendering", async () => {
    const html = await renderMarkdown("```python\nprint('hi')\n```");
    expect(html).toMatch(/<pre class="shiki/);
    expect(html).toMatch(/<span style="color:/);
  });

  it("replaces mermaid fenced blocks with rendered SVG", async () => {
    const html = await renderMarkdown("```mermaid\ngraph TD; A-->B\n```");
    expect(html).toMatch(/<svg[^>]+aria-label=/);
  });
});

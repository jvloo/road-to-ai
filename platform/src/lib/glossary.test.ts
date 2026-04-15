import { describe, it, expect } from "vitest";
import { parseGlossary } from "./glossary";

const sample = `# Glossary

## XP
**Experience Points.** A thing.

## SGD
**Stochastic Gradient Descent.** Another thing.
`;

describe("parseGlossary", () => {
  it("splits entries by ## headings", () => {
    const entries = parseGlossary(sample);
    expect(entries).toHaveLength(2);
    expect(entries.find((e) => e.term === "XP")?.body).toContain("Experience Points");
  });
});

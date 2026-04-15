import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SkillTree } from "./SkillTree";
import type { Level } from "@/lib/types";

vi.mock("cytoscape", () => ({
  default: vi.fn(() => ({
    on: vi.fn(),
    destroy: vi.fn(),
    layout: vi.fn(() => ({ run: vi.fn() })),
  })),
}));

const mkLevel = (o: Partial<Level>): Level => ({
  id: "F00", title: "T", track: "A", tier: 0, xp: 1, prereqs: [], unlocks: [],
  status: "pending", completed_at: null, body: "", slug: "", sourcePath: "", ...o,
});

describe("SkillTree", () => {
  it("renders a container element", () => {
    render(<SkillTree levels={[mkLevel({})]} onSelect={() => {}} />);
    expect(screen.getByTestId("skill-tree")).toBeInTheDocument();
  });

  it("renders a list-view fallback for accessibility", () => {
    render(
      <SkillTree levels={[mkLevel({ id: "F00", title: "Welcome" })]} onSelect={() => {}} />,
    );
    expect(screen.getByRole("list", { name: /skill tree list view/i })).toBeInTheDocument();
    // The list item contains the id + title + status
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Welcome");
  });
});

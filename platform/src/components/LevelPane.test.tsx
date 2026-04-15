import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LevelPane } from "./LevelPane";
import type { Level } from "@/lib/types";

const level: Level = {
  id: "F00",
  title: "Welcome",
  track: "A",
  tier: 0,
  xp: 1,
  prereqs: [],
  unlocks: [],
  status: "pending",
  completed_at: null,
  body: "## Objectives\n\n- First objective\n\n$E = mc^2$",
  slug: "f00",
  sourcePath: "",
};

describe("LevelPane", () => {
  it("renders the level title and id", () => {
    render(<LevelPane level={level} onMarkDone={() => {}} />);
    expect(screen.getByRole("heading", { name: /Welcome/ })).toBeInTheDocument();
    expect(screen.getByText("F00")).toBeInTheDocument();
  });

  it("renders the body markdown", async () => {
    render(<LevelPane level={level} onMarkDone={() => {}} />);
    await waitFor(() => expect(screen.getByText("Objectives")).toBeInTheDocument());
    expect(screen.getByText(/First objective/)).toBeInTheDocument();
  });

  it("shows a Mark Done button when status is pending", () => {
    render(<LevelPane level={level} onMarkDone={() => {}} />);
    expect(screen.getByRole("button", { name: /mark done/i })).toBeInTheDocument();
  });
});

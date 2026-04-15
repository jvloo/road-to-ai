import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { XpBar } from "./XpBar";

describe("XpBar", () => {
  it("renders total xp and current tier bounds", () => {
    render(<XpBar xp={150} />);
    expect(screen.getByText(/150 XP/)).toBeInTheDocument();
    expect(screen.getByText(/Apprentice/)).toBeInTheDocument();
    expect(screen.getByText(/Journeyman/)).toBeInTheDocument();
  });

  it("at max tier shows only the researcher label", () => {
    render(<XpBar xp={4000} />);
    expect(screen.getByText(/Researcher/)).toBeInTheDocument();
  });
});

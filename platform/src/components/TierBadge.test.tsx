import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TierBadge } from "./TierBadge";

describe("TierBadge", () => {
  it("renders the tier name in a monospace pill", () => {
    render(<TierBadge tier="Apprentice" />);
    const el = screen.getByText(/Apprentice/);
    expect(el).toBeInTheDocument();
  });
});

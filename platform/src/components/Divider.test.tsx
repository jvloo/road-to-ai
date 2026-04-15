import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Divider } from "./Divider";

describe("Divider", () => {
  it("renders the label prefixed with // in a monospace style", () => {
    render(<Divider>journey</Divider>);
    const el = screen.getByText(/\/\/\s*journey/);
    expect(el).toBeInTheDocument();
    expect(el.tagName.toLowerCase()).toBe("p");
  });

  it("adds a trailing horizontal rule", () => {
    const { container } = render(<Divider>projects</Divider>);
    expect(container.querySelector("hr")).toBeInTheDocument();
  });
});

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "./utils";
import FormField from "../components/forms/FormField";

// Smoke test: proves Vitest, jsdom, Testing Library, jest-dom and axe all work.
// The real component tests come next.
describe("test setup", () => {
  it("renders a labelled field with no accessibility violations", async () => {
    const { container } = render(
      <FormField label="First name" name="firstName" hint="As on your ID" />,
    );

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("detects a real accessibility problem", async () => {
    // An input with no label: axe must flag it, or the checker is not working
    const { container } = render(<input type="text" />);

    await expect(axe(container)).resolves.not.toHaveNoViolations();
  });
});
